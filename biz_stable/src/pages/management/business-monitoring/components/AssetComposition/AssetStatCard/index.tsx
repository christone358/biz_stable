import React from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import type { AssetStatistics } from '../types'
import './index.css'

interface AssetStatCardProps {
  title: string
  icon?: React.ReactNode
  statistics: AssetStatistics
  color?: string
  onClick?: () => void
  showChange?: boolean
}

const AssetStatCard: React.FC<AssetStatCardProps> = ({
  title,
  icon,
  statistics,
  color = '#1890FF',
  onClick,
  showChange = false
}) => {
  const { total, running, abnormal, stopped, monthlyChange } = statistics

  return (
    <Card
      className={`asset-stat-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      bordered={false}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="stat-header">
        {icon && <span className="stat-icon" style={{ color }}>{icon}</span>}
        <span className="stat-title">{title}</span>
      </div>

      <div className="stat-number" style={{ color }}>
        {total}
        {title !== '总资产' && <span className="stat-unit">台</span>}
      </div>

      {showChange && monthlyChange !== undefined && (
        <div className="stat-change">
          本月
          {monthlyChange > 0 ? (
            <>
              <ArrowUpOutlined style={{ color: '#52C41A', marginLeft: 4 }} />
              <span style={{ color: '#52C41A', marginLeft: 2 }}>+{monthlyChange}</span>
            </>
          ) : monthlyChange < 0 ? (
            <>
              <ArrowDownOutlined style={{ color: '#FF4D4F', marginLeft: 4 }} />
              <span style={{ color: '#FF4D4F', marginLeft: 2 }}>{monthlyChange}</span>
            </>
          ) : (
            <span style={{ color: '#8c8c8c', marginLeft: 4 }}>无变化</span>
          )}
        </div>
      )}

      {!showChange && title !== '总资产' && (
        <div className="stat-details">
          <Row gutter={8}>
            <Col span={12}>
              <div className="detail-item">
                <span className="detail-label">运行中</span>
                <span className="detail-value" style={{ color: '#52C41A' }}>{running}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="detail-item">
                <span className="detail-label">异常</span>
                <span className="detail-value" style={{ color: '#FF4D4F' }}>{abnormal}</span>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  )
}

export default AssetStatCard
