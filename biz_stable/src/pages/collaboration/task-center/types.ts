/**
 * 任务中心类型定义
 */

// ===== 脆弱性相关类型 =====

/**
 * 风险等级
 */
export type RiskLevel = 'high' | 'medium' | 'low'

/**
 * 脆弱性任务状态
 */
export type VulnerabilityStatus = 'unhandled' | 'processing' | 'completed'

/**
 * 脆弱性任务
 */
export interface Vulnerability {
  id: string
  name: string                    // 漏洞名称
  cveId: string                  // CVE编号
  riskLevel: RiskLevel           // 风险等级
  affectedAsset: {               // 受影响的资产
    name: string                 // 资产名称
    ipAddress: string            // IP地址
  }
  affectedBusiness: string       // 影响业务
  publishTime: string            // 发布时间
  status: VulnerabilityStatus    // 状态
  description?: string           // 漏洞描述
}

/**
 * 脆弱性处理表单数据
 */
export interface VulnerabilityHandleForm {
  status: 'processing' | 'completed'   // 处理状态
  handleMethod: string                 // 处理方式
  remark: string                       // 处理备注
  attachments?: File[]                 // 附件
}

// ===== 资产相关类型 =====

/**
 * 资产处置类型
 */
export type AssetDisposalType = 'claim' | 'compliance' | 'responsibility'

/**
 * 资产状态
 */
export type AssetStatus = 'unclaimed' | 'claimed' | 'rejected'

/**
 * 资产任务
 */
export interface Asset {
  id: string
  name: string                    // 资产名称
  ipAddress: string              // IP地址
  type: string                   // 资产类型
  os: string                     // 操作系统
  affectedBusiness: string       // 影响业务
  discoveryTime: string          // 发现时间
  status: AssetStatus            // 状态
  location?: string              // 物理位置
  disposalType: AssetDisposalType // 处置类型
}

/**
 * 资产认领表单数据
 */
export interface AssetClaimForm {
  department: string             // 所属部门
  remark: string                 // 认领备注
}

/**
 * 资产拒绝表单数据
 */
export interface AssetRejectForm {
  reason: string                 // 拒绝原因
  detail: string                 // 详细说明
}

// ===== 告警相关类型 =====

/**
 * 告警级别
 */
export type AlertLevel = 'critical' | 'important' | 'normal'

/**
 * 告警状态
 */
export type AlertStatus = 'unhandled' | 'processing' | 'resolved' | 'ignored'

/**
 * 告警任务
 */
export interface Alert {
  id: string
  name: string                    // 告警名称
  relatedAsset: {
    name: string
    ipAddress: string
  }
  level: AlertLevel              // 告警级别
  affectedBusiness: string       // 影响业务
  duration: string               // 持续时间
  occurTime: string              // 发生时间
  status: AlertStatus            // 状态
}

/**
 * 告警处理表单数据
 */
export interface AlertHandleForm {
  status: 'processing' | 'resolved'    // 处理状态
  causeAnalysis: string                // 原因分析
  handleMeasures: string               // 处理措施
  result: string                       // 处理结果
}

/**
 * 告警忽略表单数据
 */
export interface AlertIgnoreForm {
  reason: string                       // 忽略原因
  detail: string                       // 详细说明
  duration: '1day' | '3day' | '1week' | 'permanent'  // 忽略时长
}

// ===== 通用类型 =====

/**
 * 筛选状态
 */
export type FilterStatus = 'all' | string

/**
 * 统计数据
 */
export interface TaskStatisticsData {
  vulnerability: number          // 脆弱性处置数量
  assetClaim: number            // 资产认领数量
  alertHandle: number           // 告警处置数量
}

/**
 * 今日统计
 */
export interface TodayStatistics {
  newTasks: number              // 今日新增
  completedTasks: number        // 今日完成
}

/**
 * 模态框类型
 */
export type ModalType =
  | 'vulnerability-handle'
  | 'asset-claim'
  | 'asset-reject'
  | 'alert-handle'
  | 'alert-ignore'
  | 'success'

/**
 * 模态框配置
 */
export interface ModalConfig {
  visible: boolean
  type: ModalType
  data: any
}

/**
 * 成功提示配置
 */
export interface SuccessConfig {
  title: string
  message: string
}
