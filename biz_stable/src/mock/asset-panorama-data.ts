import type {
  PanoramaData,
  BusinessInfo,
  ResponsibleInfo,
  LayerStatistics,
  HoneycombAssetType,
  DependencyNode,
  AssetItem
} from '../pages/asset-management/panorama-types'
import { AssetLayerType, AssetStatus } from '../pages/asset-management/panorama-types'

/**
 * 生成业务基础信息
 */
export function generateBusinessInfo(businessId: string, businessName: string): BusinessInfo {
  return {
    id: businessId,
    name: businessName,
    status: '正常运行',
    createTime: '2021-03-15',
    sla: '99.9%',
    visits: '1.2亿/月',
    users: '4500万',
    description: '政务服务统一入口，提供一站式在线办事服务',
    badges: ['运行中', '核心业务']
  }
}

/**
 * 生成责任主体信息
 */
export function generateResponsibleInfo(): ResponsibleInfo {
  return {
    owner: {
      org: '市大数据中心',
      contact: '张主任',
      phone: '138****1234'
    },
    developer: {
      org: '市信息化发展公司',
      contact: '王工程师',
      phone: '139****5678'
    },
    operator: {
      org: '市政务云运营中心',
      contact: '李运维',
      phone: '136****9012'
    }
  }
}

/**
 * 生成层级统计数据
 */
export function generateLayerStatistics(): Record<AssetLayerType, LayerStatistics> {
  return {
    [AssetLayerType.APPLICATION]: {
      total: 12,
      running: 10,
      abnormal: 2,
      change: 2
    },
    [AssetLayerType.COMPUTE]: {
      total: 28,
      running: 25,
      abnormal: 3,
      change: -1
    },
    [AssetLayerType.STORAGE]: {
      total: 15,
      running: 15,
      abnormal: 0,
      change: 3
    },
    [AssetLayerType.NETWORK]: {
      total: 9,
      running: 9,
      abnormal: 0,
      change: 0
    }
  }
}

/**
 * 生成应用层资产
 */
function generateApplicationAssets(): AssetItem[] {
  const frontendApps = [
    { name: '门户首页', address: 'https://zwdt.sh.gov.cn' },
    { name: '用户中心', address: 'https://user.zwdt.sh.gov.cn' },
    { name: '办事大厅', address: 'https://service.zwdt.sh.gov.cn' },
    { name: '我的办件', address: 'https://my.zwdt.sh.gov.cn' },
    { name: '消息中心', address: 'https://message.zwdt.sh.gov.cn' }
  ]

  const backendServices = [
    { name: '用户服务', address: '10.0.1.1:8080' },
    { name: '认证服务', address: '10.0.1.2:8080' },
    { name: '办件服务', address: '10.0.1.3:8080' },
    { name: '支付服务', address: '10.0.1.4:8080' },
    { name: '消息服务', address: '10.0.1.5:8080' },
    { name: '文件服务', address: '10.0.1.6:8080' }
  ]

  const assets: AssetItem[] = []

  frontendApps.forEach((app, index) => {
    assets.push({
      id: `app-frontend-${index + 1}`,
      name: app.name,
      type: '前端应用',
      status: index === 4 ? AssetStatus.ABNORMAL : AssetStatus.RUNNING,
      address: app.address,
      config: index % 2 === 0 ? 'Vue 3.0' : 'React 18',
      owner: '前端团队'
    })
  })

  backendServices.forEach((service, index) => {
    assets.push({
      id: `app-backend-${index + 1}`,
      name: service.name,
      type: '后端服务',
      status: index === 5 ? AssetStatus.ABNORMAL : AssetStatus.RUNNING,
      address: service.address,
      config: 'Java Spring',
      owner: '后端团队'
    })
  })

  assets.push({
    id: 'app-middleware-1',
    name: '消息队列',
    type: '中间件',
    status: AssetStatus.RUNNING,
    address: '10.0.1.7:5672',
    config: 'RabbitMQ',
    owner: '中间件团队'
  })

  return assets
}

/**
 * 生成计算层资产
 */
function generateComputeAssets(): AssetItem[] {
  const assets: AssetItem[] = []

  // 云服务器
  const serverTypes = ['WEB', 'APP', 'DB', 'CACHE', 'SEARCH', 'FILE', 'AUTH', 'PAY', 'MSG']
  serverTypes.forEach((type, typeIndex) => {
    const count = type === 'WEB' ? 3 : 2
    for (let i = 1; i <= count; i++) {
      const index = typeIndex * 2 + i
      assets.push({
        id: `compute-server-${index}`,
        name: `${type}-${String(i).padStart(2, '0')}`,
        type: '云服务器',
        status: (type === 'PAY' || type === 'MSG') && i === 2 ? AssetStatus.ABNORMAL : AssetStatus.RUNNING,
        address: `192.168.1.${index}`,
        config: type === 'DB' ? '16核32G' : type === 'APP' || type === 'SEARCH' || type === 'FILE' ? '8核16G' : '4核8G',
        owner: type === 'DB' ? 'DBA团队' : '运维团队'
      })
    }
  })

  // 容器集群
  assets.push({
    id: 'compute-k8s-master',
    name: 'K8S-MASTER',
    type: '容器集群',
    status: AssetStatus.RUNNING,
    address: '10.0.0.1',
    config: '4节点',
    owner: '容器团队'
  })

  for (let i = 1; i <= 7; i++) {
    assets.push({
      id: `compute-k8s-node-${i}`,
      name: `K8S-NODE-${String(i).padStart(2, '0')}`,
      type: '容器集群',
      status: i === 7 ? AssetStatus.ABNORMAL : AssetStatus.RUNNING,
      address: `10.0.0.${i + 1}`,
      config: '8核16G',
      owner: '容器团队'
    })
  }

  // 函数计算
  assets.push({
    id: 'compute-fc-1',
    name: 'FC-IMAGE',
    type: '函数计算',
    status: AssetStatus.IDLE,
    address: '-',
    config: '512MB',
    owner: 'Serverless团队'
  })

  assets.push({
    id: 'compute-fc-2',
    name: 'FC-DOC',
    type: '函数计算',
    status: AssetStatus.ABNORMAL,
    address: '-',
    config: '512MB',
    owner: 'Serverless团队'
  })

  return assets
}

/**
 * 生成存储层资产
 */
function generateStorageAssets(): AssetItem[] {
  const assets: AssetItem[] = []

  // 对象存储
  const ossBuckets = ['USER', 'FILE', 'IMAGE', 'VIDEO', 'BACKUP', 'TEMP', 'LOG', 'ARCHIVE']
  const ossConfigs = ['100GB', '500GB', '200GB', '1TB', '2TB', '50GB', '100GB', '500GB']

  ossBuckets.forEach((bucket, index) => {
    assets.push({
      id: `storage-oss-${index + 1}`,
      name: `OSS-${bucket}`,
      type: '对象存储',
      status: AssetStatus.RUNNING,
      address: `oss://${bucket.toLowerCase()}-bucket`,
      config: ossConfigs[index],
      owner: '存储团队'
    })
  })

  // 块存储
  const diskTypes = ['DB', 'CACHE', 'SEARCH', 'BACKUP']
  const diskConfigs = ['1TB', '500GB', '500GB', '2TB']

  diskTypes.forEach((disk, index) => {
    assets.push({
      id: `storage-disk-${index + 1}`,
      name: `DISK-${disk}`,
      type: '块存储',
      status: AssetStatus.RUNNING,
      address: `/dev/sd${String.fromCharCode(98 + index)}1`,
      config: diskConfigs[index],
      owner: '存储团队'
    })
  })

  // 文件存储
  const nasTypes = ['SHARE', 'BACKUP', 'TEMP']
  const nasConfigs = ['1TB', '2TB', '500GB']

  nasTypes.forEach((nas, index) => {
    assets.push({
      id: `storage-nas-${index + 1}`,
      name: `NAS-${nas}`,
      type: '文件存储',
      status: AssetStatus.RUNNING,
      address: `nas://${nas.toLowerCase()}1`,
      config: nasConfigs[index],
      owner: '存储团队'
    })
  })

  return assets
}

/**
 * 生成网络层资产
 */
function generateNetworkAssets(): AssetItem[] {
  return [
    {
      id: 'network-slb-1',
      name: 'SLB-WEB',
      type: '负载均衡',
      status: AssetStatus.RUNNING,
      address: 'slb.zwdt.sh.gov.cn',
      config: 'HTTP/HTTPS',
      owner: '网络团队'
    },
    {
      id: 'network-slb-2',
      name: 'SLB-APP',
      type: '负载均衡',
      status: AssetStatus.RUNNING,
      address: 'api.zwdt.sh.gov.cn',
      config: 'HTTP/HTTPS',
      owner: '网络团队'
    },
    {
      id: 'network-slb-3',
      name: 'SLB-API',
      type: '负载均衡',
      status: AssetStatus.RUNNING,
      address: 'gateway.zwdt.sh.gov.cn',
      config: 'HTTP/HTTPS',
      owner: '网络团队'
    },
    {
      id: 'network-vpn-1',
      name: 'VPN-OFFICE',
      type: 'VPN网关',
      status: AssetStatus.RUNNING,
      address: 'vpn.office.sh.gov.cn',
      config: 'IPSec',
      owner: '网络团队'
    },
    {
      id: 'network-vpn-2',
      name: 'VPN-MOBILE',
      type: 'VPN网关',
      status: AssetStatus.RUNNING,
      address: 'vpn.mobile.sh.gov.cn',
      config: 'SSL',
      owner: '网络团队'
    },
    {
      id: 'network-nat-1',
      name: 'NAT-PUBLIC',
      type: 'NAT网关',
      status: AssetStatus.RUNNING,
      address: 'nat.public.sh.gov.cn',
      config: 'SNAT/DNAT',
      owner: '网络团队'
    },
    {
      id: 'network-nat-2',
      name: 'NAT-BACKUP',
      type: 'NAT网关',
      status: AssetStatus.RUNNING,
      address: 'nat.backup.sh.gov.cn',
      config: 'SNAT/DNAT',
      owner: '网络团队'
    },
    {
      id: 'network-cdn-1',
      name: 'CDN-STATIC',
      type: 'CDN',
      status: AssetStatus.RUNNING,
      address: 'cdn.static.sh.gov.cn',
      config: '静态加速',
      owner: '网络团队'
    },
    {
      id: 'network-cdn-2',
      name: 'CDN-VIDEO',
      type: 'CDN',
      status: AssetStatus.RUNNING,
      address: 'cdn.video.sh.gov.cn',
      config: '视频加速',
      owner: '网络团队'
    }
  ]
}

/**
 * 生成蜂窝矩阵数据
 */
export function generateHoneycombData(
  assets: Record<AssetLayerType, AssetItem[]>
): Record<AssetLayerType, HoneycombAssetType[]> {
  const result: Record<AssetLayerType, HoneycombAssetType[]> = {
    [AssetLayerType.APPLICATION]: [],
    [AssetLayerType.COMPUTE]: [],
    [AssetLayerType.STORAGE]: [],
    [AssetLayerType.NETWORK]: []
  }

  // 应用层分组
  const appAssets = assets[AssetLayerType.APPLICATION]
  result[AssetLayerType.APPLICATION] = [
    {
      type: '前端应用',
      count: appAssets.filter(a => a.type === '前端应用').length,
      color: '#fa541c',
      status: 'normal',
      assets: appAssets.filter(a => a.type === '前端应用')
    },
    {
      type: '后端服务',
      count: appAssets.filter(a => a.type === '后端服务').length,
      color: '#722ed1',
      status: 'normal',
      assets: appAssets.filter(a => a.type === '后端服务')
    },
    {
      type: '中间件',
      count: appAssets.filter(a => a.type === '中间件').length,
      color: '#13c2c2',
      status: 'normal',
      assets: appAssets.filter(a => a.type === '中间件')
    }
  ]

  // 计算层分组
  const computeAssets = assets[AssetLayerType.COMPUTE]
  result[AssetLayerType.COMPUTE] = [
    {
      type: '云服务器',
      count: computeAssets.filter(a => a.type === '云服务器').length,
      color: '#52c41a',
      status: 'normal',
      assets: computeAssets.filter(a => a.type === '云服务器')
    },
    {
      type: '容器集群',
      count: computeAssets.filter(a => a.type === '容器集群').length,
      color: '#1890ff',
      status: 'normal',
      assets: computeAssets.filter(a => a.type === '容器集群')
    },
    {
      type: '函数计算',
      count: computeAssets.filter(a => a.type === '函数计算').length,
      color: '#faad14',
      status: 'abnormal',
      assets: computeAssets.filter(a => a.type === '函数计算')
    }
  ]

  // 存储层分组
  const storageAssets = assets[AssetLayerType.STORAGE]
  result[AssetLayerType.STORAGE] = [
    {
      type: '对象存储',
      count: storageAssets.filter(a => a.type === '对象存储').length,
      color: '#722ed1',
      status: 'normal',
      assets: storageAssets.filter(a => a.type === '对象存储')
    },
    {
      type: '块存储',
      count: storageAssets.filter(a => a.type === '块存储').length,
      color: '#1890ff',
      status: 'normal',
      assets: storageAssets.filter(a => a.type === '块存储')
    },
    {
      type: '文件存储',
      count: storageAssets.filter(a => a.type === '文件存储').length,
      color: '#13c2c2',
      status: 'normal',
      assets: storageAssets.filter(a => a.type === '文件存储')
    }
  ]

  // 网络层分组
  const networkAssets = assets[AssetLayerType.NETWORK]
  result[AssetLayerType.NETWORK] = [
    {
      type: '负载均衡',
      count: networkAssets.filter(a => a.type === '负载均衡').length,
      color: '#fa8c16',
      status: 'normal',
      assets: networkAssets.filter(a => a.type === '负载均衡')
    },
    {
      type: 'VPN网关',
      count: networkAssets.filter(a => a.type === 'VPN网关').length,
      color: '#52c41a',
      status: 'normal',
      assets: networkAssets.filter(a => a.type === 'VPN网关')
    },
    {
      type: 'NAT网关',
      count: networkAssets.filter(a => a.type === 'NAT网关').length,
      color: '#1890ff',
      status: 'normal',
      assets: networkAssets.filter(a => a.type === 'NAT网关')
    },
    {
      type: 'CDN',
      count: networkAssets.filter(a => a.type === 'CDN').length,
      color: '#eb2f96',
      status: 'normal',
      assets: networkAssets.filter(a => a.type === 'CDN')
    }
  ]

  return result
}

/**
 * 生成依赖关系数据
 */
export function generateDependencyData(businessName: string): DependencyNode[] {
  return [
    {
      id: 'business-main',
      type: 'business',
      name: businessName,
      x: 300,
      y: 50,
      connections: ['web-app', 'payment-app', 'user-app']
    },
    {
      id: 'web-app',
      type: 'app',
      name: 'Web应用',
      x: 100,
      y: 150,
      connections: ['web-service', 'load-balancer']
    },
    {
      id: 'payment-app',
      type: 'app',
      name: '支付应用',
      x: 300,
      y: 150,
      connections: ['payment-service', 'payment-db']
    },
    {
      id: 'user-app',
      type: 'app',
      name: '用户应用',
      x: 500,
      y: 150,
      connections: ['user-service', 'user-db']
    },
    {
      id: 'web-service',
      type: 'service',
      name: 'Web服务',
      x: 50,
      y: 280,
      connections: ['app-server-1', 'app-server-2']
    },
    {
      id: 'payment-service',
      type: 'service',
      name: '支付服务',
      x: 250,
      y: 280,
      connections: ['payment-db', 'redis-cache']
    },
    {
      id: 'user-service',
      type: 'service',
      name: '用户服务',
      x: 450,
      y: 280,
      connections: ['user-db', 'redis-cache']
    },
    {
      id: 'load-balancer',
      type: 'resource',
      name: '负载均衡',
      x: 150,
      y: 380
    },
    {
      id: 'app-server-1',
      type: 'resource',
      name: '应用服务器1',
      x: 20,
      y: 400
    },
    {
      id: 'app-server-2',
      type: 'resource',
      name: '应用服务器2',
      x: 80,
      y: 430
    },
    {
      id: 'payment-db',
      type: 'database',
      name: '支付数据库',
      x: 250,
      y: 400
    },
    {
      id: 'user-db',
      type: 'database',
      name: '用户数据库',
      x: 450,
      y: 400
    },
    {
      id: 'redis-cache',
      type: 'resource',
      name: 'Redis缓存',
      x: 350,
      y: 430
    }
  ]
}

/**
 * 生成完整的全景视图数据
 */
export function generatePanoramaData(businessId: string, businessName: string): PanoramaData {
  const assetDetails = {
    [AssetLayerType.APPLICATION]: generateApplicationAssets(),
    [AssetLayerType.COMPUTE]: generateComputeAssets(),
    [AssetLayerType.STORAGE]: generateStorageAssets(),
    [AssetLayerType.NETWORK]: generateNetworkAssets()
  }

  return {
    businessInfo: generateBusinessInfo(businessId, businessName),
    responsibleInfo: generateResponsibleInfo(),
    layerStatistics: generateLayerStatistics(),
    honeycombData: generateHoneycombData(assetDetails),
    dependencyData: generateDependencyData(businessName),
    assetDetails
  }
}

/**
 * 资产状态标签映射
 */
export const assetStatusLabels: Record<AssetStatus, string> = {
  [AssetStatus.RUNNING]: '运行中',
  [AssetStatus.STOPPED]: '已停止',
  [AssetStatus.IDLE]: '空闲',
  [AssetStatus.ABNORMAL]: '异常'
}

/**
 * 层级标题映射
 */
export const layerTitles: Record<AssetLayerType, string> = {
  [AssetLayerType.APPLICATION]: '应用层',
  [AssetLayerType.COMPUTE]: '计算层资源',
  [AssetLayerType.STORAGE]: '存储层资源',
  [AssetLayerType.NETWORK]: '网络层资源'
}

/**
 * 层级图标映射
 */
export const layerIcons: Record<AssetLayerType, string> = {
  [AssetLayerType.APPLICATION]: 'AppstoreOutlined',
  [AssetLayerType.COMPUTE]: 'CloudServerOutlined',
  [AssetLayerType.STORAGE]: 'DatabaseOutlined',
  [AssetLayerType.NETWORK]: 'ApiOutlined'
}
