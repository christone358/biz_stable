import React, { useMemo } from 'react'
import { Button, Empty } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import {
  Asset,
  AssetStatistics,
  AssetTypeConfig,
  HealthStatusConfig
} from '../../types'
import './index.css'

interface AssetRelationGraphProps {
  assets: Asset[]
  statistics: AssetStatistics | null
  onFullscreen?: () => void
}

const AssetRelationGraph: React.FC<AssetRelationGraphProps> = ({
  assets,
  statistics,
  onFullscreen
}) => {
  // 按层级分组资产
  const layerGroups = useMemo(() => {
    const groups = {
      APPLICATION: [] as Asset[],
      MIDDLEWARE: [] as Asset[],
      INFRASTRUCTURE: [] as Asset[]
    }

    assets.forEach(asset => {
      if (groups[asset.layer]) {
        groups[asset.layer].push(asset)
      }
    })

    return groups
  }, [assets])

  if (assets.length === 0) {
    return (
      <div className="asset-relation">
        <div className="asset-relation-header">
          <div className="asset-relation-title">资产关系与统计</div>
        </div>
        <div className="asset-relation-empty">
          <Empty description="请选择业务查看资产关系" />
        </div>
      </div>
    )
  }

  return (
    <div className="asset-relation">
      <div className="asset-relation-header">
        <div className="asset-relation-title">资产关系与统计</div>
        {onFullscreen && (
          <Button
            type="text"
            icon={<FullscreenOutlined />}
            onClick={onFullscreen}
          >
            全屏查看
          </Button>
        )}
      </div>

      <div className="asset-relation-content">
        {/* 统计卡片 */}
        {statistics && (
          <div className="asset-stats-grid">
            <div className="asset-stat-card">
              <div className="asset-stat-value">{statistics.total}</div>
              <div className="asset-stat-label">总资产数</div>
            </div>
            <div className="asset-stat-card">
              <div className="asset-stat-value">
                {statistics.byLayer.APPLICATION}
              </div>
              <div className="asset-stat-label">应用服务</div>
            </div>
            <div className="asset-stat-card">
              <div className="asset-stat-value">
                {statistics.byLayer.MIDDLEWARE}
              </div>
              <div className="asset-stat-label">中间件</div>
            </div>
            <div className="asset-stat-card">
              <div className="asset-stat-value">
                {statistics.byLayer.INFRASTRUCTURE}
              </div>
              <div className="asset-stat-label">基础设施</div>
            </div>
          </div>
        )}

        {/* 层级关系图 */}
        <div className="asset-relation-diagram">
          {/* 应用服务层 */}
          {layerGroups.APPLICATION.length > 0 && (
            <div className="asset-relation-layer">
              <div className="asset-relation-layer-title">应用服务层</div>
              <div className="asset-relation-layer-items">
                {layerGroups.APPLICATION.map(asset => {
                  const typeConfig = AssetTypeConfig[asset.type]
                  const healthConfig = HealthStatusConfig[asset.healthStatus]
                  return (
                    <div key={asset.id} className="asset-relation-item">
                      <span>{typeConfig.icon}</span>
                      <span>{asset.name}</span>
                      <span>{healthConfig.icon}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 连接线 */}
          {layerGroups.APPLICATION.length > 0 && layerGroups.MIDDLEWARE.length > 0 && (
            <div className="asset-relation-connector">↓</div>
          )}

          {/* 中间件层 */}
          {layerGroups.MIDDLEWARE.length > 0 && (
            <div className="asset-relation-layer">
              <div className="asset-relation-layer-title">中间件层</div>
              <div className="asset-relation-layer-items">
                {layerGroups.MIDDLEWARE.map(asset => {
                  const typeConfig = AssetTypeConfig[asset.type]
                  const healthConfig = HealthStatusConfig[asset.healthStatus]
                  return (
                    <div key={asset.id} className="asset-relation-item">
                      <span>{typeConfig.icon}</span>
                      <span>{asset.name}</span>
                      <span>{healthConfig.icon}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 连接线 */}
          {layerGroups.MIDDLEWARE.length > 0 && layerGroups.INFRASTRUCTURE.length > 0 && (
            <div className="asset-relation-connector">↓</div>
          )}

          {/* 基础设施层 */}
          {layerGroups.INFRASTRUCTURE.length > 0 && (
            <div className="asset-relation-layer">
              <div className="asset-relation-layer-title">基础设施层</div>
              <div className="asset-relation-layer-items">
                {layerGroups.INFRASTRUCTURE.map(asset => {
                  const typeConfig = AssetTypeConfig[asset.type]
                  const healthConfig = HealthStatusConfig[asset.healthStatus]
                  return (
                    <div key={asset.id} className="asset-relation-item">
                      <span>{typeConfig.icon}</span>
                      <span>{asset.name}</span>
                      <span>{healthConfig.icon}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 健康分布 */}
        {statistics && (
          <div className="health-distribution">
            <div className="health-distribution-title">健康状态分布</div>
            <div className="health-distribution-items">
              <div className="health-distribution-item">
                <span className="health-distribution-label">
                  🟢 健康
                </span>
                <span
                  className="health-distribution-value"
                  style={{ color: '#52c41a' }}
                >
                  {statistics.byHealth.healthy}
                </span>
              </div>
              <div className="health-distribution-item">
                <span className="health-distribution-label">
                  🟡 警告
                </span>
                <span
                  className="health-distribution-value"
                  style={{ color: '#faad14' }}
                >
                  {statistics.byHealth.warning}
                </span>
              </div>
              <div className="health-distribution-item">
                <span className="health-distribution-label">
                  🔴 故障
                </span>
                <span
                  className="health-distribution-value"
                  style={{ color: '#ff4d4f' }}
                >
                  {statistics.byHealth.critical}
                </span>
              </div>
              <div className="health-distribution-item">
                <span className="health-distribution-label">
                  ⚪ 未知
                </span>
                <span
                  className="health-distribution-value"
                  style={{ color: '#d9d9d9' }}
                >
                  {statistics.byHealth.unknown}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetRelationGraph
