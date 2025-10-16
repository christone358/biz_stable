/**
 * 资产监测页面类型定义
 * 统一使用business-monitoring的数据结构
 */

// ===== 重新导出business-monitoring的核心类型 =====
export type {
  ApplicationMonitoringData as SystemMonitoringData,
  ApplicationKPIs,
  AlertSummary,
  AlertDetail,
  VulnerabilitySummary,
  VulnerabilityDetail,
  AssetTopologyData,
  PerformanceMetrics,
  PerformanceDataPoint,
  AssetNode
} from '../../management/business-monitoring/types'

// ===== 系统健康相关类型（保留用于SystemCard组件） =====

/**
 * 系统健康状态
 */
export type SystemHealthStatus = 'healthy' | 'warning' | 'critical'

/**
 * 系统概览信息（用于顶部卡片视图）
 */
export interface SystemOverview {
  id: string                          // 系统ID
  name: string                        // 系统名称
  shortName?: string                  // 系统简称（简略视图显示）
  healthScore: number                 // 健康度分数（0-100）
  healthStatus: SystemHealthStatus    // 健康状态
  healthLabel: string                 // 健康状态文字
  healthColor: string                 // 健康状态颜色

  // 快速统计
  metricsStatus: 'normal' | 'abnormal'  // 关键指标状态
  alertCount: number                    // 告警数量
  vulnerabilityCount: number            // 脆弱性数量
  assetCount: number                    // 资产数量
  lastUpdateTime: string                // 最近更新时间
}

// ===== 调用链相关类型（用于CallChainTab组件） =====

/**
 * 系统调用链节点
 */
export interface SystemNode {
  systemId: string
  systemName: string
  callCount: number          // 调用次数
  avgResponseTime: number    // 平均响应时间（ms）
  status: 'healthy' | 'warning' | 'error'
}
