import type { UploadFile } from 'antd'

export type TicketStatus = 'draft' | 'processing' | 'returned' | 'on_hold' | 'resolved' | 'closed' | 'canceled'
export type TicketPriority = 'P0' | 'P1' | 'P2' | 'P3'
export type TicketKind = 'internet' | 'govnet'

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
  type: 'submit' | 'return' | 'transfer' | 'comment' | 'approval'
  operator: string
  time: string
  summary: string
  detail?: string
}

export type HandleFieldType = 'text' | 'textarea' | 'select' | 'number'

export type TicketActionType = 'handle' | 'return' | 'handover'

// 业务操作类型：审批/指派/处理
export type BusinessOperationType = 'approval' | 'assignment' | 'processing'

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

export type DetailModuleType = 'formGrid' | 'dataTable'

export interface DetailModuleField {
  key: string
  label: string
  value?: string
}

export interface DetailModuleSchema {
  id: string
  title: string
  type: DetailModuleType
  fields?: DetailModuleField[]
  columns?: Array<{
    key: string
    title: string
  }>
  rows?: Array<{
    id?: string
    [key: string]: string | undefined
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
  detailModules?: DetailModuleSchema[]
  attachments: TicketAttachment[]
  handleModules: HandleModuleSchema[]
  history: TicketHistoryRecord[]
  currentActionType?: TicketActionType
  currentOperationType?: BusinessOperationType
  currentNodeName?: string
  canOperate?: boolean
  canComment?: boolean
}

export interface TicketNavigationState {
  ticketKind?: TicketKind
  ticketOverrides?: Partial<TicketDetailData>
}

export type UploadFiles = UploadFile<unknown>[]
