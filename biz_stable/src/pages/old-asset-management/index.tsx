import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, message } from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { RootState } from '../../store'
import {
  setBusinesses,
  setSelectedBusiness,
  setAssets,
  setFilteredAssets,
  setPendingAssets,
  setStatistics,
  setSearchKeyword,
  confirmPendingAsset,
  ignorePendingAsset,
  confirmAllPendingAssets,
  deleteAsset
} from '../../store/slices/assetManagementSlice'
import {
  generateMockBusinesses,
  generateMockAssets,
  generateMockPendingAssets,
  generateAssetStatistics
} from '../../mock/asset-management-data'

import BusinessSelector from './components/BusinessSelector'
import AssetList from './components/AssetList'
import AssetRelationGraph from './components/AssetRelationGraph'
import PendingAssets from './components/PendingAssets'

import './index.css'

const AssetManagement: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // 从Redux获取状态
  const {
    businesses,
    selectedBusinessId,
    selectedBusiness,
    assets,
    filteredAssets,
    pendingAssets,
    statistics,
    searchKeyword
  } = useSelector((state: RootState) => state.assetManagement)

  // 初始化数据
  useEffect(() => {
    // 加载业务列表
    const mockBusinesses = generateMockBusinesses()
    dispatch(setBusinesses(mockBusinesses))

    // 默认选择第一个业务
    if (mockBusinesses.length > 0) {
      const firstBusiness = mockBusinesses[0]
      dispatch(setSelectedBusiness(firstBusiness))

      // 加载该业务的资产数据
      const mockAssets = generateMockAssets(firstBusiness.id, firstBusiness.name)
      dispatch(setAssets(mockAssets))

      // 加载待确认资产
      const mockPendingAssets = generateMockPendingAssets(
        firstBusiness.id,
        firstBusiness.name
      )
      dispatch(setPendingAssets(mockPendingAssets))

      // 生成统计信息
      const stats = generateAssetStatistics(mockAssets, mockPendingAssets)
      dispatch(setStatistics(stats))
    }
  }, [dispatch])

  // 业务选择处理
  const handleBusinessSelect = (business: typeof selectedBusiness) => {
    if (!business) return

    dispatch(setSelectedBusiness(business))

    // 加载该业务的资产数据
    const mockAssets = generateMockAssets(business.id, business.name)
    dispatch(setAssets(mockAssets))

    // 加载待确认资产
    const mockPendingAssets = generateMockPendingAssets(business.id, business.name)
    dispatch(setPendingAssets(mockPendingAssets))

    // 生成统计信息
    const stats = generateAssetStatistics(mockAssets, mockPendingAssets)
    dispatch(setStatistics(stats))

    // 清空搜索
    dispatch(setSearchKeyword(''))

    message.success(`已切换到业务: ${business.name}`)
  }

  // 搜索处理
  const handleSearch = (keyword: string) => {
    dispatch(setSearchKeyword(keyword))

    if (!keyword.trim()) {
      dispatch(setFilteredAssets(assets))
      return
    }

    const filtered = assets.filter(
      asset =>
        asset.name.toLowerCase().includes(keyword.toLowerCase()) ||
        asset.code.toLowerCase().includes(keyword.toLowerCase()) ||
        asset.ip?.toLowerCase().includes(keyword.toLowerCase())
    )
    dispatch(setFilteredAssets(filtered))
  }

  // 编辑资产
  const handleEditAsset = (asset: any) => {
    message.info(`编辑资产: ${asset.name}（此功能将在后续实现）`)
  }

  // 删除资产
  const handleDeleteAsset = (assetId: string) => {
    dispatch(deleteAsset(assetId))
    message.success('资产已删除')

    // 重新生成统计信息
    if (selectedBusiness) {
      const newAssets = assets.filter(a => a.id !== assetId)
      const stats = generateAssetStatistics(newAssets, pendingAssets)
      dispatch(setStatistics(stats))
    }
  }

  // 确认待确认资产
  const handleConfirmPendingAsset = (assetId: string, businessId: string) => {
    dispatch(confirmPendingAsset({ assetId, businessId }))
    message.success('资产已确认归属')

    // 重新生成统计信息
    setTimeout(() => {
      const newAssets = [...assets]
      const newPendingAssets = pendingAssets.filter(a => a.id !== assetId)
      const stats = generateAssetStatistics(newAssets, newPendingAssets)
      dispatch(setStatistics(stats))
    }, 100)
  }

  // 忽略待确认资产
  const handleIgnorePendingAsset = (assetId: string) => {
    dispatch(ignorePendingAsset(assetId))
    message.info('已忽略该资产')

    // 重新生成统计信息
    setTimeout(() => {
      const newPendingAssets = pendingAssets.filter(a => a.id !== assetId)
      const stats = generateAssetStatistics(assets, newPendingAssets)
      dispatch(setStatistics(stats))
    }, 100)
  }

  // 批量确认
  const handleConfirmAll = (businessId: string) => {
    dispatch(confirmAllPendingAssets(businessId))
    message.success('已确认所有待确认资产')

    // 重新生成统计信息
    setTimeout(() => {
      const newPendingAssets = pendingAssets.filter(
        a => a.suggestedBusinessId !== businessId
      )
      const stats = generateAssetStatistics(assets, newPendingAssets)
      dispatch(setStatistics(stats))
    }, 100)
  }

  // 导入资产
  const handleImportAssets = () => {
    message.info('导入资产功能将在后续实现')
  }

  // 添加资产
  const handleAddAsset = () => {
    message.info('添加资产功能将在后续实现')
  }

  // 查看资产全景
  const handleViewPanorama = (businessId: string) => {
    navigate(`/management/asset-management/panorama/${businessId}`)
  }

  // 计算展示的资产列表
  const displayAssets = useMemo(() => {
    return searchKeyword ? filteredAssets : assets
  }, [assets, filteredAssets, searchKeyword])

  return (
    <div className="asset-management-layout">
      {/* 页面头部 */}
      <div className="asset-management-header">
        <h1 className="asset-management-title">业务资产管理</h1>
        <div className="asset-management-actions">
          <Button icon={<UploadOutlined />} onClick={handleImportAssets}>
            导入资产
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddAsset}
            disabled={!selectedBusiness}
          >
            手动添加资产
          </Button>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="asset-management-body">
        {/* 左侧业务选择器 */}
        <div className="asset-management-sider">
          <BusinessSelector
            businesses={businesses}
            selectedBusinessId={selectedBusinessId}
            onSelect={handleBusinessSelect}
            onViewPanorama={handleViewPanorama}
          />
        </div>

        {/* 中间和右侧内容 */}
        <div className="asset-management-main">
          {/* 主内容区：资产列表 + 关系图 */}
          <div className="asset-management-content">
            {/* 资产列表 */}
            <div className="asset-management-list-section">
              <AssetList
                assets={displayAssets}
                searchKeyword={searchKeyword}
                onSearchChange={handleSearch}
                onEditAsset={handleEditAsset}
                onDeleteAsset={handleDeleteAsset}
              />
            </div>

            {/* 资产关系图 */}
            <div className="asset-management-graph-section">
              <AssetRelationGraph assets={assets} statistics={statistics} />
            </div>
          </div>

          {/* 待确认资产 */}
          <div className="asset-management-pending-section">
            <PendingAssets
              pendingAssets={pendingAssets}
              onConfirm={handleConfirmPendingAsset}
              onIgnore={handleIgnorePendingAsset}
              onConfirmAll={handleConfirmAll}
              currentBusinessId={selectedBusinessId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetManagement
