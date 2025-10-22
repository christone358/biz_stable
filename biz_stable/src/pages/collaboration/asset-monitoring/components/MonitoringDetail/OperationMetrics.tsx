import React, { useMemo } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { ApplicationKPIs, PerformanceMetrics } from '../../types'
import AssetPerformancePanel from '../../../../management/business-monitoring/components/AssetPerformancePanel'
import { generateAssetsForSystem } from '../../../../../mock/asset-performance-data'
import './OperationMetrics.css'

interface OperationMetricsProps {
  systemId: string
  systemName: string
  kpis: ApplicationKPIs
  performance: PerformanceMetrics
}

/**
 * 运行指标Tab
 * 第一部分：关键指标卡片
 * 第二部分：IT资产性能监控（左侧资产树 + 右侧性能图表）
 */
const OperationMetrics: React.FC<OperationMetricsProps> = ({
  systemId,
  systemName,
  kpis,
  performance
}) => {
  // 生成IT资产列表
  const assets = useMemo(() => {
    return generateAssetsForSystem(systemId, systemName)
  }, [systemId, systemName])

  // 迷你图表配置生成器
  const getMiniChartOption = (data: number[], color: string) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
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
    <div className="operation-metrics-container">
      {/* 第一部分：关键指标卡片 */}
      <div className="kpi-section">
        <Row gutter={[16, 16]}>
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
      </div>

      {/* 第二部分：IT资产性能监控 */}
      <div className="asset-performance-section">
        <div className="section-title">IT资产性能监控</div>
        <AssetPerformancePanel
          systemId={systemId}
          systemName={systemName}
          assets={assets}
          timeRange={{ label: '最近4小时', value: '4h', hours: 4 }}
        />
      </div>
    </div>
  )
}

export default OperationMetrics
