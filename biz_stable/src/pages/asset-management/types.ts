// 资产管理相关类型定义

// 资产基础类型
export type AssetType =
  | 'HOST'           // 主机（物理机/虚拟机）
  | 'DATABASE'       // 数据库
  | 'MIDDLEWARE'     // 中间件
  | 'APPLICATION'    // 应用服务
  | 'NETWORK'        // 网络设备
  | 'STORAGE'        // 存储设备
  | 'CONTAINER'      // 容器

// 资产层级分类
export type AssetLayer =
  | 'INFRASTRUCTURE' // 基础设施层（硬件/虚拟化）
  | 'MIDDLEWARE'     // 中间件层
  | 'APPLICATION'    // 应用服务层

// 确认状态
export type ConfirmStatus = 'CONFIRMED' | 'PENDING' | 'AUTO_DISCOVERED'

// 资产状态
export type AssetStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'UNKNOWN'

// 健康状态
export type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'UNKNOWN'

// 依赖类型
export type DependencyType = 'DEPLOY' | 'CONNECT' | 'DATA' | 'SERVICE'

// 发现方式
export type DiscoveryMethod = 'MANUAL' | 'IMPORT' | 'LOG_ANALYSIS' | 'CMDB_SYNC'

// 证据类型
export type EvidenceType = 'LOG' | 'NETWORK_TRAFFIC' | 'API_CALL' | 'CONFIG'

// 资产依赖关系
export interface AssetDependency {
  targetAssetId: string           // 依赖的资产ID
  targetAssetName: string         // 依赖的资产名称
  dependencyType: DependencyType  // 依赖类型
  description?: string            // 依赖描述
}

// 资产规格信息
export interface AssetSpecs {
  cpu?: string                    // CPU规格
  memory?: string                 // 内存规格
  disk?: string                   // 磁盘规格
  os?: string                     // 操作系统
}

// 资产监控信息
export interface AssetMetrics {
  cpuUsage?: number               // CPU使用率
  memoryUsage?: number            // 内存使用率
  diskUsage?: number              // 磁盘使用率
  responseTime?: number           // 响应时间
}

// 资产详细信息
export interface Asset {
  id: string
  name: string                    // 资产名称
  code: string                    // 资产编码
  type: AssetType                 // 资产类型
  layer: AssetLayer               // 所属层级

  // 归属信息
  businessId: string              // 所属业务ID
  businessName: string            // 所属业务名称
  confirmStatus: ConfirmStatus    // 确认状态

  // 基础配置信息
  ip?: string                     // IP地址
  hostname?: string               // 主机名
  port?: number                   // 端口
  version?: string                // 版本
  vendor?: string                 // 厂商
  model?: string                  // 型号

  // 规格信息
  specs?: AssetSpecs

  // 资产关系
  dependencies: AssetDependency[] // 依赖的资产
  dependents: string[]            // 被哪些资产依赖

  // 状态信息
  status: AssetStatus
  healthStatus: HealthStatus

  // 监控信息
  metrics?: AssetMetrics

  // 发现方式
  discoveryMethod: DiscoveryMethod
  discoveryTime: string           // 发现时间
  discoverySource?: string        // 发现源

  // 管理信息
  owner?: string                  // 负责人
  tags?: string[]                 // 标签
  description?: string            // 描述

  // 元数据
  createdAt: string
  updatedAt: string
  confirmedAt?: string            // 确认时间
  confirmedBy?: string            // 确认人
}

// 资产证据
export interface AssetEvidence {
  type: EvidenceType
  content: string                 // 证据内容
  timestamp: string               // 时间戳
  source: string                  // 来源
}

// 待确认资产
export interface PendingAsset extends Asset {
  confidence: number              // 置信度 (0-100)
  evidences: AssetEvidence[]      // 证据列表
  suggestedBusinessId: string     // 建议归属的业务ID
  reason: string                  // 推荐理由
}

// 资产统计信息
export interface AssetStatistics {
  total: number                   // 总数
  byType: Record<AssetType, number>         // 按类型统计
  byLayer: Record<AssetLayer, number>       // 按层级统计
  byStatus: {
    online: number
    offline: number
    maintenance: number
    unknown: number
  }
  byHealth: {
    healthy: number
    warning: number
    critical: number
    unknown: number
  }
  pendingCount: number            // 待确认数量
}

// 资产关系图节点
export interface AssetGraphNode {
  id: string
  name: string
  type: AssetType
  layer: AssetLayer
  status: AssetStatus
  healthStatus: HealthStatus
}

// 资产关系图边
export interface AssetGraphEdge {
  source: string                  // 源节点ID
  target: string                  // 目标节点ID
  type: DependencyType            // 关系类型
  label?: string                  // 边标签
}

// 业务信息（简化版，用于选择器）
export interface BusinessInfo {
  id: string
  name: string
  code: string
  status: string
  assetCount: number
}

// 类型配置
export const AssetTypeConfig: Record<AssetType, { label: string; icon: string; color: string }> = {
  HOST: { label: '主机', icon: '💻', color: '#1677ff' },
  DATABASE: { label: '数据库', icon: '🗄️', color: '#52c41a' },
  MIDDLEWARE: { label: '中间件', icon: '⚙️', color: '#faad14' },
  APPLICATION: { label: '应用服务', icon: '📱', color: '#722ed1' },
  NETWORK: { label: '网络设备', icon: '🌐', color: '#13c2c2' },
  STORAGE: { label: '存储设备', icon: '💾', color: '#eb2f96' },
  CONTAINER: { label: '容器', icon: '📦', color: '#2f54eb' }
}

// 层级配置
export const AssetLayerConfig: Record<AssetLayer, { label: string; order: number }> = {
  APPLICATION: { label: '应用服务层', order: 1 },
  MIDDLEWARE: { label: '中间件层', order: 2 },
  INFRASTRUCTURE: { label: '基础设施层', order: 3 }
}

// 状态配置
export const AssetStatusConfig: Record<AssetStatus, { label: string; color: string }> = {
  ONLINE: { label: '在线', color: '#52c41a' },
  OFFLINE: { label: '离线', color: '#d9d9d9' },
  MAINTENANCE: { label: '维护中', color: '#faad14' },
  UNKNOWN: { label: '未知', color: '#8c8c8c' }
}

// 健康状态配置
export const HealthStatusConfig: Record<HealthStatus, { label: string; color: string; icon: string }> = {
  HEALTHY: { label: '健康', color: '#52c41a', icon: '🟢' },
  WARNING: { label: '警告', color: '#faad14', icon: '🟡' },
  CRITICAL: { label: '故障', color: '#ff4d4f', icon: '🔴' },
  UNKNOWN: { label: '未知', color: '#d9d9d9', icon: '⚪' }
}
