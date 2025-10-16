import React, { useState, useEffect } from 'react'
import { Input, Button, Breadcrumb } from 'antd'
import { SearchOutlined, AppstoreOutlined, DeploymentUnitOutlined } from '@ant-design/icons'
import BusinessTree from './components/BusinessTree'
import BusinessInfo from './components/BusinessInfo'
import AssetLayer from './components/AssetLayer'
import DependencyView from './components/DependencyView'
import AssetTable from './components/AssetTable'
import { generatePanoramaData } from '../../../mock/asset-panorama-data'
import type { PanoramaData } from './panorama-types'
import { AssetLayerType } from './panorama-types'
import type { ViewType } from './types'
import './index.css'

const AssetPanorama: React.FC = () => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>('')
  const [selectedSystemName, setSelectedSystemName] = useState<string>('')
  const [panoramaData, setPanoramaData] = useState<PanoramaData | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [detailLayer, setDetailLayer] = useState<AssetLayerType | null>(null)
  const [isManageMode, setIsManageMode] = useState(false)

  // 当选中系统时，生成全景数据
  useEffect(() => {
    if (selectedSystemId && selectedSystemName) {
      const data = generatePanoramaData(selectedSystemId, selectedSystemName)
      setPanoramaData(data)
      setCurrentView('overview')
      setDetailLayer(null)
      setIsManageMode(false)
    }
  }, [selectedSystemId, selectedSystemName])

  const handleSystemSelect = (systemId: string, systemName: string) => {
    setSelectedSystemId(systemId)
    setSelectedSystemName(systemName)
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
      [AssetLayerType.APPLICATION]: '应用',
      [AssetLayerType.COMPUTE]: '计算资源',
      [AssetLayerType.STORAGE]: '存储资源',
      [AssetLayerType.NETWORK]: '网络资源'
    }
    return titles[layer]
  }

  const getBreadcrumb = () => {
    if (!selectedSystemName) {
      return '请选择业务系统'
    }
    if (currentView === 'overview') {
      return `${selectedSystemName} - 资产全景`
    } else if (currentView === 'dependency') {
      return `${selectedSystemName} - 依赖分析`
    } else if (detailLayer) {
      const suffix = isManageMode ? '台账管理' : '台账'
      return `${selectedSystemName} > ${getLayerTitle(detailLayer)}${suffix}`
    }
    return selectedSystemName
  }

  return (
    <div className="asset-panorama-container">
      {/* 左侧业务树 */}
      <BusinessTree
        selectedSystemId={selectedSystemId}
        onSelectSystem={handleSystemSelect}
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

          {panoramaData && (
            <>
              {currentView === 'overview' || currentView === 'dependency' ? (
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
              ) : null}
            </>
          )}
        </div>

        {/* 内容主体 */}
        <div className="asset-content-body">
          {/* 未选择系统时的提示 */}
          {!panoramaData && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#8c8c8c',
              fontSize: '16px'
            }}>
              请从左侧选择业务系统查看资产全景
            </div>
          )}

          {/* 业务基础信息面板 - 所有视图都显示 */}
          {panoramaData && currentView !== 'detail' && currentView !== 'manage' && (
            <BusinessInfo business={panoramaData.businessInfo} responsible={panoramaData.responsibleInfo} />
          )}

          {/* 资产全景视图 */}
          {panoramaData && currentView === 'overview' && (
            <div className="asset-layers-vertical">
              <AssetLayer
                type={AssetLayerType.APPLICATION}
                title="应用层"
                icon="cubes"
                stats={panoramaData.layerStatistics[AssetLayerType.APPLICATION]}
                honeycombData={panoramaData.honeycombData[AssetLayerType.APPLICATION]}
                onShowManage={() => handleShowManage(AssetLayerType.APPLICATION)}
              />
              <AssetLayer
                type={AssetLayerType.COMPUTE}
                title="计算层资源"
                icon="server"
                stats={panoramaData.layerStatistics[AssetLayerType.COMPUTE]}
                honeycombData={panoramaData.honeycombData[AssetLayerType.COMPUTE]}
                onShowManage={() => handleShowManage(AssetLayerType.COMPUTE)}
              />
              <AssetLayer
                type={AssetLayerType.STORAGE}
                title="存储层资源"
                icon="database"
                stats={panoramaData.layerStatistics[AssetLayerType.STORAGE]}
                honeycombData={panoramaData.honeycombData[AssetLayerType.STORAGE]}
                onShowManage={() => handleShowManage(AssetLayerType.STORAGE)}
              />
              <AssetLayer
                type={AssetLayerType.NETWORK}
                title="网络层资源"
                icon="global"
                stats={panoramaData.layerStatistics[AssetLayerType.NETWORK]}
                honeycombData={panoramaData.honeycombData[AssetLayerType.NETWORK]}
                onShowManage={() => handleShowManage(AssetLayerType.NETWORK)}
              />
            </div>
          )}

          {/* 依赖分析视图 */}
          {panoramaData && currentView === 'dependency' && <DependencyView dependencyData={panoramaData.dependencyData} />}

          {/* 台账视图 */}
          {panoramaData && (currentView === 'detail' || currentView === 'manage') && detailLayer && (
            <AssetTable
              layer={detailLayer}
              title={getLayerTitle(detailLayer)}
              data={panoramaData.assetDetails[detailLayer] || []}
              isManageMode={isManageMode}
              onBack={handleBackToOverview}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AssetPanorama
