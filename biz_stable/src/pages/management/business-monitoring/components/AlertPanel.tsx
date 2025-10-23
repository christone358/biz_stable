import React, { useState } from 'react'
import { Row, Col, Statistic, Table, Tag, Button, Space, Typography, Empty, Drawer, Descriptions, Alert as AntAlert, Timeline } from 'antd'
import { AlertOutlined, EyeOutlined, ClockCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { AlertSummary, AlertDetail } from '../types'
import './AlertPanel.css'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography

interface AlertPanelProps {
  summary: AlertSummary
  details: AlertDetail[]
  onRowClick?: (affectedAssetId: string) => void
}

const AlertPanel: React.FC<AlertPanelProps> = ({ summary, details, onRowClick }) => {
  // 详情抽屉状态
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<AlertDetail | null>(null)

  // 告警级别配置
  const levelConfig = {
    urgent: { color: '#FF4D4F', label: '紧急', icon: <ExclamationCircleOutlined /> },
    warning: { color: '#FAAD14', label: '警告', icon: <AlertOutlined /> },
    info: { color: '#1890FF', label: '提醒', icon: <ClockCircleOutlined /> }
  }

  // 状态配置
  const statusConfig = {
    OPEN: { color: 'red', label: '待处理', icon: <CloseCircleOutlined /> },
    ACKNOWLEDGED: { color: 'orange', label: '已确认', icon: <ExclamationCircleOutlined /> },
    RESOLVED: { color: 'green', label: '已解决', icon: <CheckCircleOutlined /> }
  }

  // 打开详情
  const handleViewDetail = (alert: AlertDetail) => {
    setSelectedAlert(alert)
    setDetailVisible(true)
  }

  // 表格列定义
  const columns = [
    {
      title: '告警标题',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      render: (text: string, record: AlertDetail) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '13px' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{record.type}</Text>
        </Space>
      )
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 70,
      align: 'center' as const,
      render: (level: keyof typeof levelConfig) => {
        const config = levelConfig[level]
        return (
          <Tag color={config.color}>{config.label}</Tag>
        )
      }
    },
    {
      title: '影响资产',
      dataIndex: 'affectedAsset',
      key: 'affectedAsset',
      width: 120,
      ellipsis: true
    },
    {
      title: '触发时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 90,
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '12px' }}>{dayjs(date).format('MM-DD HH:mm')}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{dayjs(date).fromNow()}</Text>
        </Space>
      )
    },
    {
      title: '持续',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => {
        if (!duration) return '-'
        const minutes = Math.floor(duration / 60)
        const hours = Math.floor(minutes / 60)
        if (hours > 0) {
          return `${hours}h${minutes % 60}m`
        }
        return `${minutes}m`
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center' as const,
      render: (status: keyof typeof statusConfig) => (
        <Tag color={statusConfig[status].color}>{statusConfig[status].label}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: AlertDetail) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            handleViewDetail(record)
          }}
        >
          详情
        </Button>
      )
    }
  ]

  return (
    <div className="alert-panel-content">
      {/* 统计概览 */}
      <div className="alert-summary">
        <Row gutter={16}>
          <Col flex="1">
            <Statistic
              title="紧急告警"
              value={summary.urgent}
              suffix="个"
              valueStyle={{ color: '#FF4D4F', fontSize: '20px', fontWeight: 600 }}
              prefix={<AlertOutlined />}
            />
          </Col>
          <Col flex="1">
            <Statistic
              title="警告告警"
              value={summary.warning}
              suffix="个"
              valueStyle={{ color: '#FAAD14', fontSize: '20px', fontWeight: 600 }}
              prefix={<AlertOutlined />}
            />
          </Col>
          <Col flex="1">
            <Statistic
              title="提醒告警"
              value={summary.info}
              suffix="个"
              valueStyle={{ color: '#1890FF', fontSize: '20px', fontWeight: 600 }}
              prefix={<AlertOutlined />}
            />
          </Col>
        </Row>
      </div>

      {/* 详细列表 */}
      <div className="alert-details">
        <Table
          columns={columns}
          dataSource={details}
          rowKey="id"
          size="small"
          pagination={{
            pageSize: 5,
            size: 'small',
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无告警数据"
              />
            )
          }}
          onRow={(record) => ({
            onClick: () => {
              if (onRowClick && record.affectedAssetId) {
                onRowClick(record.affectedAssetId)
              }
            },
            style: { cursor: onRowClick ? 'pointer' : 'default' }
          })}
        />
      </div>

      {/* 告警详情抽屉 */}
      <Drawer
        title={
          <Space>
            <span>告警详情</span>
            {selectedAlert && (
              <Tag icon={levelConfig[selectedAlert.level].icon} color={levelConfig[selectedAlert.level].color}>
                {levelConfig[selectedAlert.level].label}
              </Tag>
            )}
          </Space>
        }
        width="55%"
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        {selectedAlert && (
          <div>
            {/* 告警概要 */}
            <AntAlert
              message={selectedAlert.title}
              description={selectedAlert.description}
              type={selectedAlert.level === 'urgent' ? 'error' : selectedAlert.level === 'warning' ? 'warning' : 'info'}
              showIcon
              style={{ marginBottom: 24 }}
            />

            {/* 基本信息 */}
            <Descriptions title="基本信息" column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="告警ID">
                <Text code copyable>{selectedAlert.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="告警级别">
                <Tag icon={levelConfig[selectedAlert.level].icon} color={levelConfig[selectedAlert.level].color}>
                  {levelConfig[selectedAlert.level].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="告警状态">
                <Tag icon={statusConfig[selectedAlert.status].icon} color={statusConfig[selectedAlert.status].color}>
                  {statusConfig[selectedAlert.status].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="告警类型">
                <Text>{selectedAlert.type}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="影响资产">
                <Text strong>{selectedAlert.affectedAsset}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="触发时间">
                <Space direction="vertical" size={0}>
                  <Text>{dayjs(selectedAlert.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {dayjs(selectedAlert.timestamp).fromNow()}
                  </Text>
                </Space>
              </Descriptions.Item>
              {selectedAlert.duration && (
                <Descriptions.Item label="持续时长">
                  <Space>
                    <ClockCircleOutlined style={{ color: '#faad14' }} />
                    <Text>{Math.floor(selectedAlert.duration / 60)}分钟</Text>
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 详细描述 */}
            <Descriptions title="详细描述" column={1} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item>
                <Text>{selectedAlert.description}</Text>
              </Descriptions.Item>
            </Descriptions>

            {/* 处理建议 */}
            {selectedAlert.status === 'OPEN' && (
              <Descriptions title="处理建议" column={1} size="small">
                <Descriptions.Item>
                  <Text>1. 检查资产状态，确认问题原因</Text><br />
                  <Text>2. 采取相应措施解决问题</Text><br />
                  <Text>3. 确认问题解决后关闭告警</Text>
                </Descriptions.Item>
              </Descriptions>
            )}

            {/* 时间线 (如果已处理) */}
            {selectedAlert.status !== 'OPEN' && (
              <div style={{ marginTop: 24 }}>
                <Text strong style={{ fontSize: '14px', marginBottom: 12, display: 'block' }}>处理时间线</Text>
                <Timeline
                  items={[
                    {
                      color: 'red',
                      children: (
                        <div>
                          <Text strong>告警触发</Text>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            {dayjs(selectedAlert.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                        </div>
                      )
                    },
                    ...(selectedAlert.status === 'ACKNOWLEDGED' || selectedAlert.status === 'RESOLVED' ? [{
                      color: 'blue' as const,
                      children: (
                        <div>
                          <Text strong>告警确认</Text>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            {dayjs(selectedAlert.timestamp).add(5, 'minute').format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                        </div>
                      )
                    }] : []),
                    ...(selectedAlert.status === 'RESOLVED' ? [{
                      color: 'green' as const,
                      children: (
                        <div>
                          <Text strong>告警解决</Text>
                          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                            {dayjs(selectedAlert.timestamp).add(selectedAlert.duration || 0, 'second').format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                        </div>
                      )
                    }] : [])
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default AlertPanel
