import type { UploadFile } from 'antd'

export type TicketStatus = 'draft' | 'processing' | 'returned' | 'on_hold' | 'resolved' | 'closed' | 'canceled'
export type TicketPriority = 'P0' | 'P1' | 'P2' | 'P3'
export type TicketKind =
  | 'internet'
  | 'govnet'
  | 'inspection'
  | 'assessment'
  | 'system-online'
  | 'resource-recycle'
  | 'security-hardening'
  | 'emergency'

export interface BusinessSystemInfo {
  level1: string
  level2?: string
}

export interface TicketAttachment {
  id: string
  name: string
  size: string
  uploader: string
  time: string
}

export interface TicketHistoryRecord {
  id: string
  type: 'submit' | 'return' | 'transfer'
  operator: string
  time: string
  summary: string
  detail?: string
}

export type HandleFieldType = 'text' | 'textarea' | 'select' | 'number'

export interface HandleFieldSchema {
  key: string
  label: string
  type: HandleFieldType
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

export interface HandleModuleSchema {
  id: string
  title: string
  type: 'formGrid' | 'dataTable'
  description?: string
  fields?: HandleFieldSchema[]
  columns?: Array<{
    key: string
    title: string
    required?: boolean
  }>
}

export interface TicketDetailData {
  id: string
  title: string
  ticketNo: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  creator: string
  businessSystem: BusinessSystemInfo
  summary?: { label: string; value: string }[]
  attachments: TicketAttachment[]
  handleModules: HandleModuleSchema[]
  history: TicketHistoryRecord[]
}

export interface TicketNavigationState {
  ticketKind?: TicketKind
  ticketOverrides?: Partial<TicketDetailData>
}

export type UploadFiles = UploadFile<unknown>[]
