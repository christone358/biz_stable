// Cloud host types (including EDR/security and business links)
export type CloudHostStatus = 'RUNNING' | 'STOPPED' | 'UNKNOWN'
export type ProtectionStatus = 'PROTECTED' | 'UNPROTECTED' | 'UNASSIGNED'
export type AdmissionStatus = 'ALLOWED' | 'DENIED' | 'UNKNOWN'

export interface CloudHost {
  id: string
  hostName: string
  label?: string
  ipAddress: string
  status: CloudHostStatus
  protectionStatus: ProtectionStatus
  cpu: number
  memory: number // GB
  disk: number // GB
  osType: string
  osVersion?: string
  type: 'STANDARD' | 'TRUSTED_CREATION'
  department: string

  // Business links
  businessBlock: string
  businessSystem: string
  businessAssetName?: string
  businessBlockId?: string
  businessSystemId?: string
  businessAssetId?: string
  businessVersionId?: string
  systemOwner?: string
  requester?: string
  requestedAt?: string
  deliveredAt?: string

  // Security (EDR & access)
  edrInstalled: boolean
  edrOnline: boolean
  edrAgentVersion?: string
  edrVirusDbVersion?: string
  edrLastHeartbeat?: string
  blocked: boolean
  blockedReason?: string
  blockedAt?: string
  admissionStatus: AdmissionStatus
  pendingAlerts: number
  vulnerabilities: number

  // Sync metadata
  dataSource: {
    source: 'CLOUD_PLATFORM' | 'MANUAL'
    lastSyncTime?: string
    syncStatus?: 'SUCCESS' | 'FAILED' | 'PENDING'
  }

  // Misc
  region?: string
  vendor?: string
  model?: string
}
