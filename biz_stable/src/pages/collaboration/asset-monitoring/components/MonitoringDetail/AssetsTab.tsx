import React, { useState, useMemo } from 'react'
import { Table, Tag, Radio, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MonitoringAsset, MonitoringAssetStatus } from '../../types'

interface AssetsTabProps {
  assets: MonitoringAsset[]
}

/**
 * 资产组成Tab组件
 */
const AssetsTab: React.FC<AssetsTabProps> = ({ assets }) => {
  const [filter, setFilter] = useState<'all' | MonitoringAssetStatus>('all')

  // 筛选后的数据
  const filteredData = useMemo(() => {
    if (filter === 'all') return assets
    return assets.filter(asset => asset.status === filter)
  }, [assets, filter])

  // 统计数据
  const stats = useMemo(() => {
    const byType: Record<string, number> = {}
    assets.forEach(asset => {
      byType[asset.type] = (byType[asset.type] || 0) + 1
    })
    return byType
  }, [assets])

  const columns: ColumnsType<MonitoringAsset> = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: '12%',
    },
    {
      title: '资产类型',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
    },
    {
      title: '操作系统/版本',
      dataIndex: 'os',
      key: 'os',
      width: '15%',
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      width: '12%',
      render: (value: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 80 ? '#ff4d4f' : value > 65 ? '#faad14' : '#52c41a'}
            style={{ width: 60 }}
          />
          <span style={{ fontSize: 12 }}>{value}%</span>
        </div>
      ),
    },
    {
      title: '内存',
      dataIndex: 'memory',
      key: 'memory',
      width: '12%',
      render: (value: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 85 ? '#ff4d4f' : value > 70 ? '#faad14' : '#52c41a'}
            style={{ width: 60 }}
          />
          <span style={{ fontSize: 12 }}>{value}%</span>
        </div>
      ),
    },
    {
      title: '磁盘',
      dataIndex: 'disk',
      key: 'disk',
      width: '12%',
      render: (value: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 90 ? '#ff4d4f' : value > 75 ? '#faad14' : '#52c41a'}
            style={{ width: 60 }}
          />
          <span style={{ fontSize: 12 }}>{value}%</span>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: MonitoringAssetStatus) => {
        const config = {
          running: { color: 'success', text: '运行中' },
          stopped: { color: 'default', text: '已停止' },
          error: { color: 'error', text: '异常' },
          unknown: { color: 'warning', text: '未知' },
        }
        const { color, text } = config[status]
        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  return (
    <div className="assets-tab">
      {/* 统计和筛选区域 */}
      <div className="filter-stats-row" style={{ marginBottom: 16 }}>
        {/* 左侧：类型统计 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {Object.entries(stats).map(([type, count]) => (
            <span key={type} style={{ fontSize: 14 }}>
              {type}: <strong>{count}</strong>
            </span>
          ))}
        </div>

        {/* 右侧：状态筛选 */}
        <Radio.Group
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="running">运行中</Radio.Button>
          <Radio.Button value="stopped">已停止</Radio.Button>
          <Radio.Button value="error">异常</Radio.Button>
        </Radio.Group>
      </div>

      {/* 表格 */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 项`,
        }}
      />
    </div>
  )
}

export default AssetsTab
