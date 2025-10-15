/**
 * 资产详情模态框组件
 * 展示未纳管资产的详细信息
 */

import React from 'react'
import { Modal, Descriptions, Tag, Typography } from 'antd'
import type { UnmanagedAsset } from '../types'
import {
  assetTypeLabels,
  assetAttributeLabels,
  assetStatusLabels
} from '../../../../mock/asset-operations-data'

const { Text } = Typography

interface AssetDetailModalProps {
  visible: boolean
  asset: UnmanagedAsset | null
  onClose: () => void
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  visible,
  asset,
  onClose
}) => {
  if (!asset) return null

  return (
    <Modal
      title="资产详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="资产ID" span={2}>
          <Text code>{asset.id}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="资产名称" span={2}>
          <Text strong>{asset.name}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="资产类型">
          <Tag color="blue">{assetTypeLabels[asset.type]}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="资产属性">
          <Tag
            color={
              asset.attribute === 'ORPHAN'
                ? 'orange'
                : asset.attribute === 'UNKNOWN'
                ? 'red'
                : asset.attribute === 'NON_COMPLIANT'
                ? 'volcano'
                : 'default'
            }
          >
            {assetAttributeLabels[asset.attribute]}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="IP地址">
          <Text code>{asset.ipAddress}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="资产状态">
          <Tag>{assetStatusLabels[asset.status]}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="物理位置" span={2}>
          {asset.location || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="发现时间" span={2}>
          {asset.discoveredTime}
        </Descriptions.Item>

        <Descriptions.Item label="发现来源" span={2}>
          <Tag>{asset.discoveredSource}</Tag>
        </Descriptions.Item>

        {asset.os && (
          <Descriptions.Item label="操作系统" span={2}>
            {asset.os}
          </Descriptions.Item>
        )}

        {asset.version && (
          <Descriptions.Item label="版本信息" span={2}>
            {asset.version}
          </Descriptions.Item>
        )}

        {asset.manufacturer && (
          <Descriptions.Item label="厂商" span={2}>
            {asset.manufacturer}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="资产描述" span={2}>
          {asset.description || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default AssetDetailModal
