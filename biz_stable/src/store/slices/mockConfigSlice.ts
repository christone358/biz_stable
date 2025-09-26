import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface MockDataConfig {
  id: string
  name: string
  type: 'organization' | 'system' | 'metric' | 'alert' | 'vulnerability'
  data: any
  enabled: boolean
  createdAt: string
  updatedAt: string
}

interface MockConfigState {
  configs: MockDataConfig[]
  selectedConfig: MockDataConfig | null
  isEditing: boolean
  loading: boolean
  error: string | null
}

const initialState: MockConfigState = {
  configs: [],
  selectedConfig: null,
  isEditing: false,
  loading: false,
  error: null,
}

const mockConfigSlice = createSlice({
  name: 'mockConfig',
  initialState,
  reducers: {
    setConfigs: (state, action: PayloadAction<MockDataConfig[]>) => {
      state.configs = action.payload
    },
    addConfig: (state, action: PayloadAction<MockDataConfig>) => {
      state.configs.push(action.payload)
    },
    updateConfig: (state, action: PayloadAction<MockDataConfig>) => {
      const index = state.configs.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.configs[index] = action.payload
      }
    },
    deleteConfig: (state, action: PayloadAction<string>) => {
      state.configs = state.configs.filter(c => c.id !== action.payload)
    },
    setSelectedConfig: (state, action: PayloadAction<MockDataConfig | null>) => {
      state.selectedConfig = action.payload
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },
    toggleConfigEnabled: (state, action: PayloadAction<string>) => {
      const config = state.configs.find(c => c.id === action.payload)
      if (config) {
        config.enabled = !config.enabled
        config.updatedAt = new Date().toISOString()
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setConfigs,
  addConfig,
  updateConfig,
  deleteConfig,
  setSelectedConfig,
  setIsEditing,
  toggleConfigEnabled,
  setLoading,
  setError,
} = mockConfigSlice.actions

export default mockConfigSlice.reducer