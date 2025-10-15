import React from 'react'
import { Row, Col, Statistic, Table, Tag, Button, Space, Typography, Empty } from 'antd'
import { AlertOutlined, EyeOutlined } from '@ant-design/icons'
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
  // 告警级别配置
  const levelConfig = {
    urgent: { color: '#FF4D4F', label: '紧急' },
    warning: { color: '#FAAD14', label: '警告' },
    info: { color: '#1890FF', label: '提醒' }
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
          rowClassName={(record) => {
            if (record.level === 'urgent') return 'alert-row-urgent'
            if (record.level === 'warning') return 'alert-row-warning'
            return 'alert-row-info'
          }}
        />
      </div>
    </div>
  )
}

export default AlertPanel
