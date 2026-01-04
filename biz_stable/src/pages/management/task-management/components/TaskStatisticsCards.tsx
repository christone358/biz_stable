import React from 'react'
import { Row, Col, Card, Statistic, Badge } from 'antd'
import { FileTextOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { TaskStatistics, TaskFilters } from '../types'

interface TaskStatisticsCardsProps {
  statistics: TaskStatistics
  onCardClick?: (status: TaskFilters['status']) => void
}

/**
 * 任务统计卡片组件
 * 显示任务的整体统计数据
 */
const TaskStatisticsCards: React.FC<TaskStatisticsCardsProps> = ({
  statistics,
  onCardClick
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }} wrap>
      {/* 全部任务 */}
      <Col flex="1 1 240px">
        <Card
          hoverable
          onClick={() => onCardClick?.('all')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title="全部任务"
            value={statistics.total}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      {/* 处置中 */}
      <Col flex="1 1 240px">
        <Card
          hoverable
          onClick={() => onCardClick?.('inProgress')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title={<span>处置中{statistics.overdue > 0 && <Badge count={statistics.overdue} style={{ backgroundColor: '#ff4d4f', marginLeft: 8 }} />}</span>}
            value={statistics.inProgress}
            prefix={<SyncOutlined spin />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      {/* 已完成 */}
      <Col flex="1 1 240px">
        <Card
          hoverable
          onClick={() => onCardClick?.('completed')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title="已完成"
            value={statistics.completed}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>

      {/* 已作废 */}
      <Col flex="1 1 240px">
        <Card
          hoverable
          onClick={() => onCardClick?.('voided')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title="已作废"
            value={statistics.voided}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default TaskStatisticsCards
