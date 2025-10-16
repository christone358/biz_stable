/**
 * 统一的业务监控Mock数据
 * 为business-panorama和business-monitoring提供一致的数据源
 */

import dayjs from 'dayjs'
import { generateBusinessDomainSystems } from './data'
import type { BusinessSystem } from '../types'

// 业务监控完整数据接口
export interface UnifiedBusinessData {
  system: BusinessSystem
  monitoring: {
    kpis: {
      healthScore: number
      accessVolume: string
      logVolume: string
      errorRate: number
      responseTime: number
      sla: number
    }
    alerts: Array<{
      id: string
      level: 'urgent' | 'warning' | 'info'
      type: string
      title: string
      description: string
      affectedAsset: string
      affectedAssetId: string
      timestamp: string
      status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'
      duration?: number
    }>
    vulnerabilities: Array<{
      id: string
      cveId?: string
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
      cvssScore: number
      title: string
      description: string
      affectedAsset: string
      affectedAssetId: string
      discoveryDate: string
      status: 'OPEN' | 'FIXING' | 'RESOLVED'
      fixRecommendation?: string
    }>
    topology: {
      nodes: Array<{
        id: string
        name: string
        type: 'application' | 'service' | 'middleware' | 'server'
        status: string
        importance: string
        metrics?: {
          cpu?: number
          memory?: number
          responseTime?: number
        }
      }>
      links: Array<{
        source: string
        target: string
        type: 'call' | 'depend'
      }>
    }
    performance: {
      cpu: Array<{ timestamp: string; value: number }>
      memory: Array<{ timestamp: string; value: number }>
      responseTime: Array<{ timestamp: string; value: number }>
      errorRate: Array<{ timestamp: string; value: number }>
      throughput: Array<{ timestamp: string; value: number }>
      requestCount: Array<{ timestamp: string; value: number }>
    }
  }
}

// 生成时序数据
const generateTimeSeriesData = (hours: number, baseValue: number, variance: number, systemHash: number) => {
  const now = Date.now()
  const interval = (hours * 3600 * 1000) / 24
  const data = []

  for (let i = 0; i < 24; i++) {
    const timestamp = dayjs(now - (23 - i) * interval).format('YYYY-MM-DD HH:mm:ss')
    // 使用systemHash确保数据稳定
    const seed = (systemHash + i * 1000) % 10000
    const value = baseValue + (seed / 10000 - 0.5) * variance
    data.push({
      timestamp,
      value: Math.max(0, value)
    })
  }

  return data
}

// 缓存的统一数据
let _cachedUnifiedData: Map<string, UnifiedBusinessData> | null = null

// 根据系统ID获取统一的业务数据
export const getUnifiedBusinessData = (systemId: string): UnifiedBusinessData | null => {
  // 初始化缓存
  if (!_cachedUnifiedData) {
    _cachedUnifiedData = new Map()
    const allSystems = generateBusinessDomainSystems()

    allSystems.forEach(system => {
      // 为每个系统生成完整的监控数据
      const systemHash = system.id.split('').reduce((hash, char) => {
        return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff
      }, 0)

      // 生成KPI指标 - 基于系统实际指标计算健康分
      // 健康分计算公式：基础分100分，根据各项指标扣分
      let healthScore = 100

      // 错误率扣分：每0.5%扣2分，最多扣20分
      healthScore -= Math.min(20, (system.errorRate / 0.5) * 2)

      // 响应时间扣分：超过200ms开始扣分，每100ms扣5分，最多扣20分
      if (system.responseTime > 200) {
        healthScore -= Math.min(20, ((system.responseTime - 200) / 100) * 5)
      }

      // 可用性扣分：低于99%开始扣分，每降低1%扣10分
      if (system.availability < 99) {
        healthScore -= (99 - system.availability) * 10
      }

      // 告警扣分：每个告警扣2分，最多扣10分
      healthScore -= Math.min(10, system.alertCount * 2)

      // 脆弱性扣分：每个脆弱性扣3分，最多扣15分
      healthScore -= Math.min(15, system.vulnerabilityCount * 3)

      // 确保健康分在0-100之间
      healthScore = Math.max(0, Math.min(100, Math.round(healthScore)))

      // 生成告警数据（数量与system.alertCount一致）
      const alerts = []
      const alertLevels: Array<'urgent' | 'warning' | 'info'> = ['urgent', 'warning', 'info']
      const alertTypes = ['PERFORMANCE', 'SYSTEM', 'SECURITY', 'RESOURCE']

      for (let i = 0; i < system.alertCount; i++) {
        const asset = system.assets?.[i % (system.assets?.length || 1)]
        alerts.push({
          id: `ALERT_${system.id}_${String(i + 1).padStart(3, '0')}`,
          level: alertLevels[i % alertLevels.length],
          type: alertTypes[i % alertTypes.length],
          title: `${system.name}${alertTypes[i % alertTypes.length]}告警`,
          description: `${system.name}检测到${alertTypes[i % alertTypes.length]}异常`,
          affectedAsset: asset?.name || `资产-${i + 1}`,
          affectedAssetId: asset?.id || `asset-${i + 1}`,
          timestamp: dayjs().subtract(i * 30, 'minute').toISOString(),
          status: (i % 3 === 0 ? 'OPEN' : i % 3 === 1 ? 'ACKNOWLEDGED' : 'RESOLVED') as 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED',
          duration: 600 + i * 300
        })
      }

      // 生成脆弱性数据（数量与system.vulnerabilityCount一致）
      const vulnerabilities = []
      const severities: Array<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'> = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

      for (let i = 0; i < system.vulnerabilityCount; i++) {
        const asset = system.assets?.[i % (system.assets?.length || 1)]
        const severity = severities[i % severities.length]
        const baseScore = severity === 'CRITICAL' ? 9.5 : severity === 'HIGH' ? 7.5 : severity === 'MEDIUM' ? 5.5 : 3.5

        vulnerabilities.push({
          id: `VUL_${system.id}_${String(i + 1).padStart(3, '0')}`,
          cveId: `CVE-2024-${String(10000 + (systemHash + i) % 9000)}`,
          severity,
          cvssScore: baseScore - (i % 3) * 0.3,
          title: `${system.name}${severity === 'CRITICAL' ? '严重' : severity === 'HIGH' ? '高危' : severity === 'MEDIUM' ? '中危' : '低危'}漏洞`,
          description: `在${asset?.name || '系统资产'}中发现安全漏洞`,
          affectedAsset: asset?.name || `资产-${i + 1}`,
          affectedAssetId: asset?.id || `asset-${i + 1}`,
          discoveryDate: dayjs().subtract(i + 1, 'day').toISOString(),
          status: (i % 3 === 0 ? 'OPEN' : i % 3 === 1 ? 'FIXING' : 'RESOLVED') as 'OPEN' | 'FIXING' | 'RESOLVED',
          fixRecommendation: '建议及时更新系统补丁'
        })
      }

      // 生成拓扑数据
      const topologyNodes = system.assets?.slice(0, 10).map((asset, index) => ({
        id: asset.id,
        name: asset.name,
        type: (asset.type.includes('服务') ? 'service' :
               asset.type.includes('中间件') || asset.type.includes('数据库') ? 'middleware' :
               'server') as 'application' | 'service' | 'middleware' | 'server',
        status: asset.healthStatus,
        importance: asset.importance,
        metrics: {
          cpu: ((systemHash + index * 10) % 100),
          memory: ((systemHash + index * 20) % 100),
          responseTime: asset.responseTime
        }
      })) || []

      // 生成节点间的连接关系
      const topologyLinks = []
      for (let i = 0; i < topologyNodes.length - 1; i++) {
        if (i % 2 === 0 && i + 1 < topologyNodes.length) {
          topologyLinks.push({
            source: topologyNodes[i].id,
            target: topologyNodes[i + 1].id,
            type: 'call' as 'call' | 'depend'
          })
        }
      }

      // 生成性能数据
      const performance = {
        cpu: generateTimeSeriesData(24, 55, 30, systemHash),
        memory: generateTimeSeriesData(24, 65, 20, systemHash + 100),
        responseTime: generateTimeSeriesData(24, system.responseTime, 100, systemHash + 200),
        errorRate: generateTimeSeriesData(24, system.errorRate, 2, systemHash + 300),
        throughput: generateTimeSeriesData(24, 1500, 500, systemHash + 400),
        requestCount: generateTimeSeriesData(24, 25000, 8000, systemHash + 500)
      }

      // 组装完整数据
      const unifiedData: UnifiedBusinessData = {
        system,
        monitoring: {
          kpis: {
            healthScore,
            // 访问量基于系统哈希生成，确保稳定性
            accessVolume: `${(1.0 + (systemHash % 30) / 10).toFixed(1)}M`,
            // 日志量基于系统哈希生成，确保稳定性
            logVolume: `${(100 + (systemHash % 200))}K`,
            errorRate: system.errorRate,
            responseTime: system.responseTime,
            sla: system.availability
          },
          alerts,
          vulnerabilities,
          topology: {
            nodes: topologyNodes,
            links: topologyLinks
          },
          performance
        }
      }

      _cachedUnifiedData.set(system.id, unifiedData)
    })
  }

  return _cachedUnifiedData.get(systemId) || null
}

// 获取所有业务系统ID列表
export const getAllBusinessSystemIds = (): string[] => {
  const allSystems = generateBusinessDomainSystems()
  return allSystems.map(sys => sys.id)
}

// 清除缓存（开发时可能需要）
export const clearUnifiedDataCache = () => {
  _cachedUnifiedData = null
}
