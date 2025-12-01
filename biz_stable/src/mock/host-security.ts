import { Alert, Vulnerability } from '../types'
import { getCloudHosts } from './cloud-hosts'

// Map cloud-hosts into alert/vuln records so business monitoring can reuse

export function generateAlertsForBusiness(params: { block?: string; system?: string; assetName?: string }): Alert[] {
  const hosts = getCloudHosts().filter(h => (
    (params.block ? h.businessBlock === params.block : true) &&
    (params.system ? h.businessSystem === params.system : true) &&
    (params.assetName ? h.businessAssetName === params.assetName : true)
  ))
  const now = Date.now()
  const list: Alert[] = []
  hosts.forEach((h, idx) => {
    // simple heuristic: if edr offline or blocked, raise alerts
    if (!h.edrInstalled) list.push(baseAlert(h, 'P1', 'EDR未安装', now - idx * 3600_000))
    if (h.edrInstalled && !h.edrOnline) list.push(baseAlert(h, 'P2', 'EDR离线/未运行', now - idx * 1800_000))
    if (h.blocked) list.push(baseAlert(h, 'P0', `主机被阻断：${h.blockedReason ?? ''}`, now - idx * 600_000))
  })
  return list
}

function baseAlert(h: any, level: Alert['level'], title: string, ts: number): Alert {
  return {
    id: `${h.id}-${level}-${Math.abs(ts)}`,
    systemId: h.id, // use host id for mapping
    systemName: h.hostName,
    department: h.department,
    level,
    type: 'HostSecurity',
    title,
    description: title,
    status: 'OPEN',
    timestamp: new Date(ts).toISOString(),
  }
}

export function generateVulnsForBusiness(params: { block?: string; system?: string; assetName?: string }): Vulnerability[] {
  const hosts = getCloudHosts().filter(h => (
    (params.block ? h.businessBlock === params.block : true) &&
    (params.system ? h.businessSystem === params.system : true) &&
    (params.assetName ? h.businessAssetName === params.assetName : true)
  ))
  const vulns: Vulnerability[] = []
  hosts.forEach((h, i) => {
    // fabricate a couple of vulns per host for demo
    vulns.push(baseVuln(h, 'CRITICAL', 9.1, `OpenSSL 1.0.2 End-of-life`, i))
    if (h.type === 'STANDARD') vulns.push(baseVuln(h, 'HIGH', 8.2, `Kernel privilege escalation`, i + 100))
  })
  return vulns
}

function baseVuln(h: any, severity: Vulnerability['severity'], cvss: number, title: string, seed: number): Vulnerability {
  return {
    id: `${h.id}-v-${seed}`,
    cveId: undefined,
    systemId: h.id, // host id
    systemName: h.hostName,
    department: h.department,
    severity,
    cvssScore: cvss,
    title,
    description: title,
    status: 'OPEN',
    discoveryDate: new Date(Date.now() - seed * 60_000).toISOString(),
    fixRecommendation: '升级组件版本或打补丁',
  }
}
