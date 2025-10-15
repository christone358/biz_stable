/**
 * 资产全景视图类型定义
 */

// 资产层级类型
export enum AssetLayerType {
  APPLICATION = 'app',        // 应用层
  COMPUTE = 'compute',       // 计算层
  STORAGE = 'storage',       // 存储层
  NETWORK = 'network'        // 网络层
}

// 资产状态
export enum AssetStatus {
  RUNNING = 'running',       // 运行中
  STOPPED = 'stopped',       // 已停止
  IDLE = 'idle',            // 空闲
  ABNORMAL = 'abnormal'      // 异常
}

// 业务基础信息
export interface BusinessInfo {
  id: string
  name: string
  status: string
  createTime: string
  sla: string
  visits: string
  users: string
  description: string
  badges: string[]
}

// 责任主体信息
export interface ResponsibleParty {
  org: string          // 单位/组织
  contact: string      // 联系人
  phone: string        // 联系电话
}

// 责任主体集合
export interface ResponsibleInfo {
  owner: ResponsibleParty      // 责任主体
  developer: ResponsibleParty  // 开发主体
  operator: ResponsibleParty   // 运维主体
}

// 资产层级统计
export interface LayerStatistics {
  total: number          // 总数
  running: number        // 运行中
  abnormal: number       // 异常数
  change: number         // 本月变化
}

// 单个资产项
export interface AssetItem {
  id: string
  name: string
  type: string
  status: AssetStatus
  address: string
  config: string
  owner?: string         // 责任人（仅台账管理）
}

// 蜂窝矩阵资产类型
export interface HoneycombAssetType {
  type: string           // 资产类型名称
  count: number          // 数量
  color: string          // 显示颜色
  status: string         // 状态
  assets: AssetItem[]    // 资产列表
}

// 依赖关系节点
export interface DependencyNode {
  id: string
  type: 'business' | 'app' | 'service' | 'database' | 'resource'
  name: string
  x: number
  y: number
  connections?: string[]  // 连接的节点ID列表
}

// 完整的全景视图数据
export interface PanoramaData {
  businessInfo: BusinessInfo
  responsibleInfo: ResponsibleInfo
  layerStatistics: Record<AssetLayerType, LayerStatistics>
  honeycombData: Record<AssetLayerType, HoneycombAssetType[]>
  dependencyData: DependencyNode[]
  assetDetails: Record<AssetLayerType, AssetItem[]>
}

// 资产台账筛选条件
export interface AssetFilter {
  keyword?: string
  status?: AssetStatus | 'all'
  type?: string | 'all'
}

// 视图模式
export enum ViewMode {
  OVERVIEW = 'overview',       // 资产全景
  DEPENDENCY = 'dependency',   // 依赖分析
  DETAIL = 'detail',          // 台账详情
  MANAGE = 'manage'           // 台账管理
}
