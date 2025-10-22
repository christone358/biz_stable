import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spin, Tabs, Card, Row, Col, Button } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import BusinessInfoCard from './components/BusinessInfoCard'
import KPICards from './components/KPICards'
import AnomalyPanel from './components/AnomalyPanel'
import AssetTopology from './components/AssetTopology'
import AssetPerformancePanel from './components/AssetPerformancePanel'
import AssetComposition from './components/AssetComposition'
import { mockApplicationMonitoringData, generateMonitoringDataForAsset } from '../../../mock/business-monitoring-data'
import { generateAssetsForSystem } from '../../../mock/asset-performance-data'
import { ApplicationMonitoringData, TimeRange } from './types'
import './index.css'

const BusinessMonitoring: React.FC = () => {
  const location = useLocation()
  const locationState = location.state as {
    businessId?: string
    businessName?: string
    systemId?: string
    department?: string
    assetId?: string
    assetName?: string
    assetType?: string
    layerType?: string
  } | null

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ApplicationMonitoringData>(mockApplicationMonitoringData)
  const [activeTab, setActiveTab] = useState<string>('operation')
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: '最近4小时',
    value: '4h',
    hours: 4
  })

  // 初始化加载数据
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      // 如果有从panorama页面传递的参数，则生成相关联的数据
      if (locationState && (locationState.systemId || locationState.businessId)) {
        const contextData = generateMonitoringDataForAsset(locationState)
        setData(contextData)
      } else {
        setData(mockApplicationMonitoringData)
      }
      setLoading(false)
    }, 500)
  }, [locationState])

  // 处理时间范围变化
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
    console.log('时间范围变更:', range)
  }

  // 处理告警或脆弱性点击
  const handleAnomalyClick = (affectedAssetId: string) => {
    setSelectedAssetId(affectedAssetId)
    console.log('选中资产ID:', affectedAssetId)
  }

  // 处理"更多"按钮点击，切换到性能监控标签页
  const handleMoreClick = () => {
    setActiveTab('performance')
  }

  if (loading) {
    return (
      <div className="business-monitoring-loading">
        <Spin size="large" tip="加载应用监控数据..." />
      </div>
    )
  }

  // Tab 1: 运行概览
  const operationTab = (
    <div className="operation-tab-content">
      {/* 顶部：关键指标区域 */}
      <div className="kpi-section">
        <div className="section-header">
          <div className="section-title-text">关键指标</div>
          <Button type="link" onClick={handleMoreClick} icon={<ArrowRightOutlined />}>
            全部指标
          </Button>
        </div>
        <KPICards kpis={data.kpis} />
      </div>

      {/* 底部：异常信息区域（左右分栏） */}
      <div className="anomaly-section">
        <Row gutter={24}>
          {/* 左侧：异常信息（告警/脆弱性切换） (40%) */}
          <Col span={10}>
            <AnomalyPanel
              vulnerabilities={data.vulnerabilities}
              alerts={data.alerts}
              onAnomalyClick={handleAnomalyClick}
            />
          </Col>

          {/* 右侧：资产拓扑 (60%) */}
          <Col span={14}>
            <Card title="资产拓扑" bordered={false} className="topology-card">
              <AssetTopology data={data.topology} selectedAssetId={selectedAssetId} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )

  // Tab 2: 性能监控
  const performanceTab = (
    <div className="performance-tab-content">
      {/* 资产性能监控面板（左侧树 + 右侧图表） */}
      <AssetPerformancePanel
        systemId={data.appInfo.id}
        systemName={data.appInfo.name}
        assets={generateAssetsForSystem(data.appInfo.id, data.appInfo.name)}
        timeRange={timeRange}
      />
    </div>
  )

  // Tab 3: 资产组成
  const assetCompositionTab = (
    <div className="asset-composition-tab-content">
      <AssetComposition
        systemId={data.appInfo.id}
        systemName={data.appInfo.name}
        onSwitchToPerformance={(assetId) => {
          setActiveTab('performance')
          // TODO: 切换到性能监控标签页并选中指定资产
        }}
      />
    </div>
  )

  return (
    <div className="business-monitoring-page">
      {/* 业务资产基本信息卡片 */}
      <BusinessInfoCard businessInfo={data.appInfo} />

      {/* 标签页区域 */}
      <div className="tabs-section">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="business-monitoring-tabs"
          items={[
            {
              key: 'operation',
              label: '运行概览',
              children: operationTab
            },
            {
              key: 'performance',
              label: '性能监控',
              children: performanceTab
            },
            {
              key: 'composition',
              label: '资产组成',
              children: assetCompositionTab
            }
          ]}
        />
      </div>
    </div>
  )
}

export default BusinessMonitoring
