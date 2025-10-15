/**
 * 资产运营管理 - Mock数据生成器
 */

import {
  AssetType,
  AssetStatus,
  AssetAttribute,
  DynamicType,
  UnmanagedAsset,
  AssetTypeStats,
  DepartmentDynamic,
  DepartmentOperations,
  AffectedBusinessStats,
  DepartmentTaskStats,
  Department,
  DepartmentAsset
} from '../pages/management/asset-operations/types'

// IP地址段到业务的映射配置
interface IPRangeMapping {
  ipPattern: RegExp
  businessName: string
  businessId: string
  reason: string
}

// IP地址段映射规则
const ipRangeMappings: IPRangeMapping[] = [
  {
    ipPattern: /^192\.168\.1\./,
    businessName: '核心业务系统',
    businessId: 'BIZ-CORE-001',
    reason: 'IP地址段192.168.1.x属于核心业务系统网络区域'
  },
  {
    ipPattern: /^192\.168\.10\./,
    businessName: '应用服务系统',
    businessId: 'BIZ-APP-001',
    reason: 'IP地址段192.168.10.x属于应用服务系统专用网段'
  },
  {
    ipPattern: /^192\.168\.15\./,
    businessName: '中间件平台',
    businessId: 'BIZ-MIDDLEWARE-001',
    reason: 'IP地址段192.168.15.x为中间件平台分配的网段'
  },
  {
    ipPattern: /^192\.168\.20\./,
    businessName: '缓存服务集群',
    businessId: 'BIZ-CACHE-001',
    reason: 'IP地址段192.168.20.x为缓存服务集群使用网段'
  },
  {
    ipPattern: /^172\.16\.[0-9]+\./,
    businessName: '数据中心服务',
    businessId: 'BIZ-DC-001',
    reason: 'IP地址段172.16.x.x属于数据中心内网网段'
  },
  {
    ipPattern: /^172\.18\./,
    businessName: '数据库服务集群',
    businessId: 'BIZ-DB-001',
    reason: 'IP地址段172.18.x.x为数据库服务集群专用网段'
  },
  {
    ipPattern: /^172\.20\./,
    businessName: '存储服务平台',
    businessId: 'BIZ-STORAGE-001',
    reason: 'IP地址段172.20.x.x为存储服务平台网段'
  },
  {
    ipPattern: /^10\.10\./,
    businessName: '网络基础设施',
    businessId: 'BIZ-NET-001',
    reason: 'IP地址段10.10.x.x属于网络基础设施管理网段'
  },
  {
    ipPattern: /^10\.50\./,
    businessName: '办公网络',
    businessId: 'BIZ-OFFICE-001',
    reason: 'IP地址段10.50.x.x属于办公网络区域'
  },
  {
    ipPattern: /^10\.60\./,
    businessName: '信创业务平台',
    businessId: 'BIZ-XINC-001',
    reason: 'IP地址段10.60.x.x为信创业务平台专用网段'
  }
]

// 根据IP地址推荐业务归属
function recommendBusinessByIP(ipAddress: string): {
  businessName: string
  businessId: string
  reason: string
} | null {
  for (const mapping of ipRangeMappings) {
    if (mapping.ipPattern.test(ipAddress)) {
      return {
        businessName: mapping.businessName,
        businessId: mapping.businessId,
        reason: mapping.reason
      }
    }
  }
  return null
}

// 生成批量资产数据的辅助函数
function generateBatchAssets(
  startId: number,
  count: number,
  type: AssetType,
  attribute: AssetAttribute,
  ipPrefix: string
): Partial<UnmanagedAsset>[] {
  const assets: Partial<UnmanagedAsset>[] = []
  const typeNames: Record<AssetType, string> = {
    [AssetType.SERVER]: 'SERVER',
    [AssetType.DESKTOP]: 'PC',
    [AssetType.NETWORK_DEVICE]: 'SWITCH',
    [AssetType.MIDDLEWARE]: 'APP',
    [AssetType.DATABASE]: 'DB',
    [AssetType.STORAGE]: 'STORAGE',
    [AssetType.SECURITY]: 'FIREWALL',
    [AssetType.OTHER]: 'DEVICE'
  }

  for (let i = 0; i < count; i++) {
    const id = startId + i
    const ipSuffix = Math.floor(Math.random() * 200) + 10
    assets.push({
      id: `ASSET-UNM-${String(id).padStart(3, '0')}`,
      name: `${typeNames[type]}-${String(id).padStart(3, '0')}`,
      type,
      attribute,
      ipAddress: `${ipPrefix}.${ipSuffix}`,
      discoveredTime: `2023-07-${String(Math.floor(Math.random() * 16) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      discoveredSource: ['网络扫描', '端口扫描', '流量分析', '合规性扫描', '资产盘点'][Math.floor(Math.random() * 5)],
      status: AssetStatus.UNMANAGED,
      description: `${assetAttributeLabels[attribute]}，等待处理`
    })
  }

  return assets
}

// 生成未纳管资产数据
export function generateUnmanagedAssets(): UnmanagedAsset[] {
  const baseAssets: Partial<UnmanagedAsset>[] = [
    {
      id: 'ASSET-UNM-001',
      name: 'APP-SERVER-15',
      type: AssetType.SERVER,
      attribute: AssetAttribute.ORPHAN,
      ipAddress: '192.168.10.15',
      location: '数据中心A区机柜A-05',
      discoveredTime: '2023-07-10 09:30:00',
      discoveredSource: '网络扫描',
      status: AssetStatus.UNMANAGED,
      description: 'CentOS 7.9服务器，疑似遗留测试环境',
      os: 'CentOS 7.9',
      manufacturer: 'Dell'
    },
    {
      id: 'ASSET-UNM-002',
      name: 'UNKNOWN-192.168.10.88',
      type: AssetType.NETWORK_DEVICE,
      attribute: AssetAttribute.UNKNOWN,
      ipAddress: '192.168.10.88',
      discoveredTime: '2023-07-12 14:20:00',
      discoveredSource: '流量分析',
      status: AssetStatus.UNMANAGED,
      description: '未知网络设备，持续产生大量流量'
    },
    {
      id: 'ASSET-UNM-003',
      name: 'WIN10-PC-078',
      type: AssetType.DESKTOP,
      attribute: AssetAttribute.NON_COMPLIANT,
      ipAddress: '10.50.20.78',
      location: '信创区域',
      discoveredTime: '2023-07-11 10:15:00',
      discoveredSource: '合规性扫描',
      status: AssetStatus.UNMANAGED,
      description: '信创区发现非信创终端',
      os: 'Windows 10',
      manufacturer: 'Lenovo'
    }
  ]

  // 批量生成各类型资产，数量与统计卡片一致
  let idCounter = 100

  // 服务器：12无主 + 8未知 + 3不合规 = 23
  baseAssets.push(...generateBatchAssets(idCounter, 12, AssetType.SERVER, AssetAttribute.ORPHAN, '192.168.10'))
  idCounter += 12
  baseAssets.push(...generateBatchAssets(idCounter, 8, AssetType.SERVER, AssetAttribute.UNKNOWN, '172.16.8'))
  idCounter += 8
  baseAssets.push(...generateBatchAssets(idCounter, 3, AssetType.SERVER, AssetAttribute.NON_COMPLIANT, '10.60.30'))
  idCounter += 3

  // 台式机：18无主 + 15未知 + 12不合规 = 45
  baseAssets.push(...generateBatchAssets(idCounter, 18, AssetType.DESKTOP, AssetAttribute.ORPHAN, '10.50.15'))
  idCounter += 18
  baseAssets.push(...generateBatchAssets(idCounter, 15, AssetType.DESKTOP, AssetAttribute.UNKNOWN, '10.50.25'))
  idCounter += 15
  baseAssets.push(...generateBatchAssets(idCounter, 12, AssetType.DESKTOP, AssetAttribute.NON_COMPLIANT, '10.50.20'))
  idCounter += 12

  // 网络设备：5无主 + 6未知 + 1不合规 = 12
  baseAssets.push(...generateBatchAssets(idCounter, 5, AssetType.NETWORK_DEVICE, AssetAttribute.ORPHAN, '10.10.10'))
  idCounter += 5
  baseAssets.push(...generateBatchAssets(idCounter, 6, AssetType.NETWORK_DEVICE, AssetAttribute.UNKNOWN, '10.10.20'))
  idCounter += 6
  baseAssets.push(...generateBatchAssets(idCounter, 1, AssetType.NETWORK_DEVICE, AssetAttribute.NON_COMPLIANT, '10.10.30'))
  idCounter += 1

  // 中间件：8无主 + 4未知 + 3不合规 = 15
  baseAssets.push(...generateBatchAssets(idCounter, 8, AssetType.MIDDLEWARE, AssetAttribute.ORPHAN, '192.168.15'))
  idCounter += 8
  baseAssets.push(...generateBatchAssets(idCounter, 4, AssetType.MIDDLEWARE, AssetAttribute.UNKNOWN, '192.168.15'))
  idCounter += 4
  baseAssets.push(...generateBatchAssets(idCounter, 3, AssetType.MIDDLEWARE, AssetAttribute.NON_COMPLIANT, '192.168.15'))
  idCounter += 3

  // 数据库：4无主 + 3未知 + 2不合规 = 9
  baseAssets.push(...generateBatchAssets(idCounter, 4, AssetType.DATABASE, AssetAttribute.ORPHAN, '172.16.5'))
  idCounter += 4
  baseAssets.push(...generateBatchAssets(idCounter, 3, AssetType.DATABASE, AssetAttribute.UNKNOWN, '172.18.10'))
  idCounter += 3
  baseAssets.push(...generateBatchAssets(idCounter, 2, AssetType.DATABASE, AssetAttribute.NON_COMPLIANT, '172.18.20'))
  idCounter += 2

  // 存储设备：3无主 + 2未知 + 1不合规 = 6
  baseAssets.push(...generateBatchAssets(idCounter, 3, AssetType.STORAGE, AssetAttribute.ORPHAN, '172.20.5'))
  idCounter += 3
  baseAssets.push(...generateBatchAssets(idCounter, 2, AssetType.STORAGE, AssetAttribute.UNKNOWN, '172.20.10'))
  idCounter += 2
  baseAssets.push(...generateBatchAssets(idCounter, 1, AssetType.STORAGE, AssetAttribute.NON_COMPLIANT, '172.20.15'))
  idCounter += 1

  // 安全设备：2无主 + 1未知 + 1不合规 = 4
  baseAssets.push(...generateBatchAssets(idCounter, 2, AssetType.SECURITY, AssetAttribute.ORPHAN, '192.168.1'))
  idCounter += 2
  baseAssets.push(...generateBatchAssets(idCounter, 1, AssetType.SECURITY, AssetAttribute.UNKNOWN, '192.168.1'))
  idCounter += 1
  baseAssets.push(...generateBatchAssets(idCounter, 1, AssetType.SECURITY, AssetAttribute.NON_COMPLIANT, '192.168.1'))
  idCounter += 1

  // 其他：3无主 + 4未知 + 1不合规 = 8
  baseAssets.push(...generateBatchAssets(idCounter, 3, AssetType.OTHER, AssetAttribute.ORPHAN, '10.10.50'))
  idCounter += 3
  baseAssets.push(...generateBatchAssets(idCounter, 4, AssetType.OTHER, AssetAttribute.UNKNOWN, '10.10.60'))
  idCounter += 4
  baseAssets.push(...generateBatchAssets(idCounter, 1, AssetType.OTHER, AssetAttribute.NON_COMPLIANT, '10.10.70'))

  // 为每个资产添加归属业务推荐
  return baseAssets.map(asset => {
    const recommendation = recommendBusinessByIP(asset.ipAddress!)

    if (recommendation) {
      return {
        ...asset,
        belongingBusiness: recommendation.businessName,
        belongingBusinessId: recommendation.businessId,
        belongingRecommendation: recommendation.reason,
        isRecommended: true
      } as UnmanagedAsset
    }

    // 无法推荐归属的资产
    return {
      ...asset,
      belongingBusiness: undefined,
      belongingBusinessId: undefined,
      belongingRecommendation: undefined,
      isRecommended: false
    } as UnmanagedAsset
  })
}

// 生成资产类型统计数据
export function generateAssetTypeStats(): AssetTypeStats[] {
  return [
    {
      type: AssetType.SERVER,
      abnormalCount: 23, // 12 + 8 + 3
      orphan: 12,
      unknown: 8,
      nonCompliant: 3
    },
    {
      type: AssetType.DESKTOP,
      abnormalCount: 45, // 18 + 15 + 12
      orphan: 18,
      unknown: 15,
      nonCompliant: 12
    },
    {
      type: AssetType.NETWORK_DEVICE,
      abnormalCount: 12, // 5 + 6 + 1
      orphan: 5,
      unknown: 6,
      nonCompliant: 1
    },
    {
      type: AssetType.MIDDLEWARE,
      abnormalCount: 15, // 8 + 4 + 3
      orphan: 8,
      unknown: 4,
      nonCompliant: 3
    },
    {
      type: AssetType.DATABASE,
      abnormalCount: 9, // 4 + 3 + 2
      orphan: 4,
      unknown: 3,
      nonCompliant: 2
    },
    {
      type: AssetType.STORAGE,
      abnormalCount: 6, // 3 + 2 + 1
      orphan: 3,
      unknown: 2,
      nonCompliant: 1
    },
    {
      type: AssetType.SECURITY,
      abnormalCount: 4, // 2 + 1 + 1
      orphan: 2,
      unknown: 1,
      nonCompliant: 1
    },
    {
      type: AssetType.OTHER,
      abnormalCount: 8, // 3 + 4 + 1
      orphan: 3,
      unknown: 4,
      nonCompliant: 1
    }
  ]
}

// 生成部门资产纳管动态
export function generateDepartmentDynamics(): DepartmentDynamic[] {
  return [
    {
      id: 'DYN-001',
      departmentId: 'DEPT-001',
      departmentName: '信息技术部',
      type: DynamicType.ASSIGN,
      assetCount: 5,
      operator: '管理员',
      operateTime: '2023-07-16 14:30:00',
      description: '指派5台服务器至信息技术部进行管理'
    },
    {
      id: 'DYN-002',
      departmentId: 'DEPT-002',
      departmentName: '网络安全部',
      type: DynamicType.CLAIM,
      assetCount: 3,
      operator: '张工程师',
      operateTime: '2023-07-16 11:20:00',
      description: '认领3台安全设备纳入管理'
    },
    {
      id: 'DYN-003',
      departmentId: 'DEPT-003',
      departmentName: '应用开发部',
      type: DynamicType.IMPORT,
      assetCount: 12,
      operator: '李主管',
      operateTime: '2023-07-16 09:15:00',
      description: '批量导入12个中间件资产'
    },
    {
      id: 'DYN-004',
      departmentId: 'DEPT-001',
      departmentName: '信息技术部',
      type: DynamicType.IGNORE,
      assetCount: 2,
      operator: '管理员',
      operateTime: '2023-07-15 16:45:00',
      description: '忽略2台已下线的旧设备'
    },
    {
      id: 'DYN-005',
      departmentId: 'DEPT-004',
      departmentName: '数据管理部',
      type: DynamicType.ASSIGN,
      assetCount: 4,
      operator: '王经理',
      operateTime: '2023-07-15 14:00:00',
      description: '指派4个数据库实例至数据管理部'
    },
    {
      id: 'DYN-006',
      departmentId: 'DEPT-002',
      departmentName: '网络安全部',
      type: DynamicType.CLAIM,
      assetCount: 1,
      operator: '赵工程师',
      operateTime: '2023-07-15 10:30:00',
      description: '认领1台防火墙设备'
    },
    {
      id: 'DYN-007',
      departmentId: 'DEPT-005',
      departmentName: '运维支撑部',
      type: DynamicType.IMPORT,
      assetCount: 8,
      operator: '刘主管',
      operateTime: '2023-07-14 15:20:00',
      description: '导入8台服务器资产信息'
    },
    {
      id: 'DYN-008',
      departmentId: 'DEPT-003',
      departmentName: '应用开发部',
      type: DynamicType.ASSIGN,
      assetCount: 6,
      operator: '管理员',
      operateTime: '2023-07-14 11:00:00',
      description: '指派6个应用服务器至应用开发部'
    }
  ]
}

// 生成部门运营情况
export function generateDepartmentOperations(): DepartmentOperations[] {
  return [
    {
      departmentId: 'DEPT-001',
      departmentName: '信息技术部',
      processingCount: 23
    },
    {
      departmentId: 'DEPT-002',
      departmentName: '网络安全部',
      processingCount: 15
    },
    {
      departmentId: 'DEPT-003',
      departmentName: '应用开发部',
      processingCount: 34
    },
    {
      departmentId: 'DEPT-004',
      departmentName: '数据管理部',
      processingCount: 18
    },
    {
      departmentId: 'DEPT-005',
      departmentName: '运维支撑部',
      processingCount: 27
    },
    {
      departmentId: 'DEPT-006',
      departmentName: '系统集成部',
      processingCount: 12
    }
  ]
}

// 生成受影响业务统计
export function generateAffectedBusinessStats(): AffectedBusinessStats[] {
  return [
    {
      businessId: 'BIZ-001',
      businessName: '办公网络',
      orphanCount: 18,
      unknownCount: 15,
      nonCompliantCount: 12,
      totalCount: 45
    },
    {
      businessId: 'BIZ-002',
      businessName: '应用服务系统',
      orphanCount: 12,
      unknownCount: 8,
      nonCompliantCount: 3,
      totalCount: 23
    },
    {
      businessId: 'BIZ-003',
      businessName: '公共信息库-人口信息库监控运维平台',
      orphanCount: 8,
      unknownCount: 4,
      nonCompliantCount: 3,
      totalCount: 15
    },
    {
      businessId: 'BIZ-004',
      businessName: '数据中心服务',
      orphanCount: 8,
      unknownCount: 3,
      nonCompliantCount: 2,
      totalCount: 13
    },
    {
      businessId: 'BIZ-005',
      businessName: '网络基础设施',
      orphanCount: 5,
      unknownCount: 6,
      nonCompliantCount: 1,
      totalCount: 12
    },
    {
      businessId: 'BIZ-006',
      businessName: '核心业务系统-政务服务平台',
      orphanCount: 5,
      unknownCount: 3,
      nonCompliantCount: 2,
      totalCount: 10
    },
    {
      businessId: 'BIZ-007',
      businessName: '数据库服务集群',
      orphanCount: 4,
      unknownCount: 3,
      nonCompliantCount: 2,
      totalCount: 9
    },
    {
      businessId: 'BIZ-008',
      businessName: '信创业务平台-统一身份认证系统',
      orphanCount: 2,
      unknownCount: 1,
      nonCompliantCount: 3,
      totalCount: 6
    },
    {
      businessId: 'BIZ-009',
      businessName: '存储服务平台',
      orphanCount: 3,
      unknownCount: 2,
      nonCompliantCount: 1,
      totalCount: 6
    },
    {
      businessId: 'BIZ-010',
      businessName: '缓存服务集群',
      orphanCount: 3,
      unknownCount: 2,
      nonCompliantCount: 0,
      totalCount: 5
    }
  ].sort((a, b) => b.totalCount - a.totalCount) // 按问题总数倒序排列
}

// 生成责任单位任务统计
export function generateDepartmentTaskStats(): DepartmentTaskStats[] {
  return [
    {
      departmentId: 'DEPT-001',
      departmentName: '信息技术部',
      processingCount: 23,
      overdueCount: 5
    },
    {
      departmentId: 'DEPT-002',
      departmentName: '网络安全部',
      processingCount: 15,
      overdueCount: 2
    },
    {
      departmentId: 'DEPT-003',
      departmentName: '应用开发部',
      processingCount: 34,
      overdueCount: 8
    },
    {
      departmentId: 'DEPT-004',
      departmentName: '数据管理部',
      processingCount: 18,
      overdueCount: 3
    },
    {
      departmentId: 'DEPT-005',
      departmentName: '运维支撑部',
      processingCount: 27,
      overdueCount: 6
    },
    {
      departmentId: 'DEPT-006',
      departmentName: '系统集成部',
      processingCount: 12,
      overdueCount: 1
    }
  ]
}

// 生成部门列表
export function generateDepartments(): Department[] {
  return [
    {
      id: 'DEPT-001',
      name: '信息技术部',
      level: 1,
      managedAssetCount: 156,
      responsiblePerson: '张主任',
      contactInfo: '13800138001'
    },
    {
      id: 'DEPT-002',
      name: '网络安全部',
      level: 1,
      managedAssetCount: 89,
      responsiblePerson: '李经理',
      contactInfo: '13800138002'
    },
    {
      id: 'DEPT-003',
      name: '应用开发部',
      level: 1,
      managedAssetCount: 234,
      responsiblePerson: '王总监',
      contactInfo: '13800138003'
    },
    {
      id: 'DEPT-004',
      name: '数据管理部',
      level: 1,
      managedAssetCount: 128,
      responsiblePerson: '赵部长',
      contactInfo: '13800138004'
    },
    {
      id: 'DEPT-005',
      name: '运维支撑部',
      level: 1,
      managedAssetCount: 198,
      responsiblePerson: '刘主管',
      contactInfo: '13800138005'
    },
    {
      id: 'DEPT-006',
      name: '系统集成部',
      level: 1,
      managedAssetCount: 145,
      responsiblePerson: '周经理',
      contactInfo: '13800138006'
    }
  ]
}

// 生成部门资产列表
export function generateDepartmentAssets(_departmentId: string): DepartmentAsset[] {
  const baseAssets: DepartmentAsset[] = [
    {
      id: 'DEPT-ASSET-001',
      name: 'WEB-SERVER-01',
      type: AssetType.SERVER,
      ipAddress: '192.168.1.101',
      managedTime: '2023-06-15 10:00:00',
      responsiblePerson: '张工程师',
      status: AssetStatus.MANAGED
    },
    {
      id: 'DEPT-ASSET-002',
      name: 'APP-SERVER-05',
      type: AssetType.SERVER,
      ipAddress: '192.168.1.105',
      managedTime: '2023-06-20 14:30:00',
      responsiblePerson: '李工程师',
      status: AssetStatus.MANAGED
    },
    {
      id: 'DEPT-ASSET-003',
      name: 'MYSQL-MASTER-01',
      type: AssetType.DATABASE,
      ipAddress: '172.16.2.10',
      managedTime: '2023-06-18 09:15:00',
      responsiblePerson: '王工程师',
      status: AssetStatus.MANAGED
    },
    {
      id: 'DEPT-ASSET-004',
      name: 'NGINX-LB-01',
      type: AssetType.MIDDLEWARE,
      ipAddress: '192.168.1.200',
      managedTime: '2023-06-22 16:00:00',
      responsiblePerson: '赵工程师',
      status: AssetStatus.MANAGED
    },
    {
      id: 'DEPT-ASSET-005',
      name: 'ROUTER-CORE-01',
      type: AssetType.NETWORK_DEVICE,
      ipAddress: '10.0.0.1',
      managedTime: '2023-06-10 08:00:00',
      responsiblePerson: '刘工程师',
      status: AssetStatus.MANAGED
    }
  ]

  return baseAssets
}

// 资产类型中文映射
export const assetTypeLabels: Record<AssetType, string> = {
  [AssetType.SERVER]: '服务器',
  [AssetType.DESKTOP]: '台式机',
  [AssetType.NETWORK_DEVICE]: '网络设备',
  [AssetType.MIDDLEWARE]: '中间件',
  [AssetType.DATABASE]: '数据库',
  [AssetType.STORAGE]: '存储设备',
  [AssetType.SECURITY]: '安全设备',
  [AssetType.OTHER]: '其他'
}

// 资产属性中文映射
export const assetAttributeLabels: Record<AssetAttribute, string> = {
  [AssetAttribute.ORPHAN]: '无主资产',
  [AssetAttribute.UNKNOWN]: '未知资产',
  [AssetAttribute.NON_COMPLIANT]: '不合规资产',
  [AssetAttribute.NORMAL]: '正常资产'
}

// 资产状态中文映射
export const assetStatusLabels: Record<AssetStatus, string> = {
  [AssetStatus.UNMANAGED]: '未纳管',
  [AssetStatus.MANAGED]: '已纳管',
  [AssetStatus.PENDING]: '待确认',
  [AssetStatus.IGNORED]: '已忽略'
}

// 动态类型中文映射
export const dynamicTypeLabels: Record<DynamicType, string> = {
  [DynamicType.ASSIGN]: '指派',
  [DynamicType.CLAIM]: '认领',
  [DynamicType.IMPORT]: '导入',
  [DynamicType.IGNORE]: '忽略'
}
