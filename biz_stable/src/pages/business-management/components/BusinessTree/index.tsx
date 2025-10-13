import React, { useMemo } from 'react'
import { Tree, Input, Button } from 'antd'
import { SearchOutlined, PlusOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import { BusinessNode, OperationStatusConfig } from '../../types'
import './index.css'

interface BusinessTreeProps {
  businessTree: BusinessNode[]
  selectedNodeId: string | null
  expandedKeys: string[]
  onSelect: (node: BusinessNode) => void
  onExpand: (keys: string[]) => void
  onAdd?: () => void
}

const BusinessTree: React.FC<BusinessTreeProps> = ({
  businessTree,
  selectedNodeId,
  expandedKeys,
  onSelect,
  onExpand,
  onAdd
}) => {
  // 将业务节点转换为Ant Design Tree的数据格式
  const convertToTreeData = (nodes: BusinessNode[]): DataNode[] => {
    return nodes.map(node => {
      const statusConfig = node.operationStatus
        ? OperationStatusConfig[node.operationStatus]
        : null

      return {
        key: node.id,
        title: (
          <div className="business-tree-node-title">
            <span>
              {node.level === 1 ? <FolderOutlined /> : <FileOutlined />}
            </span>
            <span>{node.name}</span>
            {statusConfig && (
              <span className="business-tree-node-status">{statusConfig.icon}</span>
            )}
          </div>
        ),
        children: node.children ? convertToTreeData(node.children) : undefined,
        isLeaf: !node.children || node.children.length === 0
      }
    })
  }

  const treeData = useMemo(() => convertToTreeData(businessTree), [businessTree])

  // 查找节点
  const findNode = (nodes: BusinessNode[], id: string): BusinessNode | null => {
    for (const node of nodes) {
      if (node.id === id) {
        return node
      }
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 处理选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const nodeId = selectedKeys[0] as string
      const node = findNode(businessTree, nodeId)
      if (node) {
        onSelect(node)
      }
    }
  }

  // 处理展开
  const handleExpand = (keys: React.Key[]) => {
    onExpand(keys as string[])
  }

  return (
    <div className="business-tree">
      <div className="business-tree-header">
        <div className="business-tree-title">业务板块</div>
        <Input
          className="business-tree-search"
          placeholder="搜索业务"
          prefix={<SearchOutlined />}
          allowClear
        />
        {onAdd && (
          <Button type="primary" icon={<PlusOutlined />} block onClick={onAdd}>
            新建板块
          </Button>
        )}
      </div>

      <div className="business-tree-content">
        <Tree
          treeData={treeData}
          selectedKeys={selectedNodeId ? [selectedNodeId] : []}
          expandedKeys={expandedKeys}
          onSelect={handleSelect}
          onExpand={handleExpand}
          showLine
          showIcon={false}
        />
      </div>
    </div>
  )
}

export default BusinessTree
