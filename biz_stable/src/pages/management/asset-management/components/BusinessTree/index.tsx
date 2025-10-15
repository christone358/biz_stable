import React, { useState, useEffect } from 'react'
import { Tree, Input } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { SearchOutlined } from '@ant-design/icons'
import { mockBusinessDomains, generateSystemsForBusinessDomain } from '../../../../../mock/data'
import './index.css'

interface BusinessTreeProps {
  selectedSystemId?: string
  onSelectSystem: (systemId: string, systemName: string) => void
}

const BusinessTree: React.FC<BusinessTreeProps> = ({ selectedSystemId, onSelectSystem }) => {
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')

  // 初始化树数据
  useEffect(() => {
    const initialTreeData = mockBusinessDomains.map(domain => ({
      title: domain.name,
      key: domain.id,
      isLeaf: false,
      children: []
    }))
    setTreeData(initialTreeData)

    // 默认展开第一个节点
    if (mockBusinessDomains.length > 0) {
      const firstKey = mockBusinessDomains[0].id
      setExpandedKeys([firstKey])
      loadDomainSystems(firstKey)
    }
  }, [])

  // 加载某个业务领域的系统
  const loadDomainSystems = (domainId: string) => {
    const systems = generateSystemsForBusinessDomain(domainId)

    setTreeData(prevData =>
      prevData.map(node => {
        if (node.key === domainId) {
          return {
            ...node,
            children: systems.map(system => ({
              title: system.name,
              key: system.id,
              isLeaf: true
            }))
          }
        }
        return node
      })
    )
  }

  // 处理节点展开
  const handleExpand = (expandedKeysValue: React.Key[]) => {
    const newKeys = expandedKeysValue as string[]
    setExpandedKeys(newKeys)

    // 加载新展开节点的子节点
    newKeys.forEach(key => {
      const node = treeData.find(n => n.key === key)
      if (node && (!node.children || node.children.length === 0)) {
        loadDomainSystems(key)
      }
    })
  }

  // 处理节点选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string

      // 查找对应的系统名称
      let systemName = ''
      treeData.forEach(domain => {
        if (domain.children) {
          const system = domain.children.find((child: DataNode) => child.key === key)
          if (system) {
            systemName = system.title as string
          }
        }
      })

      // 只有选中系统级别的节点才触发回调
      if (systemName) {
        onSelectSystem(key, systemName)
      }
    }
  }

  // 搜索过滤
  const getFilteredTreeData = () => {
    if (!searchValue) return treeData

    const filterTree = (nodes: DataNode[]): DataNode[] => {
      return nodes.reduce((acc: DataNode[], node) => {
        const title = node.title as string
        const matchesSearch = title.toLowerCase().includes(searchValue.toLowerCase())

        let filteredChildren: DataNode[] = []
        if (node.children) {
          filteredChildren = filterTree(node.children)
        }

        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children
          })
        }

        return acc
      }, [])
    }

    return filterTree(treeData)
  }

  return (
    <div className="business-tree-container">
      {/* 搜索框 */}
      <div className="business-tree-search">
        <Input
          placeholder="搜索业务系统..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          allowClear
        />
      </div>

      {/* 业务树 */}
      <div className="business-tree-wrapper">
        <Tree
          treeData={getFilteredTreeData()}
          expandedKeys={expandedKeys}
          selectedKeys={selectedSystemId ? [selectedSystemId] : []}
          onExpand={handleExpand}
          onSelect={handleSelect}
          showLine
          className="business-tree"
        />
      </div>
    </div>
  )
}

export default BusinessTree
