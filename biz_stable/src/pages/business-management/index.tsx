import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, message } from 'antd'
import { UploadOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { RootState } from '../../store'
import {
  setBusinessTree,
  setSelectedNode,
  setBatchBusinessDetails,
  setCurrentDetail,
  setExpandedKeys,
  startEditing,
  cancelEditing,
  saveCurrentDetail
} from '../../store/slices/businessManagementSlice'
import {
  generateMockBusinessTree,
  generateMockBusinessDetail,
  flattenBusinessTree
} from '../../mock/business-management-data'

import BusinessTree from './components/BusinessTree'
import BusinessDetailPanel from './components/BusinessDetailPanel'

import './index.css'

const BusinessManagement: React.FC = () => {
  const dispatch = useDispatch()

  // 从Redux获取状态
  const {
    businessTree,
    selectedNode,
    selectedNodeId,
    businessDetails,
    currentDetail,
    expandedKeys,
    isEditing
  } = useSelector((state: RootState) => state.businessManagement)

  // 初始化数据
  useEffect(() => {
    // 生成业务树
    const tree = generateMockBusinessTree()
    dispatch(setBusinessTree(tree))

    // 生成所有业务的详细信息
    const allNodes = flattenBusinessTree(tree)
    const details: Record<string, any> = {}

    allNodes.forEach(node => {
      if (node.hasDetail) {
        details[node.id] = generateMockBusinessDetail(node.id, node.name)
      }
    })

    dispatch(setBatchBusinessDetails(details))

    // 默认展开一级节点
    const level1Keys = tree.map(n => n.id)
    dispatch(setExpandedKeys(level1Keys))

    message.success('业务数据加载完成')
  }, [dispatch])

  // 处理节点选择
  const handleNodeSelect = (node: typeof selectedNode) => {
    if (!node) return

    dispatch(setSelectedNode(node))

    // 如果节点有详细信息，加载它
    if (node.hasDetail && businessDetails[node.id]) {
      dispatch(setCurrentDetail(businessDetails[node.id]))
    } else {
      dispatch(setCurrentDetail(null))
    }
  }

  // 处理展开
  const handleExpand = (keys: string[]) => {
    dispatch(setExpandedKeys(keys))
  }

  // 处理新建板块
  const handleAdd = () => {
    message.info('新建板块功能将在后续实现')
  }

  // 处理开始编辑
  const handleStartEdit = () => {
    dispatch(startEditing())
  }

  // 处理取消编辑
  const handleCancelEdit = () => {
    dispatch(cancelEditing())
  }

  // 处理保存
  const handleSave = (values: any) => {
    // 更新currentDetail
    dispatch(saveCurrentDetail())
    message.success('保存成功')
  }

  // 处理导入
  const handleImport = () => {
    message.info('导入功能将在后续实现')
  }

  // 处理导出
  const handleExport = () => {
    message.info('导出功能将在后续实现')
  }

  return (
    <div className="business-management-layout">
      {/* 页面头部 */}
      <div className="business-management-header">
        <h1 className="business-management-title">业务板块与应用管理</h1>
        <div className="business-management-actions">
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            导入
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建板块
          </Button>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="business-management-body">
        {/* 左侧业务树 */}
        <div className="business-management-sider">
          <BusinessTree
            businessTree={businessTree}
            selectedNodeId={selectedNodeId}
            expandedKeys={expandedKeys}
            onSelect={handleNodeSelect}
            onExpand={handleExpand}
            onAdd={handleAdd}
          />
        </div>

        {/* 右侧详情区 */}
        <div className="business-management-main">
          <BusinessDetailPanel
            selectedNode={selectedNode}
            businessDetail={currentDetail}
            isEditing={isEditing}
            onSave={handleSave}
            onStartEdit={handleStartEdit}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  )
}

export default BusinessManagement
