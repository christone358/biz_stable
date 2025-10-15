import React, { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Typography } from 'antd'
import { AlertOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons'
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
}

const AlertPanel: React.FC<AlertPanelProps> = ({ summary, details }) => {
  const [expandedPanel, setExpandedPanel] = useState(false)

  // 告警级别配置
  const levelConfig = {
    urgent: { color: '#FF4D4F', label: '紧急', bgColor: '#fff1f0' },
    warning: { color: '#FAAD14', label: '警告', bgColor: '#fffbe6' },
    info: { color: '#1890FF', label: '提醒', bgColor: '#e6f7ff' }
  }

  // 状态配置
  const statusConfig = {
    OPEN: { color: 'red', label: '待处理' },
    ACKNOWLEDGED: { color: 'orange', label: '已确认' },
    RESOLVED: { color: 'green', label: '已解决' }
  }

  // 表格列定义
  const columns = [
    {
      title: '告警标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string, record: AlertDetail) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.type}</Text>
        </Space>
      )
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
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
      width: 150
    },
    {
      title: '触发时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120,
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('MM-DD HH:mm')}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(date).fromNow()}</Text>
        </Space>
      )
    },
    {
      title: '持续时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => {
        if (!duration) return '-'
        const minutes = Math.floor(duration / 60)
        const hours = Math.floor(minutes / 60)
        if (hours > 0) {
          return `${hours}小时${minutes % 60}分钟`
        }
        return `${minutes}分钟`
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center' as const,
      render: (status: keyof typeof statusConfig) => (
        <Tag color={statusConfig[status].color}>{statusConfig[status].label}</Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: AlertDetail) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => console.log('查看告警详情:', record.id)}
          >
            详情
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Card
      title={
        <Space>
          <AlertOutlined style={{ color: '#FF4D4F' }} />
          <span>待处置告警</span>
        </Space>
      }
      className="alert-panel"
      bordered={false}
      bodyStyle={{ padding: 24 }}
      extra={
        <Button
          type="link"
          onClick={() => setExpandedPanel(!expandedPanel)}
        >
          {expandedPanel ? '收起' : '展开详情'}
        </Button>
      }
    >
      {/* 统计概览 */}
      <div className="alert-summary">
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <div className="summary-item urgent">
              <Statistic
                title="紧急告警"
                value={summary.urgent}
                suffix="个"
                valueStyle={{ color: '#FF4D4F', fontSize: '24px', fontWeight: 600 }}
                prefix={<AlertOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="summary-item warning">
              <Statistic
                title="警告告警"
                value={summary.warning}
                suffix="个"
                valueStyle={{ color: '#FAAD14', fontSize: '24px', fontWeight: 600 }}
                prefix={<AlertOutlined />}
              />
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="summary-item info">
              <Statistic
                title="提醒告警"
                value={summary.info}
                suffix="个"
                valueStyle={{ color: '#1890FF', fontSize: '24px', fontWeight: 600 }}
                prefix={<AlertOutlined />}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* 详细列表 */}
      {expandedPanel && (
        <div className="alert-details" style={{ marginTop: 16 }}>
          <Table
            columns={columns}
            dataSource={details}
            rowKey="id"
            size="middle"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`
            }}
            scroll={{ x: 900 }}
            rowClassName={(record) => {
              if (record.level === 'urgent') return 'alert-row-urgent'
              if (record.level === 'warning') return 'alert-row-warning'
              return 'alert-row-info'
            }}
          />
        </div>
      )}
    </Card>
  )
}

export default AlertPanel
