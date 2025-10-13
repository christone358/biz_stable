import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  Asset,
  PendingAsset,
  AssetStatistics,
  BusinessInfo
} from '../../pages/asset-management/types'

interface AssetManagementState {
  // 业务列表
  businesses: BusinessInfo[]

  // 当前选中的业务
  selectedBusinessId: string | null
  selectedBusiness: BusinessInfo | null

  // 资产列表
  assets: Asset[]
  filteredAssets: Asset[]

  // 待确认资产列表
  pendingAssets: PendingAsset[]

  // 资产统计信息
  statistics: AssetStatistics | null

  // UI状态
  isAssetFormVisible: boolean
  editingAsset: Asset | null
  isRelationGraphFullscreen: boolean

  // 筛选和搜索
  searchKeyword: string
  selectedLayer: string | null
  selectedType: string | null

  // 加载状态
  loading: boolean
  saving: boolean
}

const initialState: AssetManagementState = {
  businesses: [],
  selectedBusinessId: null,
  selectedBusiness: null,
  assets: [],
  filteredAssets: [],
  pendingAssets: [],
  statistics: null,
  isAssetFormVisible: false,
  editingAsset: null,
  isRelationGraphFullscreen: false,
  searchKeyword: '',
  selectedLayer: null,
  selectedType: null,
  loading: false,
  saving: false
}

const assetManagementSlice = createSlice({
  name: 'assetManagement',
  initialState,
  reducers: {
    // 设置业务列表
    setBusinesses(state, action: PayloadAction<BusinessInfo[]>) {
      state.businesses = action.payload
    },

    // 选择业务
    setSelectedBusiness(state, action: PayloadAction<BusinessInfo>) {
      state.selectedBusiness = action.payload
      state.selectedBusinessId = action.payload.id
    },

    // 清除业务选择
    clearSelectedBusiness(state) {
      state.selectedBusiness = null
      state.selectedBusinessId = null
      state.assets = []
      state.filteredAssets = []
      state.statistics = null
    },

    // 设置资产列表
    setAssets(state, action: PayloadAction<Asset[]>) {
      state.assets = action.payload
      state.filteredAssets = action.payload
    },

    // 设置筛选后的资产
    setFilteredAssets(state, action: PayloadAction<Asset[]>) {
      state.filteredAssets = action.payload
    },

    // 设置待确认资产
    setPendingAssets(state, action: PayloadAction<PendingAsset[]>) {
      state.pendingAssets = action.payload
    },

    // 设置统计信息
    setStatistics(state, action: PayloadAction<AssetStatistics>) {
      state.statistics = action.payload
    },

    // 添加资产
    addAsset(state, action: PayloadAction<Asset>) {
      state.assets.push(action.payload)
      state.filteredAssets.push(action.payload)
    },

    // 更新资产
    updateAsset(state, action: PayloadAction<Asset>) {
      const index = state.assets.findIndex(a => a.id === action.payload.id)
      if (index !== -1) {
        state.assets[index] = action.payload
      }
      const filteredIndex = state.filteredAssets.findIndex(a => a.id === action.payload.id)
      if (filteredIndex !== -1) {
        state.filteredAssets[filteredIndex] = action.payload
      }
    },

    // 删除资产
    deleteAsset(state, action: PayloadAction<string>) {
      state.assets = state.assets.filter(a => a.id !== action.payload)
      state.filteredAssets = state.filteredAssets.filter(a => a.id !== action.payload)
    },

    // 确认待确认资产
    confirmPendingAsset(state, action: PayloadAction<{ assetId: string; businessId: string }>) {
      const pendingAsset = state.pendingAssets.find(a => a.id === action.payload.assetId)
      if (pendingAsset) {
        // 移除待确认状态
        state.pendingAssets = state.pendingAssets.filter(a => a.id !== action.payload.assetId)

        // 添加到已确认资产
        const confirmedAsset: Asset = {
          ...pendingAsset,
          confirmStatus: 'CONFIRMED',
          businessId: action.payload.businessId,
          confirmedAt: new Date().toISOString(),
          confirmedBy: '当前用户'
        }
        state.assets.push(confirmedAsset)
        state.filteredAssets.push(confirmedAsset)
      }
    },

    // 忽略待确认资产
    ignorePendingAsset(state, action: PayloadAction<string>) {
      state.pendingAssets = state.pendingAssets.filter(a => a.id !== action.payload)
    },

    // 批量确认待确认资产
    confirmAllPendingAssets(state, action: PayloadAction<string>) {
      const businessId = action.payload
      const assetsToConfirm = state.pendingAssets.filter(
        a => a.suggestedBusinessId === businessId
      )

      assetsToConfirm.forEach(pendingAsset => {
        const confirmedAsset: Asset = {
          ...pendingAsset,
          confirmStatus: 'CONFIRMED',
          businessId: businessId,
          confirmedAt: new Date().toISOString(),
          confirmedBy: '当前用户'
        }
        state.assets.push(confirmedAsset)
        state.filteredAssets.push(confirmedAsset)
      })

      state.pendingAssets = state.pendingAssets.filter(
        a => a.suggestedBusinessId !== businessId
      )
    },

    // 显示资产表单
    showAssetForm(state, action: PayloadAction<Asset | null>) {
      state.isAssetFormVisible = true
      state.editingAsset = action.payload
    },

    // 隐藏资产表单
    hideAssetForm(state) {
      state.isAssetFormVisible = false
      state.editingAsset = null
    },

    // 切换关系图全屏
    toggleRelationGraphFullscreen(state) {
      state.isRelationGraphFullscreen = !state.isRelationGraphFullscreen
    },

    // 设置搜索关键词
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.searchKeyword = action.payload
    },

    // 设置层级筛选
    setSelectedLayer(state, action: PayloadAction<string | null>) {
      state.selectedLayer = action.payload
    },

    // 设置类型筛选
    setSelectedType(state, action: PayloadAction<string | null>) {
      state.selectedType = action.payload
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
  setBusinesses,
  setSelectedBusiness,
  clearSelectedBusiness,
  setAssets,
  setFilteredAssets,
  setPendingAssets,
  setStatistics,
  addAsset,
  updateAsset,
  deleteAsset,
  confirmPendingAsset,
  ignorePendingAsset,
  confirmAllPendingAssets,
  showAssetForm,
  hideAssetForm,
  toggleRelationGraphFullscreen,
  setSearchKeyword,
  setSelectedLayer,
  setSelectedType,
  setLoading,
  setSaving
} = assetManagementSlice.actions

export default assetManagementSlice.reducer
