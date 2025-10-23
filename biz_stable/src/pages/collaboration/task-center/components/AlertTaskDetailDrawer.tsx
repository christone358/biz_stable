import React, { useState } from 'react'
import { Drawer, Descriptions, Tag, Timeline, Tabs, Card, Alert as AntAlert, Space, Typography, Row, Col, Button } from 'antd'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  AlertOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { Alert } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text, Title } = Typography

interface AlertTaskDetailDrawerProps {
  visible: boolean
  alert: Alert | null
  onClose: () => void
  onHandle?: (id: string) => void
}

/**
 * 告警任务详情抽屉
 * 展示任务的详细信息和执行记录
 */
const AlertTaskDetailDrawer: React.FC<AlertTaskDetailDrawerProps> = ({
  visible,
  alert,
  onClose,
  onHandle
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  if (!alert) {
    return null
  }

  // 告警级别配置
  const levelConfig = {
    critical: { color: '#ff4d4f', icon: <ExclamationCircleOutlined />, label: '紧急' },
    important: { color: '#fa8c16', icon: <AlertOutlined />, label: '重要' },
    normal: { color: '#faad14', icon: <ClockCircleOutlined />, label: '一般' }
  }

  // 状态配置
  const statusConfig = {
    unhandled: { color: 'red', icon: <CloseCircleOutlined />, label: '未处理' },
    processing: { color: 'blue', icon: <ClockCircleOutlined />, label: '处理中' },
    resolved: { color: 'green', icon: <CheckCircleOutlined />, label: '已解决' },
    ignored: { color: 'default', icon: <ExclamationCircleOutlined />, label: '已忽略' }
  }

  const config = levelConfig[alert.level]
  const statusCfg = statusConfig[alert.status]

  // 模拟执行记录数据
  const executionRecords = [
    {
      timestamp: alert.occurTime,
      action: '任务创建',
      operator: '系统',
      description: `检测到告警：${alert.name}`,
      status: 'created'
    }
  ]

  if (alert.status === 'processing' || alert.status === 'resolved' || alert.status === 'ignored') {
    executionRecords.push({
      timestamp: dayjs(alert.occurTime).add(10, 'minute').toISOString(),
      action: '任务指派',
      operator: '运维管理员',
      description: '已指派给张三处理',
      status: 'assigned'
    })
  }

  if (alert.status === 'processing' || alert.status === 'resolved') {
    executionRecords.push({
      timestamp: dayjs(alert.occurTime).add(20, 'minute').toISOString(),
      action: '开始处理',
      operator: '张三',
      description: '已确认并开始处理该告警',
      status: 'processing'
    })
  }

  if (alert.status === 'resolved') {
    executionRecords.push({
      timestamp: dayjs(alert.occurTime).add(45, 'minute').toISOString(),
      action: '处理完成',
      operator: '张三',
      description: '告警已处理完成，问题已解决',
      status: 'completed'
    })
  }

  if (alert.status === 'ignored') {
    executionRecords.push({
      timestamp: dayjs(alert.occurTime).add(15, 'minute').toISOString(),
      action: '告警忽略',
      operator: '李四',
      description: '告警被标记为忽略：非业务影响性告警',
      status: 'ignored'
    })
  }

  // 基本信息Tab
  const BasicInfoTab = (
    <div style={{ padding: '8px 0' }}>
      {/* 告警概要 */}
      <AntAlert
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
        description={`影响业务：${alert.affectedBusiness}`}
        type={alert.level === 'critical' ? 'error' : alert.level === 'important' ? 'warning' : 'info'}
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 基本信息 */}
      <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="任务ID">
            <Text code copyable>{alert.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="告警级别">
            <Tag icon={config.icon} color={config.color}>
              {config.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="任务状态">
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="发生时间">
            <Space direction="vertical" size={0}>
              <Text>{dayjs(alert.occurTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {dayjs(alert.occurTime).fromNow()}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="持续时间">
            <Space>
              <ClockCircleOutlined style={{ color: alert.status === 'resolved' ? '#52c41a' : '#faad14' }} />
              <Text strong={alert.status !== 'resolved'}>{alert.duration}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="影响业务">
            <Text strong>{alert.affectedBusiness}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 关联资产信息 */}
      <Card title="关联资产" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="资产名称">
            <Text strong>{alert.relatedAsset.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="IP地址">
            <Text code>{alert.relatedAsset.ipAddress}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 处理信息 (如果已处理) */}
      {alert.status === 'resolved' && (
        <Card title="处理结果" size="small">
          <AntAlert
            message="告警已处理完成"
            description="经排查，该告警由于网络波动导致，已恢复正常。已优化监控阈值避免类似误报。"
            type="success"
            showIcon
          />
          <Descriptions column={1} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="原因分析">
              网络瞬时波动导致连接超时
            </Descriptions.Item>
            <Descriptions.Item label="处理措施">
              1. 检查网络设备状态
              <br />
              2. 调整监控告警阈值
              <br />
              3. 优化应用重试机制
            </Descriptions.Item>
            <Descriptions.Item label="处理人员">
              <Space>
                <UserOutlined />
                <Text>张三</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* 忽略信息 (如果已忽略) */}
      {alert.status === 'ignored' && (
        <Card title="忽略信息" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="忽略原因">
              非业务影响性告警
            </Descriptions.Item>
            <Descriptions.Item label="详细说明">
              该告警为测试环境告警，不影响生产业务，已确认可忽略
            </Descriptions.Item>
            <Descriptions.Item label="忽略时长">
              永久忽略
            </Descriptions.Item>
            <Descriptions.Item label="操作人员">
              <Space>
                <UserOutlined />
                <Text>李四</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  )

  // 执行记录Tab
  const ExecutionRecordsTab = (
    <div style={{ padding: '8px 0' }}>
      <Card title="执行时间线" size="small">
        <Timeline
          items={executionRecords.map((record, index) => {
            const colorMap: Record<string, 'red' | 'blue' | 'green' | 'gray'> = {
              created: 'red',
              assigned: 'blue',
              processing: 'blue',
              completed: 'green',
              ignored: 'gray'
            }

            return {
              color: colorMap[record.status] || 'blue',
              children: (
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong>{record.action}</Text>
                    <Text type="secondary" style={{ marginLeft: 12, fontSize: '12px' }}>
                      {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    操作人: {record.operator}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {record.description}
                  </div>
                </div>
              )
            }
          })}
        />
      </Card>

      {/* 处理统计 */}
      <Card title="处理统计" size="small" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                {executionRecords.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>执行步骤</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                {dayjs().diff(dayjs(alert.occurTime), 'minute')}分钟
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>总耗时</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#fa8c16' }}>
                {executionRecords.filter(r => r.operator !== '系统').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>人工操作</div>
            </div>
          </Col>
        </Row>
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
      key: 'execution',
      label: '执行记录',
      children: ExecutionRecordsTab
    }
  ]

  return (
    <Drawer
      title={
        <Space>
          <span>告警任务详情</span>
          {alert.status !== 'resolved' && alert.status !== 'ignored' && (
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
        alert.status === 'unhandled' && onHandle && (
          <Button type="primary" onClick={() => onHandle(alert.id)}>
            立即处理
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

export default AlertTaskDetailDrawer
