import React from 'react'
import { Drawer, Descriptions, Tag, Button, Timeline, Empty } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import type { AssetItemDetail } from '../types'
import { AssetStatus, AssetLayerType } from '../../../../asset-management/panorama-types'
import './index.css'

interface AssetDetailDrawerProps {
  visible: boolean
  asset: AssetItemDetail | null
  onClose: () => void
  onViewPerformance?: (asset: AssetItemDetail) => void
}

const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({
  visible,
  asset,
  onClose,
  onViewPerformance
}) => {
  if (!asset) return null

  // 获取状态Tag
  const getStatusTag = (status: AssetStatus) => {
    const statusMap = {
      [AssetStatus.RUNNING]: { color: 'success', text: '运行中' },
      [AssetStatus.STOPPED]: { color: 'default', text: '已停止' },
      [AssetStatus.IDLE]: { color: 'warning', text: '空闲' },
      [AssetStatus.ABNORMAL]: { color: 'error', text: '异常' }
    }
    return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
  }

  // 获取层级名称
  const getLayerName = (layer: AssetLayerType) => {
    const layerMap = {
      [AssetLayerType.COMPUTE]: '计算资源',
      [AssetLayerType.STORAGE]: '存储资源',
      [AssetLayerType.NETWORK]: '网络资源',
      [AssetLayerType.APPLICATION]: '应用层'
    }
    return layerMap[layer]
  }

  return (
    <Drawer
      title={
        <div className="drawer-title">
          <span className="drawer-title-icon">📋</span>
          <span>资产详情</span>
        </div>
      }
      width={720}
      open={visible}
      onClose={onClose}
      className="asset-detail-drawer"
      footer={
        <div className="drawer-footer">
          <Button onClick={onClose}>关闭</Button>
          {onViewPerformance && (
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={() => {
                onViewPerformance(asset)
                onClose()
              }}
            >
              查看性能监控
            </Button>
          )}
        </div>
      }
    >
      {/* 基本信息 */}
      <div className="detail-section">
        <h3 className="section-title">基本信息</h3>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="资产名称" span={2}>
            <strong>{asset.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="资产类型">{asset.type}</Descriptions.Item>
          <Descriptions.Item label="IP地址">
            <span style={{ fontFamily: 'Monaco, Consolas, monospace' }}>
              {asset.address}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="运行状态">
            {getStatusTag(asset.status)}
          </Descriptions.Item>
          <Descriptions.Item label="所属层级">
            {getLayerName(asset.layer)}
          </Descriptions.Item>
          <Descriptions.Item label="配置规格" span={2}>
            {asset.config}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 详细配置 */}
      {asset.specs && (
        <div className="detail-section">
          <h3 className="section-title">详细配置</h3>
          <Descriptions column={2} bordered>
            {asset.specs.cpu && (
              <Descriptions.Item label="CPU">{asset.specs.cpu}</Descriptions.Item>
            )}
            {asset.specs.memory && (
              <Descriptions.Item label="内存">{asset.specs.memory}</Descriptions.Item>
            )}
            {asset.specs.disk && (
              <Descriptions.Item label="磁盘">{asset.specs.disk}</Descriptions.Item>
            )}
            {asset.specs.network && (
              <Descriptions.Item label="网络">{asset.specs.network}</Descriptions.Item>
            )}
          </Descriptions>
        </div>
      )}

      {/* 责任信息 */}
      <div className="detail-section">
        <h3 className="section-title">责任信息</h3>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="责任单位">{asset.ownerOrg}</Descriptions.Item>
          <Descriptions.Item label="责任人">{asset.owner}</Descriptions.Item>
          <Descriptions.Item label="联系电话" span={2}>
            {asset.ownerPhone}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 运行指标 */}
      {asset.metrics && (
        <div className="detail-section">
          <h3 className="section-title">运行指标（最近1小时）</h3>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="CPU使用率">
              <span className={asset.metrics.cpuUsage > 80 ? 'metric-warning' : ''}>
                {asset.metrics.cpuUsage.toFixed(1)}%
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="内存使用率">
              <span className={asset.metrics.memoryUsage > 80 ? 'metric-warning' : ''}>
                {asset.metrics.memoryUsage.toFixed(1)}%
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="磁盘使用率">
              <span className={asset.metrics.diskUsage > 80 ? 'metric-warning' : ''}>
                {asset.metrics.diskUsage.toFixed(1)}%
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="网络流量">
              {asset.metrics.networkTraffic.toFixed(0)} MB/s
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}

      {/* 操作记录 */}
      <div className="detail-section">
        <h3 className="section-title">操作记录</h3>
        {asset.operationLogs && asset.operationLogs.length > 0 ? (
          <Timeline
            items={asset.operationLogs.map(log => ({
              children: (
                <div className="operation-log-item">
                  <div className="log-time">{log.timestamp}</div>
                  <div className="log-action">
                    <strong>{log.action}</strong>
                    <span className="log-operator">操作人: {log.operator}</span>
                  </div>
                  {log.description && (
                    <div className="log-description">{log.description}</div>
                  )}
                </div>
              )
            }))}
          />
        ) : (
          <Empty description="暂无操作记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </Drawer>
  )
}

export default AssetDetailDrawer
