import React from 'react'
import { Card, Statistic, Space, Tag, Button } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons'
import type { AssetLayerType, LayerStatistics, HoneycombAssetType } from '../../panorama-types'
import { layerTitles, layerIcons } from '../../../../mock/asset-panorama-data'
import './AssetLayer.css'

interface AssetLayerProps {
  layerType: AssetLayerType
  statistics: LayerStatistics
  honeycombData: HoneycombAssetType[]
  onViewDetail: () => void
  onManage: () => void
}

const AssetLayer: React.FC<AssetLayerProps> = ({
  layerType,
  statistics,
  honeycombData,
  onViewDetail,
  onManage
}) => {
  const getLayerIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      AppstoreOutlined: '📦',
      CloudServerOutlined: '🖥️',
      DatabaseOutlined: '💾',
      ApiOutlined: '🌐'
    }
    return icons[iconName] || '📦'
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <ArrowUpOutlined style={{ color: '#f5222d' }} />
    } else if (change < 0) {
      return <ArrowDownOutlined style={{ color: '#52c41a' }} />
    }
    return null
  }

  const getAssetIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      '前端应用': '🖥️',
      '后端服务': '⚙️',
      '中间件': '🔧',
      '云服务器': '🖥️',
      '容器集群': '📦',
      '函数计算': '⚡',
      '对象存储': '💾',
      '块存储': '💿',
      '文件存储': '📁',
      '负载均衡': '⚖️',
      'VPN网关': '🔑',
      'NAT网关': '🔄',
      CDN: '🌐'
    }
    return iconMap[type] || '📦'
  }

  return (
    <Card className="asset-layer-card" bordered={false}>
      <div className="layer-header">
        <div className="layer-title">
          <span className="layer-icon">{getLayerIcon(layerIcons[layerType])}</span>
          <span>{layerTitles[layerType]}</span>
        </div>
        <div className="layer-actions">
          <Button type="link" onClick={onViewDetail} icon={<RightOutlined />}>
            详情
          </Button>
          <Button type="link" onClick={onManage} icon={<SettingOutlined />} style={{ color: '#52c41a' }}>
            台账管理
          </Button>
        </div>
      </div>

      <div className="layer-statistics">
        <Space size="large">
          <Statistic title="总资源数" value={statistics.total} valueStyle={{ color: '#1890ff' }} />
          <Statistic title="运行中" value={statistics.running} />
          <Statistic title="异常" value={statistics.abnormal} />
          <Statistic
            title="本月变化"
            value={Math.abs(statistics.change)}
            prefix={statistics.change > 0 ? '+' : statistics.change < 0 ? '-' : ''}
            suffix={getTrendIcon(statistics.change)}
            valueStyle={{ fontSize: '24px' }}
          />
        </Space>
      </div>

      <div className="honeycomb-section">
        <div className="honeycomb-title">资源分布</div>
        <div className="honeycomb-grid">
          {honeycombData.map((group, groupIndex) =>
            group.assets.slice(0, group.count).map((asset, assetIndex) => (
              <div
                key={`${groupIndex}-${assetIndex}`}
                className={`honeycomb-hexagon ${asset.status === 'abnormal' ? 'hexagon-abnormal' : ''}`}
                style={{ backgroundColor: group.color }}
                title={`${asset.name} (${asset.type})\n状态: ${asset.status === 'running' ? '运行中' : asset.status === 'abnormal' ? '异常' : '正常'}`}
              >
                <div className="hexagon-icon">{getAssetIcon(asset.type)}</div>
                <div className="hexagon-name">{asset.name}</div>
                {asset.status === 'abnormal' && <div className="hexagon-status-indicator">!</div>}
              </div>
            ))
          )}
        </div>

        <div className="honeycomb-legend">
          {honeycombData.map((group, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: group.color }} />
              <span>
                {group.type} ({group.count})
              </span>
              {group.status === 'abnormal' && <Tag color="warning" style={{ marginLeft: 4 }}>异常</Tag>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default AssetLayer
