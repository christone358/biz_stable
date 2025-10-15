import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Breadcrumb, Button, Input, Radio, Table, message } from 'antd'
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'
import { generatePanoramaData, assetStatusLabels } from '../../mock/asset-panorama-data'
import BusinessInfo from './components/panorama/BusinessInfo'
import AssetLayer from './components/panorama/AssetLayer'
import DependencyGraph from './components/panorama/DependencyGraph'
import type { PanoramaData, ViewMode, AssetLayerType, AssetItem, AssetFilter } from './panorama-types'
import './AssetPanorama.css'

const AssetPanorama: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>()
  const navigate = useNavigate()

  const [panoramaData, setPanoramaData] = useState<PanoramaData | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('overview' as ViewMode)
  const [currentLayer, setCurrentLayer] = useState<AssetLayerType | null>(null)
  const [filter, setFilter] = useState<AssetFilter>({
    keyword: '',
    status: 'all',
    type: 'all'
  })

  // 加载全景数据
  useEffect(() => {
    if (businessId) {
      // 实际应用中应从API获取
      const data = generatePanoramaData(businessId, '一网通办门户')
      setPanoramaData(data)
    }
  }, [businessId])

  if (!panoramaData) {
    return <div className="asset-panorama-loading">加载中...</div>
  }

  // 返回资产管理页面
  const handleBack = () => {
    navigate('/management/asset-management')
  }

  // 查看层级详情
  const handleViewDetail = (layer: AssetLayerType) => {
    setCurrentLayer(layer)
    setViewMode('detail' as ViewMode)
  }

  // 台账管理
  const handleManage = (layer: AssetLayerType) => {
    setCurrentLayer(layer)
    setViewMode('manage' as ViewMode)
  }

  // 返回全景视图
  const handleBackToOverview = () => {
    setViewMode('overview' as ViewMode)
    setCurrentLayer(null)
    setFilter({ keyword: '', status: 'all', type: 'all' })
  }

  // 获取当前层级的资产列表
  const getCurrentLayerAssets = (): AssetItem[] => {
    if (!currentLayer) return []
    const assets = panoramaData.assetDetails[currentLayer] || []

    // 应用筛选
    return assets.filter(asset => {
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase()
        if (
          !asset.name.toLowerCase().includes(keyword) &&
          !asset.address.toLowerCase().includes(keyword)
        ) {
          return false
        }
      }

      if (filter.status !== 'all' && asset.status !== filter.status) {
        return false
      }

      if (filter.type !== 'all' && asset.type !== filter.type) {
        return false
      }

      return true
    })
  }

  // 表格列定义
  const getTableColumns = (isManage: boolean) => {
    const baseColumns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 150
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 120
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => (
          <span>
            <span
              className={`status-indicator status-${status}`}
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                marginRight: 6
              }}
            />
            {assetStatusLabels[status as keyof typeof assetStatusLabels] || status}
          </span>
        )
      },
      {
        title: 'IP/地址',
        dataIndex: 'address',
        key: 'address',
        width: 200
      },
      {
        title: '配置',
        dataIndex: 'config',
        key: 'config',
        width: 120
      }
    ]

    if (isManage) {
      baseColumns.push({
        title: '责任人',
        dataIndex: 'owner',
        key: 'owner',
        width: 120
      } as any)
    }

    baseColumns.push({
      title: '操作',
      key: 'action',
      width: 100,
      render: () => <Button type="link" size="small">详情</Button>
    } as any)

    return baseColumns
  }

  // 渲染主内容
  const renderContent = () => {
    if (viewMode === 'overview') {
      return (
        <div className="panorama-overview">
          <BusinessInfo
            businessInfo={panoramaData.businessInfo}
            responsibleInfo={panoramaData.responsibleInfo}
          />

          <div className="asset-layers">
            <AssetLayer
              layerType={'app' as AssetLayerType}
              statistics={panoramaData.layerStatistics['app' as AssetLayerType]}
              honeycombData={panoramaData.honeycombData['app' as AssetLayerType]}
              onViewDetail={() => handleViewDetail('app' as AssetLayerType)}
              onManage={() => handleManage('app' as AssetLayerType)}
            />

            <AssetLayer
              layerType={'compute' as AssetLayerType}
              statistics={panoramaData.layerStatistics['compute' as AssetLayerType]}
              honeycombData={panoramaData.honeycombData['compute' as AssetLayerType]}
              onViewDetail={() => handleViewDetail('compute' as AssetLayerType)}
              onManage={() => handleManage('compute' as AssetLayerType)}
            />

            <AssetLayer
              layerType={'storage' as AssetLayerType}
              statistics={panoramaData.layerStatistics['storage' as AssetLayerType]}
              honeycombData={panoramaData.honeycombData['storage' as AssetLayerType]}
              onViewDetail={() => handleViewDetail('storage' as AssetLayerType)}
              onManage={() => handleManage('storage' as AssetLayerType)}
            />

            <AssetLayer
              layerType={'network' as AssetLayerType}
              statistics={panoramaData.layerStatistics['network' as AssetLayerType]}
              honeycombData={panoramaData.honeycombData['network' as AssetLayerType]}
              onViewDetail={() => handleViewDetail('network' as AssetLayerType)}
              onManage={() => handleManage('network' as AssetLayerType)}
            />
          </div>
        </div>
      )
    }

    if (viewMode === 'dependency') {
      return <DependencyGraph nodes={panoramaData.dependencyData} />
    }

    if (viewMode === 'detail' || viewMode === 'manage') {
      const assets = getCurrentLayerAssets()
      const isManage = viewMode === 'manage'

      return (
        <div className="panorama-table-view">
          <div className="table-view-header">
            <div className="table-view-title">
              {isManage ? '资产台账管理' : '资产台账详情'}
            </div>
            <div className="table-view-filters">
              <Input
                placeholder="搜索资产..."
                prefix={<SearchOutlined />}
                value={filter.keyword}
                onChange={e => setFilter({ ...filter, keyword: e.target.value })}
                style={{ width: 200 }}
              />
            </div>
          </div>
          <Table
            dataSource={assets}
            columns={getTableColumns(isManage)}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: total => `共 ${total} 条`
            }}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="asset-panorama-page">
      <div className="panorama-header">
        <div className="panorama-breadcrumb">
          <Breadcrumb>
            <Breadcrumb.Item>业务资产管理</Breadcrumb.Item>
            <Breadcrumb.Item>{panoramaData.businessInfo.name}</Breadcrumb.Item>
            {viewMode !== 'overview' && viewMode !== 'dependency' && (
              <Breadcrumb.Item>
                {viewMode === 'manage' ? '台账管理' : '台账详情'}
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>

        <div className="panorama-actions">
          {(viewMode === 'detail' || viewMode === 'manage') && (
            <Button icon={<ArrowLeftOutlined />} onClick={handleBackToOverview}>
              返回全景
            </Button>
          )}
          {viewMode === 'overview' || viewMode === 'dependency' ? (
            <>
              <Input.Search
                placeholder="搜索全局资产..."
                style={{ width: 300 }}
                onSearch={value => message.info(`搜索: ${value}`)}
              />
              <Radio.Group
                value={viewMode}
                onChange={e => setViewMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="overview">资产全景</Radio.Button>
                <Radio.Button value="dependency">依赖分析</Radio.Button>
              </Radio.Group>
            </>
          ) : null}
          <Button onClick={handleBack}>返回列表</Button>
        </div>
      </div>

      <div className="panorama-content">{renderContent()}</div>
    </div>
  )
}

export default AssetPanorama
