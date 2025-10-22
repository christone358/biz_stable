import React, { useState, useMemo, useEffect } from 'react'
import { Tabs, Spin, Empty, Card } from 'antd'
import type { SystemMonitoringData, TraceDetail } from '../../types'
// 使用business-monitoring的统一组件和自定义组件
import OperationMetrics from './OperationMetrics'
import AlertPanel from '../../../../management/business-monitoring/components/AlertPanel'
import VulnerabilityPanel from '../../../../management/business-monitoring/components/VulnerabilityPanel'
import CallChainTab from './CallChainTab'
import AbnormalLogTab from './AbnormalLogTab'
import TraceTab from './TraceTab'
import TraceDetailDrawer from './TraceDetailDrawer'
import AssetTopology from '../../../../management/business-monitoring/components/AssetTopology'
import { generateAbnormalLogsForSystem } from '../../../../../mock/abnormal-log-data'
import { generateTraceList, correlateLogsWithTraces, generateTraceDetail } from '../../../../../mock/trace-data'
import './index.css'

interface MonitoringDetailProps {
  systemId: string | null                        // 当前选中的系统ID
  systemName: string | null                       // 当前选中的系统名称
  monitoringData: SystemMonitoringData | null
  loading?: boolean
}

/**
 * 监控详情组件
 * 管理下方详细监控区域，处理Tab切换和数据加载
 * 使用unified business-monitoring的数据结构
 * 展示方式：运行指标、告警、脆弱性、调用链、异常日志、资产关系
 */
const MonitoringDetail: React.FC<MonitoringDetailProps> = ({
  systemId,
  systemName,
  monitoringData,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('metrics')

  // 跨Tab联动状态
  const [highlightSystemId, setHighlightSystemId] = useState<string | undefined>(undefined)
  const [filterSystemId, setFilterSystemId] = useState<string | undefined>(undefined)
  const [highlightTraceId, setHighlightTraceId] = useState<string | undefined>(undefined)

  // Trace详情抽屉状态
  const [traceDetailVisible, setTraceDetailVisible] = useState(false)
  const [selectedTraceDetail, setSelectedTraceDetail] = useState<TraceDetail | null>(null)

  // 生成Trace数据
  const traceData = useMemo(() => {
    if (!systemId || !systemName) return []
    return generateTraceList(systemId, systemName, {
      count: 200,
      errorRate: 0.35,
      timeRangeHours: 1
    })
  }, [systemId, systemName])

  // 生成异常日志数据
  const abnormalLogDataRaw = useMemo(() => {
    if (!systemId || !systemName) return null
    return generateAbnormalLogsForSystem(systemId, systemName, {
      hoursBack: 24,
      errorRate: 0.35,
      totalCount: 150
    })
  }, [systemId, systemName])

  // 关联日志和Trace (为日志添加TraceID)
  const abnormalLogData = useMemo(() => {
    if (!abnormalLogDataRaw || traceData.length === 0) return abnormalLogDataRaw

    const correlatedLogs = correlateLogsWithTraces(abnormalLogDataRaw.logs, traceData)

    return {
      ...abnormalLogDataRaw,
      logs: correlatedLogs
    }
  }, [abnormalLogDataRaw, traceData])

  // 增强调用链数据，添加异常日志关联
  const enhancedCallChainData = useMemo(() => {
    if (!systemId || !systemName || !abnormalLogData) {
      return { upstream: [], downstream: [] }
    }

    // 从异常日志中统计关联系统的日志数量
    const systemLogCounts = new Map<string, number>()
    abnormalLogData.logs.forEach(log => {
      if (log.relatedSystemId) {
        systemLogCounts.set(
          log.relatedSystemId,
          (systemLogCounts.get(log.relatedSystemId) || 0) + 1
        )
      }
    })

    // 生成合理的上游系统Mock数据 (3-5个上游系统)
    const upstreamSystems = [
      { id: 'sys-gateway', name: 'API网关', responseTime: 15, status: 'healthy' as const },
      { id: 'sys-auth', name: '认证服务', responseTime: 25, status: 'healthy' as const },
      { id: 'sys-nginx', name: 'Nginx负载均衡', responseTime: 8, status: 'healthy' as const }
    ]

    const upstream = upstreamSystems.map(sys => {
      const abnormalLogCount = systemLogCounts.get(sys.id) || 0
      return {
        systemId: sys.id,
        systemName: sys.name,
        callCount: Math.floor(Math.random() * 10000) + 5000,
        avgResponseTime: sys.responseTime + Math.floor(Math.random() * 10),
        status: sys.status,
        hasAbnormalLogs: abnormalLogCount > 0,
        abnormalLogCount
      }
    })

    // 生成合理的下游系统Mock数据 (4-6个下游系统)
    const downstreamSystems = [
      { id: 'sys-order', name: '订单服务', responseTime: 120, status: 'healthy' as const },
      { id: 'sys-payment', name: '支付服务', responseTime: 250, status: 'warning' as const },
      { id: 'sys-inventory', name: '库存服务', responseTime: 80, status: 'healthy' as const },
      { id: 'sys-user', name: '用户服务', responseTime: 45, status: 'healthy' as const },
      { id: 'sys-notification', name: '通知服务', responseTime: 35, status: 'error' as const },
      { id: 'sys-mysql', name: 'MySQL数据库', responseTime: 12, status: 'healthy' as const }
    ]

    const downstream = downstreamSystems.map(sys => {
      const abnormalLogCount = systemLogCounts.get(sys.id) || 0
      // 错误系统添加异常日志
      const hasError = sys.status === 'error' || sys.status === 'warning'
      return {
        systemId: sys.id,
        systemName: sys.name,
        callCount: Math.floor(Math.random() * 8000) + 2000,
        avgResponseTime: sys.responseTime + Math.floor(Math.random() * 20),
        status: sys.status,
        hasAbnormalLogs: hasError || abnormalLogCount > 0,
        abnormalLogCount: hasError ? Math.floor(Math.random() * 15) + 5 : abnormalLogCount
      }
    })

    return { upstream, downstream }
  }, [systemId, systemName, abnormalLogData])

  // 获取Trace详情的关联日志 (必须在条件返回之前)
  const relatedLogsForTrace = useMemo(() => {
    if (!selectedTraceDetail || !abnormalLogData) return []
    return abnormalLogData.logs.filter(log => log.traceId === selectedTraceDetail.traceId)
  }, [selectedTraceDetail, abnormalLogData])

  // 处理从调用链跳转到异常日志
  const handleNavigateToLogs = (targetSystemId: string) => {
    setFilterSystemId(targetSystemId || undefined)
    setActiveTab('abnormalLogs')
  }

  // 处理从异常日志跳转到调用链
  const handleNavigateToCallChain = (targetSystemId: string) => {
    setHighlightSystemId(targetSystemId || undefined)
    setActiveTab('callChain')
  }

  // NEW: 处理从异常日志跳转到链路追踪
  const handleNavigateToTrace = (traceId: string) => {
    setHighlightTraceId(traceId || undefined)
    setActiveTab('trace')
  }

  // NEW: 处理点击Trace详情
  const handleTraceClick = (traceId: string) => {
    if (!systemId || !systemName) return

    // 生成Trace详情数据
    const traceDetail = generateTraceDetail(systemId, systemName, {
      hasError: Math.random() < 0.35
    })
    // 使用点击的TraceID
    traceDetail.traceId = traceId

    setSelectedTraceDetail(traceDetail)
    setTraceDetailVisible(true)
  }

  // 处理关闭Trace详情抽屉
  const handleCloseTraceDetail = () => {
    setTraceDetailVisible(false)
    setSelectedTraceDetail(null)
  }

  // 从Trace详情跳转到异常日志Tab
  const handleNavigateToLogsFromTrace = () => {
    setTraceDetailVisible(false)
    setActiveTab('abnormalLogs')
  }

  // Tab切换时清除联动状态
  useEffect(() => {
    if (activeTab !== 'callChain') {
      setHighlightSystemId(undefined)
    }
    if (activeTab !== 'abnormalLogs') {
      setFilterSystemId(undefined)
    }
    if (activeTab !== 'trace') {
      setHighlightTraceId(undefined)
    }
  }, [activeTab])

  if (loading) {
    return (
      <div className="monitoring-detail-container">
        <div className="monitoring-detail-loading">
          <Spin size="large" tip="加载监控数据中..." />
        </div>
      </div>
    )
  }

  if (!systemId || !monitoringData) {
    return (
      <div className="monitoring-detail-container">
        <div className="monitoring-detail-empty">
          <Empty
            description="请选择一个系统查看详细监控数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    )
  }

  const tabItems = [
    {
      key: 'metrics',
      label: '运行指标',
      children: (
        <OperationMetrics
          systemId={systemId!}
          systemName={systemName!}
          kpis={monitoringData.kpis}
          performance={monitoringData.performance}
        />
      )
    },
    {
      key: 'alerts',
      label: `告警 (${monitoringData.alerts.summary.total})`,
      children: (
        <AlertPanel
          summary={monitoringData.alerts.summary}
          details={monitoringData.alerts.details}
        />
      )
    },
    {
      key: 'vulnerabilities',
      label: `脆弱性 (${monitoringData.vulnerabilities.summary.total})`,
      children: (
        <VulnerabilityPanel
          summary={monitoringData.vulnerabilities.summary}
          details={monitoringData.vulnerabilities.details}
        />
      )
    },
    {
      key: 'callChain',
      label: '调用链',
      children: (
        <CallChainTab
          data={enhancedCallChainData}
          systemName={systemName || ''}
          onNavigateToLogs={handleNavigateToLogs}
          highlightSystemId={highlightSystemId}
        />
      )
    },
    {
      key: 'abnormalLogs',
      label: `异常日志 (${abnormalLogData?.summary.total || 0})`,
      children: abnormalLogData && (
        <AbnormalLogTab
          systemId={systemId!}
          systemName={systemName!}
          summary={abnormalLogData.summary}
          logs={abnormalLogData.logs}
          onNavigateToCallChain={handleNavigateToCallChain}
          onNavigateToTrace={handleNavigateToTrace}
        />
      )
    },
    {
      key: 'trace',
      label: `链路追踪 (${traceData.length})`,
      children: (
        <TraceTab
          systemId={systemId!}
          systemName={systemName!}
          traces={traceData}
          onTraceClick={handleTraceClick}
          highlightTraceId={highlightTraceId}
        />
      )
    },
    {
      key: 'assetRelation',
      label: '资产关系',
      children: (
        <Card bordered={false}>
          <AssetTopology data={monitoringData.topology} />
        </Card>
      )
    }
  ]

  return (
    <div className="monitoring-detail-container">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* Trace详情抽屉 */}
      <TraceDetailDrawer
        visible={traceDetailVisible}
        traceDetail={selectedTraceDetail}
        relatedLogs={relatedLogsForTrace}
        onClose={handleCloseTraceDetail}
        onNavigateToLogs={handleNavigateToLogsFromTrace}
      />
    </div>
  )
}

export default MonitoringDetail
