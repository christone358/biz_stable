import React, { useState } from 'react'
import { Drawer, Descriptions, Tag, Timeline, Tabs, Card, Space, Typography, Row, Col, Progress, Button, message } from 'antd'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  BellOutlined,
  FireOutlined,
  WarningOutlined,
  AlertOutlined,
  BugOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { CollaborationTask } from '../types'
import { generateTaskExecutionRecords } from '../mock/task-data'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography

interface TaskDetailDrawerProps {
  visible: boolean
  task: CollaborationTask | null
  onClose: () => void
  onRemind?: (taskId: string) => void
}

/**
 * 任务详情抽屉组件
 * 展示协同任务的详细信息和执行记录
 */
const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  visible,
  task,
  onClose,
  onRemind
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  if (!task) {
    return null
  }

  // 状态配置
  const statusConfig = {
    pending: { color: 'orange', icon: <ClockCircleOutlined />, label: '待处理' },
    processing: { color: 'blue', icon: <ClockCircleOutlined />, label: '处理中' },
    completed: { color: 'green', icon: <CheckCircleOutlined />, label: '已完成' },
    overdue: { color: 'red', icon: <ExclamationCircleOutlined />, label: '已逾期' },
    ignored: { color: 'default', icon: <CloseCircleOutlined />, label: '已忽略' }
  }

  // 优先级配置
  const priorityConfig = {
    urgent: { color: '#ff4d4f', icon: <FireOutlined />, label: '紧急' },
    high: { color: '#fa8c16', icon: <WarningOutlined />, label: '重要' },
    medium: { color: '#faad14', icon: <ExclamationCircleOutlined />, label: '一般' },
    low: { color: '#8c8c8c', icon: <ClockCircleOutlined />, label: '低' }
  }

  // 任务类型配置
  const taskTypeConfig = {
    alert: { label: '运行告警处置', icon: <AlertOutlined />, color: '#1890ff' },
    vulnerability: { label: '脆弱性处置', icon: <BugOutlined />, color: '#ff4d4f' },
    asset: { label: '资产运营', icon: <DatabaseOutlined />, color: '#faad14' }
  }

  const statusCfg = statusConfig[task.status]
  const priorityCfg = priorityConfig[task.priority]
  const typeCfg = taskTypeConfig[task.type]

  // 判断是否逾期或即将逾期
  const isOverdue = task.status === 'overdue' || (
    task.status !== 'completed' &&
    task.status !== 'ignored' &&
    dayjs().isAfter(dayjs(task.deadline))
  )

  const isNearDeadline = !isOverdue &&
    task.status !== 'completed' &&
    task.status !== 'ignored' &&
    dayjs(task.deadline).diff(dayjs(), 'hour') < 24

  // 获取执行记录
  const executionRecords = generateTaskExecutionRecords(task)

  // 催办处理
  const handleRemind = () => {
    onRemind?.(task.id)
    message.success(`已向${task.responsibleUnit}发送催办提醒`)
  }

  // 基本信息Tab
  const BasicInfoTab = (
    <div style={{ padding: '8px 0' }}>
      {/* 任务概要 */}
      <Card
        title="任务信息"
        size="small"
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Tag icon={typeCfg.icon} color={typeCfg.color}>
              {typeCfg.label}
            </Tag>
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          </Space>
        }
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="任务编号">
            <Text code copyable>{task.taskNo}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="任务ID">
            <Text code copyable>{task.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="任务标题" span={2}>
            <Text strong style={{ fontSize: 14 }}>{task.title}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="任务描述" span={2}>
            {task.description}
          </Descriptions.Item>
          <Descriptions.Item label="优先级">
            <Tag icon={priorityCfg.icon} color={priorityCfg.color}>
              {priorityCfg.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="任务状态">
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="影响业务">
            <Text strong>{task.affectedBusiness}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="进度">
            <Progress
              percent={task.progress}
              size="small"
              style={{ width: 150 }}
              status={task.progress === 100 ? 'success' : 'active'}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 责任信息 */}
      <Card title="责任信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="责任单位">
            <Space>
              <UserOutlined />
              <Text strong style={{ color: '#1890ff' }}>{task.responsibleUnit}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="责任人">
            {task.responsiblePerson || <Text type="secondary">待指派</Text>}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 时间信息 */}
      <Card title="时间信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="创建时间">
            <Space direction="vertical" size={0}>
              <Text>{dayjs(task.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(task.createdAt).fromNow()}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="截止时间">
            <Space direction="vertical" size={0}>
              <Text style={{ color: isOverdue ? '#ff4d4f' : isNearDeadline ? '#faad14' : undefined }}>
                {dayjs(task.deadline).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  color: isOverdue ? '#ff4d4f' : isNearDeadline ? '#faad14' : undefined
                }}
              >
                {isOverdue
                  ? `已逾期 ${dayjs().diff(dayjs(task.deadline), 'day')} 天`
                  : `剩余 ${dayjs(task.deadline).diff(dayjs(), 'hour')} 小时`
                }
              </Text>
            </Space>
          </Descriptions.Item>
          {task.startedAt && (
            <Descriptions.Item label="开始处理时间">
              <Space direction="vertical" size={0}>
                <Text>{dayjs(task.startedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(task.startedAt).fromNow()}
                </Text>
              </Space>
            </Descriptions.Item>
          )}
          {task.completedAt && (
            <Descriptions.Item label="完成时间">
              <Space direction="vertical" size={0}>
                <Text>{dayjs(task.completedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(task.completedAt).fromNow()}
                </Text>
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 特定类型任务的额外信息 */}
      {task.alertInfo && (
        <Card title="告警信息" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="告警ID">
              <Text code copyable>{task.alertInfo.alertId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="告警级别">
              <Tag color={
                task.alertInfo.alertLevel === 'critical' ? 'red' :
                task.alertInfo.alertLevel === 'important' ? 'orange' : 'blue'
              }>
                {task.alertInfo.alertLevel === 'critical' ? '紧急' :
                 task.alertInfo.alertLevel === 'important' ? '重要' : '一般'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关联资产" span={2}>
              <Text code>{task.alertInfo.relatedAsset}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {task.vulnerabilityInfo && (
        <Card title="脆弱性信息" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="CVE编号">
              <Text code copyable>{task.vulnerabilityInfo.cveId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="风险等级">
              <Tag color={
                task.vulnerabilityInfo.riskLevel === 'high' ? 'red' :
                task.vulnerabilityInfo.riskLevel === 'medium' ? 'orange' : 'green'
              }>
                {task.vulnerabilityInfo.riskLevel === 'high' ? '高危' :
                 task.vulnerabilityInfo.riskLevel === 'medium' ? '中危' : '低危'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="受影响资产" span={2}>
              <Text code>{task.vulnerabilityInfo.affectedAsset}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {task.assetInfo && (
        <Card title="资产信息" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="资产ID">
              <Text code copyable>{task.assetInfo.assetId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="资产名称">
              <Text strong>{task.assetInfo.assetName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="资产类型">
              <Tag>{task.assetInfo.assetType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="处置类型">
              <Tag color="purple">
                {task.assetInfo.disposalType === 'claim' ? '资产认领' :
                 task.assetInfo.disposalType === 'compliance' ? '合规处置' : '责任确认'}
              </Tag>
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
          items={executionRecords.map((record) => {
            const colorMap: Record<string, 'red' | 'blue' | 'green' | 'gray' | 'orange'> = {
              created: 'blue',
              assigned: 'blue',
              processing: 'blue',
              progress: 'blue',
              completed: 'green',
              accepted: 'green',
              overdue: 'red'
            }

            return {
              color: colorMap[record.status] || 'blue',
              children: (
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong>{record.action}</Text>
                    <Text type="secondary" style={{ marginLeft: 12, fontSize: 12 }}>
                      {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    操作人: {record.operator}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
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
                {task.completedAt
                  ? `${dayjs(task.completedAt).diff(dayjs(task.createdAt), 'hour')}h`
                  : `${dayjs().diff(dayjs(task.createdAt), 'hour')}h`
                }
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                {task.completedAt ? '完成用时' : '已耗时'}
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#fa8c16' }}>
                {executionRecords.filter(r => !r.operator.includes('系统')).length}
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
          <span>协同任务详情</span>
          {(task.status === 'pending' || task.status === 'processing') && (
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
        (task.status === 'pending' || task.status === 'processing') && onRemind && (
          <Button
            type="primary"
            icon={<BellOutlined />}
            onClick={handleRemind}
          >
            催办
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

export default TaskDetailDrawer
