import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import AssetTree from '../AssetTree'
import PerformanceCharts from '../PerformanceCharts'
import { AssetDeviceInfo } from '../AssetTree/types'
import {
  AssetPerformanceData,
  TimeRange,
  generateAssetPerformanceData
} from '../../../../../mock/asset-performance-data'
import './index.css'

interface AssetPerformancePanelProps {
  systemId: string
  systemName: string
  assets: AssetDeviceInfo[]
  timeRange: TimeRange
}

const AssetPerformancePanel: React.FC<AssetPerformancePanelProps> = ({
  systemId,
  systemName,
  assets,
  timeRange
}) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetDeviceInfo | null>(null)
  const [performanceData, setPerformanceData] = useState<AssetPerformanceData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // 初始化：默认选中第一个计算资源
  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      // 优先选择计算资源，如果没有则选第一个
      const firstComputeAsset = assets.find(a => a.layer === 'compute')
      const defaultAsset = firstComputeAsset || assets[0]
      setSelectedAsset(defaultAsset)
    }
  }, [assets])

  // 当选中资产或时间范围变化时，加载性能数据
  useEffect(() => {
    if (selectedAsset) {
      loadPerformanceData(selectedAsset)
    }
  }, [selectedAsset, timeRange])

  const loadPerformanceData = async (asset: AssetDeviceInfo) => {
    setLoading(true)

    // 模拟异步加载（300ms延迟，添加过渡效果）
    await new Promise(resolve => setTimeout(resolve, 300))

    const data = generateAssetPerformanceData(asset, timeRange)
    setPerformanceData(data)

    // 延迟100ms再取消loading，让过渡更平滑
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }

  const handleAssetSelect = (asset: AssetDeviceInfo) => {
    if (selectedAsset?.id !== asset.id) {
      setSelectedAsset(asset)
    }
  }

  if (assets.length === 0) {
    return (
      <div className="asset-performance-panel-empty">
        <div className="empty-content">
          <p style={{ fontSize: 16, color: '#8c8c8c' }}>
            该业务系统暂无资产信息
          </p>
          <p style={{ fontSize: 14, color: '#bfbfbf' }}>
            请先在"资产管理"中为该系统配置资产
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="asset-performance-panel">
      {/* 左侧：资产树 */}
      <div className="asset-performance-sidebar">
        <AssetTree
          systemId={systemId}
          assets={assets}
          selectedAssetId={selectedAsset?.id}
          onAssetSelect={handleAssetSelect}
        />
      </div>

      {/* 右侧：性能图表 */}
      <div className={`asset-performance-main ${loading ? 'loading' : ''}`}>
        <PerformanceCharts
          performanceData={performanceData}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default AssetPerformancePanel
