import React, { useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Drawer, Empty, Tooltip, Typography, Row, Col, Statistic } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type {
  TraceListItem,
  TraceStatus,
  ProtocolStatus,
  CallRole
} from '../../../types'
import './index.css'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography
const { Option } = Select

interface TraceTabProps {
  systemId: string
  systemName: string
  traces: TraceListItem[]
  onRefresh?: () => void
  onTraceClick?: (traceId: string) => void  // 点击查看Trace详情
  highlightTraceId?: string                  // 从异常日志跳转过来时高亮的TraceID
}

/**
 * 链路追踪Tab组件
 * 参考New Relic、AWS X-Ray的Trace列表设计
 */
const TraceTab: React.FC<TraceTabProps> = ({
  systemId,
  systemName,
  traces,
  onRefresh,
  onTraceClick,
  highlightTraceId
}) => {
  // 筛选状态
  const [searchTraceId, setSearchTraceId] = useState('')
  const [selectedCallRole, setSelectedCallRole] = useState<CallRole | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<TraceStatus | 'all'>('all')
  const [showErrorOnly, setShowErrorOnly] = useState(false)

  // 状态配置
  const statusConfig: Record<TraceStatus, { color: string; icon: React.ReactNode; label: string }> = {
    success: { color: '#52c41a', icon: '●', label: '成功' },
    error: { color: '#ff4d4f', icon: '●', label: '失败' },
    timeout: { color: '#faad14', icon: '●', label: '超时' }
  }

  // 协议状态配置
  const protocolStatusConfig: Record<ProtocolStatus, { color: string; label: string }> = {
    HTTP_200: { color: 'green', label: 'HTTP_200' },
    HTTP_404: { color: 'orange', label: 'HTTP_404' },
    HTTP_500: { color: 'red', label: 'HTTP_500' },
    HTTP_503: { color: 'red', label: 'HTTP_503' },
    gRPC_0: { color: 'green', label: 'gRPC_0' },
    gRPC_2: { color: 'orange', label: 'gRPC_2' },
    gRPC_14: { color: 'red', label: 'gRPC_14' }
  }

  // 筛选Trace
  const filteredTraces = useMemo(() => {
    return traces.filter(trace => {
      // TraceID搜索
      if (searchTraceId && !trace.traceId.toLowerCase().includes(searchTraceId.toLowerCase())) {
        return false
      }

      // 调用角色筛选
      if (selectedCallRole !== 'all' && trace.callRole !== selectedCallRole) {
        return false
      }

      // 状态筛选
      if (selectedStatus !== 'all' && trace.status !== selectedStatus) {
        return false
      }

      // 只显示错误
      if (showErrorOnly && trace.status !== 'error') {
        return false
      }

      return true
    })
  }, [traces, searchTraceId, selectedCallRole, selectedStatus, showErrorOnly])

  // 统计数据 - 基于Google SRE四大黄金信号
  const statistics = useMemo(() => {
    const total = filteredTraces.length
    const successCount = filteredTraces.filter(t => t.status === 'success').length
    const errorCount = filteredTraces.filter(t => t.status === 'error').length
    const timeoutCount = filteredTraces.filter(t => t.status === 'timeout').length

    // 错误率（包含超时）
    const errorRate = total > 0 ? (((errorCount + timeoutCount) / total) * 100).toFixed(2) : '0.00'

    // 慢查询数量（>500ms）
    const slowTraceCount = filteredTraces.filter(t => t.duration > 500).length

    // P95响应时间
    const p95Duration = filteredTraces.length > 0
      ? filteredTraces.map(t => t.duration).sort((a, b) => a - b)[Math.floor(filteredTraces.length * 0.95)]
      : 0

    // 吞吐量（QPS） - 基于时间跨度计算
    let qps = 0
    if (filteredTraces.length > 1) {
      const startTimes = filteredTraces.map(t => new Date(t.startTime).getTime())
      const timeSpanSeconds = (Math.max(...startTimes) - Math.min(...startTimes)) / 1000
      qps = timeSpanSeconds > 0 ? (filteredTraces.length / timeSpanSeconds) : 0
    }

    return {
      total,
      successCount,
      errorCount,
      timeoutCount,
      errorRate,
      slowTraceCount,
      p95Duration: p95Duration.toFixed(2),
      qps: qps.toFixed(2)
    }
  }, [filteredTraces])

  // 表格列定义
  const columns: ColumnsType<TraceListItem> = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 60,
      align: 'center',
      render: (status: TraceStatus) => {
        const config = statusConfig[status]
        return (
          <Tooltip title={config.label}>
            <span style={{ color: config.color, fontSize: 14 }}>{config.icon}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '状态码',
      dataIndex: 'protocolStatus',
      key: 'protocolStatus',
      width: 100,
      align: 'center',
      render: (protocolStatus: ProtocolStatus) => {
        const config = protocolStatusConfig[protocolStatus]
        return <Tag color={config.color} style={{ margin: 0, fontSize: '11px' }}>{config.label}</Tag>
      }
    },
    {
      title: 'TraceID',
      dataIndex: 'traceId',
      key: 'traceId',
      width: 140,
      render: (traceId: string, record: TraceListItem) => {
        const isHighlighted = highlightTraceId === traceId
        return (
          <Tooltip title={`TraceID: ${traceId}`}>
            <Button
              type="link"
              size="small"
              style={{
                padding: 0,
                height: 'auto',
                fontSize: '11px',
                fontWeight: isHighlighted ? 600 : 400,
                background: isHighlighted ? '#e6f7ff' : undefined,
                border: isHighlighted ? '1px solid #1890ff' : undefined,
                borderRadius: '2px'
              }}
              onClick={() => onTraceClick?.(traceId)}
            >
              {traceId.slice(0, 12)}...
            </Button>
          </Tooltip>
        )
      }
    },
    {
      title: '应用名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 150,
      ellipsis: true,
      render: (serviceName: string) => (
        <Text style={{ fontSize: '11px' }}>{serviceName}</Text>
      )
    },
    {
      title: '接口',
      dataIndex: 'endpoint',
      key: 'endpoint',
      ellipsis: { showTitle: false },
      render: (endpoint: string) => (
        <Tooltip title={endpoint} placement="topLeft">
          <Text style={{ fontSize: '11px' }}>{endpoint}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Span数',
      dataIndex: 'spanCount',
      key: 'spanCount',
      width: 70,
      align: 'center',
      render: (spanCount: number, record: TraceListItem) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Text style={{ fontSize: '11px' }}>{spanCount}</Text>
          {record.errorCount > 0 && (
            <Tag color="red" style={{ margin: 0, fontSize: '10px', padding: '0 4px', lineHeight: '14px' }}>
              {record.errorCount}错误
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: '响应时间',
      dataIndex: 'duration',
      key: 'duration',
      width: 90,
      align: 'right',
      sorter: (a, b) => a.duration - b.duration,
      render: (duration: number) => {
        const color = duration < 100 ? '#52c41a' : duration < 500 ? '#faad14' : '#ff4d4f'
        return (
          <Text strong style={{ color, fontSize: '11px' }}>
            {duration.toFixed(2)}ms
          </Text>
        )
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 140,
      sorter: (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      render: (startTime: string) => (
        <Text style={{ fontSize: '11px' }}>{dayjs(startTime).format('MM-DD HH:mm:ss')}</Text>
      )
    },
    {
      title: '日志',
      key: 'logs',
      width: 60,
      align: 'center',
      render: (_: any, record: TraceListItem) => {
        if (!record.hasLogs) return <Text type="secondary" style={{ fontSize: '11px' }}>-</Text>
        return (
          <Tag icon={<LinkOutlined />} color="blue" style={{ margin: 0, fontSize: '10px', padding: '0 4px' }}>
            {record.logCount}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: TraceListItem) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          style={{ padding: 0, fontSize: '11px', height: 'auto' }}
          onClick={() => onTraceClick?.(record.traceId)}
        >
          详情
        </Button>
      )
    }
  ]

  return (
    <div className="trace-tab-container">
      {/* 统计概览 - 基于Google SRE四大黄金信号 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ height: '100%' }}>
            <Statistic
              title="错误率"
              value={statistics.errorRate}
              suffix="%"
              prefix={<CloseCircleOutlined />}
              valueStyle={{
                fontSize: 22,
                color: parseFloat(statistics.errorRate) < 1 ? '#52c41a' :
                       parseFloat(statistics.errorRate) < 5 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ height: '100%' }}>
            <Statistic
              title="吞吐量 (QPS)"
              value={statistics.qps}
              suffix="req/s"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ fontSize: 22, color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ height: '100%' }}>
            <Statistic
              title="P95响应时间"
              value={statistics.p95Duration}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
              valueStyle={{
                fontSize: 22,
                color: parseFloat(statistics.p95Duration) < 200 ? '#52c41a' :
                       parseFloat(statistics.p95Duration) < 1000 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" style={{ height: '100%' }}>
            <Statistic
              title="慢查询 (>500ms)"
              value={statistics.slowTraceCount}
              suffix={`/ ${statistics.total}`}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{
                fontSize: 22,
                color: statistics.slowTraceCount === 0 ? '#52c41a' :
                       statistics.slowTraceCount < statistics.total * 0.1 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选工具栏 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索TraceID..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 280 }}
            value={searchTraceId}
            onChange={e => setSearchTraceId(e.target.value)}
          />

          <Select
            value={selectedCallRole}
            onChange={setSelectedCallRole}
            style={{ width: 140 }}
          >
            <Option value="all">全部角色</Option>
            <Option value="Server">Server</Option>
            <Option value="Client">Client</Option>
            <Option value="Internal">Internal</Option>
          </Select>

          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 120 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="success">成功</Option>
            <Option value="error">失败</Option>
            <Option value="timeout">超时</Option>
          </Select>

          <Button
            type={showErrorOnly ? 'primary' : 'default'}
            icon={<ExclamationCircleOutlined />}
            onClick={() => setShowErrorOnly(!showErrorOnly)}
          >
            只看错误
          </Button>

          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            刷新
          </Button>
        </Space>
      </Card>

      {/* Trace列表 */}
      <Card size="small">
        <Table
          columns={columns}
          dataSource={filteredTraces}
          rowKey="traceId"
          size="small"
          pagination={{
            pageSize: 30,
            showTotal: (total) => `共 ${total} 条Trace记录`,
            showSizeChanger: true,
            pageSizeOptions: ['20', '30', '50', '100']
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无Trace数据"
              />
            )
          }}
          scroll={{ x: 1200, y: 600 }}
          rowClassName={(record) => {
            if (record.traceId === highlightTraceId) {
              return 'highlighted-row'
            }
            return ''
          }}
        />
      </Card>

      {/* 提示信息 */}
      <div style={{ marginTop: 16, padding: 12, background: '#f0f5ff', borderRadius: 8, border: '1px solid #d6e4ff' }}>
        <div style={{ textAlign: 'center', color: '#597ef7', fontSize: 12 }}>
          💡 提示：点击TraceID或"详情"按钮可查看完整调用链瀑布图和关联日志
        </div>
      </div>
    </div>
  )
}

export default TraceTab
