import React from 'react'
import { DashboardOutlined, AlertOutlined, BugOutlined, DatabaseOutlined } from '@ant-design/icons'
import type { SystemOverview } from '../../types'
import './SystemCard.css'

interface SystemCardProps {
  system: SystemOverview
  isExpanded: boolean     // 是否展开为卡片视图
  isSelected: boolean     // 是否被选中
  onClick: () => void
}

/**
 * 系统卡片组件
 * 支持简略视图和卡片视图两种状态
 */
const SystemCard: React.FC<SystemCardProps> = ({
  system,
  isExpanded,
  isSelected,
  onClick
}) => {
  const cardClass = [
    'system-card',
    isExpanded ? 'expanded' : 'brief',
    isSelected ? 'selected' : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass} onClick={onClick}>
      {isExpanded ? (
        // 卡片视图（悬浮展开状态）
        <div className="card-view">
          <div className="card-header">
            <span className="system-name" title={system.name}>{system.name}</span>
            <div className="health-info">
              <span
                className="status-dot"
                style={{ backgroundColor: system.healthColor }}
              />
              <span className="status-label">{system.healthLabel}</span>
              <span className="health-score">{system.healthScore}分</span>
            </div>
          </div>
          <div className="quick-stats">
            <div className="stat-row">
              <div className="stat-item">
                <DashboardOutlined className="stat-icon" />
                <span className="stat-text">关键指标: {system.metricsStatus === 'normal' ? '正常' : '异常'}</span>
              </div>
              <div className="stat-item">
                <AlertOutlined className="stat-icon" />
                <span className="stat-text">告警: {system.alertCount}个</span>
              </div>
            </div>
            <div className="stat-row">
              <div className="stat-item">
                <BugOutlined className="stat-icon" />
                <span className="stat-text">脆弱性: {system.vulnerabilityCount}个</span>
              </div>
              <div className="stat-item">
                <DatabaseOutlined className="stat-icon" />
                <span className="stat-text">资产: {system.assetCount}个</span>
              </div>
            </div>
          </div>
          <div className="update-time">
            🕒 {system.lastUpdateTime}
          </div>
        </div>
      ) : (
        // 简略视图（默认状态）
        <div className="brief-view">
          <span
            className="status-dot"
            style={{ backgroundColor: system.healthColor }}
          />
          <span className="system-name" title={system.name}>
            {system.shortName || system.name}
          </span>
          <span className="status-label">{system.healthLabel}</span>
        </div>
      )}
    </div>
  )
}

export default SystemCard
