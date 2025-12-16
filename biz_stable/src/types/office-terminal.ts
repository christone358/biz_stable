export type TerminalOSFamily = 'Windows' | 'macOS' | 'Linux' | 'Other'
export type TerminalDeviceType = 'DESKTOP' | 'LAPTOP' | 'SERVER' | 'VDI' | 'THIN' | 'OTHER'
export type TerminalRunStatus = 'RUNNING' | 'STOPPED' | 'UNKNOWN'
export type TerminalRegistrationStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DEREGISTERED'
export type TerminalProtectionLevel = 'PROTECTED' | 'UNPROTECTED'
export type TerminalLockState = 'LOCKED' | 'UNLOCKED'
export type TerminalValidState = 'VALID' | 'INVALID'
export type TerminalExposure = 'INTERNET' | 'INTERNAL' | 'UNKNOWN'
export type TerminalInfoSource = 'EDR' | 'NAC' | 'AD' | 'MDM' | 'MANUAL'
export type TerminalSoftwareCategory = 'EDR' | 'AV' | '主机防火墙' | 'DLP' | '加固' | '补丁管理' | '其他'
export type TerminalSoftwareOnline = 'ONLINE' | 'OFFLINE' | 'NOT_APPLICABLE' | 'UNKNOWN'
export type TerminalSoftwareRealtime = 'ON' | 'OFF' | 'UNKNOWN'

export interface TerminalUserInfo {
  name: string
  account?: string
  phone?: string
  email?: string
  title?: string
  department?: string
}

export interface TerminalSecuritySoftware {
  id: string
  category: TerminalSoftwareCategory
  vendor?: string
  productName: string
  clientVersion?: string
  engineVersion?: string
  virusDbVersion?: string
  realtimeProtection?: TerminalSoftwareRealtime
  onlineStatus?: TerminalSoftwareOnline
  installTime?: string
  lastUpdatedAt?: string
  enabled?: boolean
  primary?: boolean
  source?: TerminalInfoSource
  uninstallTime?: string
}

export interface OfficeTerminal {
  id: string
  deviceName: string
  assetNumber?: string
  deviceType: TerminalDeviceType
  osFamily: TerminalOSFamily
  osVersion?: string
  osName?: string
  edrClientType?: string
  edrClientVersion?: string
  edrEngineVersion?: string
  ipAddress?: string
  macAddress?: string
  networkSegment?: string
  runStatus: TerminalRunStatus
  lastActiveAt?: string
  departmentPath: string
  user?: TerminalUserInfo
  registrationStatus?: TerminalRegistrationStatus
  infoSource?: TerminalInfoSource
  nacRegisteredAt?: string
  edrFirstSeenAt?: string
  edrUninstalledAt?: string
  edrInstalled: boolean
  edrOnline: boolean
  protectionLevel: TerminalProtectionLevel
  blocked?: boolean
  blockedAt?: string
  lockState?: TerminalLockState
  validState?: TerminalValidState
  exposure?: TerminalExposure
  pendingAlerts?: number
  vulnerabilities?: number
  description?: string
  remarks?: string
  tags?: string[]
  securitySoftwares?: TerminalSecuritySoftware[]
}
