import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SystemConfig, getSystemConfig } from '../../mock/system-config'

interface SystemConfigState {
  config: SystemConfig | null
}

const initialState: SystemConfigState = {
  config: getSystemConfig()
}

const systemConfigSlice = createSlice({
  name: 'systemConfig',
  initialState,
  reducers: {
    setSystemConfig: (state, action: PayloadAction<SystemConfig | null>) => {
      state.config = action.payload
    },
    resetSystemConfig: (state) => {
      state.config = getSystemConfig()
    }
  }
})

export const { setSystemConfig, resetSystemConfig } = systemConfigSlice.actions
export default systemConfigSlice.reducer
