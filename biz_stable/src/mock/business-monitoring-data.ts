// 应用监控详情页Mock数据

import dayjs from 'dayjs'
import {
  ApplicationInfo,
  ApplicationKPIs,
  ApplicationMonitoringData,
  VulnerabilitySummary,
  VulnerabilityDetail,
  AlertSummary,
  AlertDetail,
  AssetTopologyData,
  PerformanceMetrics,
  PerformanceDataPoint,
  AssetNode
} from '../pages/management/business-monitoring/types'
import { getUnifiedBusinessData } from './unified-business-data'

// 生成时序数据
const generateTimeSeriesData = (hours: number, baseValue: number, variance: number): PerformanceDataPoint[] => {
  const now = Date.now()
  const interval = (hours * 3600 * 1000) / 24 // 24个数据点
  const data: PerformanceDataPoint[] = []

  for (let i = 0; i < 24; i++) {
    const timestamp = dayjs(now - (23 - i) * interval).format('YYYY-MM-DD HH:mm:ss')
    const value = baseValue + (Math.random() - 0.5) * variance
    data.push({
      timestamp,
      value: Math.max(0, value)
    })
  }

  return data
}

// 生成迷你趋势图数据
const generateTrendData = (): number[] => {
  return Array.from({ length: 12 }, () => Math.random() * 100)
}

// Mock应用基本信息
export const mockApplicationInfo: ApplicationInfo = {
  id: 'APP_001',
  name: '一网通办门户',
  displayName: '一网通办门户系统',
  status: 'running',
  type: 'core', // 核心业务
  department: '市大数据中心',
  owner: '张三',
  monitoringDuration: '30天',
  lastUpdateTime: dayjs().subtract(5, 'minute').toISOString(),

  // 资产统计
  assetStatistics: {
    hosts: 12,
    middleware: 8,
    services: 15
  },

  // 责任主体信息
  responsibilities: {
    owner: {
      organization: '市大数据中心',
      contact: '张三',
      phone: '138-1234-5678',
      email: 'zhangsan@dataexample.com'
    },
    developer: {
      organization: '数字科技有限公司',
      contact: '李四',
      phone: '139-2345-6789',
      email: 'lisi@techexample.com'
    },
    operator: {
      organization: '运维服务团队',
      contact: '王五',
      phone: '137-3456-7890',
      email: 'wangwu@opsexample.com'
    }
  }
}

// Mock KPI指标数据
export const mockApplicationKPIs: ApplicationKPIs = {
  healthScore: {
    label: '健康度',
    value: 92,
    unit: '分',
    trend: 'up',
    trendValue: 3.5,
    status: 'good',
    chartData: generateTrendData()
  },
  accessVolume: {
    label: '访问量',
    value: '2.5M',
    unit: '次/日',
    trend: 'up',
    trendValue: 12.3,
    status: 'good',
    chartData: generateTrendData()
  },
  logVolume: {
    label: '日志量',
    value: '156K',
    unit: '条/日',
    trend: 'stable',
    trendValue: 0.5,
    status: 'good',
    chartData: generateTrendData()
  },
  errorRate: {
    label: '错误率',
    value: 0.12,
    unit: '%',
    trend: 'down',
    trendValue: -0.05,
    status: 'good',
    chartData: generateTrendData()
  },
  responseTime: {
    label: '响应时间',
    value: 245,
    unit: 'ms',
    trend: 'down',
    trendValue: -15,
    status: 'good',
    chartData: generateTrendData()
  },
  sla: {
    label: 'SLA',
    value: 99.95,
    unit: '%',
    trend: 'up',
    trendValue: 0.1,
    status: 'good',
    chartData: generateTrendData()
  }
}

// Mock脆弱性统计
export const mockVulnerabilitySummary: VulnerabilitySummary = {
  critical: 2,
  high: 5,
  medium: 12,
  low: 8,
  total: 27
}

// Mock脆弱性详细列表
export const mockVulnerabilityDetails: VulnerabilityDetail[] = [
  {
    id: 'VUL_001',
    cveId: 'CVE-2024-1234',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    title: 'SQL注入漏洞',
    description: '前端服务系统存在SQL注入漏洞，可能导致数据泄露',
    affectedAsset: '前端服务',
    affectedAssetId: 'svc_001',
    discoveryDate: dayjs().subtract(2, 'day').toISOString(),
    status: 'FIXING',
    fixRecommendation: '建议立即更新至最新版本并加强输入验证'
  },
  {
    id: 'VUL_002',
    cveId: 'CVE-2024-5678',
    severity: 'CRITICAL',
    cvssScore: 9.1,
    title: '权限提升漏洞',
    description: 'API网关存在权限提升漏洞',
    affectedAsset: 'API网关',
    affectedAssetId: 'svc_002',
    discoveryDate: dayjs().subtract(5, 'day').toISOString(),
    status: 'OPEN',
    fixRecommendation: '升级API网关版本至1.2.5以上'
  },
  {
    id: 'VUL_003',
    cveId: 'CVE-2024-2345',
    severity: 'HIGH',
    cvssScore: 7.5,
    title: 'XSS跨站脚本漏洞',
    description: '用户输入未经充分过滤',
    affectedAsset: '前端服务',
    affectedAssetId: 'svc_001',
    discoveryDate: dayjs().subtract(7, 'day').toISOString(),
    status: 'FIXING',
    fixRecommendation: '对用户输入进行严格的XSS过滤'
  },
  {
    id: 'VUL_004',
    severity: 'HIGH',
    cvssScore: 7.2,
    title: '信息泄露漏洞',
    description: 'Redis服务配置不当导致信息泄露风险',
    affectedAsset: 'Redis缓存',
    affectedAssetId: 'mid_001',
    discoveryDate: dayjs().subtract(10, 'day').toISOString(),
    status: 'OPEN',
    fixRecommendation: '配置访问控制并启用密码认证'
  },
  {
    id: 'VUL_005',
    severity: 'HIGH',
    cvssScore: 6.8,
    title: '不安全的反序列化',
    description: '应用服务存在不安全的反序列化操作',
    affectedAsset: '业务服务',
    affectedAssetId: 'svc_003',
    discoveryDate: dayjs().subtract(12, 'day').toISOString(),
    status: 'RESOLVED',
    fixRecommendation: '使用安全的序列化库'
  }
]

// Mock告警统计
export const mockAlertSummary: AlertSummary = {
  urgent: 3,
  warning: 8,
  info: 15,
  total: 26
}

// Mock告警详细列表
export const mockAlertDetails: AlertDetail[] = [
  {
    id: 'ALERT_001',
    level: 'urgent',
    type: 'PERFORMANCE',
    title: '响应时间超阈值',
    description: '前端服务系统响应时间超过500ms，当前值：650ms',
    affectedAsset: '前端服务',
    affectedAssetId: 'svc_001',
    timestamp: dayjs().subtract(10, 'minute').toISOString(),
    status: 'OPEN',
    duration: 600
  },
  {
    id: 'ALERT_002',
    level: 'urgent',
    type: 'SYSTEM',
    title: '数据库连接池耗尽',
    description: 'MySQL数据库连接池使用率达到95%',
    affectedAsset: 'MySQL主库',
    affectedAssetId: 'mid_002',
    timestamp: dayjs().subtract(30, 'minute').toISOString(),
    status: 'ACKNOWLEDGED',
    duration: 1800
  },
  {
    id: 'ALERT_003',
    level: 'urgent',
    type: 'SECURITY',
    title: '异常登录尝试',
    description: '检测到来自异常IP的大量登录尝试',
    affectedAsset: '前端服务',
    affectedAssetId: 'svc_001',
    timestamp: dayjs().subtract(1, 'hour').toISOString(),
    status: 'OPEN',
    duration: 3600
  },
  {
    id: 'ALERT_004',
    level: 'warning',
    type: 'RESOURCE',
    title: 'CPU使用率过高',
    description: '应用服务器CPU使用率达到85%',
    affectedAsset: '应用服务器-01',
    affectedAssetId: 'srv_001',
    timestamp: dayjs().subtract(2, 'hour').toISOString(),
    status: 'OPEN',
    duration: 7200
  },
  {
    id: 'ALERT_005',
    level: 'warning',
    type: 'RESOURCE',
    title: '内存使用率告警',
    description: 'Redis缓存服务器内存使用率达到80%',
    affectedAsset: 'Redis缓存',
    affectedAssetId: 'mid_001',
    timestamp: dayjs().subtract(3, 'hour').toISOString(),
    status: 'RESOLVED',
    duration: 1800
  }
]

// Mock资产拓扑数据
export const mockAssetTopology: AssetTopologyData = {
  nodes: [
    {
      id: 'app_001',
      name: '一网通办门户',
      type: 'application',
      status: 'HEALTHY',
      importance: 'CRITICAL',
      metrics: {
        cpu: 45,
        memory: 62,
        responseTime: 245
      }
    },
    {
      id: 'svc_001',
      name: '前端服务',
      type: 'service',
      status: 'WARNING',
      importance: 'HIGH',
      metrics: {
        cpu: 78,
        memory: 65,
        responseTime: 320
      }
    },
    {
      id: 'svc_002',
      name: 'API网关',
      type: 'service',
      status: 'HEALTHY',
      importance: 'HIGH',
      metrics: {
        cpu: 52,
        memory: 58,
        responseTime: 180
      }
    },
    {
      id: 'svc_003',
      name: '业务服务',
      type: 'service',
      status: 'HEALTHY',
      importance: 'HIGH',
      metrics: {
        cpu: 48,
        memory: 55,
        responseTime: 210
      }
    },
    {
      id: 'mid_001',
      name: 'Redis缓存',
      type: 'middleware',
      status: 'HEALTHY',
      importance: 'HIGH',
      metrics: {
        cpu: 35,
        memory: 72,
        responseTime: 5
      }
    },
    {
      id: 'mid_002',
      name: 'MySQL主库',
      type: 'middleware',
      status: 'WARNING',
      importance: 'CRITICAL',
      metrics: {
        cpu: 68,
        memory: 78,
        responseTime: 45
      }
    },
    {
      id: 'mid_003',
      name: 'MySQL从库',
      type: 'middleware',
      status: 'HEALTHY',
      importance: 'HIGH',
      metrics: {
        cpu: 45,
        memory: 65,
        responseTime: 38
      }
    },
    {
      id: 'srv_001',
      name: '应用服务器-01',
      type: 'server',
      status: 'HEALTHY',
      importance: 'MEDIUM',
      metrics: {
        cpu: 55,
        memory: 68,
        responseTime: 0
      }
    },
    {
      id: 'srv_002',
      name: '应用服务器-02',
      type: 'server',
      status: 'HEALTHY',
      importance: 'MEDIUM',
      metrics: {
        cpu: 48,
        memory: 62,
        responseTime: 0
      }
    },
    {
      id: 'srv_003',
      name: '数据库服务器',
      type: 'server',
      status: 'WARNING',
      importance: 'HIGH',
      metrics: {
        cpu: 72,
        memory: 82,
        responseTime: 0
      }
    }
  ],
  links: [
    { source: 'app_001', target: 'svc_001', type: 'call' },
    { source: 'app_001', target: 'svc_002', type: 'call' },
    { source: 'svc_001', target: 'svc_003', type: 'call' },
    { source: 'svc_002', target: 'svc_003', type: 'call' },
    { source: 'svc_003', target: 'mid_001', type: 'depend' },
    { source: 'svc_003', target: 'mid_002', type: 'depend' },
    { source: 'mid_002', target: 'mid_003', type: 'depend' },
    { source: 'svc_001', target: 'srv_001', type: 'depend' },
    { source: 'svc_002', target: 'srv_001', type: 'depend' },
    { source: 'svc_003', target: 'srv_002', type: 'depend' },
    { source: 'mid_002', target: 'srv_003', type: 'depend' },
    { source: 'mid_003', target: 'srv_003', type: 'depend' }
  ]
}

// Mock性能监控数据
export const mockPerformanceMetrics: PerformanceMetrics = {
  cpu: generateTimeSeriesData(24, 55, 20),
  memory: generateTimeSeriesData(24, 65, 15),
  responseTime: generateTimeSeriesData(24, 245, 80),
  errorRate: generateTimeSeriesData(24, 0.12, 0.1),
  throughput: generateTimeSeriesData(24, 1500, 400),
  requestCount: generateTimeSeriesData(24, 25000, 8000)
}

// 导出完整的应用监控数据
export const mockApplicationMonitoringData: ApplicationMonitoringData = {
  appInfo: mockApplicationInfo,
  kpis: mockApplicationKPIs,
  vulnerabilities: {
    summary: mockVulnerabilitySummary,
    details: mockVulnerabilityDetails
  },
  alerts: {
    summary: mockAlertSummary,
    details: mockAlertDetails
  },
  topology: mockAssetTopology,
  performance: mockPerformanceMetrics
}

// 支持多应用的数据生成（用于应用切换功能）
export const generateMockDataForApplication = (appId: string): ApplicationMonitoringData => {
  // 可以根据不同的appId生成不同的数据
  // 这里简化处理，返回相同结构的数据
  return mockApplicationMonitoringData
}

// 根据系统ID生成相关联的监控数据
export const generateMonitoringDataForAsset = (params: {
  businessId?: string
  businessName?: string
  assetId?: string
  assetName?: string
  assetType?: string
  layerType?: string
  systemId?: string
  department?: string
}): ApplicationMonitoringData => {
  const { systemId, businessId } = params

  // 优先使用systemId，如果没有则使用businessId
  const targetId = systemId || businessId

  console.log('=== generateMonitoringDataForAsset ===')
  console.log('Looking for system ID:', targetId)

  if (!targetId) {
    console.log('No system ID provided, returning default data')
    return mockApplicationMonitoringData
  }

  // 从统一数据源获取业务数据
  const unifiedData = getUnifiedBusinessData(targetId)

  if (!unifiedData) {
    console.log('System not found, returning default data')
    return mockApplicationMonitoringData
  }

  console.log('Found system:', unifiedData.system.name)
  console.log('Alert count:', unifiedData.monitoring.alerts.length)
  console.log('Vulnerability count:', unifiedData.monitoring.vulnerabilities.length)

  const system = unifiedData.system

  // 构建ApplicationInfo
  const appInfo: ApplicationInfo = {
    id: system.id,
    name: system.name,
    displayName: system.displayName || system.name,
    status: system.healthStatus === 'HEALTHY' ? 'running' :
            system.healthStatus === 'WARNING' ? 'warning' :
            system.healthStatus === 'CRITICAL' ? 'error' : 'stopped',
    type: system.importance === 'CRITICAL' ? 'core' : 'normal',
    department: system.department,
    owner: '系统负责人',
    monitoringDuration: '30天',
    lastUpdateTime: system.updatedAt,
    assetStatistics: {
      hosts: Math.floor(system.assetCount * 0.5),
      middleware: Math.floor(system.assetCount * 0.2),
      services: Math.floor(system.assetCount * 0.3)
    },
    responsibilities: {
      owner: {
        organization: system.department,
        contact: '责任人',
        phone: '138-1234-5678',
        email: 'owner@example.com'
      },
      developer: {
        organization: '开发单位',
        contact: '开发负责人',
        phone: '139-2345-6789',
        email: 'dev@example.com'
      },
      operator: {
        organization: '运维单位',
        contact: '运维负责人',
        phone: '137-3456-7890',
        email: 'ops@example.com'
      }
    }
  }

  // 构建KPI数据
  const kpis: ApplicationKPIs = {
    healthScore: {
      label: '健康度',
      value: unifiedData.monitoring.kpis.healthScore,
      unit: '分',
      trend: 'up',
      trendValue: 3.5,
      status: 'good',
      chartData: Array.from({ length: 12 }, () => Math.random() * 100)
    },
    accessVolume: {
      label: '访问量',
      value: unifiedData.monitoring.kpis.accessVolume,
      unit: '次/日',
      trend: 'up',
      trendValue: 12.3,
      status: 'good',
      chartData: Array.from({ length: 12 }, () => Math.random() * 100)
    },
    logVolume: {
      label: '日志量',
      value: unifiedData.monitoring.kpis.logVolume,
      unit: '条/日',
      trend: 'stable',
      trendValue: 0.5,
      status: 'good',
      chartData: Array.from({ length: 12 }, () => Math.random() * 100)
    },
    errorRate: {
      label: '错误率',
      value: unifiedData.monitoring.kpis.errorRate,
      unit: '%',
      trend: 'down',
      trendValue: -0.05,
      status: 'good',
      chartData: Array.from({ length: 12 }, () => Math.random() * 100)
    },
    responseTime: {
      label: '响应时间',
      value: unifiedData.monitoring.kpis.responseTime,
      unit: 'ms',
      trend: 'down',
      trendValue: -15,
      status: 'good',
      chartData: Array.from({ length: 12 }, () => Math.random() * 100)
    },
    sla: {
      label: 'SLA',
      value: unifiedData.monitoring.kpis.sla,
      unit: '%',
      trend: 'up',
      trendValue: 0.1,
      status: 'good',
      chartData: Array.from({ length: 12 }, () => Math.random() * 100)
    }
  }

  // 统计告警
  const alertSummary: AlertSummary = {
    urgent: unifiedData.monitoring.alerts.filter(a => a.level === 'urgent').length,
    warning: unifiedData.monitoring.alerts.filter(a => a.level === 'warning').length,
    info: unifiedData.monitoring.alerts.filter(a => a.level === 'info').length,
    total: unifiedData.monitoring.alerts.length
  }

  // 统计脆弱性
  const vulnSummary: VulnerabilitySummary = {
    critical: unifiedData.monitoring.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    high: unifiedData.monitoring.vulnerabilities.filter(v => v.severity === 'HIGH').length,
    medium: unifiedData.monitoring.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
    low: unifiedData.monitoring.vulnerabilities.filter(v => v.severity === 'LOW').length,
    total: unifiedData.monitoring.vulnerabilities.length
  }

  return {
    appInfo,
    kpis,
    vulnerabilities: {
      summary: vulnSummary,
      details: unifiedData.monitoring.vulnerabilities as VulnerabilityDetail[]
    },
    alerts: {
      summary: alertSummary,
      details: unifiedData.monitoring.alerts as AlertDetail[]
    },
    topology: unifiedData.monitoring.topology as AssetTopologyData,
    performance: unifiedData.monitoring.performance as PerformanceMetrics
  }
}
