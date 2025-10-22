/**
 * 资产树组件类型定义
 */

import { AssetStatus } from '../../../asset-management/panorama-types'

// 资产层级类型（仅包含计算/存储/网络）
export enum AssetLayerType {
  COMPUTE = 'compute',   // 计算资源
  STORAGE = 'storage',   // 存储资源
  NETWORK = 'network'    // 网络资源
}

// 资产设备信息
export interface AssetDeviceInfo {
  id: string                       // 资产ID
  name: string                     // 资产名称
  ip: string                       // IP地址
  type: string                     // 具体类型（如：Web服务器、MySQL数据库）
  status: AssetStatus              // 运行状态
  layer: AssetLayerType            // 所属层级
  specs?: string                   // 配置规格
}

// 资产树节点类型
export interface AssetTreeNode {
  key: string                      // 唯一标识
  title: string                    // 显示名称
  type: 'group' | 'asset'          // 节点类型
  assetType?: AssetLayerType       // 资产层级类型
  assetInfo?: AssetDeviceInfo      // 资产详细信息
  children?: AssetTreeNode[]       // 子节点
  count?: number                   // 分组节点的资产数量
}

// 资产树Props
export interface AssetTreeProps {
  systemId?: string                // 业务系统ID
  assets: AssetDeviceInfo[]        // 资产列表
  selectedAssetId?: string         // 选中的资产ID
  onAssetSelect: (asset: AssetDeviceInfo) => void  // 资产选择回调
}
