import React, { useState } from 'react'
import { Button, Progress, Modal, Timeline, Empty, Badge } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { PendingAsset, AssetTypeConfig, AssetEvidence } from '../../types'
import './index.css'

interface PendingAssetsProps {
  pendingAssets: PendingAsset[]
  onConfirm: (assetId: string, businessId: string) => void
  onIgnore: (assetId: string) => void
  onConfirmAll: (businessId: string) => void
  currentBusinessId: string | null
}

const PendingAssets: React.FC<PendingAssetsProps> = ({
  pendingAssets,
  onConfirm,
  onIgnore,
  onConfirmAll,
  currentBusinessId
}) => {
  const [evidenceModalVisible, setEvidenceModalVisible] = useState(false)
  const [selectedEvidences, setSelectedEvidences] = useState<AssetEvidence[]>([])
  const [selectedAssetName, setSelectedAssetName] = useState('')

  // 显示证据详情
  const showEvidences = (asset: PendingAsset) => {
    setSelectedAssetName(asset.name)
    setSelectedEvidences(asset.evidences)
    setEvidenceModalVisible(true)
  }

  // 获取证据类型标签
  const getEvidenceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LOG: '日志分析',
      NETWORK_TRAFFIC: '网络流量',
      API_CALL: 'API调用',
      CONFIG: '配置文件'
    }
    return labels[type] || type
  }

  // 获取置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#52c41a'
    if (confidence >= 70) return '#faad14'
    return '#ff4d4f'
  }

  if (pendingAssets.length === 0) {
    return (
      <div className="pending-assets">
        <div className="pending-assets-header">
          <div className="pending-assets-title">
            待确认资产 <Badge count={0} />
          </div>
        </div>
        <div className="pending-assets-empty">
          <Empty description="暂无待确认资产" />
        </div>
      </div>
    )
  }

  return (
    <div className="pending-assets">
      <div className="pending-assets-header">
        <div className="pending-assets-title">
          待确认资产 <Badge count={pendingAssets.length} />
        </div>
        <div className="pending-assets-actions">
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            disabled={!currentBusinessId}
            onClick={() => currentBusinessId && onConfirmAll(currentBusinessId)}
          >
            全部确认
          </Button>
        </div>
      </div>

      <div className="pending-assets-content">
        {pendingAssets.map(asset => {
          const typeConfig = AssetTypeConfig[asset.type]
          const confidenceColor = getConfidenceColor(asset.confidence)

          return (
            <div key={asset.id} className="pending-asset-item">
              <div className="pending-asset-header">
                <div className="pending-asset-name">
                  <span>{typeConfig.icon}</span>
                  <span>{asset.name}</span>
                </div>
                <div className="pending-asset-confidence">
                  <span>置信度:</span>
                  <Progress
                    percent={asset.confidence}
                    size="small"
                    strokeColor={confidenceColor}
                    style={{ width: 80 }}
                  />
                </div>
              </div>

              <div className="pending-asset-info">
                发现方式: {asset.discoveryMethod === 'LOG_ANALYSIS' ? '日志分析' : '网络流量分析'}
                {asset.ip && ` | IP: ${asset.ip}`}
                {asset.port && `:${asset.port}`}
              </div>

              <div className="pending-asset-reason">
                <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                推荐理由: {asset.reason}
              </div>

              <div className="pending-asset-evidences">
                <span
                  className="pending-asset-evidence-trigger"
                  onClick={() => showEvidences(asset)}
                >
                  查看 {asset.evidences.length} 条证据
                </span>
              </div>

              <div className="pending-asset-actions">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => onConfirm(asset.id, asset.suggestedBusinessId)}
                >
                  确认归属
                </Button>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  disabled
                >
                  修改业务
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => onIgnore(asset.id)}
                >
                  忽略
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 证据详情弹窗 */}
      <Modal
        title={`${selectedAssetName} - 证据详情`}
        open={evidenceModalVisible}
        onCancel={() => setEvidenceModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setEvidenceModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        <Timeline
          items={selectedEvidences.map(evidence => ({
            color: 'blue',
            children: (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {getEvidenceTypeLabel(evidence.type)} - {evidence.source}
                </div>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 4 }}>
                  {new Date(evidence.timestamp).toLocaleString()}
                </div>
                <div
                  style={{
                    padding: 12,
                    background: '#f5f5f5',
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: 'monospace'
                  }}
                >
                  {evidence.content}
                </div>
              </div>
            )
          }))}
        />
      </Modal>
    </div>
  )
}

export default PendingAssets
