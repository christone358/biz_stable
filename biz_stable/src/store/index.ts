import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import mockConfigReducer from './slices/mockConfigSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    mockConfig: mockConfigReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch