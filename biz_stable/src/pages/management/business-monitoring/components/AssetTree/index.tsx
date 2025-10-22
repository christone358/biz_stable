import React, { useState, useMemo } from 'react'
import { Input, Tree, Badge, Empty } from 'antd'
import {
  SearchOutlined,
  HddOutlined,
  DatabaseOutlined,
  CloudOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons'
import type { AssetTreeProps, AssetTreeNode, AssetLayerType } from './types'
import type { DataNode } from 'antd/es/tree'
import { AssetStatus } from '../../../asset-management/panorama-types'
import './index.css'

const AssetTree: React.FC<AssetTreeProps> = ({
  assets,
  selectedAssetId,
  onAssetSelect
}) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['compute', 'storage', 'network'])

  // 获取资产层级的图标
  const getLayerIcon = (layer: AssetLayerType) => {
    const icons = {
      compute: <HddOutlined style={{ color: '#1890FF' }} />,
      storage: <DatabaseOutlined style={{ color: '#52C41A' }} />,
      network: <CloudOutlined style={{ color: '#722ED1' }} />
    }
    return icons[layer]
  }

  // 获取状态徽章
  const getStatusBadge = (status: AssetStatus) => {
    const statusMap = {
      [AssetStatus.RUNNING]: { color: 'success', text: '运行中' },
      [AssetStatus.STOPPED]: { color: 'default', text: '已停止' },
      [AssetStatus.IDLE]: { color: 'warning', text: '空闲' },
      [AssetStatus.ABNORMAL]: { color: 'error', text: '异常' }
    }
    return statusMap[status] || { color: 'default', text: '未知' }
  }

  // 按层级分组资产
  const groupedAssets = useMemo(() => {
    const groups: Record<AssetLayerType, typeof assets> = {
      compute: [],
      storage: [],
      network: []
    }

    assets.forEach(asset => {
      if (groups[asset.layer]) {
        groups[asset.layer].push(asset)
      }
    })

    return groups
  }, [assets])

  // 构建树形数据
  const treeData = useMemo(() => {
    const layerNames: Record<AssetLayerType, string> = {
      compute: '计算资源',
      storage: '存储资源',
      network: '网络资源'
    }

    const data: DataNode[] = []

    Object.entries(groupedAssets).forEach(([layer, layerAssets]) => {
      const layerType = layer as AssetLayerType

      // 根据搜索关键字过滤资产
      const filteredAssets = layerAssets.filter(asset => {
        if (!searchKeyword) return true
        const keyword = searchKeyword.toLowerCase()
        return (
          asset.name.toLowerCase().includes(keyword) ||
          asset.ip.toLowerCase().includes(keyword) ||
          asset.type.toLowerCase().includes(keyword)
        )
      })

      if (filteredAssets.length === 0 && searchKeyword) return

      // 构建分组节点
      const groupNode: DataNode = {
        key: layerType,
        title: (
          <span className="asset-tree-group-title">
            {getLayerIcon(layerType)}
            <span className="group-name">{layerNames[layerType]}</span>
            <span className="group-count">({filteredAssets.length})</span>
          </span>
        ),
        selectable: false,
        children: filteredAssets.map(asset => ({
          key: asset.id,
          title: (
            <div className="asset-tree-item">
              <div className="asset-item-main">
                <span className="asset-name">{asset.name}</span>
                <Badge
                  status={getStatusBadge(asset.status).color as any}
                  className="asset-status-badge"
                />
              </div>
              <div className="asset-item-sub">
                <span className="asset-ip">{asset.ip}</span>
              </div>
            </div>
          ),
          isLeaf: true,
          data: asset
        }))
      }

      data.push(groupNode)
    })

    return data
  }, [groupedAssets, searchKeyword])

  // 处理节点选择
  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    if (selectedKeys.length > 0) {
      const selectedKey = selectedKeys[0] as string
      const asset = assets.find(a => a.id === selectedKey)
      if (asset) {
        onAssetSelect(asset)
      }
    }
  }

  // 处理展开/折叠
  const handleExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys as string[])
  }

  return (
    <div className="asset-tree-container">
      {/* 搜索框 */}
      <div className="asset-tree-search">
        <Input
          placeholder="搜索资产名称或IP..."
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          allowClear
        />
      </div>

      {/* 资产树 */}
      <div className="asset-tree-wrapper">
        {assets.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无资产数据"
            style={{ marginTop: 48 }}
          />
        ) : (
          <Tree
            treeData={treeData}
            selectedKeys={selectedAssetId ? [selectedAssetId] : []}
            expandedKeys={expandedKeys}
            onSelect={handleSelect}
            onExpand={handleExpand}
            showLine={false}
            showIcon={false}
            switcherIcon={({ expanded }) =>
              expanded ? <DownOutlined /> : <RightOutlined />
            }
            className="asset-tree"
          />
        )}
      </div>
    </div>
  )
}

export default AssetTree
