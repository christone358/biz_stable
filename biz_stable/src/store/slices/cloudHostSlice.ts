import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CloudHost } from '../../types/cloud-host'
import { getCloudHosts } from '../../mock/cloud-hosts'

interface CloudHostState {
  items: CloudHost[]
  selected?: CloudHost
  loading: boolean
  error?: string | null
}

const initialState: CloudHostState = {
  items: getCloudHosts(),
  loading: false,
  error: null,
}

const cloudHostSlice = createSlice({
  name: 'cloudHosts',
  initialState,
  reducers: {
    setCloudHosts(state, action: PayloadAction<CloudHost[]>) {
      state.items = action.payload
    },
    selectCloudHost(state, action: PayloadAction<string>) {
      state.selected = state.items.find(h => h.id === action.payload)
    },
    upsertCloudHost(state, action: PayloadAction<CloudHost>) {
      const idx = state.items.findIndex(h => h.id === action.payload.id)
      if (idx >= 0) state.items[idx] = action.payload
      else state.items.unshift(action.payload)
    },
  }
})

export const { setCloudHosts, selectCloudHost, upsertCloudHost } = cloudHostSlice.actions
export default cloudHostSlice.reducer
