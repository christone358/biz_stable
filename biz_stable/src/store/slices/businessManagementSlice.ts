import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BusinessNode,
  BusinessDetail
} from '../../pages/business-management/types'

interface BusinessManagementState {
  // 业务树数据
  businessTree: BusinessNode[]

  // 当前选中的业务节点
  selectedNode: BusinessNode | null
  selectedNodeId: string | null

  // 业务详细信息（键为businessId）
  businessDetails: Record<string, BusinessDetail>

  // 当前编辑的业务详情
  currentDetail: BusinessDetail | null

  // 树节点展开状态
  expandedKeys: string[]

  // UI状态
  activeTab: string  // 'basic' | 'responsible' | 'relation'
  isEditing: boolean

  // 加载状态
  loading: boolean
  saving: boolean
}

const initialState: BusinessManagementState = {
  businessTree: [],
  selectedNode: null,
  selectedNodeId: null,
  businessDetails: {},
  currentDetail: null,
  expandedKeys: [],
  activeTab: 'basic',
  isEditing: false,
  loading: false,
  saving: false
}

const businessManagementSlice = createSlice({
  name: 'businessManagement',
  initialState,
  reducers: {
    // 设置业务树
    setBusinessTree(state, action: PayloadAction<BusinessNode[]>) {
      state.businessTree = action.payload
    },

    // 选择业务节点
    setSelectedNode(state, action: PayloadAction<BusinessNode | null>) {
      state.selectedNode = action.payload
      state.selectedNodeId = action.payload?.id || null
    },

    // 设置业务详细信息
    setBusinessDetail(state, action: PayloadAction<BusinessDetail>) {
      const detail = action.payload
      state.businessDetails[detail.businessId] = detail
    },

    // 批量设置业务详细信息
    setBatchBusinessDetails(state, action: PayloadAction<Record<string, BusinessDetail>>) {
      state.businessDetails = { ...state.businessDetails, ...action.payload }
    },

    // 设置当前编辑的详情
    setCurrentDetail(state, action: PayloadAction<BusinessDetail | null>) {
      state.currentDetail = action.payload
    },

    // 更新当前详情
    updateCurrentDetail(state, action: PayloadAction<Partial<BusinessDetail>>) {
      if (state.currentDetail) {
        state.currentDetail = { ...state.currentDetail, ...action.payload }
      }
    },

    // 保存当前详情到businessDetails
    saveCurrentDetail(state) {
      if (state.currentDetail) {
        state.businessDetails[state.currentDetail.businessId] = state.currentDetail
        state.isEditing = false
      }
    },

    // 添加业务节点
    addBusinessNode(state, action: PayloadAction<{ parentId: string | null; node: BusinessNode }>) {
      const { parentId, node } = action.payload

      if (!parentId) {
        // 添加到根级别
        state.businessTree.push(node)
      } else {
        // 递归查找父节点并添加
        const addToParent = (nodes: BusinessNode[]): boolean => {
          for (const n of nodes) {
            if (n.id === parentId) {
              if (!n.children) {
                n.children = []
              }
              n.children.push(node)
              return true
            }
            if (n.children && addToParent(n.children)) {
              return true
            }
          }
          return false
        }
        addToParent(state.businessTree)
      }
    },

    // 更新业务节点
    updateBusinessNode(state, action: PayloadAction<BusinessNode>) {
      const node = action.payload
      const updateNode = (nodes: BusinessNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === node.id) {
            nodes[i] = { ...nodes[i], ...node }
            return true
          }
          if (nodes[i].children && updateNode(nodes[i].children!)) {
            return true
          }
        }
        return false
      }
      updateNode(state.businessTree)
    },

    // 删除业务节点
    deleteBusinessNode(state, action: PayloadAction<string>) {
      const nodeId = action.payload
      const deleteNode = (nodes: BusinessNode[]): BusinessNode[] => {
        return nodes.filter(n => {
          if (n.id === nodeId) {
            return false
          }
          if (n.children) {
            n.children = deleteNode(n.children)
          }
          return true
        })
      }
      state.businessTree = deleteNode(state.businessTree)

      // 删除关联的详细信息
      delete state.businessDetails[nodeId]
    },

    // 设置展开的节点
    setExpandedKeys(state, action: PayloadAction<string[]>) {
      state.expandedKeys = action.payload
    },

    // 切换节点展开状态
    toggleNodeExpand(state, action: PayloadAction<string>) {
      const key = action.payload
      const index = state.expandedKeys.indexOf(key)
      if (index > -1) {
        state.expandedKeys.splice(index, 1)
      } else {
        state.expandedKeys.push(key)
      }
    },

    // 设置当前Tab
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload
    },

    // 设置编辑状态
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload
    },

    // 开始编辑
    startEditing(state) {
      state.isEditing = true
      // 复制当前详情作为编辑副本
      if (state.selectedNodeId && state.businessDetails[state.selectedNodeId]) {
        state.currentDetail = { ...state.businessDetails[state.selectedNodeId] }
      }
    },

    // 取消编辑
    cancelEditing(state) {
      state.isEditing = false
      // 恢复原始详情
      if (state.selectedNodeId && state.businessDetails[state.selectedNodeId]) {
        state.currentDetail = { ...state.businessDetails[state.selectedNodeId] }
      }
    },

    // 设置加载状态
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },

    // 设置保存状态
    setSaving(state, action: PayloadAction<boolean>) {
      state.saving = action.payload
    }
  }
})

export const {
  setBusinessTree,
  setSelectedNode,
  setBusinessDetail,
  setBatchBusinessDetails,
  setCurrentDetail,
  updateCurrentDetail,
  saveCurrentDetail,
  addBusinessNode,
  updateBusinessNode,
  deleteBusinessNode,
  setExpandedKeys,
  toggleNodeExpand,
  setActiveTab,
  setEditing,
  startEditing,
  cancelEditing,
  setLoading,
  setSaving
} = businessManagementSlice.actions

export default businessManagementSlice.reducer
