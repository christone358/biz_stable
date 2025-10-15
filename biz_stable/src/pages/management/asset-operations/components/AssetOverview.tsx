/**
 * 资产类型统计卡片组件
 * 展示各类资产的统计信息，支持点击卡片进行筛选
 */

import React from 'react'
import { Card, Row, Col, Typography, Space } from 'antd'
import {
  CloudServerOutlined,
  DesktopOutlined,
  ApiOutlined,
  DatabaseOutlined,
  HddOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  UserDeleteOutlined,
  QuestionOutlined,
  CloseCircleOutlined
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

// 图标CSS类名映射
const iconClassNames: Record<AssetType, string> = {
  SERVER: 'icon-server',
  DESKTOP: 'icon-desktop',
  NETWORK_DEVICE: 'icon-network',
  MIDDLEWARE: 'icon-middleware',
  DATABASE: 'icon-database',
  STORAGE: 'icon-storage',
  SECURITY: 'icon-security',
  OTHER: 'icon-other'
}

const AssetOverview: React.FC<AssetOverviewProps> = ({
  stats,
  selectedType,
  onTypeSelect
}) => {
  const handleCardClick = (type: AssetType) => {
    if (onTypeSelect) {
      // 如果点击已选中的卡片，则取消选中
      if (selectedType === type) {
        onTypeSelect('all')
      } else {
        onTypeSelect(type)
      }
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
                <div className={`card-icon ${iconClassNames[stat.type]}`}>
                  {assetTypeIcons[stat.type]}
                </div>
                <Text strong className="card-title">
                  {assetTypeLabels[stat.type]}
                </Text>
              </div>

              <div className="card-stats">
                <div className="stat-main">
                  <Text className="stat-label">异常数</Text>
                  <Text className="stat-value">{stat.abnormalCount}</Text>
                </div>
              </div>

              <div className="card-footer">
                <Space size={8} wrap={false}>
                  <Space size={4}>
                    <UserDeleteOutlined style={{ color: '#fa8c16', fontSize: '12px' }} />
                    <Text type="secondary" className="footer-text">
                      无主: {stat.orphan}
                    </Text>
                  </Space>
                  <Space size={4}>
                    <QuestionOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
                    <Text type="secondary" className="footer-text">
                      未知: {stat.unknown}
                    </Text>
                  </Space>
                  <Space size={4}>
                    <CloseCircleOutlined style={{ color: '#ff7a45', fontSize: '12px' }} />
                    <Text type="secondary" className="footer-text">
                      不合规: {stat.nonCompliant}
                    </Text>
                  </Space>
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
