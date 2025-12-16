import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { OfficeTerminal } from '../../types/office-terminal'
import { getOfficeTerminals } from '../../mock/office-terminals'

interface OfficeTerminalState {
  items: OfficeTerminal[]
  selected?: OfficeTerminal
  loading: boolean
  error?: string | null
}

const initialState: OfficeTerminalState = {
  items: getOfficeTerminals(),
  loading: false,
  error: null,
}

const officeTerminalSlice = createSlice({
  name: 'officeTerminals',
  initialState,
  reducers: {
    setOfficeTerminals(state, action: PayloadAction<OfficeTerminal[]>) {
      state.items = action.payload
    },
    selectOfficeTerminal(state, action: PayloadAction<string>) {
      state.selected = state.items.find(item => item.id === action.payload)
    },
    upsertOfficeTerminal(state, action: PayloadAction<OfficeTerminal>) {
      const idx = state.items.findIndex(item => item.id === action.payload.id)
      if (idx >= 0) state.items[idx] = action.payload
      else state.items.unshift(action.payload)
    },
  }
})

export const { setOfficeTerminals, selectOfficeTerminal, upsertOfficeTerminal } = officeTerminalSlice.actions
export default officeTerminalSlice.reducer
