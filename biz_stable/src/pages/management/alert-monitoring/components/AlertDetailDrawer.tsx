import React, { useState } from 'react'
import { Drawer, Tabs, Card, Descriptions, Tag, Timeline, Space, Typography, Row, Col, Alert, Empty, Button } from 'antd'
import {
  ExclamationCircleOutlined,
  WarningOutlined,
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { AlertRecord, AlertLevel, AlertStatus, ResourceType } from '../types'
import './AlertDetailDrawer.css'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text, Title, Paragraph } = Typography

interface AlertDetailDrawerProps {
  visible: boolean
  alert: AlertRecord | null
  onClose: () => void
  onAssign?: (alert: AlertRecord) => void
}

/**
 * 告警详情抽屉组件
 * 展示完整的告警信息、时间线、处理历史
 */
const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  visible,
  alert,
  onClose,
  onAssign
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  if (!alert) {
    return null
  }

  // 告警等级配置
  const levelConfig = {
    emergency: {
      color: '#ff4d4f',
      icon: <FireOutlined />,
      label: '紧急',
      bgColor: '#fff1f0'
    },
    severe: {
      color: '#fa8c16',
      icon: <ExclamationCircleOutlined />,
      label: '严重',
      bgColor: '#fff7e6'
    },
    warning: {
      color: '#faad14',
      icon: <WarningOutlined />,
      label: '告警',
      bgColor: '#fffbe6'
    }
  }

  // 状态配置
  const statusConfig = {
    pending: {
      color: 'default',
      icon: <ClockCircleOutlined />,
      label: '待指派'
    },
    toProcess: {
      color: 'blue',
      icon: <InfoCircleOutlined />,
      label: '待处理'
    },
    processing: {
      color: 'processing',
      icon: <SyncOutlined spin />,
      label: '处理中'
    },
    toClose: {
      color: 'warning',
      icon: <ExclamationCircleOutlined />,
      label: '待关闭'
    },
    closed: {
      color: 'success',
      icon: <CheckCircleOutlined />,
      label: '已关闭'
    }
  }

  // 资源类型配置
  const resourceTypeConfig: Record<ResourceType, string> = {
    webService: 'Web服务',
    databaseService: '数据库服务',
    middlewareService: '中间件服务',
    apiService: 'API服务',
    cacheService: '缓存服务',
    operatingSystem: '操作系统',
    databaseSystem: '数据库系统',
    applicationServer: '应用服务器',
    messageQueue: '消息队列',
    server: '服务器',
    networkDevice: '网络设备',
    storageDevice: '存储设备',
    securityDevice: '安全设备'
  }

  const config = levelConfig[alert.level]
  const statusCfg = statusConfig[alert.status]

  // 计算告警持续时间
  const alertDuration = dayjs().diff(dayjs(alert.discoveredTime), 'minute')
  const durationText = alertDuration < 60
    ? `${alertDuration}分钟`
    : alertDuration < 1440
      ? `${Math.floor(alertDuration / 60)}小时${alertDuration % 60}分钟`
      : `${Math.floor(alertDuration / 1440)}天${Math.floor((alertDuration % 1440) / 60)}小时`

  // 模拟处理时间线数据
  const timelineData = [
    {
      timestamp: alert.discoveredTime,
      action: '告警发现',
      operator: '系统',
      description: `检测到${alert.alertObject}出现异常`
    }
  ]

  if (alert.assignee) {
    timelineData.push({
      timestamp: dayjs(alert.discoveredTime).add(5, 'minute').toISOString(),
      action: '告警指派',
      operator: '运维管理员',
      description: `指派给 ${alert.assignee}`
    })
  }

  if (alert.status === 'processing') {
    timelineData.push({
      timestamp: dayjs(alert.discoveredTime).add(15, 'minute').toISOString(),
      action: '开始处理',
      operator: alert.assignee || '责任人',
      description: '已开始处理该告警'
    })
  }

  if (alert.status === 'closed') {
    timelineData.push({
      timestamp: dayjs(alert.discoveredTime).add(30, 'minute').toISOString(),
      action: '告警关闭',
      operator: alert.assignee || '责任人',
      description: '告警已处理完成并关闭'
    })
  }

  // 基本信息Tab
  const BasicInfoTab = (
    <div className="alert-detail-basic-info">
      {/* 告警头部摘要 */}
      <Alert
        message={
          <Space>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>{alert.name}</span>
            <Tag icon={config.icon} color={config.color}>
              {config.label}
            </Tag>
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          </Space>
        }
        description={alert.description}
        type={alert.level === 'emergency' ? 'error' : alert.level === 'severe' ? 'warning' : 'info'}
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 告警基本信息 */}
      <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="告警ID">
            <Text code copyable>{alert.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="告警等级">
            <Tag icon={config.icon} color={config.color}>
              {config.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="告警状态">
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="发现时间">
            <Space direction="vertical" size={0}>
              <Text>{dayjs(alert.discoveredTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {dayjs(alert.discoveredTime).fromNow()}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="持续时长">
            <Space>
              <ClockCircleOutlined style={{ color: alert.status === 'closed' ? '#52c41a' : '#faad14' }} />
              <Text strong={alert.status !== 'closed'}>{durationText}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="处置责任人">
            {alert.assignee ? (
              <Space>
                <UserOutlined />
                <Text>{alert.assignee}</Text>
              </Space>
            ) : (
              <Text type="secondary">未指派</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 告警对象信息 */}
      <Card title="告警对象" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="告警对象">
            <Text strong>{alert.alertObject}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="资源类型">
            <Tag color="blue">{resourceTypeConfig[alert.resourceType]}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 告警描述 */}
      <Card title="详细描述" size="small" style={{ marginBottom: 16 }}>
        <Paragraph style={{ marginBottom: 0 }}>
          {alert.description}
        </Paragraph>
      </Card>

      {/* 影响分析 (模拟数据) */}
      <Card title="影响分析" size="small">
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                {alert.level === 'emergency' ? '高' : alert.level === 'severe' ? '中' : '低'}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>影响程度</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                {alert.level === 'emergency' ? '1' : alert.level === 'severe' ? '3' : '5'}个
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>受影响系统</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#faad14' }}>
                {alert.level === 'emergency' ? '15' : alert.level === 'severe' ? '8' : '3'}分钟
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>建议处理时间</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )

  // 处理历史Tab
  const HistoryTab = (
    <div className="alert-detail-history">
      <Card title="处理时间线" size="small">
        <Timeline
          items={timelineData.map((item, index) => ({
            color: index === 0 ? 'red' : index === timelineData.length - 1 && alert.status === 'closed' ? 'green' : 'blue',
            children: (
              <div>
                <div style={{ marginBottom: 4 }}>
                  <Text strong>{item.action}</Text>
                  <Text type="secondary" style={{ marginLeft: 12, fontSize: '12px' }}>
                    {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  操作人: {item.operator}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  {item.description}
                </div>
              </div>
            )
          }))}
        />
      </Card>

      {alert.status === 'closed' && (
        <Card title="处理结果" size="small" style={{ marginTop: 16 }}>
          <Alert
            message="告警已处理完成"
            description="经过排查，该告警由于临时网络波动导致，已恢复正常。已优化监控阈值避免类似误报。"
            type="success"
            showIcon
          />
        </Card>
      )}
    </div>
  )

  // 相关信息Tab (预留)
  const RelatedTab = (
    <div className="alert-detail-related">
      <Card title="相关告警" size="small" style={{ marginBottom: 16 }}>
        <Empty description="暂无相关告警" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
      <Card title="关联日志" size="small">
        <Empty description="暂无关联日志" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    </div>
  )

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: BasicInfoTab
    },
    {
      key: 'history',
      label: '处理历史',
      children: HistoryTab
    },
    {
      key: 'related',
      label: '相关信息',
      children: RelatedTab
    }
  ]

  return (
    <Drawer
      title={
        <Space>
          <span>告警详情</span>
          {alert.status !== 'closed' && alert.status !== 'pending' && (
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          )}
        </Space>
      }
      width="65%"
      open={visible}
      onClose={onClose}
      extra={
        alert.status === 'pending' && onAssign && (
          <Button type="primary" onClick={() => onAssign(alert)}>
            指派
          </Button>
        )
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Drawer>
  )
}

export default AlertDetailDrawer
