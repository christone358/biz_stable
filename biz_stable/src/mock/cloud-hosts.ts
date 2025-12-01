import { CloudHost } from '../types/cloud-host'

const blocks = ['一梁', '四柱', '一库']
const systems = ['支付系统', '身份系统', '客服系统', '物流系统']
const assets = ['支付核心', '身份认证', '客服联络中心', '物流对接']
const depts = ['技术部', '信息部', '运维中心']
const providers = ['阿里云', '华为云', '腾讯云', '本地专有云']

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function bool(p = 0.5) { return Math.random() < p }

function randomPastTimestamp(days: number) {
  const maxOffset = days * 24 * 60 * 60 * 1000
  return Date.now() - Math.floor(Math.random() * maxOffset)
}

let _cached: CloudHost[] | null = null

function generateCloudHosts(count = 30): CloudHost[] {
  const list: CloudHost[] = []
  for (let i = 0; i < count; i++) {
    const edrInstalled = bool(0.9)
    const edrOnline = edrInstalled ? bool(0.9) : false
    const blocked = bool(0.1)
    const status = blocked ? 'STOPPED' : (bool(0.8) ? 'RUNNING' : 'STOPPED')
    const protectionStatus = edrInstalled && edrOnline ? 'PROTECTED' : 'UNPROTECTED'
    const hasRequester = bool(0.4)
    const requester = hasRequester ? rand(['赵敏', '陈博']) : undefined
    const requestedAtTs = hasRequester ? randomPastTimestamp(120) : undefined
    const deliveredAtTs = requestedAtTs
      ? Math.min(Date.now(), requestedAtTs + (Math.floor(Math.random() * 15) + 1) * 24 * 60 * 60 * 1000)
      : undefined
    list.push({
      id: `ch-${i + 1}`,
      hostName: `host-${String(i + 1).padStart(3, '0')}`,
      label: i % 3 === 0 ? '生产' : undefined,
      ipAddress: `10.10.${Math.floor(i / 10)}.${(i % 10) + 10}`,
      status,
      protectionStatus,
      cpu: [2, 4, 8, 16][Math.floor(Math.random() * 4)],
      memory: [8, 16, 32, 64][Math.floor(Math.random() * 4)],
      disk: [100, 200, 500][Math.floor(Math.random() * 3)],
      osType: rand(['CentOS', 'Ubuntu', 'Windows Server']),
      osVersion: rand(['7.9', '20.04', '2019']),
      type: bool(0.15) ? 'TRUSTED_CREATION' : 'STANDARD',
      department: rand(depts),
      businessBlock: rand(blocks),
      businessSystem: rand(systems),
      businessAssetName: rand(assets),
      systemOwner: rand(['张伟', '李娜', '王强']),
      requester,
      requestedAt: requestedAtTs ? new Date(requestedAtTs).toISOString() : undefined,
      deliveredAt: deliveredAtTs ? new Date(deliveredAtTs).toISOString() : undefined,
      edrInstalled,
      edrOnline,
      edrAgentVersion: edrInstalled ? rand(['5.2.1', '5.3.0', '5.1.9']) : undefined,
      edrVirusDbVersion: edrInstalled ? rand(['2025.11.24', '2025.11.20']) : undefined,
      edrLastHeartbeat: edrOnline ? new Date().toISOString() : undefined,
      blocked,
      blockedReason: blocked ? rand(['策略阻断', '异常流量']) : undefined,
      blockedAt: blocked ? new Date(Date.now() - 3600_000).toISOString() : undefined,
      admissionStatus: blocked ? 'DENIED' : 'ALLOWED',
      pendingAlerts: Math.floor(Math.random() * 4),
      vulnerabilities: Math.floor(Math.random() * 3),
      dataSource: { source: 'CLOUD_PLATFORM', lastSyncTime: new Date().toISOString(), syncStatus: 'SUCCESS' },
      region: rand(['华东一区', '华北一区', '本地']),
      vendor: rand(providers),
      model: rand(['R650', 'R740', 'RH2288', 'NF5180'])
    })
  }
  return list
}

// Get a singleton list so other modules can map consistently
export function getCloudHosts(): CloudHost[] {
  if (!_cached) _cached = generateCloudHosts(40)
  return _cached
}

export function getHostsByBusiness(params: { block?: string; system?: string; assetName?: string }) {
  const all = getCloudHosts()
  return all.filter(h => (
    (params.block ? h.businessBlock === params.block : true) &&
    (params.system ? h.businessSystem === params.system : true) &&
    (params.assetName ? h.businessAssetName === params.assetName : true)
  ))
}
