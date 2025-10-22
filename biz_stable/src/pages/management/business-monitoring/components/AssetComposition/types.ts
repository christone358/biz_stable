/**
 * 资产组成相关类型定义
 */

import { AssetLayerType, AssetStatus } from '../../../asset-management/panorama-types'

// 资产统计信息
export interface AssetStatistics {
  total: number           // 总数
  running: number         // 运行中
  abnormal: number        // 异常
  stopped: number         // 停止
  monthlyChange?: number  // 本月变化（正负数）
}

// 扩展的资产项（包含责任信息和实时指标）
export interface AssetItemDetail {
  id: string
  name: string
  type: string
  status: AssetStatus
  address: string          // IP地址
  config: string           // 配置规格
  layer: AssetLayerType    // 所属层级
  owner: string            // 责任人
  ownerOrg: string         // 责任单位
  ownerPhone: string       // 联系电话
  specs: {
    cpu?: string           // CPU配置
    memory?: string        // 内存配置
    disk?: string          // 磁盘配置
    network?: string       // 网络配置
  }
  metrics?: {              // 实时指标（可选）
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    networkTraffic: number
  }
  operationLogs?: OperationLog[]  // 操作记录
}

// 操作记录
export interface OperationLog {
  id: string
  timestamp: string
  action: string
  operator: string
  description: string
}

// 资产组成数据
export interface AssetCompositionData {
  systemId: string
  systemName: string
  statistics: {
    total: AssetStatistics
    compute: AssetStatistics
    storage: AssetStatistics
    network: AssetStatistics
  }
  assets: {
    all: AssetItemDetail[]
    compute: AssetItemDetail[]
    storage: AssetItemDetail[]
    network: AssetItemDetail[]
  }
}

// 资产筛选条件
export interface AssetCompositionFilter {
  keyword?: string                 // 搜索关键字
  type?: string                    // 资产类型
  status?: AssetStatus | 'all'     // 运行状态
  layer?: AssetLayerType | 'all'   // 资产层级
}
