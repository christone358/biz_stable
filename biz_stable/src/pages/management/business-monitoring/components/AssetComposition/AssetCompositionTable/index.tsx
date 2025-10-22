import React, { useState, useMemo } from 'react'
import { Table, Tag, Button, Input, Select, Space, Tabs } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { AssetItemDetail, AssetCompositionFilter } from '../types'
import { AssetStatus, AssetLayerType } from '../../../../asset-management/panorama-types'
import './index.css'

const { Search } = Input
const { Option } = Select

interface AssetCompositionTableProps {
  assets: {
    all: AssetItemDetail[]
    compute: AssetItemDetail[]
    storage: AssetItemDetail[]
    network: AssetItemDetail[]
  }
  onViewDetail: (asset: AssetItemDetail) => void
  onRefresh: () => void
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const AssetCompositionTable: React.FC<AssetCompositionTableProps> = ({
  assets,
  onViewDetail,
  onRefresh,
  activeTab: externalActiveTab,
  onTabChange
}) => {
  // 使用外部传入的activeTab，如果没有则使用内部状态
  const [internalActiveTab, setInternalActiveTab] = useState<string>('all')
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab

  const handleTabChange = (key: string) => {
    if (onTabChange) {
      onTabChange(key)
    } else {
      setInternalActiveTab(key)
    }
  }

  const [filter, setFilter] = useState<AssetCompositionFilter>({
    keyword: '',
    type: 'all',
    status: 'all'
  })

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

  // 获取层级Tag
  const getLayerTag = (layer: AssetLayerType) => {
    const layerMap = {
      [AssetLayerType.COMPUTE]: { color: 'blue', text: '计算资源' },
      [AssetLayerType.STORAGE]: { color: 'green', text: '存储资源' },
      [AssetLayerType.NETWORK]: { color: 'purple', text: '网络资源' },
      [AssetLayerType.APPLICATION]: { color: 'orange', text: '应用层' }
    }
    return <Tag color={layerMap[layer].color}>{layerMap[layer].text}</Tag>
  }

  // 表格列定义
  const columns: ColumnsType<AssetItemDetail> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: AssetItemDetail) => (
        <Button
          type="link"
          onClick={() => onViewDetail(record)}
          style={{ padding: 0, height: 'auto' }}
        >
          {text}
        </Button>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: AssetStatus) => getStatusTag(status)
    },
    {
      title: 'IP地址',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (text: string) => (
        <span style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: 13 }}>
          {text}
        </span>
      )
    },
    {
      title: '配置规格',
      dataIndex: 'config',
      key: 'config',
      width: 120,
      className: 'hide-on-tablet'
    },
    {
      title: '所属层级',
      dataIndex: 'layer',
      key: 'layer',
      width: 100,
      align: 'center',
      className: 'hide-on-mobile',
      render: (layer: AssetLayerType) => getLayerTag(layer)
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: AssetItemDetail) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onViewDetail(record)}
        >
          查看
        </Button>
      )
    }
  ]

  // 根据当前标签页获取数据源
  const currentAssets = useMemo(() => {
    const dataSource = {
      all: assets.all,
      compute: assets.compute,
      storage: assets.storage,
      network: assets.network
    }[activeTab] || assets.all

    return dataSource
  }, [activeTab, assets])

  // 应用筛选条件
  const filteredAssets = useMemo(() => {
    let result = currentAssets

    // 关键字搜索
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase()
      result = result.filter(
        asset =>
          asset.name.toLowerCase().includes(keyword) ||
          asset.address.toLowerCase().includes(keyword) ||
          asset.type.toLowerCase().includes(keyword)
      )
    }

    // 类型筛选
    if (filter.type && filter.type !== 'all') {
      result = result.filter(asset => asset.type === filter.type)
    }

    // 状态筛选
    if (filter.status && filter.status !== 'all') {
      result = result.filter(asset => asset.status === filter.status)
    }

    return result
  }, [currentAssets, filter])

  // 获取所有唯一的资产类型
  const assetTypes = useMemo(() => {
    const types = new Set<string>()
    assets.all.forEach(asset => types.add(asset.type))
    return Array.from(types).sort()
  }, [assets.all])

  // 标签页配置
  const tabs = [
    { key: 'all', label: `全部 (${assets.all.length})` },
    { key: 'compute', label: `计算资源 (${assets.compute.length})` },
    { key: 'storage', label: `存储资源 (${assets.storage.length})` },
    { key: 'network', label: `网络资源 (${assets.network.length})` }
  ]

  return (
    <div className="asset-composition-table-container">
      {/* 筛选和操作区 */}
      <div className="table-toolbar">
        <Space size="middle" wrap>
          <Search
            placeholder="搜索资产名称、IP地址..."
            allowClear
            style={{ width: 320 }}
            onChange={e => setFilter({ ...filter, keyword: e.target.value })}
            prefix={<SearchOutlined />}
          />

          <Select
            value={filter.type}
            onChange={value => setFilter({ ...filter, type: value })}
            style={{ width: 160 }}
          >
            <Option value="all">全部类型</Option>
            {assetTypes.map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>

          <Select
            value={filter.status}
            onChange={value => setFilter({ ...filter, status: value as any })}
            style={{ width: 120 }}
          >
            <Option value="all">全部状态</Option>
            <Option value={AssetStatus.RUNNING}>运行中</Option>
            <Option value={AssetStatus.ABNORMAL}>异常</Option>
            <Option value={AssetStatus.STOPPED}>已停止</Option>
            <Option value={AssetStatus.IDLE}>空闲</Option>
          </Select>

          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 分类标签页 */}
      <div className="table-tabs">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabs}
          size="large"
        />
      </div>

      {/* 资产列表表格 */}
      <Table
        columns={columns}
        dataSource={filteredAssets}
        rowKey="id"
        pagination={{
          total: filteredAssets.length,
          pageSize: 20,
          showTotal: total => `共 ${total} 条资产`,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        scroll={{ x: 1000 }}
        className="asset-composition-table"
      />
    </div>
  )
}

export default AssetCompositionTable
