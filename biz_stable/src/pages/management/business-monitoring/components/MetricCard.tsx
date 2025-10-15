import React, { useEffect, useRef } from 'react'
import { Card, Statistic, Space, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'
import { KPIMetric } from '../types'
import './MetricCard.css'

const { Text } = Typography

interface MetricCardProps {
  metric: KPIMetric
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 绘制迷你趋势图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !metric.chartData || metric.chartData.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置canvas尺寸
    const width = 100
    const height = 40
    canvas.width = width
    canvas.height = height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 计算数据范围
    const values = metric.chartData
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue || 1

    // 绘制区域填充
    ctx.beginPath()
    const stepX = width / (values.length - 1)
    values.forEach((value, index) => {
      const x = index * stepX
      const y = height - ((value - minValue) / range) * height
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    // 闭合路径到底部
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    // 设置填充渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    const color = metric.status === 'good'
      ? 'rgba(82, 196, 26, 0.3)'
      : metric.status === 'warning'
      ? 'rgba(250, 173, 20, 0.3)'
      : 'rgba(255, 77, 79, 0.3)'
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
    ctx.fillStyle = gradient
    ctx.fill()

    // 绘制线条
    ctx.beginPath()
    values.forEach((value, index) => {
      const x = index * stepX
      const y = height - ((value - minValue) / range) * height
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    const lineColor = metric.status === 'good'
      ? '#52C41A'
      : metric.status === 'warning'
      ? '#FAAD14'
      : '#FF4D4F'
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.stroke()

  }, [metric.chartData, metric.status])

  // 趋势图标和颜色
  const getTrendIcon = () => {
    if (metric.trend === 'up') {
      return <ArrowUpOutlined style={{ color: '#52C41A' }} />
    } else if (metric.trend === 'down') {
      return <ArrowDownOutlined style={{ color: '#FF4D4F' }} />
    } else {
      return <MinusOutlined style={{ color: '#8C8C8C' }} />
    }
  }

  const getTrendColor = () => {
    if (metric.trend === 'up') return '#52C41A'
    if (metric.trend === 'down') return '#FF4D4F'
    return '#8C8C8C'
  }

  // 状态边框颜色
  const getBorderColor = () => {
    if (metric.status === 'good') return '#52C41A'
    if (metric.status === 'warning') return '#FAAD14'
    return '#FF4D4F'
  }

  return (
    <Card
      className="metric-card"
      style={{ borderTop: `3px solid ${getBorderColor()}` }}
      bodyStyle={{ padding: '16px', position: 'relative' }}
    >
      <div className="metric-content">
        <div className="metric-info">
          <Text type="secondary" className="metric-label" style={{ fontSize: '12px' }}>
            {metric.label}
          </Text>
          <Statistic
            value={metric.value}
            suffix={metric.unit}
            valueStyle={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#262626'
            }}
          />
          <Space size={4} className="metric-trend" style={{ marginTop: '4px' }}>
            {getTrendIcon()}
            <Text style={{ color: getTrendColor(), fontSize: '12px' }}>
              {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '' : ''}
              {Math.abs(metric.trendValue)}
              {typeof metric.trendValue === 'number' && metric.label !== '响应时间' ? '%' : metric.label === '响应时间' ? 'ms' : ''}
            </Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              vs 昨日
            </Text>
          </Space>
        </div>
        {/* 迷你趋势图 - 右下角 */}
        <div className="metric-mini-chart">
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
      </div>
    </Card>
  )
}

export default MetricCard
