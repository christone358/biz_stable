/**
 * 资产类型统计卡片组件
 * 展示各类资产的统计信息，支持点击卡片进行筛选
 */

import React from 'react'
import { Card, Row, Col, Badge, Typography, Space } from 'antd'
import {
  CloudServerOutlined,
  DesktopOutlined,
  ApiOutlined,
  DatabaseOutlined,
  HddOutlined,
  SafetyOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import type { AssetTypeStats, AssetType } from '../types'
import { assetTypeLabels } from '../../../../mock/asset-operations-data'
import './AssetOverview.css'

const { Text } = Typography

interface AssetOverviewProps {
  stats: AssetTypeStats[]
  selectedType?: AssetType | 'all'
  onTypeSelect?: (type: AssetType | 'all') => void
}

// 资产类型图标映射
const assetTypeIcons: Record<AssetType, React.ReactNode> = {
  SERVER: <CloudServerOutlined />,
  DESKTOP: <DesktopOutlined />,
  NETWORK_DEVICE: <ApiOutlined />,
  MIDDLEWARE: <AppstoreOutlined />,
  DATABASE: <DatabaseOutlined />,
  STORAGE: <HddOutlined />,
  SECURITY: <SafetyOutlined />,
  OTHER: <AppstoreOutlined />
}

const AssetOverview: React.FC<AssetOverviewProps> = ({
  stats,
  selectedType,
  onTypeSelect
}) => {
  const handleCardClick = (type: AssetType) => {
    if (onTypeSelect) {
      onTypeSelect(type)
    }
  }

  return (
    <div className="asset-overview">
      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} md={8} lg={6} key={stat.type}>
            <Card
              className={`asset-type-card ${selectedType === stat.type ? 'selected' : ''}`}
              hoverable
              onClick={() => handleCardClick(stat.type)}
            >
              <div className="card-header">
                <div className="card-icon">{assetTypeIcons[stat.type]}</div>
                <Text strong className="card-title">
                  {assetTypeLabels[stat.type]}
                </Text>
              </div>

              <div className="card-stats">
                <div className="stat-main">
                  <Text className="stat-label">总数</Text>
                  <Text className="stat-value">{stat.total}</Text>
                </div>

                <div className="stat-details">
                  <Space direction="vertical" size={4}>
                    <div className="stat-item">
                      <Badge status="success" />
                      <Text className="stat-text">已纳管: {stat.managed}</Text>
                    </div>
                    <div className="stat-item">
                      <Badge status="error" />
                      <Text className="stat-text">未纳管: {stat.unmanaged}</Text>
                    </div>
                  </Space>
                </div>
              </div>

              <div className="card-footer">
                <Space size={12}>
                  <Text type="secondary" className="footer-text">
                    无主: {stat.orphan}
                  </Text>
                  <Text type="secondary" className="footer-text">
                    未知: {stat.unknown}
                  </Text>
                  <Text type="secondary" className="footer-text">
                    不合规: {stat.nonCompliant}
                  </Text>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default AssetOverview
