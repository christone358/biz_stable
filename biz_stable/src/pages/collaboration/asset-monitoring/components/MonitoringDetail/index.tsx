import React, { useState, useMemo } from 'react'
import { Tabs, Spin, Empty, Card } from 'antd'
import type { SystemMonitoringData } from '../../types'
// 使用business-monitoring的统一组件和自定义组件
import OperationMetrics from './OperationMetrics'
import AlertPanel from '../../../../management/business-monitoring/components/AlertPanel'
import VulnerabilityPanel from '../../../../management/business-monitoring/components/VulnerabilityPanel'
import CallChainTab from './CallChainTab'
import AssetTopology from '../../../../management/business-monitoring/components/AssetTopology'
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
 * 展示方式：运行指标、告警、脆弱性、调用链、资产关系
 */
const MonitoringDetail: React.FC<MonitoringDetailProps> = ({
  systemId,
  systemName,
  monitoringData,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('metrics')

  // 从topology数据生成调用链数据
  const callChainData = useMemo(() => {
    if (!monitoringData?.topology) {
      return { upstream: [], downstream: [] }
    }

    // 简化处理：从topology的links中推断上下游关系
    // 这里需要根据实际的topology数据结构进行调整
    const currentSystemNode = monitoringData.topology.nodes.find(
      node => node.type === 'application'
    )

    if (!currentSystemNode) {
      return { upstream: [], downstream: [] }
    }

    // 找到所有与当前系统相关的连接
    const upstreamLinks = monitoringData.topology.links.filter(
      link => link.target === currentSystemNode.id && link.type === 'call'
    )
    const downstreamLinks = monitoringData.topology.links.filter(
      link => link.source === currentSystemNode.id && link.type === 'call'
    )

    // 构建上游系统节点
    const upstream = upstreamLinks.map(link => {
      const node = monitoringData.topology.nodes.find(n => n.id === link.source)
      return {
        systemId: node?.id || '',
        systemName: node?.name || '',
        callCount: Math.floor(Math.random() * 10000) + 1000,
        avgResponseTime: node?.metrics?.responseTime || 100,
        status: node?.status === 'HEALTHY' ? 'healthy' as const :
                node?.status === 'WARNING' ? 'warning' as const : 'error' as const
      }
    })

    // 构建下游系统节点
    const downstream = downstreamLinks.map(link => {
      const node = monitoringData.topology.nodes.find(n => n.id === link.target)
      return {
        systemId: node?.id || '',
        systemName: node?.name || '',
        callCount: Math.floor(Math.random() * 8000) + 500,
        avgResponseTime: node?.metrics?.responseTime || 80,
        status: node?.status === 'HEALTHY' ? 'healthy' as const :
                node?.status === 'WARNING' ? 'warning' as const : 'error' as const
      }
    })

    return { upstream, downstream }
  }, [monitoringData])

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
          data={callChainData}
          systemName={systemName || ''}
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
    </div>
  )
}

export default MonitoringDetail
