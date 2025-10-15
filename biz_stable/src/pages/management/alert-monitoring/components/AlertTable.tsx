import React, { useState } from 'react'
import { Card, Table, Button, Input, Tag, Space } from 'antd'
import { SearchOutlined, UserAddOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { AlertRecord } from '../types'
import { AlertLevel, AlertStatus } from '../types'
import { alertLevelLabels, alertStatusLabels, resourceTypeLabels } from '../../../../mock/alert-monitoring-data'
import './AlertTable.css'

interface AlertTableProps {
  data: AlertRecord[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  onPageChange: (page: number, pageSize: number) => void
  onAssign: (record: AlertRecord) => void
  onClose: (record: AlertRecord) => void
  onBatchAssign: (selectedIds: string[]) => void
  onBatchClose: (selectedIds: string[]) => void
}

const AlertTable: React.FC<AlertTableProps> = ({
  data,
  loading,
  pagination,
  onPageChange,
  onAssign,
  onClose,
  onBatchAssign,
  onBatchClose
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 告警等级颜色映射
  const getLevelColor = (level: AlertLevel): string => {
    const colorMap = {
      [AlertLevel.EMERGENCY]: 'error',
      [AlertLevel.SEVERE]: 'warning',
      [AlertLevel.WARNING]: 'gold'
    }
    return colorMap[level]
  }

  // 告警状态颜色映射
  const getStatusColor = (status: AlertStatus): string => {
    const colorMap = {
      [AlertStatus.PENDING]: 'blue',
      [AlertStatus.TO_PROCESS]: 'default',
      [AlertStatus.PROCESSING]: 'purple',
      [AlertStatus.TO_CLOSE]: 'default',
      [AlertStatus.CLOSED]: 'success'
    }
    return colorMap[status]
  }

  const columns: ColumnsType<AlertRecord> = [
    {
      title: '告警等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level: AlertLevel) => (
        <Tag color={getLevelColor(level)}>{alertLevelLabels[level]}</Tag>
      )
    },
    {
      title: '告警名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name: string, record: AlertRecord) => (
        <div>
          <div className="alert-name">{name}</div>
          <div className="alert-description">{record.description}</div>
        </div>
      )
    },
    {
      title: '告警发现时间',
      dataIndex: 'discoveredTime',
      key: 'discoveredTime',
      width: 180
    },
    {
      title: '告警ID',
      dataIndex: 'id',
      key: 'id',
      width: 180
    },
    {
      title: '告警对象',
      dataIndex: 'alertObject',
      key: 'alertObject',
      width: 150
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      key: 'resourceType',
      width: 120,
      render: (type) => resourceTypeLabels[type]
    },
    {
      title: '告警状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AlertStatus) => (
        <Tag color={getStatusColor(status)}>{alertStatusLabels[status]}</Tag>
      )
    },
    {
      title: '处置责任人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (assignee) => assignee || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === AlertStatus.CLOSED ? (
            <Button size="small" type="link">
              查看详情
            </Button>
          ) : (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() => onAssign(record)}
              >
                {record.assignee ? '重新指派' : '指派'}
              </Button>
              <Button
                size="small"
                onClick={() => onClose(record)}
              >
                关闭
              </Button>
            </>
          )}
        </Space>
      )
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys)
    }
  }

  const handleBatchAssign = () => {
    onBatchAssign(selectedRowKeys as string[])
    setSelectedRowKeys([])
  }

  const handleBatchClose = () => {
    onBatchClose(selectedRowKeys as string[])
    setSelectedRowKeys([])
  }

  return (
    <Card
      title="告警列表"
      className="alert-table-card"
      bordered={false}
    >
      <div className="action-bar">
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchAssign}
          >
            批量指派
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchClose}
          >
            批量关闭
          </Button>
        </Space>
        <Input
          placeholder="请输入关键词搜索"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: onPageChange
        }}
        scroll={{ x: 1500 }}
      />
    </Card>
  )
}

export default AlertTable
