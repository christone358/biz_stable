import React, { useState, useMemo } from 'react'
import { Table, Tag, Button, Space, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MonitoringAlert, MonitoringAlertStatus } from '../../types'

interface AlertsTabProps {
  alerts: MonitoringAlert[]
}

/**
 * 运行告警Tab组件
 */
const AlertsTab: React.FC<AlertsTabProps> = ({ alerts }) => {
  const [filter, setFilter] = useState<'all' | MonitoringAlertStatus>('all')

  // 筛选后的数据
  const filteredData = useMemo(() => {
    if (filter === 'all') return alerts
    return alerts.filter(alert => alert.status === filter)
  }, [alerts, filter])

  // 统计数据
  const stats = useMemo(() => {
    const critical = alerts.filter(a => a.level === 'critical').length
    const important = alerts.filter(a => a.level === 'important').length
    const normal = alerts.filter(a => a.level === 'normal').length
    return { critical, important, normal }
  }, [alerts])

  const columns: ColumnsType<MonitoringAlert> = [
    {
      title: '告警名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '关联资产',
      key: 'relatedAsset',
      width: '20%',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.relatedAsset.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.relatedAsset.ipAddress}</div>
        </div>
      ),
    },
    {
      title: '告警级别',
      dataIndex: 'level',
      key: 'level',
      width: '10%',
      render: (level: string) => {
        const config = {
          critical: { color: 'error', text: '紧急' },
          important: { color: 'warning', text: '重要' },
          normal: { color: 'default', text: '一般' },
        }
        const { color, text} = config[level as keyof typeof config]
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      width: '10%',
    },
    {
      title: '发生时间',
      dataIndex: 'occurTime',
      key: 'occurTime',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => {
        const config = {
          unhandled: { color: 'error', text: '未处理' },
          processing: { color: 'processing', text: '处理中' },
          resolved: { color: 'success', text: '已解决' },
        }
        const { color, text } = config[status as keyof typeof config]
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" style={{ width: '60px' }}>
            {record.status === 'processing' ? '继续' : '处理'}
          </Button>
          <Button size="small" style={{ width: '60px' }}>
            查看
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="alerts-tab">
      {/* 统计和筛选区域 */}
      <div className="filter-stats-row" style={{ marginBottom: 16 }}>
        {/* 左侧：数量统计 */}
        <Space size="middle">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4f' }}></span>
            紧急: {stats.critical}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#faad14' }}></span>
            重要: {stats.important}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d9d9d9' }}></span>
            一般: {stats.normal}
          </span>
        </Space>

        {/* 右侧：状态筛选 */}
        <Radio.Group
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="unhandled">未处理</Radio.Button>
          <Radio.Button value="processing">处理中</Radio.Button>
          <Radio.Button value="resolved">已解决</Radio.Button>
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

export default AlertsTab
