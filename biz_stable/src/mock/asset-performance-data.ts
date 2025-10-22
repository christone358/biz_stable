/**
 * 资产性能监控数据生成器
 */

import dayjs from 'dayjs'
import { AssetLayerType, AssetDeviceInfo } from '../pages/management/business-monitoring/components/AssetTree/types'
import { AssetStatus } from '../pages/management/asset-management/panorama-types'

// 时序数据点
export interface TimeSeriesData {
  timestamp: string
  value: number
}

// 时间范围
export interface TimeRange {
  label: string
  value: string
  hours: number
}

// 资产性能数据
export interface AssetPerformanceData {
  assetId: string
  assetName: string
  assetType: string
  layer: AssetLayerType
  timeRange: TimeRange
  metrics: {
    cpu?: TimeSeriesData[]
    memory?: TimeSeriesData[]
    diskIO?: TimeSeriesData[]
    networkTraffic?: TimeSeriesData[]
    qps?: TimeSeriesData[]
    connections?: TimeSeriesData[]
    responseTime?: TimeSeriesData[]
    errorRate?: TimeSeriesData[]
    throughput?: TimeSeriesData[]
    requestCount?: TimeSeriesData[]
  }
}

/**
 * 生成时序数据
 * @param timeRange 时间范围
 * @param baseValue 基准值
 * @param variance 波动幅度
 * @param trend 趋势系数（-1到1，负数下降，正数上升）
 */
function generateTimeSeries(
  timeRange: TimeRange,
  baseValue: number,
  variance: number,
  trend: number = 0
): TimeSeriesData[] {
  const points: TimeSeriesData[] = []
  const now = dayjs()
  const hours = timeRange.hours
  const pointsCount = hours * 12 // 每5分钟一个点

  for (let i = 0; i < pointsCount; i++) {
    const timestamp = now.subtract(hours * 60 - i * 5, 'minute').toISOString()

    // 基础随机波动
    const randomFactor = (Math.random() - 0.5) * variance

    // 趋势因素（随时间增加或减少）
    const trendFactor = (i / pointsCount) * trend * baseValue

    // 周期性波动（模拟日常业务高峰低谷）
    const hour = (24 - hours + Math.floor(i * 5 / 60)) % 24
    const periodicFactor = Math.sin((hour - 6) / 24 * Math.PI * 2) * variance * 0.3

    let value = baseValue + randomFactor + trendFactor + periodicFactor
    value = Math.max(0, value) // 确保非负

    points.push({ timestamp, value })
  }

  return points
}

/**
 * 为计算资源生成性能数据
 */
function generateComputeMetrics(
  asset: AssetDeviceInfo,
  timeRange: TimeRange
): AssetPerformanceData['metrics'] {
  // 根据资产状态调整基准值
  const statusFactor = asset.status === AssetStatus.ABNORMAL ? 1.5 :
                       asset.status === AssetStatus.RUNNING ? 1.0 : 0.3

  return {
    cpu: generateTimeSeries(timeRange, 45 * statusFactor, 20, 0.1),
    memory: generateTimeSeries(timeRange, 60 * statusFactor, 15, 0.05),
    diskIO: generateTimeSeries(timeRange, 300, 150, 0),
    networkTraffic: generateTimeSeries(timeRange, 500, 200, 0),
    responseTime: generateTimeSeries(timeRange, 120 * statusFactor, 50, 0),
    throughput: generateTimeSeries(timeRange, 1000 / statusFactor, 300, 0)
  }
}

/**
 * 为存储资源生成性能数据
 */
function generateStorageMetrics(
  asset: AssetDeviceInfo,
  timeRange: TimeRange
): AssetPerformanceData['metrics'] {
  const statusFactor = asset.status === AssetStatus.ABNORMAL ? 1.5 :
                       asset.status === AssetStatus.RUNNING ? 1.0 : 0.3

  return {
    cpu: generateTimeSeries(timeRange, 35 * statusFactor, 15, 0),
    memory: generateTimeSeries(timeRange, 70 * statusFactor, 10, 0.02),
    qps: generateTimeSeries(timeRange, 2000 / statusFactor, 800, 0),
    connections: generateTimeSeries(timeRange, 150, 50, 0),
    responseTime: generateTimeSeries(timeRange, 80 * statusFactor, 30, 0),
    errorRate: generateTimeSeries(timeRange, 0.5 * statusFactor, 0.3, 0)
  }
}

/**
 * 为网络资源生成性能数据
 */
function generateNetworkMetrics(
  asset: AssetDeviceInfo,
  timeRange: TimeRange
): AssetPerformanceData['metrics'] {
  const statusFactor = asset.status === AssetStatus.ABNORMAL ? 1.5 :
                       asset.status === AssetStatus.RUNNING ? 1.0 : 0.3

  return {
    throughput: generateTimeSeries(timeRange, 5000 / statusFactor, 1500, 0),
    connections: generateTimeSeries(timeRange, 500, 200, 0),
    errorRate: generateTimeSeries(timeRange, 0.2 * statusFactor, 0.15, 0),
    responseTime: generateTimeSeries(timeRange, 50 * statusFactor, 20, 0),
    networkTraffic: generateTimeSeries(timeRange, 8000, 2000, 0),
    requestCount: generateTimeSeries(timeRange, 3000, 1000, 0)
  }
}

/**
 * 生成资产性能数据
 */
export function generateAssetPerformanceData(
  asset: AssetDeviceInfo,
  timeRange: TimeRange
): AssetPerformanceData {
  let metrics: AssetPerformanceData['metrics'] = {}

  switch (asset.layer) {
    case AssetLayerType.COMPUTE:
      metrics = generateComputeMetrics(asset, timeRange)
      break
    case AssetLayerType.STORAGE:
      metrics = generateStorageMetrics(asset, timeRange)
      break
    case AssetLayerType.NETWORK:
      metrics = generateNetworkMetrics(asset, timeRange)
      break
  }

  return {
    assetId: asset.id,
    assetName: asset.name,
    assetType: asset.type,
    layer: asset.layer,
    timeRange,
    metrics
  }
}

/**
 * 为业务系统生成资产列表
 */
export function generateAssetsForSystem(systemId: string, systemName: string): AssetDeviceInfo[] {
  const assets: AssetDeviceInfo[] = []

  // 生成计算资源（3-5个）
  const computeCount = 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < computeCount; i++) {
    const types = ['Web服务器', '应用服务器', '任务服务器']
    const typeIndex = i % types.length
    assets.push({
      id: `${systemId}-compute-${i + 1}`,
      name: `${types[typeIndex]}-${String(i + 1).padStart(2, '0')}`,
      ip: `10.0.${1 + typeIndex}.${10 + i}`,
      type: types[typeIndex],
      status: i === 0 && Math.random() > 0.8 ? AssetStatus.ABNORMAL : AssetStatus.RUNNING,
      layer: AssetLayerType.COMPUTE,
      specs: '16C32G'
    })
  }

  // 生成存储资源（2-4个）
  const storageTypes = [
    { type: 'MySQL主库', ip: '10.0.10.10' },
    { type: 'MySQL从库', ip: '10.0.10.11' },
    { type: 'Redis缓存', ip: '10.0.11.10' },
    { type: 'MongoDB', ip: '10.0.12.10' }
  ]
  const storageCount = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < storageCount; i++) {
    const storageInfo = storageTypes[i]
    assets.push({
      id: `${systemId}-storage-${i + 1}`,
      name: storageInfo.type,
      ip: storageInfo.ip,
      type: storageInfo.type,
      status: AssetStatus.RUNNING,
      layer: AssetLayerType.STORAGE,
      specs: '8C16G 500GB SSD'
    })
  }

  // 生成网络资源（1-2个）
  const networkTypes = [
    { type: '负载均衡器', ip: '10.0.0.10' },
    { type: '核心交换机', ip: '10.0.0.1' }
  ]
  const networkCount = 1 + Math.floor(Math.random() * 2)
  for (let i = 0; i < networkCount; i++) {
    const networkInfo = networkTypes[i]
    assets.push({
      id: `${systemId}-network-${i + 1}`,
      name: networkInfo.type,
      ip: networkInfo.ip,
      type: networkInfo.type,
      status: AssetStatus.RUNNING,
      layer: AssetLayerType.NETWORK,
      specs: '10Gbps'
    })
  }

  return assets
}

/**
 * 为业务系统生成资产组成数据（包含详细信息）
 */
export function generateAssetCompositionData(
  systemId: string,
  systemName: string
): any {
  // 复用基础资产列表
  const baseAssets = generateAssetsForSystem(systemId, systemName)

  // 生成详细资产信息
  const detailedAssets = baseAssets.map((asset, index) => {
    const owners = ['张三', '李四', '王五', '赵六', '钱七']
    const orgs = ['基础架构部', '研发中心', '运维团队']

    return {
      ...asset,
      address: asset.ip,  // 将ip映射为address
      config: asset.specs || '',  // 将specs映射为config
      owner: owners[index % owners.length],
      ownerOrg: orgs[index % orgs.length],
      ownerPhone: `138****${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      specs: {
        cpu: asset.layer === AssetLayerType.COMPUTE ? '16核' : '8核',
        memory: asset.layer === AssetLayerType.COMPUTE ? '32GB' : '16GB',
        disk: asset.layer === AssetLayerType.STORAGE ? '500GB SSD' : '200GB SSD',
        network: asset.layer === AssetLayerType.NETWORK ? '10Gbps' : '1Gbps'
      },
      metrics: {
        cpuUsage: 30 + Math.random() * 50,
        memoryUsage: 40 + Math.random() * 40,
        diskUsage: 30 + Math.random() * 40,
        networkTraffic: Math.random() * 500
      },
      operationLogs: [
        {
          id: `log-${index}-1`,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString().slice(0, 16).replace('T', ' '),
          action: '启动服务',
          operator: owners[index % owners.length],
          description: '系统正常启动'
        },
        {
          id: `log-${index}-2`,
          timestamp: new Date(Date.now() - Math.random() * 172800000).toISOString().slice(0, 16).replace('T', ' '),
          action: '配置变更',
          operator: owners[index % owners.length],
          description: '更新配置文件'
        }
      ].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    }
  })

  // 按层级分类
  const compute = detailedAssets.filter(a => a.layer === AssetLayerType.COMPUTE)
  const storage = detailedAssets.filter(a => a.layer === AssetLayerType.STORAGE)
  const network = detailedAssets.filter(a => a.layer === AssetLayerType.NETWORK)

  // 计算统计
  const calculateStats = (assets: typeof detailedAssets) => ({
    total: assets.length,
    running: assets.filter(a => a.status === AssetStatus.RUNNING).length,
    abnormal: assets.filter(a => a.status === AssetStatus.ABNORMAL).length,
    stopped: assets.filter(a => a.status === AssetStatus.STOPPED).length
  })

  return {
    systemId,
    systemName,
    statistics: {
      total: {
        total: detailedAssets.length,
        running: detailedAssets.filter(a => a.status === AssetStatus.RUNNING).length,
        abnormal: detailedAssets.filter(a => a.status === AssetStatus.ABNORMAL).length,
        stopped: detailedAssets.filter(a => a.status === AssetStatus.STOPPED).length,
        monthlyChange: Math.floor(Math.random() * 10) - 3
      },
      compute: calculateStats(compute),
      storage: calculateStats(storage),
      network: calculateStats(network)
    },
    assets: {
      all: detailedAssets,
      compute,
      storage,
      network
    }
  }
}
