import React, { useMemo } from 'react'
import { Card, Row, Col, Tag, Empty, Space, Button, Alert, Statistic } from 'antd'
import { ArrowRightOutlined, ArrowLeftOutlined, ClockCircleOutlined, ExclamationCircleOutlined, EyeOutlined, ApiOutlined, ThunderboltOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import type { SystemNode } from '../../types'
import './CallChainTab.css'

interface CallChainTabProps {
  data: {
    upstream: SystemNode[]    // 上游系统
    downstream: SystemNode[]  // 下游系统
  }
  systemName: string
  onNavigateToLogs?: (systemId: string) => void  // 跳转到异常日志Tab
  highlightSystemId?: string  // 需要高亮的系统ID（从异常日志跳转过来时）
}

/**
 * 调用链Tab组件（增强版：支持智能联动）
 */
const CallChainTab: React.FC<CallChainTabProps> = ({
  data,
  systemName,
  onNavigateToLogs,
  highlightSystemId
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '正常'
      case 'warning':
        return '警告'
      case 'error':
        return '异常'
      default:
        return '未知'
    }
  }

  // 检查是否有异常系统
  const hasAbnormalSystems = [...data.upstream, ...data.downstream].some(
    node => node.hasAbnormalLogs || node.status === 'error' || node.status === 'warning'
  )

  // 统计数据
  const statistics = useMemo(() => {
    const totalCalls = [...data.upstream, ...data.downstream].reduce((sum, node) => sum + node.callCount, 0)
    const avgResponseTime = [...data.upstream, ...data.downstream].reduce((sum, node) => sum + node.avgResponseTime, 0) /
      ([...data.upstream, ...data.downstream].length || 1)
    const abnormalCount = [...data.upstream, ...data.downstream].filter(node =>
      node.status === 'error' || node.status === 'warning'
    ).length
    const upstreamCalls = data.upstream.reduce((sum, node) => sum + node.callCount, 0)
    const downstreamCalls = data.downstream.reduce((sum, node) => sum + node.callCount, 0)

    return {
      totalCalls,
      avgResponseTime: Math.round(avgResponseTime),
      abnormalCount,
      upstreamCalls,
      downstreamCalls,
      totalSystems: data.upstream.length + data.downstream.length
    }
  }, [data])

  // 调用趋势图表配置（模拟最近6小时数据）
  const callTrendChartOption = useMemo(() => {
    const hours = 6
    const timeLabels = Array.from({ length: hours * 4 }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (hours * 4 - i) * 15)
      return date.toTimeString().slice(0, 5)
    })

    // 生成模拟数据（带波动）
    const generateTrendData = (base: number, variance: number) => {
      return Array.from({ length: hours * 4 }, () => {
        return Math.max(0, base + (Math.random() - 0.5) * variance)
      })
    }

    return {
      grid: { left: 50, right: 20, top: 40, bottom: 30 },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value.toFixed(0)} 次/分<br/>`
          })
          return result
        }
      },
      legend: {
        data: ['上游调用', '下游调用'],
        top: 0
      },
      xAxis: {
        type: 'category',
        data: timeLabels,
        axisLabel: {
          rotate: 45,
          interval: 3
        }
      },
      yAxis: {
        type: 'value',
        name: '调用次数/分'
      },
      series: [
        {
          name: '上游调用',
          type: 'line',
          data: generateTrendData(statistics.upstreamCalls / 60, statistics.upstreamCalls / 120),
          smooth: true,
          itemStyle: { color: '#1890ff' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
              ]
            }
          }
        },
        {
          name: '下游调用',
          type: 'line',
          data: generateTrendData(statistics.downstreamCalls / 60, statistics.downstreamCalls / 120),
          smooth: true,
          itemStyle: { color: '#52c41a' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
              ]
            }
          }
        }
      ]
    }
  }, [statistics])

  // 响应时间分布图表
  const responseTimeChartOption = useMemo(() => {
    const upstreamData = data.upstream.map(node => ({
      name: node.systemName,
      value: node.avgResponseTime
    }))
    const downstreamData = data.downstream.map(node => ({
      name: node.systemName,
      value: node.avgResponseTime
    }))

    return {
      grid: { left: 80, right: 20, top: 30, bottom: 20 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          return `${params[0].name}<br/>${params[0].marker}响应时间: ${params[0].value}ms`
        }
      },
      xAxis: {
        type: 'value',
        name: '响应时间(ms)',
        axisLabel: {
          formatter: '{value}ms'
        }
      },
      yAxis: {
        type: 'category',
        data: [...upstreamData.map(d => d.name), ...downstreamData.map(d => d.name)],
        axisLabel: {
          width: 70,
          overflow: 'truncate'
        }
      },
      series: [
        {
          name: '响应时间',
          type: 'bar',
          data: [...upstreamData.map(d => d.value), ...downstreamData.map(d => d.value)],
          itemStyle: {
            color: (params: any) => {
              const value = params.value
              if (value < 100) return '#52c41a'
              if (value < 300) return '#faad14'
              return '#ff4d4f'
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}ms'
          }
        }
      ]
    }
  }, [data])

  const renderSystemNode = (node: SystemNode, isUpstream: boolean) => {
    const isHighlighted = highlightSystemId === node.systemId
    const hasAbnormal = node.hasAbnormalLogs || node.status !== 'healthy'

    return (
      <Card
        key={node.systemId}
        size="small"
        hoverable
        style={{
          marginBottom: 12,
          border: isHighlighted ? '2px solid #1890ff' : undefined,
          background: isHighlighted ? '#e6f7ff' : undefined,
          boxShadow: isHighlighted ? '0 4px 12px rgba(24, 144, 255, 0.2)' : undefined
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isUpstream && <ArrowRightOutlined style={{ color: '#1890ff', fontSize: 16 }} />}
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 500,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {node.systemName}
              {isHighlighted && <Tag color="blue">当前</Tag>}
            </div>
            <Space size="small" wrap>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                调用次数: {node.callCount.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                <ClockCircleOutlined /> 平均响应: {node.avgResponseTime}ms
              </span>
              <Tag color={getStatusColor(node.status)} style={{ margin: 0 }}>
                {getStatusText(node.status)}
              </Tag>
              {node.hasAbnormalLogs && node.abnormalLogCount && (
                <Tag icon={<ExclamationCircleOutlined />} color="red">
                  {node.abnormalLogCount}条异常
                </Tag>
              )}
            </Space>
            {hasAbnormal && onNavigateToLogs && (
              <div style={{ marginTop: 8 }}>
                <Button
                  type="link"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => onNavigateToLogs(node.systemId)}
                  style={{ padding: 0 }}
                >
                  查看异常日志
                </Button>
              </div>
            )}
          </div>
          {!isUpstream && <ArrowLeftOutlined style={{ color: '#52c41a', fontSize: 16 }} />}
        </div>
      </Card>
    )
  }

  return (
    <div className="call-chain-tab" style={{ padding: 24, background: '#f5f5f5' }}>
      {/* 标题 */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ApiOutlined style={{ color: '#1890ff' }} />
          {systemName} - 调用链分析
        </h3>
      </div>

      {/* 统计概览卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="依赖系统数"
              value={statistics.totalSystems}
              suffix="个"
              prefix={<ApiOutlined />}
              valueStyle={{ fontSize: 22, color: '#1890ff' }}
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              上游 {data.upstream.length} / 下游 {data.downstream.length}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="总调用量"
              value={statistics.totalCalls}
              suffix="/小时"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ fontSize: 22, color: '#52c41a' }}
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              入 {statistics.upstreamCalls.toLocaleString()} / 出 {statistics.downstreamCalls.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="平均响应时间"
              value={statistics.avgResponseTime}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
              valueStyle={{
                fontSize: 22,
                color: statistics.avgResponseTime < 100 ? '#52c41a' : statistics.avgResponseTime < 300 ? '#faad14' : '#ff4d4f'
              }}
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              {statistics.avgResponseTime < 100 ? '性能良好' : statistics.avgResponseTime < 300 ? '性能一般' : '性能较差'}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="异常系统"
              value={statistics.abnormalCount}
              suffix="个"
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ fontSize: 22, color: statistics.abnormalCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              {statistics.abnormalCount > 0 ? '需要关注' : '运行正常'}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 智能提示：发现异常 */}
      {hasAbnormalSystems && (
        <Alert
          message="发现异常"
          description={
            <div>
              <ExclamationCircleOutlined style={{ marginRight: 8 }} />
              检测到调用链中存在异常系统，建议查看相关异常日志进行分析
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            onNavigateToLogs && (
              <Button size="small" onClick={() => onNavigateToLogs('')}>
                查看全部日志
              </Button>
            )
          }
        />
      )}

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card title="调用量趋势（最近6小时）" size="small">
            <ReactECharts
              option={callTrendChartOption}
              style={{ height: 240 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="系统响应时间分布" size="small">
            {data.upstream.length + data.downstream.length > 0 ? (
              <ReactECharts
                option={responseTimeChartOption}
                style={{ height: 240 }}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* 上下游系统列表 */}
      <Row gutter={16}>
        {/* 上游系统 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <ArrowRightOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                上游系统 ({data.upstream.length})
              </span>
            }
            bordered={false}
          >
            {data.upstream.length > 0 ? (
              data.upstream.map(node => renderSystemNode(node, true))
            ) : (
              <Empty description="无上游系统依赖" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* 下游系统 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <ArrowLeftOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                下游系统 ({data.downstream.length})
              </span>
            }
            bordered={false}
          >
            {data.downstream.length > 0 ? (
              data.downstream.map(node => renderSystemNode(node, false))
            ) : (
              <Empty description="无下游系统调用" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 提示信息 */}
      <div style={{ marginTop: 24, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}>
        <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 12 }}>
          💡 提示：点击"查看异常日志"按钮可快速跳转到异常日志Tab查看相关系统的日志详情
        </div>
      </div>
    </div>
  )
}

export default CallChainTab
