/**
 * 资产运营管理主页面
 * 包含资产类型统计、部门纳管动态和未纳管资产列表
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Breadcrumb, Row, Col, message } from 'antd'
import AssetOverview from './components/AssetOverview'
import DepartmentDynamics from './components/DepartmentDynamics'
import UnmanagedAssetTable from './components/UnmanagedAssetTable'
import AssetDetailModal from './components/AssetDetailModal'
import DepartmentAssetModal from './components/DepartmentAssetModal'
import AssignModal from './components/AssignModal'
import type {
  UnmanagedAsset,
  AssetTypeStats,
  DepartmentDynamic,
  Department,
  DepartmentAsset,
  AssetType,
  AssetAttribute,
  PaginationConfig,
  FilterConfig,
  AssignFormData
} from './types'
import {
  generateUnmanagedAssets,
  generateAssetTypeStats,
  generateDepartmentDynamics,
  generateDepartments,
  generateDepartmentAssets
} from '../../../mock/asset-operations-data'
import './index.css'

const AssetOperations: React.FC = () => {
  // 状态管理
  const [assetTypeStats, setAssetTypeStats] = useState<AssetTypeStats[]>([])
  const [unmanagedAssets, setUnmanagedAssets] = useState<UnmanagedAsset[]>([])
  const [departmentDynamics, setDepartmentDynamics] = useState<DepartmentDynamic[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)

  // 筛选条件
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    assetType: 'all',
    assetAttribute: 'all',
    searchKeyword: ''
  })

  // 分页配置
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 模态框状态
  const [assetDetailModal, setAssetDetailModal] = useState<{
    visible: boolean
    asset: UnmanagedAsset | null
  }>({
    visible: false,
    asset: null
  })

  const [departmentAssetModal, setDepartmentAssetModal] = useState<{
    visible: boolean
    departmentId: string
    departmentName: string
    assets: DepartmentAsset[]
  }>({
    visible: false,
    departmentId: '',
    departmentName: '',
    assets: []
  })

  const [assignModal, setAssignModal] = useState<{
    visible: boolean
    assetIds: string[]
  }>({
    visible: false,
    assetIds: []
  })

  // 初始化数据
  useEffect(() => {
    loadData()
  }, [])

  // 加载数据
  const loadData = () => {
    setLoading(true)
    setTimeout(() => {
      const stats = generateAssetTypeStats()
      const assets = generateUnmanagedAssets()
      const dynamics = generateDepartmentDynamics()
      const depts = generateDepartments()

      setAssetTypeStats(stats)
      setUnmanagedAssets(assets)
      setDepartmentDynamics(dynamics)
      setDepartments(depts)
      setPagination((prev) => ({ ...prev, total: assets.length }))
      setLoading(false)
    }, 500)
  }

  // 筛选后的资产数据
  const filteredAssets = useMemo(() => {
    return unmanagedAssets.filter((asset) => {
      // 资产类型筛选
      if (filterConfig.assetType !== 'all' && asset.type !== filterConfig.assetType) {
        return false
      }
      // 资产属性筛选
      if (
        filterConfig.assetAttribute !== 'all' &&
        asset.attribute !== filterConfig.assetAttribute
      ) {
        return false
      }
      // 关键词搜索
      if (filterConfig.searchKeyword) {
        const keyword = filterConfig.searchKeyword.toLowerCase()
        return (
          asset.name.toLowerCase().includes(keyword) ||
          asset.ipAddress.toLowerCase().includes(keyword)
        )
      }
      return true
    })
  }, [unmanagedAssets, filterConfig])

  // 分页后的资产数据
  const paginatedAssets = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredAssets.slice(start, end)
  }, [filteredAssets, pagination.current, pagination.pageSize])

  // 处理资产类型选择
  const handleTypeSelect = (type: AssetType | 'all') => {
    setFilterConfig((prev) => ({ ...prev, assetType: type }))
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 处理资产属性筛选
  const handleAttributeFilter = (attribute: AssetAttribute | 'all') => {
    setFilterConfig((prev) => ({ ...prev, assetAttribute: attribute }))
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setFilterConfig((prev) => ({ ...prev, searchKeyword: keyword }))
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
      total: filteredAssets.length
    }))
  }

  // 查看资产详情
  const handleViewDetail = (asset: UnmanagedAsset) => {
    setAssetDetailModal({
      visible: true,
      asset
    })
  }

  // 关闭资产详情模态框
  const handleCloseAssetDetail = () => {
    setAssetDetailModal({
      visible: false,
      asset: null
    })
  }

  // 查看部门资产列表
  const handleDepartmentClick = (departmentId: string, departmentName: string) => {
    const assets = generateDepartmentAssets(departmentId)
    setDepartmentAssetModal({
      visible: true,
      departmentId,
      departmentName,
      assets
    })
  }

  // 关闭部门资产模态框
  const handleCloseDepartmentAssets = () => {
    setDepartmentAssetModal({
      visible: false,
      departmentId: '',
      departmentName: '',
      assets: []
    })
  }

  // 打开指派模态框
  const handleOpenAssignModal = (assetIds: string[]) => {
    setAssignModal({
      visible: true,
      assetIds
    })
  }

  // 关闭指派模态框
  const handleCloseAssignModal = () => {
    setAssignModal({
      visible: false,
      assetIds: []
    })
  }

  // 提交指派
  const handleSubmitAssign = (data: AssignFormData) => {
    console.log('指派数据:', data)
    // 这里可以调用API提交数据
    loadData() // 重新加载数据
  }

  // 忽略资产
  const handleIgnoreAssets = (assetIds: string[]) => {
    message.success(`已忽略 ${assetIds.length} 个资产`)
    // 这里可以调用API
    loadData() // 重新加载数据
  }

  return (
    <div className="asset-operations-page">
      {/* 面包屑导航 */}
      <div className="page-header">
        <Breadcrumb
          items={[
            { title: '首页' },
            { title: '业务保障管理' },
            { title: '资产运营' }
          ]}
        />
      </div>

      {/* 内容区域 */}
      <div className="page-content">
        {/* 顶部两栏布局 */}
        <Row gutter={[16, 16]} className="top-section">
          {/* 左侧：资产类型统计 */}
          <Col xs={24} lg={14}>
            <AssetOverview
              stats={assetTypeStats}
              selectedType={filterConfig.assetType}
              onTypeSelect={handleTypeSelect}
            />
          </Col>

          {/* 右侧：部门纳管动态 */}
          <Col xs={24} lg={10}>
            <DepartmentDynamics
              dynamics={departmentDynamics}
              onDepartmentClick={handleDepartmentClick}
            />
          </Col>
        </Row>

        {/* 底部：未纳管资产列表 */}
        <div className="bottom-section">
          <UnmanagedAssetTable
            data={paginatedAssets}
            loading={loading}
            pagination={{
              ...pagination,
              total: filteredAssets.length
            }}
            onPageChange={handlePageChange}
            onViewDetail={handleViewDetail}
            onAssign={handleOpenAssignModal}
            onIgnore={handleIgnoreAssets}
            onSearch={handleSearch}
            onTypeFilter={handleTypeSelect}
            onAttributeFilter={handleAttributeFilter}
          />
        </div>
      </div>

      {/* 模态框 */}
      <AssetDetailModal
        visible={assetDetailModal.visible}
        asset={assetDetailModal.asset}
        onClose={handleCloseAssetDetail}
      />

      <DepartmentAssetModal
        visible={departmentAssetModal.visible}
        departmentName={departmentAssetModal.departmentName}
        assets={departmentAssetModal.assets}
        onClose={handleCloseDepartmentAssets}
      />

      <AssignModal
        visible={assignModal.visible}
        assetIds={assignModal.assetIds}
        departments={departments}
        onClose={handleCloseAssignModal}
        onSubmit={handleSubmitAssign}
      />
    </div>
  )
}

export default AssetOperations
