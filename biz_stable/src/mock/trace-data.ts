/**
 * 链路追踪Mock数据生成器
 * 参考New Relic、Datadog、AWS X-Ray的数据结构
 */

import type {
  TraceListItem,
  TraceDetail,
  TraceSpan,
  TraceStatus,
  ProtocolStatus,
  CallRole,
  AbnormalLogDetail
} from '../pages/collaboration/asset-monitoring/types'

// 服务名称池
const serviceNames = [
  'java-gateway-service',
  'java-order-service',
  'java-payment-service',
  'java-inventory-service',
  'java-user-service',
  'python-recommendation-service',
  'python-analytics-service',
  'node-notification-service',
  'go-auth-service'
]

// 接口路径模板
const endpointTemplates = {
  gateway: [
    'GET /api/v1/orders/{orderId}',
    'POST /api/v1/orders',
    'GET /api/v1/users/{userId}/profile',
    'POST /api/v1/payments',
    'GET /api/v1/products/search'
  ],
  order: [
    'GET /order/mockGenerated',
    'POST /order/create',
    'GET /order/mockRepeatedCall',
    'PUT /order/{id}/status',
    'DELETE /order/{id}'
  ],
  payment: [
    'POST /payment/process',
    'GET /payment/{id}/status',
    'POST /payment/refund'
  ],
  user: [
    'GET /user/{id}',
    'POST /user/register',
    'PUT /user/{id}/profile'
  ]
}

// 内部方法调用模板
const internalOperations = {
  order: [
    'OrderService.createOrder',
    'OrderService.validateOrder',
    'OrderRepository.save',
    'OrderService.getOrderById',
    'OrderController.generateOrder'
  ],
  payment: [
    'PaymentService.processPayment',
    'PaymentGateway.charge',
    'PaymentRepository.saveTransaction'
  ],
  database: [
    'SELECT FROM orders WHERE id = ?',
    'INSERT INTO orders (id, user_id, amount) VALUES (?, ?, ?)',
    'UPDATE orders SET status = ? WHERE id = ?',
    'SELECT FROM users WHERE id = ?'
  ],
  cache: [
    'Redis.get(user:12345)',
    'Redis.set(order:67890, ...)',
    'Memcached.get(product:111)'
  ]
}

// 错误消息模板
const errorMessages = {
  database: [
    'Connection pool exhausted',
    'Deadlock detected when trying to get lock',
    'Query timeout after 5000ms'
  ],
  network: [
    'Connection refused by remote service',
    'Read timed out after 3000ms',
    'DNS resolution failed for service-host'
  ],
  application: [
    '配送失败',
    'Invalid order status transition',
    'Payment gateway returned error code 502',
    'Insufficient inventory for product SKU12345'
  ]
}

/**
 * 生成随机TraceID (32位16进制)
 */
function generateTraceId(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

/**
 * 生成随机SpanID (16位16进制)
 */
function generateSpanId(): string {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

/**
 * 生成IP地址
 */
function generateIP(): string {
  return `10.6.0.${Math.floor(Math.random() * 254) + 1}`
}

/**
 * 生成主机名
 */
function generateHostname(serviceName: string): string {
  const idx = Math.floor(Math.random() * 5) + 1
  return `${serviceName}-${idx}`
}

/**
 * 生成时间戳范围
 */
function generateTimeRange(baseTime: Date, durationMs: number): { start: string; end: string } {
  const startTime = new Date(baseTime)
  const endTime = new Date(baseTime.getTime() + durationMs)
  return {
    start: startTime.toISOString(),
    end: endTime.toISOString()
  }
}

/**
 * 构建Span树结构
 */
function buildSpanTree(spans: TraceSpan[]): TraceSpan[] {
  const spanMap = new Map<string, TraceSpan>()
  const rootSpans: TraceSpan[] = []

  // 第一遍：建立映射
  spans.forEach(span => {
    spanMap.set(span.spanId, { ...span, children: [] })
  })

  // 第二遍：构建树
  spans.forEach(span => {
    const node = spanMap.get(span.spanId)!
    if (span.parentSpanId === null) {
      rootSpans.push(node)
    } else {
      const parent = spanMap.get(span.parentSpanId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    }
  })

  return rootSpans
}

/**
 * 生成单个Trace的完整数据
 */
export function generateTraceDetail(
  systemId: string,
  systemName: string,
  options: {
    hasError?: boolean
    errorRate?: number
  } = {}
): TraceDetail {
  const { hasError = Math.random() < 0.3, errorRate = 0.3 } = options

  const traceId = generateTraceId()
  const baseTime = new Date(Date.now() - Math.random() * 3600000) // 最近1小时内

  // 决定调用链深度和广度
  const rootService = 'java-gateway-service'
  const endpoint = endpointTemplates.gateway[Math.floor(Math.random() * endpointTemplates.gateway.length)]

  const spans: TraceSpan[] = []
  let currentTime = baseTime.getTime()
  let totalDuration = 0
  let errorCount = 0

  // Root Span (Gateway入口)
  const rootSpanId = generateSpanId()
  const gatewayDuration = Math.random() * 50 + 10 // 10-60ms自身耗时

  // 子服务调用链
  const orderSpanId = generateSpanId()
  const orderDuration = Math.random() * 150 + 50 // 50-200ms

  const paymentSpanId = generateSpanId()
  const paymentDuration = Math.random() * 200 + 100 // 100-300ms

  // 是否有数据库调用
  const hasDBCall = Math.random() < 0.8
  const dbSpanId = hasDBCall ? generateSpanId() : ''
  const dbDuration = hasDBCall ? Math.random() * 30 + 5 : 0 // 5-35ms

  // 计算总耗时
  totalDuration = Math.max(
    gatewayDuration + orderDuration,
    gatewayDuration + paymentDuration
  ) + (hasDBCall ? dbDuration : 0)

  // 决定哪个Span出错(如果hasError=true)
  const errorSpanIndex = hasError ? Math.floor(Math.random() * 4) : -1

  // 1. Root Span - Gateway
  const gatewayTime = generateTimeRange(new Date(currentTime), gatewayDuration)
  spans.push({
    spanId: rootSpanId,
    parentSpanId: null,
    traceId,
    serviceName: rootService,
    operation: endpoint,
    callRole: 'Server',
    startTime: gatewayTime.start,
    endTime: gatewayTime.end,
    duration: gatewayDuration,
    status: errorSpanIndex === 0 ? 'ERROR' : 'OK',
    protocolStatus: errorSpanIndex === 0 ? 'HTTP_500' : 'HTTP_200',
    tags: {
      'http.method': endpoint.split(' ')[0],
      'http.url': endpoint.split(' ')[1],
      'http.status_code': errorSpanIndex === 0 ? '500' : '200'
    },
    resource: {
      hostname: generateHostname(rootService),
      ip: generateIP(),
      version: '1.0.0'
    }
  })

  // 2. Order Service Span
  currentTime += gatewayDuration
  const orderTime = generateTimeRange(new Date(currentTime), orderDuration)
  const orderHasError = errorSpanIndex === 1
  if (orderHasError) errorCount++

  spans.push({
    spanId: orderSpanId,
    parentSpanId: rootSpanId,
    traceId,
    serviceName: 'java-order-service',
    operation: 'GET /order/mockGenerated',
    callRole: 'Server',
    startTime: orderTime.start,
    endTime: orderTime.end,
    duration: orderDuration,
    status: orderHasError ? 'ERROR' : 'OK',
    protocolStatus: orderHasError ? 'HTTP_500' : 'HTTP_200',
    tags: {
      'http.method': 'GET',
      'http.url': '/order/mockGenerated',
      'http.status_code': orderHasError ? '500' : '200'
    },
    resource: {
      hostname: generateHostname('java-order-service'),
      ip: generateIP(),
      version: '10.6.0.252'
    },
    error: orderHasError ? {
      message: '配送失败',
      type: 'com.tencent.cloudmonitor.common.exception.DeliveryException',
      stacktrace: `com.tencent.cloudmonitor.common.exception.DeliveryException: 配送失败
    at com.tencent.cloudmonitor.orderservice.domain.service.OrderService.<clinit>(OrderService.java:240)
    at java.base/java.lang.Class.forName0(Native Method)
    at java.base/java.lang.Class.forName(Class.java:375)
    at com.tencent.cloudmonitor.orderservice.controller.OrderController.generateOrder(OrderController.java:52)`
    } : undefined
  })

  // 3. Internal Operation Span (OrderService内部调用)
  const orderInternalSpanId = generateSpanId()
  const orderInternalDuration = Math.random() * 20 + 5
  const orderInternalTime = generateTimeRange(new Date(currentTime + 10), orderInternalDuration)

  spans.push({
    spanId: orderInternalSpanId,
    parentSpanId: orderSpanId,
    traceId,
    serviceName: 'java-order-service',
    operation: 'OrderController.generateOrder',
    callRole: 'Internal',
    startTime: orderInternalTime.start,
    endTime: orderInternalTime.end,
    duration: orderInternalDuration,
    status: 'OK',
    tags: {
      'component': 'spring-mvc',
      'span.kind': 'internal'
    },
    resource: {
      hostname: generateHostname('java-order-service'),
      ip: generateIP()
    }
  })

  // 4. Database Span (if applicable)
  if (hasDBCall) {
    currentTime += orderInternalDuration
    const dbTime = generateTimeRange(new Date(currentTime), dbDuration)
    const dbHasError = errorSpanIndex === 2
    if (dbHasError) errorCount++

    spans.push({
      spanId: dbSpanId,
      parentSpanId: orderInternalSpanId,
      traceId,
      serviceName: 'mysql-master',
      operation: 'SELECT FROM orders WHERE id = ?',
      callRole: 'Client',
      startTime: dbTime.start,
      endTime: dbTime.end,
      duration: dbDuration,
      status: dbHasError ? 'ERROR' : 'OK',
      tags: {
        'db.type': 'mysql',
        'db.instance': 'order_db',
        'db.statement': 'SELECT * FROM orders WHERE id = ?',
        'db.user': 'app_user'
      },
      resource: {
        hostname: 'mysql-master-1',
        ip: '10.6.1.15'
      },
      error: dbHasError ? {
        message: 'Deadlock detected when trying to get lock',
        type: 'java.sql.SQLException',
        stacktrace: `java.sql.SQLException: Deadlock detected when trying to get lock
    at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:129)
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:186)`
      } : undefined
    })
  }

  // 5. Payment Service Span (并行调用)
  const paymentTime = generateTimeRange(new Date(baseTime.getTime() + gatewayDuration), paymentDuration)
  const paymentHasError = errorSpanIndex === 3
  if (paymentHasError) errorCount++

  spans.push({
    spanId: paymentSpanId,
    parentSpanId: rootSpanId,
    traceId,
    serviceName: 'java-payment-service',
    operation: 'POST /payment/process',
    callRole: 'Server',
    startTime: paymentTime.start,
    endTime: paymentTime.end,
    duration: paymentDuration,
    status: paymentHasError ? 'ERROR' : 'OK',
    protocolStatus: paymentHasError ? 'HTTP_503' : 'HTTP_200',
    tags: {
      'http.method': 'POST',
      'http.url': '/payment/process'
    },
    resource: {
      hostname: generateHostname('java-payment-service'),
      ip: generateIP()
    },
    error: paymentHasError ? {
      message: 'Payment gateway timeout',
      type: 'java.net.SocketTimeoutException',
      stacktrace: `java.net.SocketTimeoutException: Read timed out
    at java.base/java.net.SocketInputStream.socketRead0(Native Method)
    at java.base/java.net.SocketInputStream.socketRead(SocketInputStream.java:115)`
    } : undefined
  })

  // 构建树结构
  const spanTree = buildSpanTree(spans)

  return {
    traceId,
    serviceName: rootService,
    endpoint,
    status: errorCount > 0 ? 'error' : 'success',
    duration: totalDuration,
    startTime: baseTime.toISOString(),
    endTime: new Date(baseTime.getTime() + totalDuration).toISOString(),
    spanCount: spans.length,
    errorCount,
    spans: spanTree,
    relatedSystems: Array.from(new Set(spans.map(s => s.serviceName)))
  }
}

/**
 * 生成Trace列表数据
 */
export function generateTraceList(
  systemId: string,
  systemName: string,
  options: {
    count?: number
    errorRate?: number
    timeRangeHours?: number
  } = {}
): TraceListItem[] {
  const { count = 200, errorRate = 0.35, timeRangeHours = 1 } = options

  const traces: TraceListItem[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const traceId = generateTraceId()
    const spanId = generateSpanId()

    // 随机时间分布
    const randomTime = now - Math.random() * timeRangeHours * 3600000
    const startTime = new Date(randomTime).toISOString()

    // 随机服务和接口
    const serviceName = serviceNames[Math.floor(Math.random() * serviceNames.length)]
    const endpointList = Object.values(endpointTemplates).flat()
    const endpoint = endpointList[Math.floor(Math.random() * endpointList.length)]

    // 随机耗时 (大部分在100-300ms,少数异常值)
    const isSlowTrace = Math.random() < 0.15
    const duration = isSlowTrace
      ? Math.random() * 5000 + 1000  // 1-6秒(慢请求)
      : Math.random() * 200 + 50      // 50-250ms(正常)

    // 错误状态
    const hasError = Math.random() < errorRate
    const status: TraceStatus = hasError ? 'error' : 'success'
    const protocolStatus: ProtocolStatus = hasError
      ? (Math.random() < 0.5 ? 'HTTP_500' : 'HTTP_503')
      : 'HTTP_200'

    // Span数量(3-15个)
    const spanCount = Math.floor(Math.random() * 12) + 3
    const errorCount = hasError ? Math.floor(Math.random() * 3) + 1 : 0

    // 是否有关联日志
    const hasLogs = hasError || Math.random() < 0.2
    const logCount = hasLogs ? Math.floor(Math.random() * 10) + 1 : 0

    // 调用角色
    const callRole: CallRole = 'Server'

    traces.push({
      traceId,
      spanId,
      status,
      protocolStatus,
      serviceName,
      endpoint,
      callRole,
      duration: parseFloat(duration.toFixed(3)),
      spanCount,
      errorCount,
      startTime,
      hasLogs,
      logCount
    })
  }

  // 按时间倒序排序
  return traces.sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )
}

/**
 * 关联异常日志和Trace (为已有日志添加TraceID)
 */
export function correlateLogsWithTraces(
  logs: AbnormalLogDetail[],
  traces: TraceListItem[]
): AbnormalLogDetail[] {
  // 30%的ERROR日志关联Trace, 10%的WARN日志关联Trace
  return logs.map(log => {
    const shouldCorrelate = log.level === 'ERROR'
      ? Math.random() < 0.7  // 70%的ERROR日志有TraceID
      : Math.random() < 0.3  // 30%的WARN日志有TraceID

    if (shouldCorrelate && traces.length > 0) {
      // 找一个时间接近的错误Trace
      const errorTraces = traces.filter(t => t.status === 'error')
      const randomTrace = errorTraces.length > 0
        ? errorTraces[Math.floor(Math.random() * errorTraces.length)]
        : traces[Math.floor(Math.random() * traces.length)]

      return {
        ...log,
        traceId: randomTrace.traceId,
        spanId: generateSpanId()
      }
    }

    return log
  })
}
