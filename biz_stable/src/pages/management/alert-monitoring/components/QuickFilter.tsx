import React from 'react'
import { Card, Tag } from 'antd'
import { AlertLevel, AlertStatus } from '../types'
import './QuickFilter.css'

interface QuickFilterProps {
  selectedLevel: AlertLevel | 'all'
  selectedStatus: AlertStatus | 'all'
  onLevelChange: (level: AlertLevel | 'all') => void
  onStatusChange: (status: AlertStatus | 'all') => void
}

const QuickFilter: React.FC<QuickFilterProps> = ({
  selectedLevel,
  selectedStatus,
  onLevelChange,
  onStatusChange
}) => {
  const levelOptions: Array<{ value: AlertLevel | 'all'; label: string; color?: string }> = [
    { value: 'all', label: '全部等级' },
    { value: AlertLevel.EMERGENCY, label: '紧急', color: 'error' },
    { value: AlertLevel.SEVERE, label: '严重', color: 'warning' },
    { value: AlertLevel.WARNING, label: '警告', color: 'gold' }
  ]

  const statusOptions: Array<{ value: AlertStatus | 'all'; label: string; color?: string }> = [
    { value: 'all', label: '全部状态' },
    { value: AlertStatus.PENDING, label: '待指派', color: 'blue' },
    { value: AlertStatus.TO_PROCESS, label: '待处理', color: 'default' },
    { value: AlertStatus.PROCESSING, label: '处理中', color: 'purple' },
    { value: AlertStatus.TO_CLOSE, label: '待关闭', color: 'default' },
    { value: AlertStatus.CLOSED, label: '已关闭', color: 'success' }
  ]

  return (
    <Card title="快速筛选" className="quick-filter-card" bordered={false}>
      <div className="quick-filter-content">
        <div className="filter-group">
          <span className="filter-label">告警等级:</span>
          <div className="filter-options">
            {levelOptions.map((option) => (
              <Tag
                key={option.value}
                className={`filter-tag ${selectedLevel === option.value ? 'active' : ''}`}
                color={selectedLevel === option.value ? option.color : 'default'}
                onClick={() => onLevelChange(option.value)}
                style={{ cursor: 'pointer' }}
              >
                {option.label}
              </Tag>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">处置状态:</span>
          <div className="filter-options">
            {statusOptions.map((option) => (
              <Tag
                key={option.value}
                className={`filter-tag ${selectedStatus === option.value ? 'active' : ''}`}
                color={selectedStatus === option.value ? option.color : 'default'}
                onClick={() => onStatusChange(option.value)}
                style={{ cursor: 'pointer' }}
              >
                {option.label}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default QuickFilter
