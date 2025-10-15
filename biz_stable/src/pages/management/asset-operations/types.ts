/**
 * 资产运营管理 - TypeScript类型定义
 */

// 资产类型
export enum AssetType {
  SERVER = 'SERVER', // 服务器
  DESKTOP = 'DESKTOP', // 台式机
  NETWORK_DEVICE = 'NETWORK_DEVICE', // 网络设备
  MIDDLEWARE = 'MIDDLEWARE', // 中间件
  DATABASE = 'DATABASE', // 数据库
  STORAGE = 'STORAGE', // 存储设备
  SECURITY = 'SECURITY', // 安全设备
  OTHER = 'OTHER' // 其他
}

// 资产状态
export enum AssetStatus {
  UNMANAGED = 'UNMANAGED', // 未纳管
  MANAGED = 'MANAGED', // 已纳管
  PENDING = 'PENDING', // 待确认
  IGNORED = 'IGNORED' // 已忽略
}

// 资产属性类型
export enum AssetAttribute {
  ORPHAN = 'ORPHAN', // 无主资产
  UNKNOWN = 'UNKNOWN', // 未知资产
  NON_COMPLIANT = 'NON_COMPLIANT', // 不合规资产
  NORMAL = 'NORMAL' // 正常资产
}

// 纳管动态类型
export enum DynamicType {
  ASSIGN = 'ASSIGN', // 指派
  CLAIM = 'CLAIM', // 认领
  IMPORT = 'IMPORT', // 导入
  IGNORE = 'IGNORE' // 忽略
}

// 未纳管资产数据结构
export interface UnmanagedAsset {
  id: string // 资产ID
  name: string // 资产名称
  type: AssetType // 资产类型
  attribute: AssetAttribute // 资产属性
  ipAddress: string // IP地址
  location?: string // 物理位置
  discoveredTime: string // 发现时间
  discoveredSource: string // 发现来源
  status: AssetStatus // 资产状态
  description?: string // 资产描述
  os?: string // 操作系统
  version?: string // 版本信息
  manufacturer?: string // 厂商
}

// 资产类型统计
export interface AssetTypeStats {
  type: AssetType // 资产类型
  total: number // 总数
  unmanaged: number // 未纳管数量
  managed: number // 已纳管数量
  orphan: number // 无主资产数量
  unknown: number // 未知资产数量
  nonCompliant: number // 不合规资产数量
}

// 部门资产纳管动态
export interface DepartmentDynamic {
  id: string // 动态ID
  departmentId: string // 部门ID
  departmentName: string // 部门名称
  type: DynamicType // 动态类型
  assetCount: number // 资产数量
  operator: string // 操作人
  operateTime: string // 操作时间
  description: string // 描述
}

// 部门信息
export interface Department {
  id: string // 部门ID
  name: string // 部门名称
  parentId?: string // 父部门ID
  level: number // 层级
  managedAssetCount: number // 已纳管资产数量
  responsiblePerson?: string // 负责人
  contactInfo?: string // 联系方式
}

// 部门资产信息
export interface DepartmentAsset {
  id: string // 资产ID
  name: string // 资产名称
  type: AssetType // 资产类型
  ipAddress: string // IP地址
  managedTime: string // 纳管时间
  responsiblePerson: string // 责任人
  status: AssetStatus // 状态
}

// 分页配置
export interface PaginationConfig {
  current: number // 当前页码
  pageSize: number // 每页条数
  total: number // 总数
}

// 筛选条件
export interface FilterConfig {
  assetType?: AssetType | 'all' // 资产类型筛选
  assetAttribute?: AssetAttribute | 'all' // 资产属性筛选
  searchKeyword?: string // 搜索关键词
  dateRange?: [string, string] // 时间范围
}

// 指派表单数据
export interface AssignFormData {
  departmentId: string // 目标部门ID
  responsiblePerson: string // 责任人
  contactInfo?: string // 联系方式
  remark?: string // 备注
}
