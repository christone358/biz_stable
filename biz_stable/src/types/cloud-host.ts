// Cloud host types (including EDR/security and business links)
export type CloudHostStatus = 'RUNNING' | 'STOPPED' | 'UNKNOWN'
export type ProtectionStatus = 'PROTECTED' | 'UNPROTECTED' | 'UNASSIGNED'
export type AdmissionStatus = 'ALLOWED' | 'DENIED' | 'UNKNOWN'

export type TrustedCategory = 'TRUSTED_CREATION' | 'DOMESTIC' | 'STANDARD'

export interface CloudHostStorage {
  type: 'SSD' | 'HDD' | 'NVME' | string
  sizeGB: number
  model?: string
}

export interface CloudHostOwner {
  name: string
  phone?: string
  email?: string
  organization?: string
}

export interface CloudHost {
  id: string
  hostName: string
  label?: string
  ipAddress: string
  ipAddresses?: string[]
  status: CloudHostStatus
  protectionStatus: ProtectionStatus
  cpu: number
  memory: number // GB
  disk: number // GB
  osType: string
  osVersion?: string
  type: 'STANDARD' | 'TRUSTED_CREATION'
  department: string
  macAddresses?: string[]
  serialNumber?: string
  manufactureDate?: string
  trustedCategory?: TrustedCategory
  description?: string
  cpuModel?: string
  memoryType?: string
  storage?: CloudHostStorage[]
  gpu?: { model: string; count: number }

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
  owner?: CloudHostOwner

  // Security (EDR & access)
  edrInstalled: boolean
  edrOnline: boolean
  edrAgentVersion?: string
  edrVirusDbVersion?: string
  edrLastHeartbeat?: string
  edrBrand?: string
  blocked: boolean
  blockedReason?: string
  blockedAt?: string
  admissionStatus: AdmissionStatus
  pendingAlerts: number
  vulnerabilities: number

  // Sync metadata
  dataSource: {
    source: 'CLOUD_PLATFORM' | 'MANUAL'
    provider?: string
    lastSyncTime?: string
    syncStatus?: 'SUCCESS' | 'FAILED' | 'PENDING'
  }

  // Deployment / exposure
  networkSegment?: string
  datacenter?: string
  nodeRoom?: string
  platformDetail?: string

  // Misc
  region?: string
  vendor?: string
  model?: string
}
