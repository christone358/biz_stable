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

  // 新增：与异常日志关联
  hasAbnormalLogs?: boolean     // 是否有异常日志
  abnormalLogCount?: number     // 异常日志数量
}

// ===== 异常日志相关类型 =====

/**
 * 异常日志级别
 */
export type AbnormalLogLevel = 'ERROR' | 'WARN'

/**
 * 异常日志分类
 */
export type AbnormalLogCategory = 'database' | 'network' | 'application' | 'system' | 'middleware'

/**
 * 异常日志统计
 */
export interface AbnormalLogSummary {
  errorCount: number           // ERROR级别日志数
  warningCount: number         // WARNING级别日志数
  total: number                // 总异常日志数

  // 时段分布数据（最近24小时）
  trendData: {
    timestamp: string
    errorCount: number
    warningCount: number
  }[]

  // 异常TOP5资产
  topAffectedAssets: {
    assetId: string
    assetName: string
    assetType: string          // compute/storage/network
    abnormalCount: number
    lastAbnormalTime: string
  }[]

  // 调用链关联统计（可选）
  relatedSystemsStats?: {
    systemId: string
    systemName: string
    logCount: number
    isUpstream: boolean        // 是否为上游系统
  }[]
}

/**
 * 异常日志详情
 */
export interface AbnormalLogDetail {
  id: string                   // 日志唯一ID
  level: AbnormalLogLevel      // 日志级别
  timestamp: string            // 时间戳

  // 资产关联
  assetId: string              // 关联资产ID
  assetName: string            // 资产名称
  assetType: string            // 资产类型

  // 日志内容
  message: string              // 日志主要消息
  loggerName: string           // 日志来源（模块/类名）
  stackTrace?: string          // 堆栈跟踪（ERROR级别）

  // 分类标签
  category: AbnormalLogCategory  // 异常分类
  tags?: string[]              // 标签（如：OOM、timeout、connection_lost）

  // 关联信息
  traceId?: string             // 链路追踪ID (NEW)
  spanId?: string              // 当前SpanID (NEW)
  relatedAlertId?: string      // 关联的告警ID
  relatedSystemId?: string     // 关联的系统ID（调用链）
  relatedSystemName?: string   // 关联的系统名称
}

// ===== 链路追踪相关类型 (NEW) =====

/**
 * Trace状态
 */
export type TraceStatus = 'success' | 'error' | 'timeout'

/**
 * 调用角色
 */
export type CallRole = 'Server' | 'Client' | 'Internal'

/**
 * 协议状态码
 */
export type ProtocolStatus = 'HTTP_200' | 'HTTP_500' | 'HTTP_404' | 'HTTP_503' | 'gRPC_0' | 'gRPC_2' | 'gRPC_14'

/**
 * Trace列表项
 */
export interface TraceListItem {
  traceId: string              // Trace ID
  spanId: string               // Root Span ID
  status: TraceStatus          // 整体状态
  protocolStatus: ProtocolStatus  // 协议状态码
  serviceName: string          // 入口服务名称
  endpoint: string             // 入口接口路径
  callRole: CallRole           // 调用角色
  duration: number             // 总耗时(ms)
  spanCount: number            // Span数量
  errorCount: number           // 错误Span数量
  startTime: string            // 开始时间
  hasLogs: boolean             // 是否有关联日志
  logCount?: number            // 关联日志数量
}

/**
 * Trace详情
 */
export interface TraceDetail {
  traceId: string
  serviceName: string
  endpoint: string
  status: TraceStatus
  duration: number
  startTime: string
  endTime: string
  spanCount: number
  errorCount: number

  // Span树
  spans: TraceSpan[]

  // 关联数据
  relatedLogs?: AbnormalLogDetail[]    // 关联的异常日志
  relatedSystems?: string[]            // 涉及的系统列表
}

/**
 * Trace Span (调用单元)
 */
export interface TraceSpan {
  spanId: string               // Span ID
  parentSpanId: string | null  // 父Span ID
  traceId: string              // Trace ID

  // 服务信息
  serviceName: string          // 服务名称
  operation: string            // 操作/方法名
  callRole: CallRole           // 调用角色

  // 时间信息
  startTime: string            // 开始时间(ISO 8601)
  endTime: string              // 结束时间
  duration: number             // 耗时(ms)

  // 状态信息
  status: 'OK' | 'ERROR' | 'TIMEOUT'
  protocolStatus?: ProtocolStatus

  // 元数据
  tags?: Record<string, string>  // 标签(如: http.method, db.statement)
  logs?: SpanLog[]               // Span日志事件

  // 错误信息(仅status=ERROR时)
  error?: {
    message: string
    type: string              // 异常类型
    stacktrace?: string       // 堆栈跟踪
  }

  // 资源信息
  resource?: {
    hostname: string          // 实例主机名
    ip: string               // 实例IP
    version?: string         // 版本号
  }

  // 子Span(用于树形渲染)
  children?: TraceSpan[]
}

/**
 * Span日志事件
 */
export interface SpanLog {
  timestamp: string
  fields: Record<string, any>  // 日志字段
}

/**
 * Trace筛选条件
 */
export interface TraceFilterParams {
  traceId?: string             // TraceID搜索
  serviceName?: string         // 服务名称
  callRole?: CallRole | 'all'  // 调用角色
  status?: TraceStatus | 'all' // 状态筛选
  minDuration?: number         // 最小耗时(ms)
  maxDuration?: number         // 最大耗时(ms)
  startTime?: string           // 开始时间范围
  endTime?: string             // 结束时间范围
  hasError?: boolean           // 只显示有错误的
  hasLogs?: boolean            // 只显示有日志的
}
