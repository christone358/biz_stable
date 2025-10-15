// 应用监控详情页面类型定义

import { HealthStatus, ImportanceLevel, AlertLevel } from '../../../types'

// 应用基本信息
export interface ApplicationInfo {
  id: string
  name: string
  displayName: string
  status: 'running' | 'stopped' | 'warning' | 'error'
  department: string
  owner: string
  monitoringDuration: string // 监测时长，如 "30天"
  lastUpdateTime: string
}

// KPI指标数据
export interface KPIMetric {
  label: string
  value: number | string
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number // 趋势变化百分比
  status: 'good' | 'warning' | 'danger'
  chartData: number[] // 迷你趋势图数据
}

// 应用监控KPI指标集合
export interface ApplicationKPIs {
  healthScore: KPIMetric // 健康度
  accessVolume: KPIMetric // 访问量
  logVolume: KPIMetric // 日志量
  errorRate: KPIMetric // 错误率
  responseTime: KPIMetric // 响应时间
  sla: KPIMetric // SLA
}

// 脆弱性统计
export interface VulnerabilitySummary {
  critical: number // 严重
  high: number // 高危
  medium: number // 中危
  low: number // 低危
  total: number
}

// 脆弱性详细信息
export interface VulnerabilityDetail {
  id: string
  cveId?: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  cvssScore: number
  title: string
  description: string
  affectedAsset: string
  discoveryDate: string
  status: 'OPEN' | 'FIXING' | 'RESOLVED'
  fixRecommendation?: string
}

// 告警统计
export interface AlertSummary {
  urgent: number // 紧急
  warning: number // 警告
  info: number // 提醒
  total: number
}

// 告警详细信息
export interface AlertDetail {
  id: string
  level: 'urgent' | 'warning' | 'info'
  type: string
  title: string
  description: string
  affectedAsset: string
  timestamp: string
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'
  duration?: number
}

// 资产节点类型
export interface AssetNode {
  id: string
  name: string
  type: 'application' | 'service' | 'middleware' | 'server'
  status: HealthStatus
  importance: ImportanceLevel
  metrics?: {
    cpu?: number
    memory?: number
    responseTime?: number
  }
  children?: AssetNode[]
}

// 资产关系拓扑数据
export interface AssetTopologyData {
  nodes: AssetNode[]
  links: {
    source: string
    target: string
    type: 'call' | 'depend'
  }[]
}

// 性能监控时序数据点
export interface PerformanceDataPoint {
  timestamp: string
  value: number
}

// 性能监控指标
export interface PerformanceMetrics {
  cpu: PerformanceDataPoint[] // CPU使用率
  memory: PerformanceDataPoint[] // 内存使用率
  responseTime: PerformanceDataPoint[] // 响应时间
  errorRate: PerformanceDataPoint[] // 错误率
  throughput: PerformanceDataPoint[] // 吞吐量
  requestCount: PerformanceDataPoint[] // 请求数
}

// 时间范围选项
export interface TimeRange {
  label: string
  value: string
  hours: number
}

// 应用监控完整数据
export interface ApplicationMonitoringData {
  appInfo: ApplicationInfo
  kpis: ApplicationKPIs
  vulnerabilities: {
    summary: VulnerabilitySummary
    details: VulnerabilityDetail[]
  }
  alerts: {
    summary: AlertSummary
    details: AlertDetail[]
  }
  topology: AssetTopologyData
  performance: PerformanceMetrics
}
