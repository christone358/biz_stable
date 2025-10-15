import React from 'react'
import { Card, Button, Statistic, Row, Col } from 'antd'
import { ArrowRightOutlined, SettingOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import * as Icons from '@ant-design/icons'
import HoneycombMatrix from '../HoneycombMatrix'
import type { AssetLayerType, AssetStats, HoneycombData } from '../../types'
import './index.css'

interface AssetLayerProps {
  type: AssetLayerType
  title: string
  icon: string
  stats: AssetStats
  honeycombData: HoneycombData[]
  onShowDetail: () => void
  onShowManage: () => void
}

const AssetLayer: React.FC<AssetLayerProps> = ({
  title,
  icon,
  stats,
  honeycombData,
  onShowDetail,
  onShowManage
}) => {
  // 动态获取图标组件
  const IconComponent = (Icons as any)[icon.charAt(0).toUpperCase() + icon.slice(1) + 'Outlined'] || Icons.AppstoreOutlined

  const getTrendIcon = () => {
    if (stats.change > 0) {
      return <ArrowUpOutlined style={{ color: '#ff4d4f', fontSize: '12px' }} />
    } else if (stats.change < 0) {
      return <ArrowDownOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
    }
    return <span style={{ color: '#d9d9d9' }}>-</span>
  }

  return (
    <Card className="asset-layer-section" bordered={false}>
      <div className="layer-header">
        <div className="layer-title">
          <IconComponent style={{ color: '#1890ff', marginRight: 8 }} />
          <span>{title}</span>
        </div>
        <div className="layer-actions">
          <Button type="link" onClick={onShowDetail}>
            详情 <ArrowRightOutlined />
          </Button>
          <Button type="link" onClick={onShowManage} style={{ color: '#52c41a' }}>
            台账管理 <SettingOutlined />
          </Button>
        </div>
      </div>

      <Row gutter={[24, 16]} className="layer-stats">
        <Col span={6}>
          <Statistic
            title="总资源数"
            value={stats.total}
            valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 600 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="运行中"
            value={stats.running}
            valueStyle={{ fontSize: '24px', fontWeight: 600 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="异常"
            value={stats.abnormal}
            valueStyle={{ fontSize: '24px', fontWeight: 600 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="本月变化"
            value={`${stats.change > 0 ? '+' : ''}${stats.change}`}
            suffix={getTrendIcon()}
            valueStyle={{ fontSize: '24px', fontWeight: 600 }}
          />
        </Col>
      </Row>

      <HoneycombMatrix data={honeycombData} />
    </Card>
  )
}

export default AssetLayer
