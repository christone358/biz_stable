import React, { useState, useEffect, useMemo } from 'react'
import SystemOverview from './components/SystemOverview'
import MonitoringDetail from './components/MonitoringDetail'
import type { SystemOverview as SystemOverviewType, SystemMonitoringData } from './types'
import { generateSystemsOverview, generateSystemMonitoringData } from './mock/monitoring-data'
import { clearUnifiedDataCache } from '../../../mock/unified-business-data'
import './index.css'

/**
 * 资产监测主页面
 */
const AssetMonitoring: React.FC = () => {
  // 清除缓存，确保使用最新的计算逻辑
  useEffect(() => {
    clearUnifiedDataCache()
  }, [])

  // 系统列表
  const [systems] = useState<SystemOverviewType[]>(() => generateSystemsOverview())

  // 当前选中的系统ID
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)

  // 当前系统的监控数据
  const [monitoringData, setMonitoringData] = useState<SystemMonitoringData | null>(null)

  // 数据加载状态
  const [loading, setLoading] = useState(false)

  // 选中的系统信息
  const selectedSystem = useMemo(() => {
    return systems.find(s => s.id === selectedSystemId) || null
  }, [systems, selectedSystemId])

  // 页面加载时默认选中第一个系统
  useEffect(() => {
    if (systems.length > 0 && !selectedSystemId) {
      setSelectedSystemId(systems[0].id)
    }
  }, [systems, selectedSystemId])

  // 当选中系统变化时，加载该系统的监控数据
  useEffect(() => {
    if (selectedSystemId) {
      setLoading(true)
      // 模拟异步加载数据
      setTimeout(() => {
        const data = generateSystemMonitoringData(selectedSystemId)
        setMonitoringData(data)
        setLoading(false)
      }, 300)
    } else {
      setMonitoringData(null)
    }
  }, [selectedSystemId])

  // 处理系统选择
  const handleSystemSelect = (systemId: string) => {
    setSelectedSystemId(systemId)
  }

  return (
    <div className="asset-monitoring-page">
      {/* 顶部：系统健康概览区域 */}
      <div className="overview-section">
        <SystemOverview
          systems={systems}
          selectedSystemId={selectedSystemId}
          onSystemSelect={handleSystemSelect}
        />
      </div>

      {/* 下方：详细监控数据区域 */}
      <div className="detail-section">
        <MonitoringDetail
          systemId={selectedSystemId}
          systemName={selectedSystem?.name || null}
          monitoringData={monitoringData}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default AssetMonitoring
