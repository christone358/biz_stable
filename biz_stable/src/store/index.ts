import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import mockConfigReducer from './slices/mockConfigSlice'
import assetManagementReducer from './slices/assetManagementSlice'
import businessManagementReducer from './slices/businessManagementSlice'
import systemConfigReducer from './slices/systemConfigSlice'
import cloudHostsReducer from './slices/cloudHostSlice'
import officeTerminalsReducer from './slices/officeTerminalSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    mockConfig: mockConfigReducer,
    assetManagement: assetManagementReducer,
    businessManagement: businessManagementReducer,
    systemConfig: systemConfigReducer,
    cloudHosts: cloudHostsReducer,
    officeTerminals: officeTerminalsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
