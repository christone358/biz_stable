import React, { useMemo } from 'react'
import { Card, Row, Col, Progress, Statistic, Tag } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import type { ApplicationKPIs, PerformanceMetrics } from '../../types'
import './OperationMetrics.css'

interface OperationMetricsProps {
  kpis: ApplicationKPIs
  performance: PerformanceMetrics
}

/**
 * 运行指标Tab - 紧凑型布局
 * 集中展示KPI指标、实时监控数据和性能趋势图表
 */
const OperationMetrics: React.FC<OperationMetricsProps> = ({ kpis, performance }) => {

  // 获取最新的性能数据
  const latestMetrics = useMemo(() => {
    const getLatest = (data: any[]) => data[data.length - 1]?.value || 0
    return {
      cpu: getLatest(performance.cpu),
      memory: getLatest(performance.memory),
      responseTime: getLatest(performance.responseTime),
      errorRate: getLatest(performance.errorRate),
      throughput: getLatest(performance.throughput),
      requestCount: getLatest(performance.requestCount)
    }
  }, [performance])

  // 生成扩展的监控指标
  const extendedMetrics = useMemo(() => {
    return {
      diskUsage: 68.5,
      diskIO: 45.2,
      networkIn: 125.8,
      networkOut: 89.3,
      connections: 1250,
      cacheHitRate: 94.8,
      dbConnPool: 72.3,
      queueDepth: 156,
      gcCount: 12,
      gcTime: 245,
      activeUsers: 3580,
      activeSessions: 2156
    }
  }, [])

  // 迷你图表配置生成器
  const getMiniChartOption = (data: number[], color: string, max?: number) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false, max: max || 'dataMax' },
    series: [{
      type: 'line',
      data: data,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: color + '40' },
            { offset: 1, color: color + '05' }
          ]
        }
      }
    }]
  })

  // 紧凑型性能图表配置
  const getCompactChartOption = (title: string, data: any[], unit: string, color: string) => ({
    title: {
      text: title,
      left: 'center',
      top: 5,
      textStyle: { fontSize: 13, fontWeight: 500 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const time = dayjs(params[0].name).format('HH:mm')
        return `${time}<br/>${title}: ${params[0].value.toFixed(2)}${unit}`
      }
    },
    grid: { left: 45, right: 15, bottom: 25, top: 35 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.timestamp),
      axisLabel: { fontSize: 10, formatter: (value: string) => dayjs(value).format('HH:mm') }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, formatter: `{value}${unit}` }
    },
    series: [{
      type: 'line',
      data: data.map(d => d.value),
      smooth: true,
      lineStyle: { width: 2, color },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: color + '30' },
            { offset: 1, color: color + '05' }
          ]
        }
      }
    }]
  })

  // 趋势指示器
  const TrendIndicator = ({ value, inverse = false }: { value: number; inverse?: boolean }) => {
    const isPositive = inverse ? value < 0 : value > 0
    const Icon = value > 0.1 ? ArrowUpOutlined : value < -0.1 ? ArrowDownOutlined : MinusOutlined
    const color = isPositive ? '#52c41a' : value < -0.1 ? '#ff4d4f' : '#8c8c8c'
    return (
      <span style={{ color, fontSize: 12 }}>
        <Icon /> {Math.abs(value).toFixed(1)}%
      </span>
    )
  }

  return (
    <div className="operation-metrics-compact">
      {/* 顶部：KPI指标卡片 - 6个关键指标 */}
      <Row gutter={[12, 12]} className="kpi-cards-section">
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="kpi-card-mini" size="small">
            <Statistic
              title="健康度"
              value={kpis.healthScore.value}
              suffix="分"
              valueStyle={{ fontSize: 20, color: kpis.healthScore.status === 'good' ? '#52c41a' : '#faad14' }}
            />
            <div className="mini-chart">
              <ReactECharts
                option={getMiniChartOption(kpis.healthScore.chartData, '#52c41a')}
                style={{ height: 40 }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="kpi-card-mini" size="small">
            <Statistic
              title="访问量"
              value={kpis.accessVolume.value}
              suffix="/日"
              valueStyle={{ fontSize: 20 }}
            />
            <TrendIndicator value={kpis.accessVolume.trendValue} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="kpi-card-mini" size="small">
            <Statistic
              title="错误率"
              value={kpis.errorRate.value}
              suffix="%"
              precision={2}
              valueStyle={{ fontSize: 20, color: kpis.errorRate.value > 0.5 ? '#ff4d4f' : '#52c41a' }}
            />
            <TrendIndicator value={kpis.errorRate.trendValue} inverse />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="kpi-card-mini" size="small">
            <Statistic
              title="响应时间"
              value={kpis.responseTime.value}
              suffix="ms"
              valueStyle={{ fontSize: 20 }}
            />
            <TrendIndicator value={kpis.responseTime.trendValue} inverse />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="kpi-card-mini" size="small">
            <Statistic
              title="SLA"
              value={kpis.sla.value}
              suffix="%"
              precision={2}
              valueStyle={{ fontSize: 20, color: '#1677ff' }}
            />
            <TrendIndicator value={kpis.sla.trendValue} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="kpi-card-mini" size="small">
            <Statistic
              title="日志量"
              value={kpis.logVolume.value}
              suffix="/日"
              valueStyle={{ fontSize: 20 }}
            />
            <TrendIndicator value={kpis.logVolume.trendValue} />
          </Card>
        </Col>
      </Row>

      {/* 中部：实时监控指标 - 紧凑型展示 */}
      <Card className="realtime-metrics-card" size="small" title="实时监控指标">
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">CPU使用率</div>
              <Progress
                percent={latestMetrics.cpu}
                size="small"
                status={latestMetrics.cpu > 80 ? 'exception' : latestMetrics.cpu > 65 ? 'normal' : 'success'}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">内存使用率</div>
              <Progress
                percent={latestMetrics.memory}
                size="small"
                status={latestMetrics.memory > 85 ? 'exception' : latestMetrics.memory > 70 ? 'normal' : 'success'}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">磁盘使用率</div>
              <Progress
                percent={extendedMetrics.diskUsage}
                size="small"
                status={extendedMetrics.diskUsage > 90 ? 'exception' : 'success'}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">缓存命中率</div>
              <Progress
                percent={extendedMetrics.cacheHitRate}
                size="small"
                strokeColor="#52c41a"
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">连接池使用</div>
              <Progress
                percent={extendedMetrics.dbConnPool}
                size="small"
                status={extendedMetrics.dbConnPool > 85 ? 'exception' : 'success'}
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">磁盘I/O</div>
              <Progress
                percent={extendedMetrics.diskIO}
                size="small"
              />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">网络入流量</div>
              <div className="metric-value">{extendedMetrics.networkIn} MB/s</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">网络出流量</div>
              <div className="metric-value">{extendedMetrics.networkOut} MB/s</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">网络连接数</div>
              <div className="metric-value">{extendedMetrics.connections.toLocaleString()}</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">消息队列堆积</div>
              <div className="metric-value">{extendedMetrics.queueDepth}</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">在线用户数</div>
              <div className="metric-value">{extendedMetrics.activeUsers.toLocaleString()}</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="metric-item">
              <div className="metric-label">活跃会话数</div>
              <div className="metric-value">{extendedMetrics.activeSessions.toLocaleString()}</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 下部：性能趋势图表 - 3x3紧凑布局 */}
      <Card className="performance-charts-card" size="small" title="性能趋势分析（最近4小时）">
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={8}>
            <ReactECharts
              option={getCompactChartOption('CPU使用率', performance.cpu, '%', '#1890ff')}
              style={{ height: 180 }}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <ReactECharts
              option={getCompactChartOption('内存使用率', performance.memory, '%', '#52c41a')}
              style={{ height: 180 }}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <ReactECharts
              option={getCompactChartOption('响应时间', performance.responseTime, 'ms', '#faad14')}
              style={{ height: 180 }}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <ReactECharts
              option={getCompactChartOption('错误率', performance.errorRate, '%', '#ff4d4f')}
              style={{ height: 180 }}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <ReactECharts
              option={getCompactChartOption('吞吐量', performance.throughput, ' req/s', '#722ed1')}
              style={{ height: 180 }}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <ReactECharts
              option={getCompactChartOption('请求数', performance.requestCount, '', '#13c2c2')}
              style={{ height: 180 }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default OperationMetrics
