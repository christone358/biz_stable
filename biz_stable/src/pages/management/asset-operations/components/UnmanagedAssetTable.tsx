/**
 * 未纳管资产表格组件
 * 展示未纳管资产列表，支持筛选、搜索和批量操作
 */

import React, { useState } from 'react'
import { Table, Tag, Button, Space, Input, Select, message, Tooltip } from 'antd'
import {
  EyeOutlined,
  SendOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { UnmanagedAsset, AssetType, AssetAttribute, PaginationConfig } from '../types'
import {
  assetTypeLabels,
  assetAttributeLabels
} from '../../../../mock/asset-operations-data'
import './UnmanagedAssetTable.css'

const { Search } = Input

interface UnmanagedAssetTableProps {
  data: UnmanagedAsset[]
  loading?: boolean
  pagination: PaginationConfig
  onPageChange: (page: number, pageSize: number) => void
  onViewDetail: (asset: UnmanagedAsset) => void
  onAssign: (assetIds: string[]) => void
  onIgnore: (assetIds: string[]) => void
  onSearch?: (keyword: string) => void
  onTypeFilter?: (type: AssetType | 'all') => void
  onAttributeFilter?: (attribute: AssetAttribute | 'all') => void
}

// 资产属性颜色映射
const attributeColors: Record<AssetAttribute, string> = {
  ORPHAN: 'orange',
  UNKNOWN: 'red',
  NON_COMPLIANT: 'volcano',
  NORMAL: 'default'
}

const UnmanagedAssetTable: React.FC<UnmanagedAssetTableProps> = ({
  data,
  loading = false,
  pagination,
  onPageChange,
  onViewDetail,
  onAssign,
  onIgnore,
  onSearch,
  onTypeFilter,
  onAttributeFilter
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 表格列定义
  const columns: ColumnsType<UnmanagedAsset> = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      fixed: 'left',
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="asset-name">{text}</span>
        </Tooltip>
      )
    },
    {
      title: '资产类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: AssetType) => (
        <Tag color="blue">{assetTypeLabels[type]}</Tag>
      )
    },
    {
      title: '资产属性',
      dataIndex: 'attribute',
      key: 'attribute',
      width: 120,
      render: (attribute: AssetAttribute) => (
        <Tag color={attributeColors[attribute]}>
          {assetAttributeLabels[attribute]}
        </Tag>
      )
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140
    },
    {
      title: '物理位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
      ellipsis: true,
      render: (text: string) => text || '-'
    },
    {
      title: '发现时间',
      dataIndex: 'discoveredTime',
      key: 'discoveredTime',
      width: 160
    },
    {
      title: '发现来源',
      dataIndex: 'discoveredSource',
      key: 'discoveredSource',
      width: 120
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || '-'}</span>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_: any, record: UnmanagedAsset) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SendOutlined />}
            onClick={() => onAssign([record.id])}
          >
            指派
          </Button>
        </Space>
      )
    }
  ]

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys as string[])
    }
  }

  // 批量指派
  const handleBatchAssign = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要指派的资产')
      return
    }
    onAssign(selectedRowKeys)
    setSelectedRowKeys([])
  }

  // 批量忽略
  const handleBatchIgnore = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要忽略的资产')
      return
    }
    onIgnore(selectedRowKeys)
    setSelectedRowKeys([])
  }

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  // 分页配置
  const paginationConfig: TablePaginationConfig = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onPageChange,
    pageSizeOptions: ['10', '20', '50', '100']
  }

  return (
    <div className="unmanaged-asset-table">
      {/* 筛选工具栏 */}
      <div className="table-toolbar">
        <Space size="middle" wrap>
          <Search
            placeholder="搜索资产名称、IP地址"
            allowClear
            style={{ width: 260 }}
            onSearch={handleSearch}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Select
            placeholder="资产类型"
            allowClear
            style={{ width: 140 }}
            onChange={onTypeFilter}
            options={[
              { value: 'all', label: '全部类型' },
              ...Object.entries(assetTypeLabels).map(([key, label]) => ({
                value: key,
                label
              }))
            ]}
          />
          <Select
            placeholder="资产属性"
            allowClear
            style={{ width: 140 }}
            onChange={onAttributeFilter}
            options={[
              { value: 'all', label: '全部属性' },
              ...Object.entries(assetAttributeLabels).map(([key, label]) => ({
                value: key,
                label
              }))
            ]}
          />
        </Space>

        <Space>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleBatchAssign}
            disabled={selectedRowKeys.length === 0}
          >
            批量指派 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleBatchIgnore}
            disabled={selectedRowKeys.length === 0}
          >
            批量忽略
          </Button>
        </Space>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={paginationConfig}
        rowSelection={rowSelection}
        scroll={{ x: 1400 }}
        size="middle"
      />
    </div>
  )
}

export default UnmanagedAssetTable
