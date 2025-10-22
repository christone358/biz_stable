import React, { useState, useMemo } from 'react'
import { Drawer, Tabs, Card, Table, Tag, Button, Space, Typography, Row, Col, Descriptions, Empty, Alert, Divider } from 'antd'
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import type { TraceDetail, TraceSpan, AbnormalLogDetail } from '../../../types'
import './TraceDetailDrawer.css'

dayjs.extend(duration)

const { Text, Title } = Typography

interface TraceDetailDrawerProps {
  visible: boolean
  traceDetail: TraceDetail | null
  relatedLogs?: AbnormalLogDetail[]
  onClose: () => void
  onNavigateToLogs?: () => void  // 跳转到异常日志Tab
}

/**
 * Trace详情抽屉组件
 * 参考New Relic/Datadog的Trace详情设计
 * 支持瀑布图、Span列表、关联日志展示
 */
const TraceDetailDrawer: React.FC<TraceDetailDrawerProps> = ({
  visible,
  traceDetail,
  relatedLogs = [],
  onClose,
  onNavigateToLogs
}) => {
  const [activeTab, setActiveTab] = useState('waterfall')
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

  // 扁平化Span树为列表(用于表格展示) - 必须在条件返回之前
  const flatSpans = useMemo(() => {
    if (!traceDetail) return []

    const flattenSpans = (spans: TraceSpan[], level = 0): Array<TraceSpan & { level: number }> => {
      const result: Array<TraceSpan & { level: number }> = []
      spans.forEach(span => {
        result.push({ ...span, level })
        if (span.children && span.children.length > 0) {
          result.push(...flattenSpans(span.children, level + 1))
        }
      })
      return result
    }

    return flattenSpans(traceDetail.spans)
  }, [traceDetail])

  // 早期返回必须在所有Hooks之后
  if (!traceDetail) {
    return null
  }

  // 计算瀑布图时间比例
  const traceDuration = traceDetail.duration
  const startTimeMs = new Date(traceDetail.startTime).getTime()

  // Span详情展开内容
  const expandedRowRender = (record: TraceSpan & { level: number }) => {
    return (
      <div style={{ background: '#f5f5f5', padding: '16px', margin: '-8px -16px' }}>
        <Row gutter={[16, 12]}>
          <Col span={24}>
            <Descriptions
              size="small"
              column={3}
              labelStyle={{ fontWeight: 500, color: '#666' }}
              contentStyle={{ color: '#333' }}
            >
              <Descriptions.Item label="TraceID">
                <Text code copyable style={{ fontSize: '11px' }}>{record.traceId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="SpanID">
                <Text code copyable style={{ fontSize: '11px' }}>{record.spanId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="调用角色">
                <Tag color={record.callRole === 'Server' ? 'blue' : record.callRole === 'Client' ? 'green' : 'default'}>
                  {record.callRole}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss.SSS')}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间">
                {dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss.SSS')}
              </Descriptions.Item>
              <Descriptions.Item label="实例">
                {record.resource?.hostname || '-'}
                {record.resource?.ip && <Text type="secondary" style={{ fontSize: '11px', marginLeft: 4 }}>({record.resource.ip})</Text>}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* 错误信息 */}
          {record.status === 'ERROR' && record.error && (
            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ background: '#fff2f0', padding: '12px', borderRadius: '4px', border: '1px solid #ffccc7' }}>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ color: '#cf1322' }}>error.message</Text>
                    <div style={{ marginTop: 4, padding: '8px', background: '#fff', borderRadius: '2px', fontSize: '12px' }}>
                      {record.error.message}
                    </div>
                  </div>

                  <div>
                    <Text strong style={{ color: '#cf1322' }}>error.object</Text>
                    <div style={{ marginTop: 4, padding: '8px', background: '#fff', borderRadius: '2px', fontSize: '12px', fontFamily: 'monospace' }}>
                      {record.error.type}
                    </div>
                  </div>

                  {record.error.stacktrace && (
                    <div>
                      <Text strong style={{ color: '#cf1322' }}>exception.stacktrace</Text>
                      <div style={{
                        marginTop: 4,
                        padding: '8px',
                        background: '#fff',
                        borderRadius: '2px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        maxHeight: '200px',
                        overflow: 'auto'
                      }}>
                        {record.error.stacktrace}
                      </div>
                    </div>
                  )}
                </Space>
              </div>
            </Col>
          )}

          {/* CLS日志 (如果有) */}
          {record.resource && (
            <Col span={24}>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong style={{ fontSize: '12px' }}>资源信息</Text>
                <div style={{ marginTop: 8, padding: '8px', background: '#fff', borderRadius: '2px', border: '1px solid #d9d9d9' }}>
                  <Space direction="vertical" size={4} style={{ fontSize: '11px' }}>
                    {record.resource.hostname && <div><Text type="secondary">hostname:</Text> {record.resource.hostname}</div>}
                    {record.resource.ip && <div><Text type="secondary">ip:</Text> {record.resource.ip}</div>}
                    {record.resource.version && <div><Text type="secondary">version:</Text> {record.resource.version}</div>}
                  </Space>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>
    )
  }

  // 状态配置
  const statusConfig = {
    OK: { color: '#52c41a', icon: <CheckCircleOutlined />, label: '成功' },
    ERROR: { color: '#ff4d4f', icon: <CloseCircleOutlined />, label: '失败' },
    TIMEOUT: { color: '#faad14', icon: <ExclamationCircleOutlined />, label: '超时' }
  }

  // Span表格列定义
  const spanColumns: ColumnsType<TraceSpan & { level: number }> = [
    {
      title: '操作/服务',
      dataIndex: 'operation',
      key: 'operation',
      width: 300,
      render: (operation: string, record: TraceSpan & { level: number }) => {
        const indent = record.level * 20
        const hasError = record.status === 'ERROR'
        return (
          <div style={{ paddingLeft: indent, display: 'flex', alignItems: 'center', gap: 6 }}>
            {record.level > 0 && <span style={{ color: '#d9d9d9', fontSize: '12px' }}>└─</span>}
            <div>
              <div style={{ fontWeight: 500, color: hasError ? '#ff4d4f' : undefined, fontSize: '12px' }}>
                {operation}
              </div>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {record.serviceName}
              </Text>
            </div>
          </div>
        )
      }
    },
    {
      title: '调用角色',
      dataIndex: 'callRole',
      key: 'callRole',
      width: 90,
      align: 'center',
      render: (role: string) => {
        const colors: Record<string, string> = {
          Server: 'blue',
          Client: 'green',
          Internal: 'default'
        }
        return <Tag color={colors[role]}>{role}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status: 'OK' | 'ERROR' | 'TIMEOUT') => {
        const config = statusConfig[status]
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.label}
          </Tag>
        )
      }
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.duration - b.duration,
      render: (duration: number) => {
        const color = duration < 50 ? '#52c41a' : duration < 200 ? '#faad14' : '#ff4d4f'
        return (
          <Text strong style={{ color }}>
            {duration.toFixed(2)}ms
          </Text>
        )
      }
    },
    {
      title: '调用时间',
      key: 'timeline',
      render: (_: any, record: TraceSpan) => {
        const spanStartMs = new Date(record.startTime).getTime()
        const offset = ((spanStartMs - startTimeMs) / traceDuration) * 100
        const width = (record.duration / traceDuration) * 100

        const bgColor = record.status === 'ERROR' ? '#ff4d4f' :
                        record.status === 'TIMEOUT' ? '#faad14' : '#52c41a'

        return (
          <div style={{ position: 'relative', height: 20, background: '#fafafa', borderRadius: 2, border: '1px solid #e8e8e8' }}>
            <div
              style={{
                position: 'absolute',
                left: `${offset}%`,
                width: `${width}%`,
                height: '100%',
                background: bgColor,
                borderRadius: 2,
                minWidth: 2,
                transition: 'all 0.2s'
              }}
              title={`${record.operation}: ${record.duration.toFixed(2)}ms (开始: ${offset.toFixed(1)}%)`}
            />
            {/* 显示耗时文本 */}
            {width > 5 && (
              <div style={{
                position: 'absolute',
                left: `${offset}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                paddingLeft: 4,
                fontSize: '10px',
                color: '#fff',
                fontWeight: 500,
                pointerEvents: 'none'
              }}>
                {record.duration.toFixed(1)}ms
              </div>
            )}
          </div>
        )
      }
    }
  ]

  // 关联日志表格列
  const logColumns: ColumnsType<AbnormalLogDetail> = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={level === 'ERROR' ? 'red' : 'orange'}>
          {level}
        </Tag>
      )
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => dayjs(timestamp).format('HH:mm:ss.SSS')
    },
    {
      title: '资产',
      dataIndex: 'assetName',
      key: 'assetName',
      width: 120
    },
    {
      title: '日志消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true
    }
  ]

  // Tab配置
  const tabItems = [
    {
      key: 'waterfall',
      label: '全链路展示',
      children: (
        <div className="waterfall-view">
          {/* Span层级表格(带时间线瀑布图) */}
          <Table
            columns={spanColumns}
            dataSource={flatSpans}
            rowKey="spanId"
            size="small"
            pagination={false}
            scroll={{ y: 500 }}
            rowClassName={(record) => record.status === 'ERROR' ? 'error-row' : ''}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
              expandIcon: ({ expanded, onExpand, record }) => (
                expanded ? (
                  <DownOutlined onClick={(e) => onExpand(record, e)} style={{ cursor: 'pointer', fontSize: '10px' }} />
                ) : (
                  <RightOutlined onClick={(e) => onExpand(record, e)} style={{ cursor: 'pointer', fontSize: '10px' }} />
                )
              )
            }}
          />

          {/* 时间轴说明 */}
          <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <Space>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ClockCircleOutlined /> 总耗时: <Text strong>{traceDuration.toFixed(2)}ms</Text>
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ThunderboltOutlined /> Span数量: <Text strong>{flatSpans.length}</Text>
              </Text>
              {traceDetail.errorCount > 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ExclamationCircleOutlined /> 错误Span: <Text strong style={{ color: '#ff4d4f' }}>{traceDetail.errorCount}</Text>
                </Text>
              )}
            </Space>
          </div>
        </div>
      )
    },
    {
      key: 'logs',
      label: `关联日志 (${relatedLogs.length})`,
      children: (
        <div className="logs-view">
          {relatedLogs.length > 0 ? (
            <>
              <Alert
                message="此Trace关联的异常日志"
                description="以下日志与当前Trace的TraceID匹配,可能包含错误详细信息"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                action={
                  onNavigateToLogs && (
                    <Button size="small" onClick={onNavigateToLogs}>
                      查看全部日志 →
                    </Button>
                  )
                }
              />
              <Table
                columns={logColumns}
                dataSource={relatedLogs}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 10 }}
              />
            </>
          ) : (
            <Empty
              description="此Trace暂无关联的异常日志"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      )
    },
    {
      key: 'details',
      label: 'Trace详情',
      children: (
        <div className="details-view">
          <Card size="small" style={{ marginBottom: 16 }}>
            <Descriptions title="基本信息" column={2} size="small">
              <Descriptions.Item label="TraceID">
                <Text code copyable>{traceDetail.traceId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="服务名称">
                {traceDetail.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="入口接口">
                {traceDetail.endpoint}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={traceDetail.status === 'success' ? 'green' : 'red'}>
                  {traceDetail.status === 'success' ? '成功' : '失败'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {dayjs(traceDetail.startTime).format('YYYY-MM-DD HH:mm:ss.SSS')}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间">
                {dayjs(traceDetail.endTime).format('YYYY-MM-DD HH:mm:ss.SSS')}
              </Descriptions.Item>
              <Descriptions.Item label="总耗时">
                <Text strong style={{ color: traceDuration < 100 ? '#52c41a' : traceDuration < 500 ? '#faad14' : '#ff4d4f' }}>
                  {traceDuration.toFixed(2)}ms
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Span数量">
                {traceDetail.spanCount}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 涉及的系统列表 */}
          {traceDetail.relatedSystems && traceDetail.relatedSystems.length > 0 && (
            <Card title="涉及的系统" size="small">
              <Space wrap>
                {traceDetail.relatedSystems.map(system => (
                  <Tag key={system} icon={<LinkOutlined />} color="blue">
                    {system}
                  </Tag>
                ))}
              </Space>
            </Card>
          )}
        </div>
      )
    }
  ]

  return (
    <Drawer
      title={
        <div>
          <Title level={5} style={{ margin: 0 }}>链路详情</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            TraceID: {traceDetail.traceId.slice(0, 16)}...
          </Text>
        </div>
      }
      placement="right"
      width="80%"
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </Drawer>
  )
}

export default TraceDetailDrawer
