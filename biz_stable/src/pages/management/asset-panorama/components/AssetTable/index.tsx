import React from 'react'
import { Card, Table, Tag, Button } from 'antd'
import type { AssetLayerType, AssetItem } from '../../types'
import './index.css'

interface AssetTableProps {
  layer: AssetLayerType
  title: string
  data: AssetItem[]
  isManageMode: boolean
}

const AssetTable: React.FC<AssetTableProps> = ({ title, data, isManageMode }) => {
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      running: { color: 'success', text: '运行中' },
      stopped: { color: 'error', text: '已停止' },
      idle: { color: 'warning', text: '空闲' },
      abnormal: { color: 'error', text: '异常' }
    }
    const config = statusMap[status] || { color: 'default', text: '未知' }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns: any[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
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
      render: (status: string) => getStatusTag(status)
    },
    {
      title: 'IP/地址',
      dataIndex: 'address',
      key: 'address',
      width: 200
    },
    {
      title: '配置',
      dataIndex: 'config',
      key: 'config',
      width: 150
    }
  ]

  if (isManageMode) {
    columns.push({
      title: '责任人',
      dataIndex: 'owner',
      key: 'owner',
      width: 150
    })
  }

  columns.push({
    title: '操作',
    key: 'action',
    width: 100,
    render: () => <Button type="link" size="small">详情</Button>
  })

  return (
    <Card
      className="asset-table-card"
      title={`${title}${isManageMode ? '台账管理' : '台账'}`}
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        scroll={{ x: 900 }}
      />
    </Card>
  )
}

export default AssetTable
