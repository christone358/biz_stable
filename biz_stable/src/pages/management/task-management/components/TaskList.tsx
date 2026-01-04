import React from 'react'
import { Card, List, Tag, Space, Button, Typography, Empty, Divider, theme } from 'antd'
import {
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  AlertOutlined,
  BugOutlined,
  DatabaseOutlined,
  FireOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { CollaborationTask, TaskType, TaskStatusView } from '../types'
import { getViewStatusByTaskStatus } from '../status-utils'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography

interface TaskListProps {
  tasks: CollaborationTask[]
  onViewDetail?: (task: CollaborationTask) => void
}

/**
 * 任务列表组件
 * 展示协同任务列表,支持查看详情、催办等操作
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onViewDetail,
}) => {
  const { token } = theme.useToken()
  // 任务类型配置
  const taskTypeConfig: Record<TaskType, { label: string; icon: React.ReactNode; color: string }> = {
    alert: { label: '运行告警', icon: <AlertOutlined />, color: '#1890ff' },
    vulnerability: { label: '脆弱性', icon: <BugOutlined />, color: '#ff4d4f' },
    asset: { label: '资产运营', icon: <DatabaseOutlined />, color: '#faad14' }
  }

  // 优先级样式
  const priorityConfig = {
    urgent: { color: token.colorError, icon: <FireOutlined />, label: '紧急' },
    high: { color: token.colorWarning, icon: <WarningOutlined />, label: '重要' },
    medium: { color: token.colorInfo, icon: <ExclamationCircleOutlined />, label: '一般' },
    low: { color: token.colorTextQuaternary, icon: <ClockCircleOutlined />, label: '低' },
  }

  // 状态配置（展示层级）
  const statusConfig: Record<Exclude<TaskStatusView, 'all'>, { label: string; icon: React.ReactNode; color: string }> = {
    inProgress: { label: '处置中', icon: <SyncOutlined spin />, color: token.colorInfo },
    completed: { label: '已完成', icon: <CheckCircleOutlined />, color: token.colorSuccess },
    voided: { label: '已作废', icon: <CloseCircleOutlined />, color: token.colorTextQuaternary },
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

  // 获取时间字段信息
  const getTimeFieldInfo = (task: CollaborationTask) => {
    const deadline = dayjs(task.deadline)

    if (task.status === 'completed' && task.completedAt) {
      return {
        label: '完成时间',
        value: dayjs(task.completedAt).format('YYYY-MM-DD HH:mm'),
        helper: '',
        color: token.colorSuccess,
      }
    }

    if (isOverdue(task)) {
      const overdueHours = Math.max(dayjs().diff(deadline, 'hour'), 1)
      const helper = overdueHours >= 24
        ? `已逾期 ${Math.floor(overdueHours / 24)} 天`
        : `已逾期 ${overdueHours} 小时`

      return {
        label: '逾期时间',
        value: deadline.format('YYYY-MM-DD HH:mm'),
        helper,
        color: token.colorError,
      }
    }

    const hoursLeft = deadline.diff(dayjs(), 'hour')
    return {
      label: '截止时间',
      value: deadline.format('YYYY-MM-DD HH:mm'),
      helper: hoursLeft > 0 && hoursLeft < 24 ? `剩余 ${hoursLeft} 小时` : '',
      color: hoursLeft > 0 && hoursLeft < 24 ? token.colorWarning : token.colorTextSecondary,
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
          const priorityCfg = priorityConfig[task.priority]
          const statusView = getViewStatusByTaskStatus(task.status)
          const statusCfg = statusConfig[statusView]
          const timeInfo = getTimeFieldInfo(task)
          const renderActionButtons = () => (
            <Space size={8} className="task-action-buttons">
              <Button
                key="detail"
                size="small"
                type="link"
                icon={<EyeOutlined />}
                onClick={() => onViewDetail?.(task)}
              >
                查看详情
              </Button>
            </Space>
          )

          const metaNodes = [
            (
              <Text key="taskNo" type="secondary" className="task-meta-text">
                任务编号：<Text code copyable>{task.taskNo}</Text>
              </Text>
            ),
            (
              <Text key="createdAt" type="secondary" className="task-meta-text">
                创建时间：{dayjs(task.createdAt).format('YYYY-MM-DD HH:mm')}
                <Text type="secondary" style={{ marginLeft: 4 }}>
                  ({dayjs(task.createdAt).fromNow()})
                </Text>
              </Text>
            ),
            (
              <Text key="initiator" type="secondary" className="task-meta-text">
                流程发起人：<Text strong>{task.initiator}</Text>
              </Text>
            ),
            (
              <Text key="processor" type="secondary" className="task-meta-text">
                当前处理人：<Text strong>{task.currentProcessor || '未指派'}</Text>
              </Text>
            ),
            (
              <Text key="time" type="secondary" className="task-meta-text">
                {timeInfo.label}：
                <Text strong style={{ color: timeInfo.color }}>{timeInfo.value}</Text>
                {timeInfo.helper && (
                  <Text type="secondary" style={{ marginLeft: 4, color: timeInfo.color }}>
                    ({timeInfo.helper})
                  </Text>
                )}
              </Text>
            )
          ]

          const getItemStyle = (): React.CSSProperties => {
            const base: React.CSSProperties = {
              borderRadius: 8,
              marginBottom: 12,
              padding: '16px 24px',
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
            }

            if (isOverdue(task)) {
              base.background = token.colorErrorBg
              base.border = `1px solid ${token.colorErrorBorder}`
            } else if (isNearDeadline(task)) {
              base.background = token.colorWarningBg
              base.border = `1px solid ${token.colorWarningBorder}`
            }

            return base
          }

          return (
            <List.Item
              key={task.id}
              style={getItemStyle()}
            >
              <div className="task-item-wrapper">
                <div className="task-item-main">
                  <div className="task-item-heading">
                    <Space wrap>
                      <Tag icon={priorityCfg.icon} color={priorityCfg.color}>
                        {priorityCfg.label}
                      </Tag>
                      <Tag icon={typeConfig.icon} color={typeConfig.color}>
                        {typeConfig.label}
                      </Tag>
                      <Text strong className="task-item-title">
                        {task.title}
                      </Text>
                    </Space>
                  </div>

                  <Space
                    size={16}
                    wrap
                    split={<Divider type="vertical" className="task-meta-divider" />}
                    className="task-item-meta"
                  >
                    {metaNodes}
                  </Space>
                </div>
                <div className="task-item-side">
                  <div className="task-status-column">
                    <Tag icon={statusCfg.icon} color={statusCfg.color}>
                      {statusCfg.label}
                    </Tag>
                  </div>
                  <div className="task-action-column">
                    {renderActionButtons()}
                  </div>
                </div>
              </div>
            </List.Item>
          )
        }}
      />
    </Card>
  )
}

export default TaskList
