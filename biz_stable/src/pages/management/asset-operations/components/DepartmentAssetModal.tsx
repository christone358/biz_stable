/**
 * 部门资产列表模态框组件
 * 展示指定部门已纳管的资产列表
 */

import React from 'react'
import { Modal, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DepartmentAsset, AssetType, AssetStatus } from '../types'
import { assetTypeLabels, assetStatusLabels } from '../../../../mock/asset-operations-data'

const { Text } = Typography

interface DepartmentAssetModalProps {
  visible: boolean
  departmentName: string
  assets: DepartmentAsset[]
  loading?: boolean
  onClose: () => void
}

const DepartmentAssetModal: React.FC<DepartmentAssetModalProps> = ({
  visible,
  departmentName,
  assets,
  loading = false,
  onClose
}) => {
  const columns: ColumnsType<DepartmentAsset> = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '资产类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: AssetType) => <Tag color="blue">{assetTypeLabels[type]}</Tag>
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140
    },
    {
      title: '纳管时间',
      dataIndex: 'managedTime',
      key: 'managedTime',
      width: 160
    },
    {
      title: '责任人',
      dataIndex: 'responsiblePerson',
      key: 'responsiblePerson',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AssetStatus) => <Tag color="green">{assetStatusLabels[status]}</Tag>
    }
  ]

  return (
    <Modal
      title={`${departmentName} - 已纳管资产`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Table
        columns={columns}
        dataSource={assets}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条资产`
        }}
        size="middle"
      />
    </Modal>
  )
}

export default DepartmentAssetModal
