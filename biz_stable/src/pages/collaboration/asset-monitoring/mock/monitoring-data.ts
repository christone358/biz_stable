import type { SystemOverview, SystemMonitoringData } from '../types'
import { generateMonitoringDataForAsset } from '../../../../mock/business-monitoring-data'
import { getUnifiedBusinessData, getAllBusinessSystemIds } from '../../../../mock/unified-business-data'
import { generateBusinessDomainSystems } from '../../../../mock/data'

/**
 * 核心业务系统ID映射
 * 从所有业务系统中选择6个核心系统用于资产监测页面展示
 */
const CORE_SYSTEM_IDS = [
  'SYS_PORTAL_WEB_001',      // 一网通办门户前端服务系统
  'SYS_PORTAL_APP_001',      // 随申办APP前端服务系统
  'SYS_AUTH_001',            // 统一身份认证前端服务系统
  'SYS_PAY_001',             // 统一公共支付前端服务系统
  'SYS_DB_PUBLIC_001',       // 公共信息库前端服务系统
  'SYS_DB_POP_001',          // 人口信息库前端服务系统
]

/**
 * 根据分数获取健康状态
 */
function getHealthStatus(score: number): {
  status: 'healthy' | 'warning' | 'critical'
  label: string
  color: string
} {
  if (score >= 90) {
    return { status: 'healthy', label: '正常', color: '#52c41a' }
  } else if (score >= 70) {
    return { status: 'warning', label: '告警', color: '#faad14' }
  } else {
    return { status: 'critical', label: '异常', color: '#ff4d4f' }
  }
}

/**
 * 生成系统概览数据
 * 从unified-business-data获取真实数据
 */
export function generateSystemsOverview(): SystemOverview[] {
  return CORE_SYSTEM_IDS.map(systemId => {
    // 从统一数据源获取真实数据
    const unifiedData = getUnifiedBusinessData(systemId)

    if (!unifiedData) {
      console.warn(`System ${systemId} not found in unified data`)
      // 返回空数据占位
      return {
        id: systemId,
        name: '未知系统',
        shortName: '未知',
        healthScore: 0,
        healthStatus: 'critical' as const,
        healthLabel: '异常',
        healthColor: '#ff4d4f',
        metricsStatus: 'abnormal' as const,
        alertCount: 0,
        vulnerabilityCount: 0,
        assetCount: 0,
        lastUpdateTime: '未知',
      }
    }

    // 使用真实的统一数据
    const healthStatus = getHealthStatus(unifiedData.monitoring.kpis.healthScore)
    const systemName = unifiedData.system.name

    // 计算最近更新时间（基于系统hash确保稳定性）
    const systemHash = systemId.split('').reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff
    }, 0)
    const minutesAgo = (systemHash % 10) + 1

    return {
      id: systemId,
      name: systemName,
      shortName: systemName.length > 8 ? systemName.substring(0, 8) + '...' : systemName,
      healthScore: unifiedData.monitoring.kpis.healthScore,
      healthStatus: healthStatus.status,
      healthLabel: healthStatus.label,
      healthColor: healthStatus.color,
      metricsStatus: unifiedData.monitoring.kpis.errorRate > 1 ? 'abnormal' : 'normal',
      alertCount: unifiedData.monitoring.alerts.length,
      vulnerabilityCount: unifiedData.monitoring.vulnerabilities.length,
      assetCount: unifiedData.system.assetCount,
      lastUpdateTime: `${minutesAgo}分钟前`,
    }
  })
}

/**
 * 生成系统详细监控数据
 * 使用unified business-monitoring data structure
 */
export function generateSystemMonitoringData(systemId: string): SystemMonitoringData {
  // 使用business-monitoring的统一数据生成函数
  const monitoringData = generateMonitoringDataForAsset({
    systemId,
    businessId: systemId,
  })

  return monitoringData
}
