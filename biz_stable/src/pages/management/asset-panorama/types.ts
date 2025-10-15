// 资产全景视图类型定义

// 业务状态
export type BusinessStatus = 'normal' | 'warning' | 'error'

// 业务分组
export type BusinessGroup = 'yiliang' | 'duoyingyong' | 'sizhu' | 'yiku'

// 业务信息
export interface BusinessInfo {
  id: string
  name: string
  group: BusinessGroup
  status: BusinessStatus
  assetCount: number
  info: {
    id: string
    status: string
    createTime: string
    sla: string
    visits: string
    users: string
    description: string
  }
  responsible: {
    owner: ResponsibleInfo
    developer: ResponsibleInfo
    operator: ResponsibleInfo
  }
  assets: {
    app: AssetStats
    compute: AssetStats
    storage: AssetStats
    network: AssetStats
  }
}

// 责任主体信息
export interface ResponsibleInfo {
  org: string
  contact: string
  phone: string
}

// 资产统计
export interface AssetStats {
  total: number
  running: number
  abnormal: number
  change: number // 本月变化
}

// 资产层类型
export type AssetLayerType = 'app' | 'compute' | 'storage' | 'network'

// 资产层数据
export interface AssetLayerData {
  type: AssetLayerType
  title: string
  icon: string
  stats: AssetStats
  honeycomb: HoneycombData[]
}

// 蜂窝数据
export interface HoneycombData {
  type: string
  count: number
  color: string
  status: 'normal' | 'abnormal'
  assets: string[]
}

// 资产状态
export type AssetStatus = 'running' | 'stopped' | 'idle' | 'abnormal'

// 台账资产项
export interface AssetItem {
  name: string
  type: string
  status: AssetStatus
  address: string
  config: string
  owner?: string // 仅在管理视图中显示
  operation: string
}

// 依赖节点类型
export type DependencyNodeType = 'business' | 'app' | 'service' | 'resource' | 'database'

// 依赖节点
export interface DependencyNode {
  id: string
  type: DependencyNodeType
  name: string
  x: number
  y: number
  connections?: string[]
}

// 视图类型
export type ViewType = 'overview' | 'dependency' | 'detail' | 'manage'
