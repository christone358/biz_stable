// 资产管理Mock数据生成

import {
  Asset,
  PendingAsset,
  AssetStatistics,
  BusinessInfo,
  AssetType,
  AssetLayer,
  AssetStatus,
  HealthStatus,
  AssetEvidence
} from '../pages/asset-management/types'
import { generateBusinessDomainSystems } from './data'

// 生成业务列表 - 从统一数据源获取
export const generateMockBusinesses = (): BusinessInfo[] => {
  const allSystems = generateBusinessDomainSystems()

  return allSystems.map(system => ({
    id: system.id,
    name: system.name,
    code: system.id,
    status: system.healthStatus === 'HEALTHY' ? 'RUNNING' :
            system.healthStatus === 'WARNING' ? 'WARNING' :
            'ERROR' as 'RUNNING' | 'STOPPED' | 'WARNING' | 'ERROR',
    assetCount: system.assetCount
  }))
}

// 生成资产列表（根据业务ID）
export const generateMockAssets = (businessId: string, businessName: string): Asset[] => {
  const assets: Asset[] = []
  const now = new Date()

  // 基础设施层 - 主机
  const hosts: Asset[] = [
    {
      id: `${businessId}-host-001`,
      name: `${businessName}-主机-01`,
      code: 'HOST-001',
      type: 'HOST',
      layer: 'INFRASTRUCTURE',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.10',
      hostname: 'app-server-01',
      version: 'CentOS 7.9',
      vendor: 'VMware',
      specs: {
        cpu: '8核',
        memory: '32GB',
        disk: '500GB',
        os: 'CentOS 7.9'
      },
      dependencies: [],
      dependents: [`${businessId}-app-001`, `${businessId}-mid-001`],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 45,
        memoryUsage: 60,
        diskUsage: 35,
        responseTime: 50
      },
      discoveryMethod: 'CMDB_SYNC',
      discoveryTime: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '张三',
      tags: ['生产环境', '核心主机'],
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    },
    {
      id: `${businessId}-host-002`,
      name: `${businessName}-主机-02`,
      code: 'HOST-002',
      type: 'HOST',
      layer: 'INFRASTRUCTURE',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.11',
      hostname: 'app-server-02',
      version: 'CentOS 7.9',
      vendor: 'VMware',
      specs: {
        cpu: '8核',
        memory: '32GB',
        disk: '500GB',
        os: 'CentOS 7.9'
      },
      dependencies: [],
      dependents: [`${businessId}-app-002`],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 38,
        memoryUsage: 55,
        diskUsage: 40,
        responseTime: 45
      },
      discoveryMethod: 'CMDB_SYNC',
      discoveryTime: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '张三',
      tags: ['生产环境'],
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    },
    {
      id: `${businessId}-host-003`,
      name: `${businessName}-数据库主机`,
      code: 'HOST-003',
      type: 'HOST',
      layer: 'INFRASTRUCTURE',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.20',
      hostname: 'db-server-01',
      version: 'CentOS 7.9',
      vendor: 'VMware',
      specs: {
        cpu: '16核',
        memory: '64GB',
        disk: '1TB',
        os: 'CentOS 7.9'
      },
      dependencies: [],
      dependents: [`${businessId}-db-001`, `${businessId}-db-002`],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 55,
        memoryUsage: 70,
        diskUsage: 50,
        responseTime: 30
      },
      discoveryMethod: 'CMDB_SYNC',
      discoveryTime: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '李四',
      tags: ['生产环境', '数据库主机'],
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    }
  ]

  // 中间件层
  const middleware: Asset[] = [
    {
      id: `${businessId}-db-001`,
      name: `${businessName}-MySQL主库`,
      code: 'DB-001',
      type: 'DATABASE',
      layer: 'MIDDLEWARE',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.20',
      port: 3306,
      version: 'MySQL 8.0.28',
      vendor: 'Oracle',
      dependencies: [
        {
          targetAssetId: `${businessId}-host-003`,
          targetAssetName: `${businessName}-数据库主机`,
          dependencyType: 'DEPLOY',
          description: '部署在此主机上'
        }
      ],
      dependents: [`${businessId}-app-001`],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 40,
        memoryUsage: 65,
        responseTime: 20
      },
      discoveryMethod: 'LOG_ANALYSIS',
      discoveryTime: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '李四',
      tags: ['MySQL', '主库'],
      createdAt: new Date(now.getTime() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    },
    {
      id: `${businessId}-db-002`,
      name: `${businessName}-Redis缓存`,
      code: 'REDIS-001',
      type: 'MIDDLEWARE',
      layer: 'MIDDLEWARE',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.20',
      port: 6379,
      version: 'Redis 6.2.6',
      vendor: 'Redis',
      dependencies: [
        {
          targetAssetId: `${businessId}-host-003`,
          targetAssetName: `${businessName}-数据库主机`,
          dependencyType: 'DEPLOY',
          description: '部署在此主机上'
        }
      ],
      dependents: [`${businessId}-app-001`, `${businessId}-app-002`],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 25,
        memoryUsage: 45,
        responseTime: 5
      },
      discoveryMethod: 'LOG_ANALYSIS',
      discoveryTime: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '李四',
      tags: ['Redis', '缓存'],
      createdAt: new Date(now.getTime() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    },
    {
      id: `${businessId}-mid-001`,
      name: `${businessName}-Nginx`,
      code: 'NGINX-001',
      type: 'MIDDLEWARE',
      layer: 'MIDDLEWARE',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.10',
      port: 80,
      version: 'Nginx 1.20.2',
      vendor: 'Nginx',
      dependencies: [
        {
          targetAssetId: `${businessId}-host-001`,
          targetAssetName: `${businessName}-主机-01`,
          dependencyType: 'DEPLOY',
          description: '部署在此主机上'
        }
      ],
      dependents: [`${businessId}-app-001`],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 20,
        memoryUsage: 30,
        responseTime: 10
      },
      discoveryMethod: 'MANUAL',
      discoveryTime: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '王五',
      tags: ['Nginx', '负载均衡'],
      createdAt: new Date(now.getTime() - 88 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    }
  ]

  // 应用服务层
  const applications: Asset[] = [
    {
      id: `${businessId}-app-001`,
      name: `${businessName}-服务`,
      code: 'APP-001',
      type: 'APPLICATION',
      layer: 'APPLICATION',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.10',
      port: 8080,
      version: 'v1.2.0',
      dependencies: [
        {
          targetAssetId: `${businessId}-host-001`,
          targetAssetName: `${businessName}-主机-01`,
          dependencyType: 'DEPLOY',
          description: '部署在此主机上'
        },
        {
          targetAssetId: `${businessId}-db-001`,
          targetAssetName: `${businessName}-MySQL主库`,
          dependencyType: 'DATA',
          description: '数据库连接'
        },
        {
          targetAssetId: `${businessId}-db-002`,
          targetAssetName: `${businessName}-Redis缓存`,
          dependencyType: 'CONNECT',
          description: '缓存连接'
        },
        {
          targetAssetId: `${businessId}-mid-001`,
          targetAssetName: `${businessName}-Nginx`,
          dependencyType: 'SERVICE',
          description: '通过Nginx提供服务'
        }
      ],
      dependents: [],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      metrics: {
        cpuUsage: 50,
        memoryUsage: 60,
        responseTime: 120
      },
      discoveryMethod: 'MANUAL',
      discoveryTime: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '赵六',
      tags: ['Java', 'SpringBoot'],
      description: `${businessName}核心应用服务`,
      createdAt: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    },
    {
      id: `${businessId}-app-002`,
      name: `${businessName}-订单处理服务`,
      code: 'APP-002',
      type: 'APPLICATION',
      layer: 'APPLICATION',
      businessId,
      businessName,
      confirmStatus: 'CONFIRMED',
      ip: '192.168.1.11',
      port: 8081,
      version: 'v1.0.5',
      dependencies: [
        {
          targetAssetId: `${businessId}-host-002`,
          targetAssetName: `${businessName}-主机-02`,
          dependencyType: 'DEPLOY',
          description: '部署在此主机上'
        },
        {
          targetAssetId: `${businessId}-db-002`,
          targetAssetName: `${businessName}-Redis缓存`,
          dependencyType: 'CONNECT',
          description: '缓存连接'
        }
      ],
      dependents: [],
      status: 'ONLINE',
      healthStatus: 'WARNING',
      metrics: {
        cpuUsage: 75,
        memoryUsage: 80,
        responseTime: 250
      },
      discoveryMethod: 'MANUAL',
      discoveryTime: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      owner: '赵六',
      tags: ['Java', 'SpringBoot'],
      description: '订单处理子服务',
      createdAt: new Date(now.getTime() - 78 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      confirmedBy: '管理员'
    }
  ]

  assets.push(...hosts, ...middleware, ...applications)
  return assets
}

// 生成待确认资产
export const generateMockPendingAssets = (businessId: string, businessName: string): PendingAsset[] => {
  const now = new Date()

  return [
    {
      id: `${businessId}-pending-001`,
      name: `${businessName}-MySQL从库`,
      code: 'DB-SLAVE-001',
      type: 'DATABASE',
      layer: 'MIDDLEWARE',
      businessId: '',
      businessName: '',
      confirmStatus: 'PENDING',
      ip: '192.168.1.21',
      port: 3306,
      version: 'MySQL 8.0.28',
      vendor: 'Oracle',
      dependencies: [],
      dependents: [],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      discoveryMethod: 'LOG_ANALYSIS',
      discoveryTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      discoverySource: '日志分析系统',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      // PendingAsset特有字段
      confidence: 85,
      suggestedBusinessId: businessId,
      reason: `检测到与${businessName}主库的主从复制关系`,
      evidences: [
        {
          type: 'LOG',
          content: `[2024-10-11 10:30:15] 检测到数据库主从复制连接：192.168.1.20:3306 -> 192.168.1.21:3306`,
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          source: '日志分析系统'
        },
        {
          type: 'CONFIG',
          content: `主从复制配置文件中指向主库: 192.168.1.20`,
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          source: '配置文件扫描'
        },
        {
          type: 'NETWORK_TRAFFIC',
          content: `频繁的数据库协议流量：192.168.1.20 <-> 192.168.1.21`,
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          source: '网络流量分析'
        }
      ]
    },
    {
      id: `${businessId}-pending-002`,
      name: `${businessName}-Redis集群节点2`,
      code: 'REDIS-002',
      type: 'MIDDLEWARE',
      layer: 'MIDDLEWARE',
      businessId: '',
      businessName: '',
      confirmStatus: 'PENDING',
      ip: '192.168.1.22',
      port: 6379,
      version: 'Redis 6.2.6',
      vendor: 'Redis',
      dependencies: [],
      dependents: [],
      status: 'ONLINE',
      healthStatus: 'HEALTHY',
      discoveryMethod: 'NETWORK_TRAFFIC',
      discoveryTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      discoverySource: '网络流量分析',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 92,
      suggestedBusinessId: businessId,
      reason: `检测到与${businessName}服务的频繁Redis协议通信`,
      evidences: [
        {
          type: 'NETWORK_TRAFFIC',
          content: `高频Redis协议通信：${businessName}-服务 <-> 192.168.1.22:6379`,
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: '网络流量分析'
        },
        {
          type: 'API_CALL',
          content: `应用日志显示连接到Redis集群：192.168.1.20:6379, 192.168.1.22:6379`,
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: '应用日志'
        },
        {
          type: 'CONFIG',
          content: `Redis集群配置：包含192.168.1.22作为集群节点`,
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: '配置文件扫描'
        },
        {
          type: 'LOG',
          content: `Redis集群日志显示节点间心跳通信`,
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'Redis日志'
        },
        {
          type: 'NETWORK_TRAFFIC',
          content: `流量模式与已知Redis节点一致`,
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: '流量模式分析'
        }
      ]
    }
  ]
}

// 生成资产统计信息
export const generateAssetStatistics = (assets: Asset[], pendingAssets: PendingAsset[]): AssetStatistics => {
  const statistics: AssetStatistics = {
    total: assets.length,
    byType: {
      HOST: 0,
      DATABASE: 0,
      MIDDLEWARE: 0,
      APPLICATION: 0,
      NETWORK: 0,
      STORAGE: 0,
      CONTAINER: 0
    },
    byLayer: {
      INFRASTRUCTURE: 0,
      MIDDLEWARE: 0,
      APPLICATION: 0
    },
    byStatus: {
      online: 0,
      offline: 0,
      maintenance: 0,
      unknown: 0
    },
    byHealth: {
      healthy: 0,
      warning: 0,
      critical: 0,
      unknown: 0
    },
    pendingCount: pendingAssets.length
  }

  assets.forEach(asset => {
    // 按类型统计
    statistics.byType[asset.type]++

    // 按层级统计
    statistics.byLayer[asset.layer]++

    // 按状态统计
    if (asset.status === 'ONLINE') statistics.byStatus.online++
    else if (asset.status === 'OFFLINE') statistics.byStatus.offline++
    else if (asset.status === 'MAINTENANCE') statistics.byStatus.maintenance++
    else statistics.byStatus.unknown++

    // 按健康状态统计
    if (asset.healthStatus === 'HEALTHY') statistics.byHealth.healthy++
    else if (asset.healthStatus === 'WARNING') statistics.byHealth.warning++
    else if (asset.healthStatus === 'CRITICAL') statistics.byHealth.critical++
    else statistics.byHealth.unknown++
  })

  return statistics
}
