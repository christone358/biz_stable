import React from 'react'
import { Card, Row, Col, Progress, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import type { MetricData } from '../../types'

interface KeyMetricsProps {
  data: {
    cpu: MetricData
    memory: MetricData
    disk: MetricData
    network: MetricData
  }
  systemName: string
}

/**
 * 关键指标Tab组件
 */
const KeyMetrics: React.FC<KeyMetricsProps> = ({ data, systemName }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#ff4d4f'
      case 'warning':
        return '#faad14'
      case 'normal':
      default:
        return '#52c41a'
    }
  }

  const renderMetricCard = (metric: MetricData) => {
    const statusColor = getStatusColor(metric.status)
    const isIncreasing = metric.trend[metric.trend.length - 1] > metric.trend[0]

    return (
      <Card key={metric.name} hoverable>
        <Statistic
          title={metric.name}
          value={metric.value.toFixed(1)}
          suffix={metric.unit}
          valueStyle={{ color: statusColor }}
          prefix={isIncreasing ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        />
        <Progress
          percent={metric.value}
          strokeColor={statusColor}
          size="small"
          style={{ marginTop: 12 }}
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
          阈值: {metric.threshold}{metric.unit}
        </div>
      </Card>
    )
  }

  return (
    <div className="key-metrics-tab">
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>{systemName} - 关键性能指标</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            {renderMetricCard(data.cpu)}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderMetricCard(data.memory)}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderMetricCard(data.disk)}
          </Col>
          <Col xs={24} sm={12} lg={6}>
            {renderMetricCard(data.network)}
          </Col>
        </Row>
      </div>

      <div>
        <h4 style={{ marginBottom: 12 }}>性能趋势（最近24小时）</h4>
        <div style={{
          padding: 16,
          background: '#fafafa',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ color: '#8c8c8c' }}>
            图表功能待实现 - 可集成 ECharts 或其他图表库
          </div>
          <div style={{ fontSize: 12, color: '#bfbfbf', marginTop: 8 }}>
            将显示CPU、内存、磁盘、网络的24小时趋势曲线
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyMetrics
