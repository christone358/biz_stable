import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrganizationNode, BusinessSystem, Asset, DashboardMetrics, FilterOptions, Alert, Vulnerability } from '../../types'

interface DashboardState {
  selectedOrganization: OrganizationNode | null
  organizations: OrganizationNode[]
  systems: BusinessSystem[]
  filteredAssets: Asset[]
  selectedDepartmentId: string | null
  selectedAssetId: string | null
  metrics: DashboardMetrics | null
  alerts: Alert[]
  vulnerabilities: Vulnerability[]
  filters: FilterOptions
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  selectedOrganization: null,
  organizations: [],
  systems: [],
  filteredAssets: [],
  selectedDepartmentId: null,
  selectedAssetId: null,
  metrics: null,
  alerts: [],
  vulnerabilities: [],
  filters: {},
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedOrganization: (state, action: PayloadAction<OrganizationNode>) => {
      state.selectedOrganization = action.payload
    },
    setOrganizations: (state, action: PayloadAction<OrganizationNode[]>) => {
      state.organizations = action.payload
    },
    setSystems: (state, action: PayloadAction<BusinessSystem[]>) => {
      state.systems = action.payload
    },
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload
    },
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload
    },
    setVulnerabilities: (state, action: PayloadAction<Vulnerability[]>) => {
      state.vulnerabilities = action.payload
    },
    updateSystemStatus: (state, action: PayloadAction<{ systemId: string; healthStatus: any; metrics?: any }>) => {
      const system = state.systems.find(s => s.id === action.payload.systemId)
      if (system) {
        system.healthStatus = action.payload.healthStatus
        if (action.payload.metrics) {
          Object.assign(system, action.payload.metrics)
        }
      }
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload)
    },
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    toggleOrganizationExpand: (state, action: PayloadAction<string>) => {
      const toggleNodeRecursively = (nodes: OrganizationNode[], id: string): boolean => {
        for (const node of nodes) {
          if (node.id === id) {
            node.isExpanded = !node.isExpanded
            return true
          }
          if (node.children && toggleNodeRecursively(node.children, id)) {
            return true
          }
        }
        return false
      }
      toggleNodeRecursively(state.organizations, action.payload)
    },
    expandOrganizationNode: (state, action: PayloadAction<{ nodeId: string; children: OrganizationNode[] }>) => {
      const addChildrenRecursively = (nodes: OrganizationNode[], id: string, children: OrganizationNode[]): boolean => {
        for (const node of nodes) {
          if (node.id === id) {
            node.children = children
            node.isExpanded = true
            return true
          }
          if (node.children && addChildrenRecursively(node.children, id, children)) {
            return true
          }
        }
        return false
      }
      addChildrenRecursively(state.organizations, action.payload.nodeId, action.payload.children)
    },
    setFilteredAssets: (state, action: PayloadAction<Asset[]>) => {
      state.filteredAssets = action.payload
    },
    setSelectedDepartmentId: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartmentId = action.payload
    },
    setSelectedAssetId: (state, action: PayloadAction<string | null>) => {
      state.selectedAssetId = action.payload
    },
  },
})

export const {
  setSelectedOrganization,
  setOrganizations,
  setSystems,
  setMetrics,
  setAlerts,
  setVulnerabilities,
  updateSystemStatus,
  addAlert,
  setFilters,
  setLoading,
  setError,
  toggleOrganizationExpand,
  expandOrganizationNode,
  setFilteredAssets,
  setSelectedDepartmentId,
  setSelectedAssetId,
} = dashboardSlice.actions

export default dashboardSlice.reducer