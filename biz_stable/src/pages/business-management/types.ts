// 业务板块管理相关类型定义

// 节点类型
export type NodeType = 'CATEGORY' | 'BUSINESS'

// 业务重要性
export type BusinessImportance = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

// 运行状态
export type OperationStatus = 'RUNNING' | 'STOPPED' | 'MAINTENANCE' | 'TESTING'

// 业务类型
export type BusinessType =
  | '事项办理'
  | '数据服务'
  | '支撑平台'
  | '基础设施'
  | '其他'

// 业务节点（树结构）
export interface BusinessNode {
  id: string
  name: string                    // 业务名称
  code: string                    // 业务编码
  nodeType: NodeType              // 节点类型：CATEGORY-分类，BUSINESS-业务
  level: number                   // 层级（1-一级，2-二级，3-三级...）
  parentId: string | null         // 父节点ID
  order: number                   // 同级排序
  children?: BusinessNode[]       // 子节点
  hasDetail: boolean              // 是否有详细信息（只有BUSINESS类型才有）
}

// 联系人信息
export interface ContactPerson {
  id: string
  name: string                    // 姓名
  role: string                    // 职务/角色
  phone: string                   // 联系电话
  email: string                   // 邮箱
  wechat?: string                 // 微信
  isPrimary: boolean              // 是否主要联系人
}

// 协同单位
export interface CooperativeUnit {
  id: string
  unitName: string                // 单位名称
  cooperationType: string         // 协作类型（技术支持/数据提供等）
  contact: ContactPerson          // 联系人
}

// 责任单位
export interface ResponsibleUnit {
  unitName: string                // 单位名称
  unitCode?: string               // 单位编码
  department?: string             // 所属部门
  primaryContact: ContactPerson   // 主要负责人
  backupContacts: ContactPerson[] // 备用联系人
  cooperativeUnits?: CooperativeUnit[] // 协同单位
}

// 业务详细信息
export interface BusinessDetail {
  id: string
  businessId: string              // 所属业务节点ID

  // === 基本信息 ===
  name: string
  code: string
  description: string
  businessType: BusinessType
  importance: BusinessImportance
  operationStatus: OperationStatus

  // === 业务特性 ===
  serviceScope: string            // 服务范围
  serviceTarget: string[]         // 服务对象（市民/企业/政府等）
  operationTime: string           // 运行时间要求（7×24/工作时间）
  annualVisits?: number           // 年访问量
  coverageRate?: number           // 覆盖率

  // === 责任单位信息（核心）===
  responsibleUnit: ResponsibleUnit    // 主责单位
  operationUnit: ResponsibleUnit      // 运维单位
  developmentUnit: ResponsibleUnit    // 开发单位

  // === 业务关系 ===
  upstreamBusinessIds: string[]   // 上游业务ID列表
  downstreamBusinessIds: string[] // 下游业务ID列表

  // === 元数据 ===
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

// 业务重要性配置
export const BusinessImportanceConfig: Record<BusinessImportance, {
  label: string
  color: string
  description: string
}> = {
  CRITICAL: {
    label: '关键业务',
    color: '#ff4d4f',
    description: '影响核心服务，需7×24保障'
  },
  HIGH: {
    label: '重要业务',
    color: '#faad14',
    description: '影响重要服务，需优先保障'
  },
  MEDIUM: {
    label: '一般业务',
    color: '#1677ff',
    description: '常规业务，正常保障'
  },
  LOW: {
    label: '辅助业务',
    color: '#52c41a',
    description: '辅助性业务'
  }
}

// 运行状态配置
export const OperationStatusConfig: Record<OperationStatus, {
  label: string
  color: string
  icon: string
}> = {
  RUNNING: { label: '运行中', color: '#52c41a', icon: '🟢' },
  STOPPED: { label: '已停用', color: '#d9d9d9', icon: '⚫' },
  MAINTENANCE: { label: '维护中', color: '#faad14', icon: '🟡' },
  TESTING: { label: '测试中', color: '#1677ff', icon: '🔵' }
}

// 业务类型配置
export const BusinessTypeOptions: BusinessType[] = [
  '事项办理',
  '数据服务',
  '支撑平台',
  '基础设施',
  '其他'
]

// 服务对象选项
export const ServiceTargetOptions = [
  { label: '市民', value: '市民' },
  { label: '企业', value: '企业' },
  { label: '政府内部', value: '政府内部' }
]

// 运行时间选项
export const OperationTimeOptions = [
  { label: '7×24小时', value: '7×24' },
  { label: '工作时间', value: '工作时间' },
  { label: '自定义', value: '自定义' }
]

// 协作类型选项
export const CooperationTypeOptions = [
  '技术支持',
  '数据提供',
  '业务协同',
  '运维协作',
  '其他'
]
