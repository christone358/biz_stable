import React from 'react'
import { Row, Col, Card, Statistic, Badge } from 'antd'
import {
  FileTextOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import type { TaskStatistics } from '../types'

interface TaskStatisticsCardsProps {
  statistics: TaskStatistics
  onCardClick?: (status: string) => void
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
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {/* 全部任务 */}
      <Col xs={24} sm={12} md={6} lg={4}>
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

      {/* 待处理 */}
      <Col xs={24} sm={12} md={6} lg={4}>
        <Card
          hoverable
          onClick={() => onCardClick?.('pending')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title="待处理"
            value={statistics.pending}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>

      {/* 处理中 */}
      <Col xs={24} sm={12} md={6} lg={4}>
        <Card
          hoverable
          onClick={() => onCardClick?.('processing')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title="处理中"
            value={statistics.processing}
            prefix={<SyncOutlined spin />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      {/* 已完成 */}
      <Col xs={24} sm={12} md={6} lg={4}>
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

      {/* 已逾期 */}
      <Col xs={24} sm={12} md={6} lg={4}>
        <Card
          hoverable
          onClick={() => onCardClick?.('overdue')}
          style={{
            cursor: 'pointer',
            borderColor: statistics.overdue > 0 ? '#ff4d4f' : undefined
          }}
        >
          <Statistic
            title={
              <span>
                已逾期
                {statistics.overdue > 0 && (
                  <Badge
                    count={statistics.overdue}
                    style={{
                      backgroundColor: '#ff4d4f',
                      marginLeft: 8
                    }}
                  />
                )}
              </span>
            }
            value={statistics.overdue}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>

      {/* 已忽略 */}
      <Col xs={24} sm={12} md={6} lg={4}>
        <Card
          hoverable
          onClick={() => onCardClick?.('ignored')}
          style={{ cursor: 'pointer' }}
        >
          <Statistic
            title="已忽略"
            value={statistics.ignored}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default TaskStatisticsCards
