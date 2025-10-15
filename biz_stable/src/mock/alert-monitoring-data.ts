import { AlertRecord, AlertLevel, AlertStatus, ResourceType, ResourceCategory } from '../pages/management/alert-monitoring/types'

// 生成模拟告警数据
export function generateMockAlertRecords(): AlertRecord[] {
  return [
    {
      id: 'ALERT-20230715-001',
      level: AlertLevel.EMERGENCY,
      name: '数据库连接数超限',
      description: 'MySQL-主库 当前连接数: 985/1000',
      discoveredTime: '2023-07-15 14:23:45',
      alertObject: 'MySQL-主库',
      resourceType: ResourceType.DATABASE_SERVICE,
      status: AlertStatus.PENDING,
      assignee: null
    },
    {
      id: 'ALERT-20230715-002',
      level: AlertLevel.SEVERE,
      name: '服务器CPU使用率过高',
      description: 'APP-SERVER-01 CPU使用率: 92% (阈值: 85%)',
      discoveredTime: '2023-07-15 13:45:12',
      alertObject: 'APP-SERVER-01',
      resourceType: ResourceType.SERVER,
      status: AlertStatus.PROCESSING,
      assignee: '张工程师'
    },
    {
      id: 'ALERT-20230715-003',
      level: AlertLevel.WARNING,
      name: '磁盘空间不足',
      description: 'STORAGE-01 磁盘使用率: 88% (阈值: 85%)',
      discoveredTime: '2023-07-15 12:30:33',
      alertObject: 'STORAGE-01',
      resourceType: ResourceType.STORAGE_DEVICE,
      status: AlertStatus.PENDING,
      assignee: null
    },
    {
      id: 'ALERT-20230715-004',
      level: AlertLevel.SEVERE,
      name: 'API响应超时',
      description: 'API-GATEWAY 平均响应时间: 2.3s (阈值: 1.5s)',
      discoveredTime: '2023-07-15 11:15:22',
      alertObject: 'API-GATEWAY',
      resourceType: ResourceType.API_SERVICE,
      status: AlertStatus.CLOSED,
      assignee: '李工程师'
    },
    {
      id: 'ALERT-20230715-005',
      level: AlertLevel.EMERGENCY,
      name: '网络设备端口异常',
      description: 'SWITCH-01 端口3 错误包率: 12% (阈值: 5%)',
      discoveredTime: '2023-07-15 10:05:18',
      alertObject: 'SWITCH-01',
      resourceType: ResourceType.NETWORK_DEVICE,
      status: AlertStatus.PROCESSING,
      assignee: '王工程师'
    },
    {
      id: 'ALERT-20230715-006',
      level: AlertLevel.WARNING,
      name: '内存使用率偏高',
      description: 'APP-SERVER-02 内存使用率: 82% (阈值: 80%)',
      discoveredTime: '2023-07-15 09:45:30',
      alertObject: 'APP-SERVER-02',
      resourceType: ResourceType.SERVER,
      status: AlertStatus.PENDING,
      assignee: null
    },
    {
      id: 'ALERT-20230715-007',
      level: AlertLevel.SEVERE,
      name: '数据库备份失败',
      description: 'MySQL-从库 备份任务失败，错误码: 503',
      discoveredTime: '2023-07-15 08:20:15',
      alertObject: 'MySQL-从库',
      resourceType: ResourceType.DATABASE_SERVICE,
      status: AlertStatus.PROCESSING,
      assignee: '赵工程师'
    }
  ]
}

// 生成资源类别数据
export function generateResourceCategories(): ResourceCategory[] {
  return [
    {
      id: 'system-services',
      name: '系统服务',
      items: [
        { id: 'all', name: '全部', type: ResourceType.WEB_SERVICE, checked: true },
        { id: 'web-service', name: 'Web服务', type: ResourceType.WEB_SERVICE, checked: false },
        { id: 'database-service', name: '数据库服务', type: ResourceType.DATABASE_SERVICE, checked: false },
        { id: 'middleware-service', name: '中间件服务', type: ResourceType.MIDDLEWARE_SERVICE, checked: false },
        { id: 'api-service', name: 'API服务', type: ResourceType.API_SERVICE, checked: false },
        { id: 'cache-service', name: '缓存服务', type: ResourceType.CACHE_SERVICE, checked: false }
      ]
    },
    {
      id: 'basic-software',
      name: '基础软件',
      items: [
        { id: 'operating-system', name: '操作系统', type: ResourceType.OPERATING_SYSTEM, checked: false },
        { id: 'database-system', name: '数据库系统', type: ResourceType.DATABASE_SYSTEM, checked: false },
        { id: 'application-server', name: '应用服务器', type: ResourceType.APPLICATION_SERVER, checked: false },
        { id: 'message-queue', name: '消息队列', type: ResourceType.MESSAGE_QUEUE, checked: false }
      ]
    },
    {
      id: 'hardware-facilities',
      name: '硬件设施',
      items: [
        { id: 'server', name: '服务器', type: ResourceType.SERVER, checked: false },
        { id: 'network-device', name: '网络设备', type: ResourceType.NETWORK_DEVICE, checked: false },
        { id: 'storage-device', name: '存储设备', type: ResourceType.STORAGE_DEVICE, checked: false },
        { id: 'security-device', name: '安全设备', type: ResourceType.SECURITY_DEVICE, checked: false }
      ]
    }
  ]
}

// 资源类型中文映射
export const resourceTypeLabels: Record<ResourceType, string> = {
  [ResourceType.WEB_SERVICE]: 'Web服务',
  [ResourceType.DATABASE_SERVICE]: '数据库服务',
  [ResourceType.MIDDLEWARE_SERVICE]: '中间件服务',
  [ResourceType.API_SERVICE]: 'API服务',
  [ResourceType.CACHE_SERVICE]: '缓存服务',
  [ResourceType.OPERATING_SYSTEM]: '操作系统',
  [ResourceType.DATABASE_SYSTEM]: '数据库系统',
  [ResourceType.APPLICATION_SERVER]: '应用服务器',
  [ResourceType.MESSAGE_QUEUE]: '消息队列',
  [ResourceType.SERVER]: '服务器',
  [ResourceType.NETWORK_DEVICE]: '网络设备',
  [ResourceType.STORAGE_DEVICE]: '存储设备',
  [ResourceType.SECURITY_DEVICE]: '安全设备'
}

// 告警等级中文映射
export const alertLevelLabels: Record<AlertLevel, string> = {
  [AlertLevel.EMERGENCY]: '紧急',
  [AlertLevel.SEVERE]: '严重',
  [AlertLevel.WARNING]: '警告'
}

// 告警状态中文映射
export const alertStatusLabels: Record<AlertStatus, string> = {
  [AlertStatus.PENDING]: '待指派',
  [AlertStatus.TO_PROCESS]: '待处理',
  [AlertStatus.PROCESSING]: '处理中',
  [AlertStatus.TO_CLOSE]: '待关闭',
  [AlertStatus.CLOSED]: '已关闭'
}
