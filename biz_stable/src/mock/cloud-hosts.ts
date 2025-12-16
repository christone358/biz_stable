import { CloudHost } from '../types/cloud-host'

const blocks = ['一梁', '四柱', '一库']
const systems = ['支付系统', '身份系统', '客服系统', '物流系统']
const assets = ['支付核心', '身份认证', '客服联络中心', '物流对接']
const depts = ['技术部', '信息部', '运维中心']
const providers = ['华为云', '云轴', '私有云']
const datacenters = ['华北一区', '华东一区']
const networkSegments = ['10.1.0.0/24', '10.2.5.0/24', '172.20.1.0/24', '192.168.50.0/24']
const platformDetails = ['华为云·华北', '华为云·华东', '云轴·华北', '云轴·华东', '私有云']
const cpuModels = ['Intel Xeon Platinum 8375C', 'Kunpeng 920', 'AMD EPYC 7K62']
const memoryTypes = ['DDR4 3200', 'DDR5 4800']
const storagePresets = [
  [{ type: 'SSD', sizeGB: 200, model: 'ESSD PL1' }],
  [{ type: 'SSD', sizeGB: 500, model: 'ESSD PL2' }],
  [
    { type: 'SSD', sizeGB: 200, model: 'ESSD PL1' },
    { type: 'HDD', sizeGB: 1000, model: 'SATA' }
  ]
]
const trustedCategories = ['STANDARD', 'DOMESTIC'] as const
const edrBrands = ['奇安信天擎', '北信源EDR', '青藤云EDR']

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
    const ownerName = rand(['张伟', '李娜', '王强'])
    const department = rand(depts)
    const manufactureDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 3600 * 1000).toISOString()
    const networkSegment = rand(networkSegments)
    const provider = rand(providers)
    const platformDetail = provider === '私有云' ? '私有云' : rand(platformDetails.filter(p => p.startsWith(provider)))
    const datacenter = provider === '私有云' ? '私有云数据中心' : rand(datacenters)
    const storage = storagePresets[i % storagePresets.length]
    list.push({
      id: `ch-${i + 1}`,
      hostName: `host-${String(i + 1).padStart(3, '0')}`,
      label: i % 3 === 0 ? '生产' : undefined,
      ipAddress: `10.10.${Math.floor(i / 10)}.${(i % 10) + 10}`,
      ipAddresses: [`10.10.${Math.floor(i / 10)}.${(i % 10) + 10}`],
      status,
      protectionStatus,
      cpu: [2, 4, 8, 16][Math.floor(Math.random() * 4)],
      memory: [8, 16, 32, 64][Math.floor(Math.random() * 4)],
      disk: [100, 200, 500][Math.floor(Math.random() * 3)],
      osType: rand(['CentOS', 'Ubuntu', 'Windows Server']),
      osVersion: rand(['7.9', '20.04', '2019']),
      type: bool(0.15) ? 'TRUSTED_CREATION' : 'STANDARD',
      department,
      macAddresses: [`00-16-3E-${(i + 10).toString(16).padStart(2, '0')}-${(i + 20).toString(16).padStart(2, '0')}-${(i + 30).toString(16).padStart(2, '0')}`],
      serialNumber: `SR-${20230000 + i}`,
      manufactureDate,
      trustedCategory: bool(0.2)
        ? 'TRUSTED_CREATION'
        : rand(trustedCategories),
      description: '承载生产业务的云主机',
      cpuModel: rand(cpuModels),
      memoryType: rand(memoryTypes),
      storage,
      gpu: bool(0.2) ? { model: 'Tesla T4', count: 1 } : undefined,
      businessBlock: rand(blocks),
      businessSystem: rand(systems),
      businessAssetName: rand(assets),
      systemOwner: ownerName,
      requester,
      requestedAt: requestedAtTs ? new Date(requestedAtTs).toISOString() : undefined,
      deliveredAt: deliveredAtTs ? new Date(deliveredAtTs).toISOString() : undefined,
      owner: {
        name: ownerName,
        phone: `138${String(10000000 + i).slice(0, 8)}`,
        email: `owner${i + 1}@example.com`,
        organization: department,
        position: '系统负责人'
      },
      edrInstalled,
      edrOnline,
      edrBrand: edrInstalled ? rand(edrBrands) : undefined,
      edrAgentVersion: edrInstalled ? rand(['5.2.1', '5.3.0', '5.1.9']) : undefined,
      edrVirusDbVersion: edrInstalled ? rand(['2025.11.24', '2025.11.20']) : undefined,
      edrLastHeartbeat: edrOnline ? new Date().toISOString() : undefined,
      blocked,
      blockedReason: blocked ? rand(['策略阻断', '异常流量']) : undefined,
      blockedAt: blocked ? new Date(Date.now() - 3600_000).toISOString() : undefined,
      admissionStatus: blocked ? 'DENIED' : 'ALLOWED',
      pendingAlerts: Math.floor(Math.random() * 4),
      vulnerabilities: Math.floor(Math.random() * 3),
      dataSource: { source: 'CLOUD_PLATFORM', provider, lastSyncTime: new Date().toISOString(), syncStatus: 'SUCCESS' },
      networkSegment,
      datacenter,
      nodeRoom: `F${(i % 10) + 1}-0${i % 5}`,
      platformDetail,
      region: datacenter,
      vendor: provider,
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
