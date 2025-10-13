import React, { useMemo } from 'react'
import { Input, Button, Tag, Space, Popconfirm, Select, Empty } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  Asset,
  AssetLayerConfig,
  AssetTypeConfig,
  HealthStatusConfig,
  AssetStatusConfig
} from '../../types'
import './index.css'

interface AssetListProps {
  assets: Asset[]
  searchKeyword: string
  onSearchChange: (keyword: string) => void
  onEditAsset: (asset: Asset) => void
  onDeleteAsset: (assetId: string) => void
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  searchKeyword,
  onSearchChange,
  onEditAsset,
  onDeleteAsset
}) => {
  // 按层级分组资产
  const groupedAssets = useMemo(() => {
    const groups: Record<string, Asset[]> = {
      APPLICATION: [],
      MIDDLEWARE: [],
      INFRASTRUCTURE: []
    }

    assets.forEach(asset => {
      if (groups[asset.layer]) {
        groups[asset.layer].push(asset)
      }
    })

    return groups
  }, [assets])

  // 渲染资产项
  const renderAssetItem = (asset: Asset) => {
    const typeConfig = AssetTypeConfig[asset.type]
    const healthConfig = HealthStatusConfig[asset.healthStatus]
    const statusConfig = AssetStatusConfig[asset.status]

    return (
      <div key={asset.id} className="asset-list-item">
        <div className="asset-list-item-header">
          <div className="asset-list-item-name">
            <span>{typeConfig.icon}</span>
            <span>{asset.name}</span>
          </div>
          <div className="asset-list-item-status">
            <Tag color={healthConfig.color}>{healthConfig.icon}</Tag>
            <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
          </div>
        </div>

        <div className="asset-list-item-info">
          {asset.ip && <span>IP: {asset.ip}</span>}
          {asset.port && <span> | 端口: {asset.port}</span>}
        </div>

        {asset.version && (
          <div className="asset-list-item-info">版本: {asset.version}</div>
        )}

        <div className="asset-list-item-actions">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditAsset(asset)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个资产吗？"
            onConfirm={() => onDeleteAsset(asset.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      </div>
    )
  }

  // 渲染层级分组
  const renderLayerGroup = (layer: string) => {
    const layerAssets = groupedAssets[layer]
    if (layerAssets.length === 0) return null

    const layerConfig = AssetLayerConfig[layer as keyof typeof AssetLayerConfig]

    return (
      <div key={layer} className="asset-layer-group">
        <div className="asset-layer-header">
          <span className="asset-layer-title">{layerConfig.label}</span>
          <span className="asset-layer-count">{layerAssets.length}个</span>
        </div>
        {layerAssets.map(renderAssetItem)}
      </div>
    )
  }

  return (
    <div className="asset-list">
      <div className="asset-list-header">
        <div className="asset-list-title">资产列表</div>
        <Input
          className="asset-list-search"
          placeholder="搜索资产名称、IP..."
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={e => onSearchChange(e.target.value)}
          allowClear
        />
      </div>

      <div className="asset-list-content">
        {assets.length === 0 ? (
          <div className="asset-list-empty">
            <Empty description="暂无资产数据" />
          </div>
        ) : (
          <>
            {renderLayerGroup('APPLICATION')}
            {renderLayerGroup('MIDDLEWARE')}
            {renderLayerGroup('INFRASTRUCTURE')}
          </>
        )}
      </div>
    </div>
  )
}

export default AssetList
