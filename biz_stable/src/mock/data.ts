import { OrganizationNode, BusinessSystem, Asset, DashboardMetrics, Alert, Vulnerability, HealthStatus, ImportanceLevel, AlertLevel } from '../types'

// 生成资产数据的函数
const generateAssetsForSystem = (systemId: string, systemName: string, departmentId: string, department: string, count: number): Asset[] => {
  const assetTypes = ['服务器', '数据库', '网络设备', '存储设备', '安全设备', '应用服务', '中间件']
  const healthStatuses: HealthStatus[] = ['HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN']
  const importanceLevels: ImportanceLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  const assets: Asset[] = []

  for (let i = 0; i < count; i++) {
    const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]
    const healthStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)]
    const importance = importanceLevels[Math.floor(Math.random() * importanceLevels.length)]

    assets.push({
      id: `ASSET_${systemId}_${String(i + 1).padStart(3, '0')}`,
      name: `${assetType}-${String(i + 1).padStart(2, '0')}`,
      type: assetType,
      healthStatus,
      importance,
      systemId,
      systemName,
      departmentId,
      department,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      description: `${systemName}的${assetType}资产`,
      errorRate: Math.random() * 5,
      responseTime: Math.floor(Math.random() * 1000) + 10,
      availability: 95 + Math.random() * 5,
      alertCount: Math.floor(Math.random() * 3),
      vulnerabilityCount: Math.floor(Math.random() * 2),
      lastCheck: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(),
    })
  }

  return assets
}

// Mock组织架构数据
export const mockOrganizations: OrganizationNode[] = [
  {
    id: 'ROOT',
    name: '市大数据中心',
    type: 'root',
    systemCount: 156,
    assetCount: 1240,
    healthStatus: 'WARNING',
    level: 0,
    isExpanded: true,
    children: [
      {
        id: 'POLICE',
        name: '市公安局',
        type: 'department',
        systemCount: 23,
        assetCount: 180,
        healthStatus: 'WARNING',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'CIVIL',
        name: '市民政局',
        type: 'department',
        systemCount: 12,
        assetCount: 95,
        healthStatus: 'HEALTHY',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'MARKET',
        name: '市市场监管局',
        type: 'department',
        systemCount: 18,
        assetCount: 145,
        healthStatus: 'CRITICAL',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'EDUCATION',
        name: '市教委',
        type: 'department',
        systemCount: 15,
        assetCount: 120,
        healthStatus: 'HEALTHY',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'HEALTH',
        name: '市卫生健康委',
        type: 'department',
        systemCount: 21,
        assetCount: 168,
        healthStatus: 'WARNING',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'TRANSPORT',
        name: '市交通委',
        type: 'department',
        systemCount: 19,
        assetCount: 152,
        healthStatus: 'HEALTHY',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'HOUSING',
        name: '市住建委',
        type: 'department',
        systemCount: 14,
        assetCount: 112,
        healthStatus: 'WARNING',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'EMERGENCY',
        name: '市应急局',
        type: 'department',
        systemCount: 8,
        assetCount: 64,
        healthStatus: 'HEALTHY',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'FINANCE',
        name: '市财政局',
        type: 'department',
        systemCount: 11,
        assetCount: 88,
        healthStatus: 'HEALTHY',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
      {
        id: 'SOCIAL',
        name: '市人社局',
        type: 'department',
        systemCount: 15,
        assetCount: 116,
        healthStatus: 'WARNING',
        level: 1,
        parentId: 'ROOT',
        isExpanded: false,
      },
    ]
  }
]

// 生成Mock业务系统数据
export const generateMockSystems = (_orgId: string = 'ROOT'): BusinessSystem[] => {
  const departments = [
    { id: 'POLICE', name: '市公安局' },
    { id: 'CIVIL', name: '市民政局' },
    { id: 'MARKET', name: '市市场监管局' },
    { id: 'EDUCATION', name: '市教委' },
    { id: 'HEALTH', name: '市卫生健康委' },
    { id: 'TRANSPORT', name: '市交通委' },
    { id: 'HOUSING', name: '市住建委' },
    { id: 'EMERGENCY', name: '市应急局' },
    { id: 'FINANCE', name: '市财政局' },
    { id: 'SOCIAL', name: '市人社局' },
  ]

  const systemTemplates = [
    { name: '执法系统', prefix: 'ENF' },
    { name: '管理平台', prefix: 'MGT' },
    { name: '服务平台', prefix: 'SRV' },
    { name: '监控系统', prefix: 'MON' },
    { name: '数据平台', prefix: 'DATA' },
    { name: '办公系统', prefix: 'OFC' },
    { name: '移动应用', prefix: 'MOB' },
    { name: '门户网站', prefix: 'WEB' },
  ]

  const healthStatuses: HealthStatus[] = ['HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN']
  const importanceLevels: ImportanceLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  const systems: BusinessSystem[] = []

  departments.forEach(dept => {
    const systemCount = Math.floor(Math.random() * 8) + 3 // 3-10个系统

    for (let i = 0; i < systemCount; i++) {
      const template = systemTemplates[Math.floor(Math.random() * systemTemplates.length)]
      const healthStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)]
      const importance = importanceLevels[Math.floor(Math.random() * importanceLevels.length)]

      const assetCount = Math.floor(Math.random() * 15) + 5 // 5-19个资产
      const systemId = `SYS_${dept.id}_${template.prefix}_${String(i + 1).padStart(3, '0')}`
      const systemName = `${dept.name}${template.name}`

      const assets = generateAssetsForSystem(systemId, systemName, dept.id, dept.name, assetCount)

      systems.push({
        id: systemId,
        name: systemName,
        displayName: systemName,
        description: `${dept.name}的${template.name}，负责相关业务功能`,
        department: dept.name,
        departmentId: dept.id,
        importance,
        healthStatus,
        assetCount,
        vulnerabilityCount: Math.floor(Math.random() * 5), // 0-4个漏洞
        alertCount: Math.floor(Math.random() * 10), // 0-9个告警
        errorRate: Math.random() * 5, // 0-5%错误率
        responseTime: Math.floor(Math.random() * 500) + 50, // 50-549ms响应时间
        availability: 95 + Math.random() * 5, // 95-100%可用性
        assets,
        lastCheck: new Date(Date.now() - Math.random() * 3600000).toISOString(), // 最近1小时内
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(), // 最近1年内创建
        updatedAt: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(), // 最近1天内更新
      })
    }
  })

  return systems
}

// Mock KPI指标数据
export const mockMetrics: DashboardMetrics = {
  totalSystems: 156,
  abnormalSystems: {
    count: 23,
    warningCount: 18,
    criticalCount: 5,
    rate: 0.147, // 14.7%
  },
  urgentAlerts: {
    total: 12,
    p0Count: 2,
    p1Count: 10,
    latestTime: new Date(Date.now() - 180000).toISOString(), // 3分钟前
  },
  criticalVulnerabilities: {
    count: 8,
    affectedSystems: 6,
    longestUnfixed: 15, // 15天
  },
}

// Mock告警数据
export const generateMockAlerts = (): Alert[] => {
  const alertTypes = [
    { type: 'SYSTEM', title: '系统异常' },
    { type: 'DATABASE', title: '数据库连接失败' },
    { type: 'NETWORK', title: '网络延迟过高' },
    { type: 'SECURITY', title: '安全事件' },
    { type: 'PERFORMANCE', title: '性能异常' },
  ]

  const levels: AlertLevel[] = ['P0', 'P1', 'P2', 'P3', 'P4']
  const systems = generateMockSystems()

  const alerts: Alert[] = []

  for (let i = 0; i < 50; i++) {
    const system = systems[Math.floor(Math.random() * systems.length)]
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]

    alerts.push({
      id: `ALT_${Date.now()}_${String(i + 1).padStart(3, '0')}`,
      systemId: system.id,
      systemName: system.name,
      department: system.department,
      level,
      type: alertType.type,
      title: alertType.title,
      description: `${system.name}出现${alertType.title}，需要立即处理`,
      status: Math.random() > 0.3 ? 'OPEN' : 'RESOLVED',
      timestamp: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(), // 最近24小时
      duration: Math.floor(Math.random() * 3600), // 0-3600秒
      impact: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
    })
  }

  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Mock漏洞数据
export const generateMockVulnerabilities = (): Vulnerability[] => {
  const vulnTypes = [
    { title: 'SQL注入漏洞', type: 'INJECTION' },
    { title: 'XSS跨站脚本', type: 'XSS' },
    { title: '权限提升漏洞', type: 'PRIVILEGE_ESCALATION' },
    { title: '信息泄露漏洞', type: 'INFORMATION_DISCLOSURE' },
    { title: '缓冲区溢出', type: 'BUFFER_OVERFLOW' },
  ]

  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const
  const systems = generateMockSystems()

  const vulnerabilities: Vulnerability[] = []

  for (let i = 0; i < 30; i++) {
    const system = systems[Math.floor(Math.random() * systems.length)]
    const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    vulnerabilities.push({
      id: `VUL_${Date.now()}_${String(i + 1).padStart(3, '0')}`,
      cveId: `CVE-2024-${String(Math.floor(Math.random() * 9999) + 1000)}`,
      systemId: system.id,
      systemName: system.name,
      department: system.department,
      severity,
      cvssScore: Math.random() * 10, // 0-10分
      title: vulnType.title,
      description: `${system.name}中发现${vulnType.title}，存在安全风险`,
      status: Math.random() > 0.4 ? 'OPEN' : 'RESOLVED',
      discoveryDate: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(), // 最近30天
      fixRecommendation: '建议及时更新系统补丁，加强输入验证',
      estimatedFixTime: Math.floor(Math.random() * 168) + 1, // 1-168小时
    })
  }

  return vulnerabilities.sort((a, b) => b.cvssScore - a.cvssScore)
}

// 为部门生成系统和资产的组织树节点
export const generateSystemsForDepartment = (departmentId: string): OrganizationNode[] => {
  const systems = generateMockSystems().filter(sys => sys.departmentId === departmentId)

  return systems.map(system => ({
    id: system.id,
    name: system.name,
    type: 'system' as const,
    systemCount: 1,
    assetCount: system.assetCount,
    healthStatus: system.healthStatus,
    level: 2,
    parentId: departmentId,
    isExpanded: false,
    children: system.assets?.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: 'asset' as const,
      systemCount: 0,
      assetCount: 1,
      healthStatus: asset.healthStatus,
      level: 3,
      parentId: system.id,
      isExpanded: false,
    })) || []
  }))
}

// 获取部门的所有资产
export const getAssetsForDepartment = (departmentId: string): Asset[] => {
  const systems = generateMockSystems().filter(sys => sys.departmentId === departmentId)
  const assets: Asset[] = []

  systems.forEach(system => {
    if (system.assets) {
      assets.push(...system.assets)
    }
  })

  return assets
}

// 获取所有资产
export const getAllAssets = (): Asset[] => {
  const systems = generateMockSystems()
  const assets: Asset[] = []

  systems.forEach(system => {
    if (system.assets) {
      assets.push(...system.assets)
    }
  })

  return assets
}