import React, { useState } from 'react'
import { Input, Button, Breadcrumb } from 'antd'
import { SearchOutlined, AppstoreOutlined, DeploymentUnitOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import BusinessSidebar from './components/BusinessSidebar'
import BusinessInfo from './components/BusinessInfo'
import AssetLayer from './components/AssetLayer'
import DependencyView from './components/DependencyView'
import AssetTable from './components/AssetTable'
import { businessDataList, honeycombDataMap, assetTableData } from './mock-data'
import type { BusinessInfo as BusinessInfoType, ViewType, AssetLayerType } from './types'
import './index.css'

const AssetPanorama: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessInfoType>(businessDataList[0])
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [detailLayer, setDetailLayer] = useState<AssetLayerType | null>(null)
  const [isManageMode, setIsManageMode] = useState(false)

  const handleBusinessSelect = (business: BusinessInfoType) => {
    setSelectedBusiness(business)
    setCurrentView('overview')
    setDetailLayer(null)
    setIsManageMode(false)
  }

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    setDetailLayer(null)
    setIsManageMode(false)
  }

  const handleShowDetail = (layer: AssetLayerType) => {
    setDetailLayer(layer)
    setCurrentView('detail')
    setIsManageMode(false)
  }

  const handleShowManage = (layer: AssetLayerType) => {
    setDetailLayer(layer)
    setCurrentView('manage')
    setIsManageMode(true)
  }

  const handleBackToOverview = () => {
    setCurrentView('overview')
    setDetailLayer(null)
    setIsManageMode(false)
  }

  const getLayerTitle = (layer: AssetLayerType): string => {
    const titles: Record<AssetLayerType, string> = {
      app: '应用',
      compute: '计算资源',
      storage: '存储资源',
      network: '网络资源'
    }
    return titles[layer]
  }

  const getBreadcrumb = () => {
    if (currentView === 'overview') {
      return `${selectedBusiness.name} - 资产全景`
    } else if (currentView === 'dependency') {
      return `${selectedBusiness.name} - 依赖分析`
    } else if (detailLayer) {
      const suffix = isManageMode ? '台账管理' : '台账'
      return `${selectedBusiness.name} > ${getLayerTitle(detailLayer)}${suffix}`
    }
    return selectedBusiness.name
  }

  return (
    <div className="asset-panorama-container">
      {/* 左侧业务列表 */}
      <BusinessSidebar
        businesses={businessDataList}
        selectedId={selectedBusiness.id}
        onSelect={handleBusinessSelect}
      />

      {/* 右侧内容区 */}
      <div className="asset-content">
        {/* 顶部Header */}
        <div className="asset-content-header">
          <div className="asset-breadcrumb">{getBreadcrumb()}</div>

          <div className="asset-global-search">
            <Input
              placeholder="搜索全局资产..."
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>

          <div className="asset-view-switcher">
            <Button
              type={currentView === 'overview' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => handleViewChange('overview')}
            >
              资产全景
            </Button>
            <Button
              type={currentView === 'dependency' ? 'primary' : 'default'}
              icon={<DeploymentUnitOutlined />}
              onClick={() => handleViewChange('dependency')}
              style={{ marginLeft: 8 }}
            >
              依赖分析
            </Button>
          </div>

          {(currentView === 'detail' || currentView === 'manage') && (
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToOverview}
            >
              返回全景
            </Button>
          )}
        </div>

        {/* 内容主体 */}
        <div className="asset-content-body">
          {/* 业务基础信息面板 - 所有视图都显示 */}
          {currentView !== 'detail' && currentView !== 'manage' && (
            <BusinessInfo business={selectedBusiness} />
          )}

          {/* 资产全景视图 */}
          {currentView === 'overview' && (
            <div className="asset-layers-vertical">
              <AssetLayer
                type="app"
                title="应用层"
                icon="cubes"
                stats={selectedBusiness.assets.app}
                honeycombData={honeycombDataMap.app}
                onShowDetail={() => handleShowDetail('app')}
                onShowManage={() => handleShowManage('app')}
              />
              <AssetLayer
                type="compute"
                title="计算层资源"
                icon="server"
                stats={selectedBusiness.assets.compute}
                honeycombData={honeycombDataMap.compute}
                onShowDetail={() => handleShowDetail('compute')}
                onShowManage={() => handleShowManage('compute')}
              />
              <AssetLayer
                type="storage"
                title="存储层资源"
                icon="database"
                stats={selectedBusiness.assets.storage}
                honeycombData={honeycombDataMap.storage}
                onShowDetail={() => handleShowDetail('storage')}
                onShowManage={() => handleShowManage('storage')}
              />
              <AssetLayer
                type="network"
                title="网络层资源"
                icon="global"
                stats={selectedBusiness.assets.network}
                honeycombData={honeycombDataMap.network}
                onShowDetail={() => handleShowDetail('network')}
                onShowManage={() => handleShowManage('network')}
              />
            </div>
          )}

          {/* 依赖分析视图 */}
          {currentView === 'dependency' && <DependencyView />}

          {/* 台账视图 */}
          {(currentView === 'detail' || currentView === 'manage') && detailLayer && (
            <AssetTable
              layer={detailLayer}
              title={getLayerTitle(detailLayer)}
              data={assetTableData[detailLayer] || []}
              isManageMode={isManageMode}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AssetPanorama
