import React, { useState, useMemo } from 'react'
import { Row, Col, message } from 'antd'
import { HddOutlined, DatabaseOutlined, CloudOutlined, AppstoreOutlined } from '@ant-design/icons'
import AssetStatCard from './AssetStatCard'
import AssetCompositionTable from './AssetCompositionTable'
import AssetDetailDrawer from './AssetDetailDrawer'
import type { AssetItemDetail, AssetCompositionData } from './types'
import { generateAssetCompositionData } from '../../../../../mock/asset-performance-data'
import './index.css'

interface AssetCompositionProps {
  systemId: string
  systemName: string
  onSwitchToPerformance?: (assetId: string) => void
}

const AssetComposition: React.FC<AssetCompositionProps> = ({
  systemId,
  systemName,
  onSwitchToPerformance
}) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetItemDetail | null>(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('all') // 控制表格的tab切换

  // 生成资产组成数据
  const compositionData: AssetCompositionData = useMemo(() => {
    return generateAssetCompositionData(systemId, systemName)
  }, [systemId, systemName])

  // 处理统计卡片点击 - 切换到对应的tab
  const handleStatCardClick = (layer?: string) => {
    if (layer) {
      setActiveTab(layer)
    }
  }

  // 处理查看详情
  const handleViewDetail = (asset: AssetItemDetail) => {
    setSelectedAsset(asset)
    setDrawerVisible(true)
  }

  // 处理刷新
  const handleRefresh = () => {
    message.success('数据已刷新')
  }

  // 处理查看性能监控
  const handleViewPerformance = (asset: AssetItemDetail) => {
    if (onSwitchToPerformance) {
      onSwitchToPerformance(asset.id)
    }
  }

  return (
    <div className="asset-composition-container">
      {/* 顶部统计卡片 */}
      <div className="stat-cards-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <AssetStatCard
              title="总资产"
              icon={<AppstoreOutlined />}
              statistics={compositionData.statistics.total}
              color="#1890FF"
              showChange={true}
              onClick={() => handleStatCardClick('all')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <AssetStatCard
              title="计算资源"
              icon={<HddOutlined />}
              statistics={compositionData.statistics.compute}
              color="#1890FF"
              onClick={() => handleStatCardClick('compute')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <AssetStatCard
              title="存储资源"
              icon={<DatabaseOutlined />}
              statistics={compositionData.statistics.storage}
              color="#52C41A"
              onClick={() => handleStatCardClick('storage')}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <AssetStatCard
              title="网络资源"
              icon={<CloudOutlined />}
              statistics={compositionData.statistics.network}
              color="#722ED1"
              onClick={() => handleStatCardClick('network')}
            />
          </Col>
        </Row>
      </div>

      {/* 资产列表表格 */}
      <div className="asset-table-section">
        <AssetCompositionTable
          assets={compositionData.assets}
          onViewDetail={handleViewDetail}
          onRefresh={handleRefresh}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* 资产详情抽屉 */}
      <AssetDetailDrawer
        visible={drawerVisible}
        asset={selectedAsset}
        onClose={() => setDrawerVisible(false)}
        onViewPerformance={handleViewPerformance}
      />
    </div>
  )
}

export default AssetComposition
