/**
 * 异常日志Mock数据生成器
 * 生成逼真的异常日志数据，包含真实的错误类型、堆栈跟踪等
 */

import dayjs from 'dayjs'
import type {
  AbnormalLogSummary,
  AbnormalLogDetail,
  AbnormalLogLevel,
  AbnormalLogCategory
} from '../pages/collaboration/asset-monitoring/types'
import { generateAssetsForSystem } from './asset-performance-data'

// 真实的错误消息模板
const errorMessageTemplates = {
  database: [
    'Connection pool exhausted: Unable to obtain connection from pool after 5000ms',
    'SQLException: Deadlock detected when trying to get lock; try restarting transaction',
    'Connection timeout: Failed to connect to database server at {host}:3306',
    'Too many connections: max_connections limit (500) reached',
    'SQL execution timeout: Query exceeded max execution time of 30 seconds',
    'Database connection lost: Communications link failure during query execution'
  ],
  network: [
    'SocketTimeoutException: Read timed out after 5000ms',
    'ConnectException: Connection refused by {system} at {host}:8080',
    'UnknownHostException: Unable to resolve hostname {host}',
    'HttpClientException: HTTP 503 Service Unavailable from upstream {system}',
    'SSLHandshakeException: Certificate validation failed for {host}',
    'NetworkException: Maximum retry attempts (3) exceeded for {system}'
  ],
  application: [
    'NullPointerException at {class}.{method}({file}:{line})',
    'IllegalArgumentException: Invalid parameter value: {param}',
    'ConcurrentModificationException in {class}.{method}',
    'OutOfMemoryError: Java heap space (current: 2048MB, max: 2048MB)',
    'StackOverflowError: Stack depth exceeded in recursive call',
    'ClassCastException: Cannot cast {type1} to {type2} at {class}'
  ],
  system: [
    'Disk space critical: Only 2% free on /data partition (98% used)',
    'High CPU usage detected: 95% utilization for 5 consecutive minutes',
    'Memory pressure: System memory usage at 92% (7.4GB/8GB)',
    'Too many open files: ulimit reached (1024 file descriptors)',
    'Process crashed: Segmentation fault (core dumped) in {process}',
    'Kernel panic: Unable to mount root filesystem on /dev/sda1'
  ],
  middleware: [
    'Redis connection failed: ECONNREFUSED {host}:6379',
    'Kafka consumer lag exceeded threshold: 50000 messages behind',
    'RabbitMQ queue overflow: {queue} reached max length (10000 messages)',
    'Nginx upstream server timeout: No response from backend after 60s',
    'Tomcat thread pool exhausted: All 200 threads busy, request queued',
    'ElasticSearch cluster health RED: 5 shards unassigned'
  ]
}

// 真实的Logger名称
const loggerNames = {
  database: [
    'com.zaxxer.hikari.pool.HikariPool',
    'org.hibernate.engine.jdbc.spi.SqlExceptionHelper',
    'com.alibaba.druid.pool.DruidDataSource',
    'org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator'
  ],
  network: [
    'org.apache.http.impl.client.DefaultHttpClient',
    'okhttp3.internal.connection.RealConnection',
    'java.net.HttpURLConnection',
    'org.springframework.web.client.RestTemplate'
  ],
  application: [
    'com.example.service.UserService',
    'com.example.controller.OrderController',
    'com.example.repository.ProductRepository',
    'com.example.util.DataValidator'
  ],
  system: [
    'java.lang.Runtime',
    'sun.misc.Launcher',
    'java.lang.management.MemoryMXBean'
  ],
  middleware: [
    'redis.clients.jedis.JedisPool',
    'org.apache.kafka.clients.consumer.KafkaConsumer',
    'com.rabbitmq.client.impl.AMQConnection',
    'org.elasticsearch.client.RestHighLevelClient'
  ]
}

// 真实的堆栈跟踪模板
const stackTraceTemplates = {
  database: `\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:186)
\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:145)
\tat com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:100)
\tat org.springframework.jdbc.datasource.DataSourceUtils.fetchConnection(DataSourceUtils.java:158)
\tat org.springframework.jdbc.core.JdbcTemplate.execute(JdbcTemplate.java:376)
\tat com.example.service.OrderService.createOrder(OrderService.java:127)
\tat com.example.controller.OrderController.placeOrder(OrderController.java:89)`,

  network: `\tat java.net.SocketInputStream.socketRead0(Native Method)
\tat java.net.SocketInputStream.socketRead(SocketInputStream.java:116)
\tat java.net.SocketInputStream.read(SocketInputStream.java:171)
\tat org.apache.http.impl.io.AbstractSessionInputBuffer.fillBuffer(AbstractSessionInputBuffer.java:161)
\tat org.apache.http.impl.io.SocketInputBuffer.fillBuffer(SocketInputBuffer.java:82)
\tat org.apache.http.impl.conn.DefaultHttpResponseParser.parseHead(DefaultHttpResponseParser.java:138)`,

  application: `\tat com.example.service.UserService.login(UserService.java:156)
\tat com.example.controller.AuthController.authenticate(AuthController.java:78)
\tat sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
\tat sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)`,

  middleware: `\tat redis.clients.jedis.Connection.connect(Connection.java:207)
\tat redis.clients.jedis.BinaryClient.connect(BinaryClient.java:93)
\tat redis.clients.jedis.Connection.sendCommand(Connection.java:126)
\tat redis.clients.jedis.BinaryClient.set(BinaryClient.java:109)
\tat com.example.cache.RedisCache.put(RedisCache.java:45)`
}

// 常见标签
const commonTags = {
  database: ['connection_pool', 'timeout', 'deadlock', 'slow_query'],
  network: ['timeout', 'connection_refused', 'dns_error', 'ssl_error'],
  application: ['npe', 'oom', 'stackoverflow', 'concurrent_modification'],
  system: ['disk_space', 'high_cpu', 'memory_pressure', 'file_descriptor'],
  middleware: ['redis', 'kafka', 'rabbitmq', 'elasticsearch', 'connection_failed']
}

/**
 * 生成异常日志数据
 */
export function generateAbnormalLogsForSystem(
  systemId: string,
  systemName: string,
  options: {
    hoursBack?: number       // 生成多少小时前的数据
    errorRate?: number       // ERROR比例（0-1）
    totalCount?: number      // 总日志数
  } = {}
): {
  summary: AbnormalLogSummary
  logs: AbnormalLogDetail[]
} {
  const {
    hoursBack = 24,
    errorRate = 0.3, // 30% ERROR, 70% WARN
    totalCount = 100
  } = options

  // 获取系统的资产列表
  const assets = generateAssetsForSystem(systemId, systemName)

  // 生成日志详情
  const logs: AbnormalLogDetail[] = []
  const now = dayjs()

  // 生成时段分布（用于统计）
  const hourlyStats = new Map<string, { error: number; warn: number }>()

  for (let i = 0; i < totalCount; i++) {
    // 随机时间（最近N小时内）
    const minutesAgo = Math.floor(Math.random() * hoursBack * 60)
    const timestamp = now.subtract(minutesAgo, 'minute').format('YYYY-MM-DD HH:mm:ss')
    const hour = now.subtract(minutesAgo, 'minute').format('YYYY-MM-DD HH:00:00')

    // 随机选择资产
    const asset = assets[Math.floor(Math.random() * assets.length)]

    // 随机选择日志级别
    const level: AbnormalLogLevel = Math.random() < errorRate ? 'ERROR' : 'WARN'

    // 根据资产类型选择异常分类
    const category = selectCategoryByAssetType(asset.type)

    // 生成日志消息
    const messageTemplate = errorMessageTemplates[category][
      Math.floor(Math.random() * errorMessageTemplates[category].length)
    ]
    const message = interpolateMessage(messageTemplate, systemName, asset.name)

    // 生成Logger名称
    const loggerName = loggerNames[category][
      Math.floor(Math.random() * loggerNames[category].length)
    ]

    // 生成堆栈跟踪（仅ERROR级别）
    const stackTrace = level === 'ERROR' ? stackTraceTemplates[category] : undefined

    // 生成标签
    const tags = [
      commonTags[category][Math.floor(Math.random() * commonTags[category].length)],
      commonTags[category][Math.floor(Math.random() * commonTags[category].length)]
    ].filter((v, i, a) => a.indexOf(v) === i) // 去重

    // 生成TraceID
    const traceId = `trace-${systemId.slice(0, 8)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

    logs.push({
      id: `log-${systemId}-${i}-${Date.now()}`,
      level,
      timestamp,
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      message,
      loggerName,
      stackTrace,
      category,
      tags,
      traceId,
      relatedAlertId: Math.random() > 0.8 ? `alert-${Math.random().toString(36).slice(2, 10)}` : undefined,
      relatedSystemId: Math.random() > 0.7 ? generateRandomSystemId() : undefined,
      relatedSystemName: Math.random() > 0.7 ? generateRandomSystemName() : undefined
    })

    // 统计时段分布
    if (!hourlyStats.has(hour)) {
      hourlyStats.set(hour, { error: 0, warn: 0 })
    }
    const stats = hourlyStats.get(hour)!
    if (level === 'ERROR') {
      stats.error++
    } else {
      stats.warn++
    }
  }

  // 按时间倒序排列（最新的在前）
  logs.sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())

  // 生成时段分布数据
  const trendData = Array.from(hourlyStats.entries())
    .map(([timestamp, stats]) => ({
      timestamp,
      errorCount: stats.error,
      warningCount: stats.warn
    }))
    .sort((a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf())

  // 统计TOP资产
  const assetStatsMap = new Map<string, {
    assetId: string
    assetName: string
    assetType: string
    count: number
    lastTime: string
  }>()

  logs.forEach(log => {
    if (!assetStatsMap.has(log.assetId)) {
      assetStatsMap.set(log.assetId, {
        assetId: log.assetId,
        assetName: log.assetName,
        assetType: log.assetType,
        count: 0,
        lastTime: log.timestamp
      })
    }
    const stats = assetStatsMap.get(log.assetId)!
    stats.count++
    if (dayjs(log.timestamp).isAfter(dayjs(stats.lastTime))) {
      stats.lastTime = log.timestamp
    }
  })

  const topAffectedAssets = Array.from(assetStatsMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(stats => ({
      assetId: stats.assetId,
      assetName: stats.assetName,
      assetType: stats.assetType,
      abnormalCount: stats.count,
      lastAbnormalTime: stats.lastTime
    }))

  // 统计关联系统
  const systemStatsMap = new Map<string, { systemId: string; systemName: string; count: number }>()
  logs.forEach(log => {
    if (log.relatedSystemId && log.relatedSystemName) {
      if (!systemStatsMap.has(log.relatedSystemId)) {
        systemStatsMap.set(log.relatedSystemId, {
          systemId: log.relatedSystemId,
          systemName: log.relatedSystemName,
          count: 0
        })
      }
      systemStatsMap.get(log.relatedSystemId)!.count++
    }
  })

  const relatedSystemsStats = Array.from(systemStatsMap.values())
    .sort((a, b) => b.count - a.count)
    .map(stats => ({
      systemId: stats.systemId,
      systemName: stats.systemName,
      logCount: stats.count,
      isUpstream: Math.random() > 0.5 // 随机判断是上游还是下游
    }))

  // 统计汇总
  const errorCount = logs.filter(log => log.level === 'ERROR').length
  const warningCount = logs.filter(log => log.level === 'WARN').length

  const summary: AbnormalLogSummary = {
    errorCount,
    warningCount,
    total: errorCount + warningCount,
    trendData,
    topAffectedAssets,
    relatedSystemsStats
  }

  return { summary, logs }
}

/**
 * 根据资产类型选择异常分类
 */
function selectCategoryByAssetType(assetType: string): AbnormalLogCategory {
  if (assetType.includes('数据库') || assetType.includes('DB') || assetType.includes('MySQL')) {
    return 'database'
  }
  if (assetType.includes('网络') || assetType.includes('路由') || assetType.includes('交换机')) {
    return 'network'
  }
  if (assetType.includes('Redis') || assetType.includes('Kafka') || assetType.includes('消息')) {
    return 'middleware'
  }
  if (assetType.includes('服务器') || assetType.includes('主机')) {
    const rand = Math.random()
    if (rand < 0.4) return 'application'
    if (rand < 0.7) return 'system'
    return 'database'
  }
  return 'application'
}

/**
 * 插值消息模板
 */
function interpolateMessage(template: string, systemName: string, assetName: string): string {
  return template
    .replace('{system}', systemName)
    .replace('{host}', assetName)
    .replace('{class}', 'com.example.service.' + ['User', 'Order', 'Product', 'Payment'][Math.floor(Math.random() * 4)] + 'Service')
    .replace('{method}', ['process', 'execute', 'handle', 'validate'][Math.floor(Math.random() * 4)])
    .replace('{file}', ['UserService.java', 'OrderController.java', 'DataProcessor.java'][Math.floor(Math.random() * 3)])
    .replace('{line}', String(Math.floor(Math.random() * 500) + 100))
    .replace('{param}', ['userId', 'orderId', 'amount', 'status'][Math.floor(Math.random() * 4)])
    .replace('{type1}', 'java.lang.String')
    .replace('{type2}', 'java.lang.Integer')
    .replace('{process}', 'java')
    .replace('{queue}', 'order-processing-queue')
}

/**
 * 生成随机系统ID
 */
function generateRandomSystemId(): string {
  const systems = ['sys-user-center', 'sys-payment-gateway', 'sys-inventory', 'sys-notification', 'sys-logistics']
  return systems[Math.floor(Math.random() * systems.length)]
}

/**
 * 生成随机系统名称
 */
function generateRandomSystemName(): string {
  const names = ['用户中心', '支付网关', '库存中心', '消息通知', '物流查询']
  return names[Math.floor(Math.random() * names.length)]
}
