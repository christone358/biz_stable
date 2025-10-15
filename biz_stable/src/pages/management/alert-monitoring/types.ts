// 告警等级枚举
export enum AlertLevel {
  EMERGENCY = 'emergency',
  SEVERE = 'severe',
  WARNING = 'warning'
}

// 告警状态枚举
export enum AlertStatus {
  PENDING = 'pending',           // 待指派
  TO_PROCESS = 'toProcess',      // 待处理
  PROCESSING = 'processing',     // 处理中
  TO_CLOSE = 'toClose',         // 待关闭
  CLOSED = 'closed'             // 已关闭
}

// 资源类型枚举
export enum ResourceType {
  WEB_SERVICE = 'webService',
  DATABASE_SERVICE = 'databaseService',
  MIDDLEWARE_SERVICE = 'middlewareService',
  API_SERVICE = 'apiService',
  CACHE_SERVICE = 'cacheService',
  OPERATING_SYSTEM = 'operatingSystem',
  DATABASE_SYSTEM = 'databaseSystem',
  APPLICATION_SERVER = 'applicationServer',
  MESSAGE_QUEUE = 'messageQueue',
  SERVER = 'server',
  NETWORK_DEVICE = 'networkDevice',
  STORAGE_DEVICE = 'storageDevice',
  SECURITY_DEVICE = 'securityDevice'
}

// 告警记录接口
export interface AlertRecord {
  id: string                      // 告警ID
  level: AlertLevel              // 告警等级
  name: string                   // 告警名称
  description: string            // 告警描述
  discoveredTime: string         // 告警发现时间
  alertObject: string            // 告警对象
  resourceType: ResourceType     // 资源类型
  status: AlertStatus            // 告警状态
  assignee: string | null        // 处置责任人
}

// 资源类别接口
export interface ResourceCategory {
  id: string
  name: string
  items: ResourceItem[]
}

// 资源项接口
export interface ResourceItem {
  id: string
  name: string
  type: ResourceType
  checked: boolean
}

// 快速筛选状态接口
export interface QuickFilterState {
  level: AlertLevel | 'all'
  status: AlertStatus | 'all'
}

// 分页配置接口
export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
}
