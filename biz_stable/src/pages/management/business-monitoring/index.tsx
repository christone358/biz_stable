import React, { useState, useEffect } from 'react'
import { Spin, Tabs } from 'antd'
import ApplicationHeader from './components/ApplicationHeader'
import KPICards from './components/KPICards'
import VulnerabilityPanel from './components/VulnerabilityPanel'
import AlertPanel from './components/AlertPanel'
import AssetTopology from './components/AssetTopology'
import PerformanceCharts from './components/PerformanceCharts'
import { mockApplicationMonitoringData, generateMockDataForApplication } from '../../../mock/business-monitoring-data'
import { ApplicationMonitoringData, TimeRange } from './types'
import './index.css'

const BusinessMonitoring: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ApplicationMonitoringData>(mockApplicationMonitoringData)
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: '最近24小时',
    value: '24h',
    hours: 24
  })
  const [activeTab, setActiveTab] = useState<string>('topology')

  // 可用的应用列表（模拟数据）
  const availableApps = [
    { id: 'APP_001', name: '一网通办门户' },
    { id: 'APP_002', name: '随申办APP' },
    { id: 'APP_003', name: '政务服务平台' },
    { id: 'APP_004', name: '数据共享交换平台' },
    { id: 'APP_005', name: '统一身份认证' }
  ]

  // 初始化加载数据
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  // 处理时间范围变化
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
    // 这里可以根据时间范围重新加载数据
    console.log('时间范围变更:', range)
  }

  // 处理应用切换
  const handleApplicationChange = (appId: string) => {
    setLoading(true)
    // 模拟切换应用加载数据
    setTimeout(() => {
      const newData = generateMockDataForApplication(appId)
      setData(newData)
      setLoading(false)
    }, 500)
    console.log('切换应用:', appId)
  }

  if (loading) {
    return (
      <div className="business-monitoring-loading">
        <Spin size="large" tip="加载应用监控数据..." />
      </div>
    )
  }

  return (
    <div className="business-monitoring-page">
      {/* 应用信息头部 */}
      <ApplicationHeader
        appInfo={data.appInfo}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onApplicationChange={handleApplicationChange}
        availableApps={availableApps}
      />

      {/* 三栏概览区域 */}
      <div className="overview-grid">
        {/* 左栏：KPI指标卡片 */}
        <div className="overview-left">
          <KPICards kpis={data.kpis} />
        </div>

        {/* 中栏：脆弱性动态 */}
        <div className="overview-middle">
          <VulnerabilityPanel
            summary={data.vulnerabilities.summary}
            details={data.vulnerabilities.details}
          />
        </div>

        {/* 右栏：待处置告警 */}
        <div className="overview-right">
          <AlertPanel
            summary={data.alerts.summary}
            details={data.alerts.details}
          />
        </div>
      </div>

      {/* 标签页区域：资产关系 vs 性能监控分析 */}
      <div className="tabs-section">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="business-monitoring-tabs"
          items={[
            {
              key: 'topology',
              label: '资产关系',
              children: <AssetTopology data={data.topology} />
            },
            {
              key: 'performance',
              label: '性能监控分析',
              children: <PerformanceCharts metrics={data.performance} />
            }
          ]}
        />
      </div>
    </div>
  )
}

export default BusinessMonitoring
