import { OrganizationNode, BusinessSystem, Asset, DashboardMetrics, Alert, Vulnerability, HealthStatus, ImportanceLevel, AlertLevel } from '../types'

// 生成资产数据的函数
const generateAssetsForSystem = (systemId: string, systemName: string, departmentId: string, department: string, count: number): Asset[] => {
  const assetTypes = ['服务器', '数据库', '网络设备', '存储设备', '安全设备', '应用服务', '中间件']
  const healthStatuses: HealthStatus[] = ['HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN']
  const importanceLevels: ImportanceLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  const assets: Asset[] = []

  // 使用systemId的哈希值作为种子，确保同一个系统总是生成相同的资产
  const systemHash = systemId.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff
  }, 0)

  for (let i = 0; i < count; i++) {
    // 基于系统哈希和索引生成确定性的随机值
    const seed = Math.abs(systemHash + i * 1234567) % 1000000
    const assetTypeIndex = seed % assetTypes.length
    const healthStatusIndex = (seed + 1) % healthStatuses.length
    const importanceIndex = (seed + 2) % importanceLevels.length

    const assetType = assetTypes[assetTypeIndex]
    const healthStatus = healthStatuses[healthStatusIndex]
    const importance = importanceLevels[importanceIndex]

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
      ipAddress: `192.168.${(seed + 10) % 255}.${(seed + 20) % 255}`,
      description: `${systemName}的${assetType}资产`,
      errorRate: ((seed + 30) % 500) / 100, // 0-5%
      responseTime: ((seed + 40) % 1000) + 10, // 10-1009ms
      availability: 95 + ((seed + 50) % 500) / 100, // 95-100%
      alertCount: (seed + 60) % 3, // 0-2个告警
      vulnerabilityCount: (seed + 70) % 2, // 0-1个漏洞
      lastCheck: new Date(Date.now() - ((seed + 80) % 3600000)).toISOString(),
      createdAt: new Date(Date.now() - ((seed + 90) % (365 * 24 * 3600000))).toISOString(),
      updatedAt: new Date(Date.now() - ((seed + 100) % (24 * 3600000))).toISOString(),
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

// 缓存生成的系统数据，确保一致性
let _cachedSystems: BusinessSystem[] | null = null

// 生成Mock业务系统数据
export const generateMockSystems = (_orgId: string = 'ROOT'): BusinessSystem[] => {
  // 如果已有缓存数据，直接返回
  if (_cachedSystems) {
    return _cachedSystems
  }

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

  // 使用固定的种子确保数据一致性
  const systemCounts = [6, 5, 7, 4, 8, 5, 6, 4, 7, 5] // 为每个部门预定义系统数量

  departments.forEach((dept, deptIndex) => {
    const systemCount = systemCounts[deptIndex] || 5

    for (let i = 0; i < systemCount; i++) {
      const templateIndex = (deptIndex * systemCount + i) % systemTemplates.length
      const template = systemTemplates[templateIndex]
      const healthStatus = healthStatuses[(deptIndex + i) % healthStatuses.length]
      const importance = importanceLevels[(deptIndex + i * 2) % importanceLevels.length]

      const assetCount = 8 + (deptIndex + i) % 12 // 8-19个资产，基于索引确定
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

  // 缓存生成的数据
  _cachedSystems = systems
  return systems
}

// 清除缓存的函数（开发时可能需要）
export const clearMockSystemsCache = () => {
  _cachedSystems = null
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

// Mock业务领域树数据（基于业务视角 - 直接展示一级板块）
export const mockBusinessDomains: OrganizationNode[] = [
  {
    id: 'BIZ_PORTAL_CATEGORY',
    name: '一梁',
    type: 'department',
    systemCount: 25,
    assetCount: 200,
    healthStatus: 'HEALTHY',
    level: 0,
    parentId: undefined,
    isExpanded: true,  // 默认展开
  },
  {
    id: 'BIZ_DATABASE_CATEGORY',
    name: '一库',
    type: 'department',
    systemCount: 18,
    assetCount: 144,
    healthStatus: 'WARNING',
    level: 0,
    parentId: undefined,
    isExpanded: true,  // 默认展开
  },
  {
    id: 'BIZ_FOUR_PILLARS_CATEGORY',
    name: '四柱',
    type: 'department',
    systemCount: 45,
    assetCount: 360,
    healthStatus: 'HEALTHY',
    level: 0,
    parentId: undefined,
    isExpanded: true,  // 默认展开
  },
  {
    id: 'BIZ_APPS_CATEGORY',
    name: '多应用',
    type: 'department',
    systemCount: 68,
    assetCount: 536,
    healthStatus: 'WARNING',
    level: 0,
    parentId: undefined,
    isExpanded: true,  // 默认展开
  },
]

// 生成业务领域的系统数据（支持三级结构）
export const generateBusinessDomainSystems = (domainId: string = 'BIZ_ROOT'): BusinessSystem[] => {
  // 一梁：统一受理平台下的二级业务
  const portalDomains = [
    { id: 'BIZ_PORTAL_WEB', name: '一网通办门户', prefix: 'PORTAL_WEB', parentId: 'BIZ_PORTAL_CATEGORY' },
    { id: 'BIZ_PORTAL_APP', name: '随申办APP', prefix: 'PORTAL_APP', parentId: 'BIZ_PORTAL_CATEGORY' },
    { id: 'BIZ_PORTAL_MINI', name: '小程序入口', prefix: 'PORTAL_MINI', parentId: 'BIZ_PORTAL_CATEGORY' },
  ]

  // 一库：政务大数据核心数据库下的二级业务
  const databaseDomains = [
    { id: 'BIZ_DB_PUBLIC', name: '公共信息库', prefix: 'DB_PUBLIC', parentId: 'BIZ_DATABASE_CATEGORY' },
    { id: 'BIZ_DB_POPULATION', name: '人口信息库', prefix: 'DB_POP', parentId: 'BIZ_DATABASE_CATEGORY' },
    { id: 'BIZ_DB_GEO', name: '空间地理信息库', prefix: 'DB_GEO', parentId: 'BIZ_DATABASE_CATEGORY' },
  ]

  // 四柱：统一服务能力下的二级业务
  const pillarDomains = [
    { id: 'BIZ_PAYMENT', name: '统一公共支付', prefix: 'PAY', parentId: 'BIZ_FOUR_PILLARS_CATEGORY' },
    { id: 'BIZ_AUTH', name: '统一身份认证', prefix: 'AUTH', parentId: 'BIZ_FOUR_PILLARS_CATEGORY' },
    { id: 'BIZ_CUSTOMER', name: '统一客服', prefix: 'CS', parentId: 'BIZ_FOUR_PILLARS_CATEGORY' },
    { id: 'BIZ_LOGISTICS', name: '统一物流快递', prefix: 'LOG', parentId: 'BIZ_FOUR_PILLARS_CATEGORY' },
  ]

  // 多应用：委办单位业务应用下的二级业务
  const appDomains = [
    { id: 'BIZ_APP_INNOVATION', name: '创新创业一件事', prefix: 'INNO', parentId: 'BIZ_APPS_CATEGORY' },
    { id: 'BIZ_APP_ENTERPRISE', name: '企业开办一件事', prefix: 'ENT', parentId: 'BIZ_APPS_CATEGORY' },
    { id: 'BIZ_APP_BIRTH', name: '出生一件事', prefix: 'BIRTH', parentId: 'BIZ_APPS_CATEGORY' },
    { id: 'BIZ_APP_MARRIAGE', name: '结婚落户一件事', prefix: 'MAR', parentId: 'BIZ_APPS_CATEGORY' },
    { id: 'BIZ_APP_EDUCATION', name: '教育服务一件事', prefix: 'EDU', parentId: 'BIZ_APPS_CATEGORY' },
    { id: 'BIZ_APP_SOCIAL', name: '社会保障一件事', prefix: 'SOC', parentId: 'BIZ_APPS_CATEGORY' },
  ]

  // 合并所有二级业务域
  const allBusinessDomains = [
    ...portalDomains,
    ...databaseDomains,
    ...pillarDomains,
    ...appDomains
  ]

  const systemTemplates = [
    { name: '前端服务系统', type: 'frontend' },
    { name: '业务处理平台', type: 'backend' },
    { name: '数据管理系统', type: 'data' },
    { name: '监控运维平台', type: 'monitor' },
    { name: '移动应用服务', type: 'mobile' },
  ]

  const healthStatuses: HealthStatus[] = ['HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN']
  const importanceLevels: ImportanceLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

  const systems: BusinessSystem[] = []

  // 为每个二级业务域生成系统
  const systemCountPerDomain = [3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3] // 每个二级业务的系统数量

  allBusinessDomains.forEach((domain, deptIndex) => {
    const systemCount = systemCountPerDomain[deptIndex] || 3

    for (let i = 0; i < systemCount; i++) {
      const templateIndex = (deptIndex * systemCount + i) % systemTemplates.length
      const template = systemTemplates[templateIndex]
      const healthStatus = healthStatuses[(deptIndex + i) % healthStatuses.length]
      const importance = importanceLevels[(deptIndex + i * 2) % importanceLevels.length]

      const assetCount = 8 + (deptIndex + i) % 12
      const systemId = `SYS_${domain.prefix}_${String(i + 1).padStart(3, '0')}`
      const systemName = `${domain.name}${template.name}`

      const assets = generateAssetsForSystem(systemId, systemName, domain.id, domain.name, assetCount)

      systems.push({
        id: systemId,
        name: systemName,
        displayName: systemName,
        description: `${domain.name}的${template.name}，负责相关业务功能`,
        department: domain.name,
        departmentId: domain.id,
        importance,
        healthStatus,
        assetCount,
        vulnerabilityCount: (deptIndex + i) % 5,
        alertCount: (deptIndex + i * 2) % 10,
        errorRate: ((deptIndex + i) % 50) / 10,
        responseTime: 50 + ((deptIndex + i) % 500),
        availability: 95 + ((deptIndex + i) % 5),
        assets,
        lastCheck: new Date(Date.now() - ((deptIndex + i) % 3600000)).toISOString(),
        createdAt: new Date(Date.now() - ((deptIndex + i) % (365 * 24 * 3600000))).toISOString(),
        updatedAt: new Date(Date.now() - ((deptIndex + i) % (24 * 3600000))).toISOString(),
      })
    }
  })

  // 如果传入了具体的domainId,则筛选该domain下的系统
  if (domainId && domainId !== 'BIZ_ROOT') {
    // 定义一级板块包含的所有二级业务ID
    const categoryToSecondLevel: Record<string, string[]> = {
      'BIZ_PORTAL_CATEGORY': ['BIZ_PORTAL_WEB', 'BIZ_PORTAL_APP', 'BIZ_PORTAL_MINI'],
      'BIZ_DATABASE_CATEGORY': ['BIZ_DB_PUBLIC', 'BIZ_DB_POPULATION', 'BIZ_DB_GEO'],
      'BIZ_FOUR_PILLARS_CATEGORY': ['BIZ_PAYMENT', 'BIZ_AUTH', 'BIZ_CUSTOMER', 'BIZ_LOGISTICS'],
      'BIZ_APPS_CATEGORY': ['BIZ_APP_INNOVATION', 'BIZ_APP_ENTERPRISE', 'BIZ_APP_BIRTH', 'BIZ_APP_MARRIAGE', 'BIZ_APP_EDUCATION', 'BIZ_APP_SOCIAL'],
    }

    // 如果是一级板块ID,获取其下所有二级业务的ID
    if (categoryToSecondLevel[domainId]) {
      const targetDomainIds = categoryToSecondLevel[domainId]
      return systems.filter(sys => targetDomainIds.includes(sys.departmentId))
    }

    // 如果是二级业务ID,直接筛选
    return systems.filter(sys => sys.departmentId === domainId)
  }

  return systems
}

// 为业务领域生成树节点（支持三级结构）
export const generateSystemsForBusinessDomain = (domainId: string): OrganizationNode[] => {
  // 定义二级业务分类数据
  const secondLevelDomains: Record<string, Array<{ id: string; name: string; systemCount: number; assetCount: number }>> = {
    'BIZ_PORTAL_CATEGORY': [
      { id: 'BIZ_PORTAL_WEB', name: '一网通办门户', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_PORTAL_APP', name: '随申办APP', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_PORTAL_MINI', name: '小程序入口', systemCount: 3, assetCount: 24 },
    ],
    'BIZ_DATABASE_CATEGORY': [
      { id: 'BIZ_DB_PUBLIC', name: '公共信息库', systemCount: 2, assetCount: 16 },
      { id: 'BIZ_DB_POPULATION', name: '人口信息库', systemCount: 2, assetCount: 16 },
      { id: 'BIZ_DB_GEO', name: '空间地理信息库', systemCount: 2, assetCount: 16 },
    ],
    'BIZ_FOUR_PILLARS_CATEGORY': [
      { id: 'BIZ_PAYMENT', name: '统一公共支付', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_AUTH', name: '统一身份认证', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_CUSTOMER', name: '统一客服', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_LOGISTICS', name: '统一物流快递', systemCount: 3, assetCount: 24 },
    ],
    'BIZ_APPS_CATEGORY': [
      { id: 'BIZ_APP_INNOVATION', name: '创新创业一件事', systemCount: 2, assetCount: 16 },
      { id: 'BIZ_APP_ENTERPRISE', name: '企业开办一件事', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_APP_BIRTH', name: '出生一件事', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_APP_MARRIAGE', name: '结婚落户一件事', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_APP_EDUCATION', name: '教育服务一件事', systemCount: 3, assetCount: 24 },
      { id: 'BIZ_APP_SOCIAL', name: '社会保障一件事', systemCount: 3, assetCount: 24 },
    ],
  }

  // 如果是一级板块，返回二级业务分类节点
  if (secondLevelDomains[domainId]) {
    const healthStatuses: HealthStatus[] = ['HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN']

    return secondLevelDomains[domainId].map((domain, index) => ({
      id: domain.id,
      name: domain.name,
      type: 'department' as const,
      systemCount: domain.systemCount,
      assetCount: domain.assetCount,
      healthStatus: healthStatuses[index % healthStatuses.length],
      level: 2,
      parentId: domainId,
      isExpanded: false,
    }))
  }

  // 如果是二级业务分类，返回三级具体系统节点
  const systems = generateBusinessDomainSystems().filter(sys => sys.departmentId === domainId)

  return systems.map(system => ({
    id: system.id,
    name: system.name,
    type: 'system' as const,
    systemCount: 1,
    assetCount: system.assetCount,
    healthStatus: system.healthStatus,
    level: 3,
    parentId: domainId,
    isExpanded: false,
    children: system.assets?.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: 'asset' as const,
      systemCount: 0,
      assetCount: 1,
      healthStatus: asset.healthStatus,
      level: 4,
      parentId: system.id,
      isExpanded: false,
    })) || []
  }))
}

// 获取业务领域的所有资产
export const getAssetsForBusinessDomain = (domainId: string): Asset[] => {
  // 定义一级板块包含的所有二级业务ID
  const categoryToSecondLevel: Record<string, string[]> = {
    'BIZ_PORTAL_CATEGORY': ['BIZ_PORTAL_WEB', 'BIZ_PORTAL_APP', 'BIZ_PORTAL_MINI'],
    'BIZ_DATABASE_CATEGORY': ['BIZ_DB_PUBLIC', 'BIZ_DB_POPULATION', 'BIZ_DB_GEO'],
    'BIZ_FOUR_PILLARS_CATEGORY': ['BIZ_PAYMENT', 'BIZ_AUTH', 'BIZ_CUSTOMER', 'BIZ_LOGISTICS'],
    'BIZ_APPS_CATEGORY': ['BIZ_APP_INNOVATION', 'BIZ_APP_ENTERPRISE', 'BIZ_APP_BIRTH', 'BIZ_APP_MARRIAGE', 'BIZ_APP_EDUCATION', 'BIZ_APP_SOCIAL'],
  }

  let targetDomainIds: string[] = []

  // 如果是一级板块，获取其下所有二级业务的ID
  if (categoryToSecondLevel[domainId]) {
    targetDomainIds = categoryToSecondLevel[domainId]
  } else {
    // 如果是二级业务，直接使用该ID
    targetDomainIds = [domainId]
  }

  // 根据目标业务ID筛选系统并收集资产
  const systems = generateBusinessDomainSystems().filter(sys =>
    targetDomainIds.includes(sys.departmentId)
  )

  const assets: Asset[] = []
  systems.forEach(system => {
    if (system.assets) {
      assets.push(...system.assets)
    }
  })

  return assets
}