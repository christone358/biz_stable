import React from 'react'
import { Card, List, Tag, Space, Button, Progress, Typography, Empty, Tooltip, Badge } from 'antd'
import {
  EyeOutlined,
  BellOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  AlertOutlined,
  BugOutlined,
  DatabaseOutlined,
  FireOutlined,
  WarningOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { CollaborationTask, TaskStatus, TaskPriority, TaskType } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text, Paragraph } = Typography

interface TaskListProps {
  tasks: CollaborationTask[]
  onViewDetail?: (task: CollaborationTask) => void
  onRemind?: (task: CollaborationTask) => void
  onEscalate?: (task: CollaborationTask) => void
}

/**
 * 任务列表组件
 * 展示协同任务列表,支持查看详情、催办等操作
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onViewDetail,
  onRemind,
  onEscalate
}) => {
  // 任务类型配置
  const taskTypeConfig: Record<TaskType, { label: string; icon: React.ReactNode; color: string }> = {
    alert: { label: '运行告警', icon: <AlertOutlined />, color: '#1890ff' },
    vulnerability: { label: '脆弱性', icon: <BugOutlined />, color: '#ff4d4f' },
    asset: { label: '资产运营', icon: <DatabaseOutlined />, color: '#faad14' }
  }

  // 状态配置
  const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode; color: string }> = {
    pending: { label: '待处理', icon: <ClockCircleOutlined />, color: 'orange' },
    processing: { label: '处理中', icon: <SyncOutlined spin />, color: 'blue' },
    completed: { label: '已完成', icon: <CheckCircleOutlined />, color: 'green' },
    overdue: { label: '已逾期', icon: <ExclamationCircleOutlined />, color: 'red' },
    ignored: { label: '已忽略', icon: <CloseCircleOutlined />, color: 'default' }
  }

  // 优先级配置
  const priorityConfig: Record<TaskPriority, { label: string; icon: React.ReactNode; color: string }> = {
    urgent: { label: '紧急', icon: <FireOutlined />, color: '#ff4d4f' },
    high: { label: '重要', icon: <WarningOutlined />, color: '#fa8c16' },
    medium: { label: '一般', icon: <ExclamationCircleOutlined />, color: '#faad14' },
    low: { label: '低', icon: <ClockCircleOutlined />, color: '#8c8c8c' }
  }

  // 判断任务是否即将逾期 (距离截止时间<24小时)
  const isNearDeadline = (task: CollaborationTask): boolean => {
    if (task.status === 'completed' || task.status === 'overdue' || task.status === 'ignored') {
      return false
    }
    const hoursLeft = dayjs(task.deadline).diff(dayjs(), 'hour')
    return hoursLeft > 0 && hoursLeft < 24
  }

  // 判断任务是否已逾期
  const isOverdue = (task: CollaborationTask): boolean => {
    return task.status === 'overdue' || (
      task.status !== 'completed' &&
      task.status !== 'ignored' &&
      dayjs().isAfter(dayjs(task.deadline))
    )
  }

  // 获取截止时间显示文本和颜色
  const getDeadlineInfo = (task: CollaborationTask) => {
    if (task.status === 'completed') {
      return {
        text: `已完成 ${dayjs(task.completedAt).format('MM-DD HH:mm')}`,
        color: '#52c41a'
      }
    }

    if (isOverdue(task)) {
      const overdueDays = dayjs().diff(dayjs(task.deadline), 'day')
      return {
        text: `逾期 ${overdueDays} 天`,
        color: '#ff4d4f'
      }
    }

    if (isNearDeadline(task)) {
      const hoursLeft = dayjs(task.deadline).diff(dayjs(), 'hour')
      return {
        text: `剩余 ${hoursLeft} 小时`,
        color: '#faad14'
      }
    }

    return {
      text: `截止 ${dayjs(task.deadline).format('MM-DD HH:mm')}`,
      color: '#595959'
    }
  }

  return (
    <Card size="small" style={{ marginTop: 16 }}>
      <List
        dataSource={tasks}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无任务数据"
            />
          )
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 个任务`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        renderItem={(task) => {
          const typeConfig = taskTypeConfig[task.type]
          const statusCfg = statusConfig[task.status]
          const priorityCfg = priorityConfig[task.priority]
          const deadlineInfo = getDeadlineInfo(task)

          return (
            <List.Item
              key={task.id}
              style={{
                background: isOverdue(task)
                  ? '#fff1f0'
                  : isNearDeadline(task)
                  ? '#fffbe6'
                  : '#ffffff',
                border: isOverdue(task)
                  ? '1px solid #ffccc7'
                  : isNearDeadline(task)
                  ? '1px solid #ffe58f'
                  : undefined,
                borderRadius: 8,
                marginBottom: 12,
                padding: '16px 24px'
              }}
              actions={[
                <Button
                  key="view"
                  type="link"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetail?.(task)}
                >
                  详情
                </Button>,
                task.status === 'pending' || task.status === 'processing' ? (
                  <Tooltip key="remind" title="向责任单位发送催办提醒">
                    <Button
                      type="link"
                      size="small"
                      icon={<BellOutlined />}
                      onClick={() => onRemind?.(task)}
                    >
                      催办
                    </Button>
                  </Tooltip>
                ) : null,
                isOverdue(task) && onEscalate ? (
                  <Tooltip key="escalate" title="将逾期任务升级处理">
                    <Button
                      type="link"
                      size="small"
                      danger
                      icon={<ExclamationCircleOutlined />}
                      onClick={() => onEscalate?.(task)}
                    >
                      升级
                    </Button>
                  </Tooltip>
                ) : null
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ width: 48, textAlign: 'center' }}>
                    {isOverdue(task) && (
                      <Badge
                        count="逾期"
                        style={{
                          backgroundColor: '#ff4d4f',
                          fontSize: 10,
                          padding: '0 4px',
                          height: 16,
                          lineHeight: '16px'
                        }}
                      />
                    )}
                    {isNearDeadline(task) && !isOverdue(task) && (
                      <Badge
                        count="紧急"
                        style={{
                          backgroundColor: '#faad14',
                          fontSize: 10,
                          padding: '0 4px',
                          height: 16,
                          lineHeight: '16px'
                        }}
                      />
                    )}
                  </div>
                }
                title={
                  <Space wrap style={{ width: '100%' }}>
                    {/* 优先级标签 */}
                    <Tag icon={priorityCfg.icon} color={priorityCfg.color}>
                      {priorityCfg.label}
                    </Tag>

                    {/* 任务标题 */}
                    <Text strong style={{ fontSize: 15 }}>
                      {task.title}
                    </Text>

                    {/* 任务类型 */}
                    <Tag icon={typeConfig.icon} color={typeConfig.color}>
                      {typeConfig.label}
                    </Tag>

                    {/* 任务状态 */}
                    <Tag icon={statusCfg.icon} color={statusCfg.color}>
                      {statusCfg.label}
                    </Tag>
                  </Space>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    {/* 任务描述 */}
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: false }}
                      style={{ marginBottom: 12, color: '#595959' }}
                    >
                      {task.description}
                    </Paragraph>

                    {/* 任务详细信息 */}
                    <Space split="|" wrap>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        任务编号: <Text code copyable style={{ fontSize: 12 }}>{task.taskNo}</Text>
                      </Text>

                      <Text type="secondary" style={{ fontSize: 12 }}>
                        责任单位: <Text strong style={{ color: '#1890ff' }}>{task.responsibleUnit}</Text>
                        {task.responsiblePerson && ` - ${task.responsiblePerson}`}
                      </Text>

                      <Text type="secondary" style={{ fontSize: 12 }}>
                        影响业务: <Text strong>{task.affectedBusiness}</Text>
                      </Text>

                      <Text type="secondary" style={{ fontSize: 12 }}>
                        创建时间: {dayjs(task.createdAt).format('YYYY-MM-DD HH:mm')}
                        <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                          ({dayjs(task.createdAt).fromNow()})
                        </Text>
                      </Text>

                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          color: deadlineInfo.color,
                          fontWeight: isOverdue(task) || isNearDeadline(task) ? 600 : 400
                        }}
                      >
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {deadlineInfo.text}
                      </Text>
                    </Space>

                    {/* 进度条 (处理中状态显示) */}
                    {task.status === 'processing' && task.progress > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <Progress
                          percent={task.progress}
                          size="small"
                          status={task.progress === 100 ? 'success' : 'active'}
                          strokeColor={
                            isOverdue(task)
                              ? '#ff4d4f'
                              : isNearDeadline(task)
                              ? '#faad14'
                              : '#1890ff'
                          }
                        />
                      </div>
                    )}

                    {/* 特定类型任务的额外信息 */}
                    {task.alertInfo && (
                      <div style={{ marginTop: 8 }}>
                        <Space size="small">
                          <Tag color="blue" style={{ fontSize: 11 }}>
                            告警级别: {
                              task.alertInfo.alertLevel === 'critical' ? '紧急' :
                              task.alertInfo.alertLevel === 'important' ? '重要' : '一般'
                            }
                          </Tag>
                          <Tag color="cyan" style={{ fontSize: 11 }}>
                            关联资产: {task.alertInfo.relatedAsset}
                          </Tag>
                        </Space>
                      </div>
                    )}

                    {task.vulnerabilityInfo && (
                      <div style={{ marginTop: 8 }}>
                        <Space size="small">
                          <Tag color="red" style={{ fontSize: 11 }}>
                            CVE: {task.vulnerabilityInfo.cveId}
                          </Tag>
                          <Tag
                            color={
                              task.vulnerabilityInfo.riskLevel === 'high' ? 'red' :
                              task.vulnerabilityInfo.riskLevel === 'medium' ? 'orange' : 'green'
                            }
                            style={{ fontSize: 11 }}
                          >
                            风险等级: {
                              task.vulnerabilityInfo.riskLevel === 'high' ? '高危' :
                              task.vulnerabilityInfo.riskLevel === 'medium' ? '中危' : '低危'
                            }
                          </Tag>
                          <Tag color="volcano" style={{ fontSize: 11 }}>
                            受影响资产: {task.vulnerabilityInfo.affectedAsset}
                          </Tag>
                        </Space>
                      </div>
                    )}

                    {task.assetInfo && (
                      <div style={{ marginTop: 8 }}>
                        <Space size="small">
                          <Tag color="gold" style={{ fontSize: 11 }}>
                            资产类型: {task.assetInfo.assetType}
                          </Tag>
                          <Tag color="purple" style={{ fontSize: 11 }}>
                            处置类型: {
                              task.assetInfo.disposalType === 'claim' ? '资产认领' :
                              task.assetInfo.disposalType === 'compliance' ? '合规处置' : '责任确认'
                            }
                          </Tag>
                        </Space>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )
        }}
      />
    </Card>
  )
}

export default TaskList
