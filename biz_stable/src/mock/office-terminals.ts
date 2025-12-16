import { OfficeTerminal, TerminalDeviceType, TerminalOSFamily, TerminalRegistrationStatus, TerminalSecuritySoftware } from '../types/office-terminal'

const osFamilies: Array<{ family: TerminalOSFamily; names: string[]; versions: string[] }> = [
  { family: 'Windows', names: ['Windows 7 Ultimate', 'Windows 10 Enterprise', 'Windows 11 Enterprise'], versions: ['6.1.7601', '10.0.19045', '10.0.22631'] },
  { family: 'macOS', names: ['macOS Ventura', 'macOS Sonoma'], versions: ['13.6', '14.1'] },
  { family: 'Linux', names: ['UOS 1070e', '麒麟 V10'], versions: ['1070e', '10.6'] },
]

const deviceTypes: TerminalDeviceType[] = ['DESKTOP', 'LAPTOP', 'VDI', 'THIN']
const orgPaths = [
  '闵行区/区政府/区经委',
  '闵行区/镇、街道、莘庄工业区/新虹街道',
  '闵行区/镇、街道、莘庄工业区/华漕镇',
  '闵行区/镇、街道、莘庄工业区/梅陇镇',
  '闵行区/区政府/区财政局',
]
const departments = ['经委办公室', '政务大厅', '社会发展科', '信息中心', '网络科']
const terminalUsers = ['谢征', '张伟', '李娜', '王洋', '陈曦', '刘婷', '赵雷']
const edrClientTypes = ['Windows桌面终端', 'Windows服务器终端', 'macOS终端', 'Linux桌面终端', 'VDI虚拟桌面']
const registrationStatuses: TerminalRegistrationStatus[] = ['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'DEREGISTERED']
const infoSources = ['EDR', 'NAC', 'AD', 'MDM'] as const
const securityVendors = ['Microsoft', '奇虎360', '火绒', '深信服', '江南天安']
const edrVendors = ['奇安信', '深信服', '启明星辰']

const networkSegments = ['10.29.113.0/24', '22.2.67.0/24', '132.1.14.0/24', '104.23.14.0/24']

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function bool(prob = 0.5) {
  return Math.random() < prob
}

function randomTimestamp(withinDays: number) {
  const delta = withinDays * 24 * 3600 * 1000
  return new Date(Date.now() - Math.floor(Math.random() * delta)).toISOString()
}

function buildSecuritySoftwares(id: string, edrInstalled: boolean, edrOnline: boolean): TerminalSecuritySoftware[] {
  const softwares: TerminalSecuritySoftware[] = []
  if (edrInstalled) {
    softwares.push({
      id: `${id}-edr`,
      category: 'EDR',
      vendor: rand(edrVendors),
      productName: '终端检测响应',
      clientVersion: `8.1.${100 + Math.floor(Math.random() * 50)}`,
      engineVersion: `5.${Math.floor(Math.random() * 10)}`,
      onlineStatus: edrOnline ? 'ONLINE' : 'OFFLINE',
      realtimeProtection: edrOnline ? 'ON' : 'UNKNOWN',
      installTime: randomTimestamp(200),
      lastUpdatedAt: randomTimestamp(15),
      enabled: true,
      primary: true,
      source: 'EDR'
    })
  }
  softwares.push({
    id: `${id}-av`,
    category: 'AV',
    vendor: rand(securityVendors),
    productName: rand(['Microsoft Defender', '360安全卫士', '火绒终端安全']),
    clientVersion: `10.${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 900)}`,
    engineVersion: `1.${Math.floor(Math.random() * 20)}`,
    virusDbVersion: `2025.${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}.${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    realtimeProtection: bool(0.85) ? 'ON' : 'OFF',
    onlineStatus: bool(0.9) ? 'ONLINE' : 'OFFLINE',
    installTime: randomTimestamp(400),
    lastUpdatedAt: randomTimestamp(10),
    enabled: true,
    source: 'EDR'
  })
  return softwares
}

let cachedTerminals: OfficeTerminal[] | null = null

export function getOfficeTerminals(count = 36): OfficeTerminal[] {
  if (cachedTerminals) return cachedTerminals
  const list: OfficeTerminal[] = []
  for (let i = 0; i < count; i++) {
    const osDef = rand(osFamilies)
    const osName = rand(osDef.names)
    const osVersion = rand(osDef.versions)
    const deviceType = rand(deviceTypes)
    const osFamily = osDef.family
    const ip = `10.${20 + (i % 30)}.${(i * 3) % 255}.${(i * 7) % 200}`
    const mac = `0C-${(10 + i).toString(16).padStart(2, '0')}-${(20 + i).toString(16).padStart(2, '0')}-${(30 + i).toString(16).padStart(2, '0')}-AA-${(40 + i).toString(16).padStart(2, '0')}`.toUpperCase()
    const edrInstalled = bool(0.88)
    const edrOnline = edrInstalled ? bool(0.82) : false
    const runStatus: OfficeTerminal['runStatus'] = bool(0.75) ? 'RUNNING' : bool(0.15) ? 'STOPPED' : 'UNKNOWN'
    const blocked = bool(0.08)
    const lockState = bool(0.06) ? 'LOCKED' : 'UNLOCKED'
    const validState = bool(0.92) ? 'VALID' : 'INVALID'
    const regStatus = rand(registrationStatuses)
    const departmentPath = rand(orgPaths)
    const userName = rand(terminalUsers)
    const user: OfficeTerminal['user'] = {
      name: userName,
      account: `user${String(i + 1).padStart(3, '0')}`,
      department: rand(departments),
      title: rand(['政务专员', '窗口人员', '系统管理员']),
      phone: `139${String(10000000 + i * 123).slice(0, 8)}`,
      email: `user${i + 1}@gov.local`
    }
    const nacRegisteredAt = ['APPROVED', 'IN_REVIEW'].includes(regStatus) ? randomTimestamp(200) : undefined
    const edrFirstSeenAt = edrInstalled ? randomTimestamp(150) : undefined
    const edrUninstalledAt = !edrInstalled && bool(0.3) ? randomTimestamp(60) : undefined
    const lastActiveAt = randomTimestamp(12)
    const pendingAlerts = Math.floor(Math.random() * 4)
    const vulnerabilities = Math.floor(Math.random() * 3)

    const item: OfficeTerminal = {
      id: `terminal-${i + 1}`,
      deviceName: `PC-${String(100 + i).padStart(3, '0')}`,
      assetNumber: `MN-${202300 + i}`,
      deviceType,
      osFamily,
      osVersion,
      osName,
      edrClientType: edrInstalled ? rand(edrClientTypes) : undefined,
      edrClientVersion: edrInstalled ? `8.1.${150 + (i % 60)}` : undefined,
      edrEngineVersion: edrInstalled ? `5.${i % 12}` : undefined,
      ipAddress: ip,
      macAddress: mac,
      networkSegment: rand(networkSegments),
      runStatus,
      lastActiveAt,
      departmentPath,
      user,
      registrationStatus: regStatus,
      infoSource: rand(infoSources),
      nacRegisteredAt,
      edrFirstSeenAt,
      edrUninstalledAt,
      edrInstalled,
      edrOnline,
      protectionLevel: edrInstalled && edrOnline ? 'PROTECTED' : 'UNPROTECTED',
      blocked,
      blockedAt: blocked ? randomTimestamp(20) : undefined,
      lockState,
      validState,
      exposure: bool(0.15) ? 'INTERNET' : 'INTERNAL',
      pendingAlerts,
      vulnerabilities,
      description: '办公终端资产',
      tags: [osFamily, deviceType === 'LAPTOP' ? '移动' : '固定'],
      securitySoftwares: buildSecuritySoftwares(`terminal-${i + 1}`, edrInstalled, edrOnline)
    }

    list.push(item)
  }

  cachedTerminals = list
  return list
}
