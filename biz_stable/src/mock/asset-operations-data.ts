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
  Department,
  DepartmentAsset
} from '../pages/management/asset-operations/types'

// 生成未纳管资产数据
export function generateUnmanagedAssets(): UnmanagedAsset[] {
  return [
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
    },
    {
      id: 'ASSET-UNM-004',
      name: 'MYSQL-SLAVE-03',
      type: AssetType.DATABASE,
      attribute: AssetAttribute.ORPHAN,
      ipAddress: '172.16.5.33',
      discoveredTime: '2023-07-09 16:45:00',
      discoveredSource: '端口扫描',
      status: AssetStatus.UNMANAGED,
      description: 'MySQL从库，未关联任何业务系统',
      version: 'MySQL 5.7.36'
    },
    {
      id: 'ASSET-UNM-005',
      name: 'UNKNOWN-172.16.8.120',
      type: AssetType.SERVER,
      attribute: AssetAttribute.UNKNOWN,
      ipAddress: '172.16.8.120',
      discoveredTime: '2023-07-13 08:00:00',
      discoveredSource: '资产清查',
      status: AssetStatus.UNMANAGED,
      description: '未登记服务器，运行未知服务'
    },
    {
      id: 'ASSET-UNM-006',
      name: 'TOMCAT-APP-09',
      type: AssetType.MIDDLEWARE,
      attribute: AssetAttribute.ORPHAN,
      ipAddress: '192.168.15.209',
      discoveredTime: '2023-07-08 11:30:00',
      discoveredSource: '应用扫描',
      status: AssetStatus.UNMANAGED,
      description: 'Tomcat中间件，无业务关联',
      version: 'Apache Tomcat 8.5'
    },
    {
      id: 'ASSET-UNM-007',
      name: 'SWITCH-UNKNOWN-01',
      type: AssetType.NETWORK_DEVICE,
      attribute: AssetAttribute.UNKNOWN,
      ipAddress: '10.10.10.250',
      location: '数据中心B区',
      discoveredTime: '2023-07-14 15:00:00',
      discoveredSource: 'SNMP扫描',
      status: AssetStatus.UNMANAGED,
      description: '发现未知交换机设备'
    },
    {
      id: 'ASSET-UNM-008',
      name: 'STORAGE-OLD-05',
      type: AssetType.STORAGE,
      attribute: AssetAttribute.ORPHAN,
      ipAddress: '172.20.5.105',
      location: '数据中心A区',
      discoveredTime: '2023-07-07 09:00:00',
      discoveredSource: '资产盘点',
      status: AssetStatus.UNMANAGED,
      description: '旧存储设备，疑似已下线',
      manufacturer: 'Huawei'
    },
    {
      id: 'ASSET-UNM-009',
      name: 'REDIS-CACHE-07',
      type: AssetType.MIDDLEWARE,
      attribute: AssetAttribute.ORPHAN,
      ipAddress: '192.168.20.107',
      discoveredTime: '2023-07-15 13:20:00',
      discoveredSource: '服务发现',
      status: AssetStatus.UNMANAGED,
      description: 'Redis缓存服务，未关联业务',
      version: 'Redis 6.2.6'
    },
    {
      id: 'ASSET-UNM-010',
      name: 'ARM-SERVER-03',
      type: AssetType.SERVER,
      attribute: AssetAttribute.NON_COMPLIANT,
      ipAddress: '10.60.30.103',
      location: '非信创区域',
      discoveredTime: '2023-07-16 10:00:00',
      discoveredSource: '合规性扫描',
      status: AssetStatus.UNMANAGED,
      description: '非信创区发现信创服务器',
      os: 'Kylin V10',
      manufacturer: 'Huawei'
    },
    {
      id: 'ASSET-UNM-011',
      name: 'FIREWALL-01',
      type: AssetType.SECURITY,
      attribute: AssetAttribute.ORPHAN,
      ipAddress: '192.168.1.1',
      location: '网络边界',
      discoveredTime: '2023-07-05 08:30:00',
      discoveredSource: '安全审计',
      status: AssetStatus.UNMANAGED,
      description: '防火墙设备，未纳入管理',
      manufacturer: 'H3C'
    },
    {
      id: 'ASSET-UNM-012',
      name: 'ORACLE-DB-02',
      type: AssetType.DATABASE,
      attribute: AssetAttribute.UNKNOWN,
      ipAddress: '172.18.10.202',
      discoveredTime: '2023-07-14 16:30:00',
      discoveredSource: '数据库扫描',
      status: AssetStatus.UNMANAGED,
      description: '发现Oracle数据库实例，用途不明',
      version: 'Oracle 11g'
    }
  ]
}

// 生成资产类型统计数据
export function generateAssetTypeStats(): AssetTypeStats[] {
  return [
    {
      type: AssetType.SERVER,
      total: 156,
      unmanaged: 23,
      managed: 133,
      orphan: 12,
      unknown: 8,
      nonCompliant: 3
    },
    {
      type: AssetType.DESKTOP,
      total: 342,
      unmanaged: 45,
      managed: 297,
      orphan: 18,
      unknown: 15,
      nonCompliant: 12
    },
    {
      type: AssetType.NETWORK_DEVICE,
      total: 78,
      unmanaged: 12,
      managed: 66,
      orphan: 5,
      unknown: 6,
      nonCompliant: 1
    },
    {
      type: AssetType.MIDDLEWARE,
      total: 89,
      unmanaged: 15,
      managed: 74,
      orphan: 8,
      unknown: 4,
      nonCompliant: 3
    },
    {
      type: AssetType.DATABASE,
      total: 64,
      unmanaged: 9,
      managed: 55,
      orphan: 4,
      unknown: 3,
      nonCompliant: 2
    },
    {
      type: AssetType.STORAGE,
      total: 34,
      unmanaged: 6,
      managed: 28,
      orphan: 3,
      unknown: 2,
      nonCompliant: 1
    },
    {
      type: AssetType.SECURITY,
      total: 28,
      unmanaged: 4,
      managed: 24,
      orphan: 2,
      unknown: 1,
      nonCompliant: 1
    },
    {
      type: AssetType.OTHER,
      total: 45,
      unmanaged: 8,
      managed: 37,
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
