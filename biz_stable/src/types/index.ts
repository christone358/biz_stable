// 健康状态枚举
export type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNKNOWN'

// 重要性等级枚举
export type ImportanceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

// 告警级别枚举
export type AlertLevel = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'

// 资产信息
export interface Asset {
  id: string
  name: string
  type: string
  healthStatus: HealthStatus
  importance: ImportanceLevel
  systemId: string
  systemName: string
  departmentId: string
  department: string
  ipAddress?: string
  description?: string
  errorRate: number
  responseTime: number
  availability: number
  alertCount: number
  vulnerabilityCount: number
  lastCheck?: string
  createdAt: string
  updatedAt: string
}

// 组织节点
export interface OrganizationNode {
  id: string
  name: string
  type: 'root' | 'department' | 'system' | 'asset'
  systemCount: number
  assetCount: number
  healthStatus: HealthStatus
  children?: OrganizationNode[]
  level?: number
  parentId?: string
  assets?: Asset[]
  isExpanded?: boolean
}

// 业务系统
export interface BusinessSystem {
  id: string
  name: string
  displayName?: string
  description?: string
  department: string
  departmentId: string
  importance: ImportanceLevel
  healthStatus: HealthStatus
  assetCount: number
  vulnerabilityCount: number
  alertCount: number
  errorRate: number
  responseTime: number
  availability: number
  assets?: Asset[]
  lastCheck?: string
  createdAt: string
  updatedAt: string
}

// 系统指标
export interface SystemMetrics {
  systemId: string
  errorRate: number
  responseTime: number
  availability: number
  throughput: number
  activeUsers: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  timestamp: string
}

// 告警信息
export interface Alert {
  id: string
  systemId: string
  systemName: string
  department: string
  level: AlertLevel
  type: string
  title: string
  description: string
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CLOSED'
  timestamp: string
  duration?: number
  impact?: 'HIGH' | 'MEDIUM' | 'LOW'
}

// 漏洞信息
export interface Vulnerability {
  id: string
  cveId?: string
  systemId: string
  systemName: string
  department: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  cvssScore: number
  title: string
  description: string
  status: 'OPEN' | 'FIXING' | 'TESTING' | 'RESOLVED' | 'FALSE_POSITIVE'
  discoveryDate: string
  fixRecommendation?: string
  estimatedFixTime?: number
}

// KPI指标
export interface DashboardMetrics {
  totalSystems: number
  abnormalSystems: {
    count: number
    warningCount: number
    criticalCount: number
    rate: number
  }
  urgentAlerts: {
    total: number
    p0Count: number
    p1Count: number
    latestTime?: string
  }
  criticalVulnerabilities: {
    count: number
    affectedSystems: number
    longestUnfixed: number
  }
}

// 矩阵图维度
export interface MatrixDimensions {
  departments: string[]
  importanceLevels: ImportanceLevel[]
}

// 过滤选项
export interface FilterOptions {
  departments?: string[]
  healthStatus?: HealthStatus[]
  importance?: ImportanceLevel[]
  hasVulnerabilities?: boolean
  hasAlerts?: boolean
}

// API响应结构
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: string
}