import React, { useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Space, Radio } from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import type { Alert, FilterStatus } from '../types'
import type { ColumnsType } from 'antd/es/table'
import './AlertHandleCard.css'

interface AlertHandleCardProps {
  data: Alert[]
  onHandle: (id: string) => void
  onIgnore: (id: string) => void
  onView: (id: string) => void
}

/**
 * 告警处置卡片组件
 */
const AlertHandleCard: React.FC<AlertHandleCardProps> = ({ data, onHandle, onIgnore, onView }) => {
  const [filter, setFilter] = useState<FilterStatus>('all')

  // 筛选后的数据
  const filteredData = useMemo(() => {
    if (filter === 'all') return data
    return data.filter(item => item.status === filter)
  }, [data, filter])

  // 统计数据
  const stats = useMemo(() => {
    const critical = data.filter(a => a.level === 'critical').length
    const important = data.filter(a => a.level === 'important').length
    const normal = data.filter(a => a.level === 'normal').length
    return { critical, important, normal }
  }, [data])

  // 表格列配置
  const columns: ColumnsType<Alert> = [
    {
      title: '告警名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '关联资产',
      key: 'relatedAsset',
      width: '18%',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.relatedAsset.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.relatedAsset.ipAddress}</div>
        </div>
      ),
    },
    {
      title: '影响业务',
      dataIndex: 'affectedBusiness',
      key: 'affectedBusiness',
      width: '13%',
    },
    {
      title: '告警等级',
      dataIndex: 'level',
      key: 'level',
      width: '10%',
      render: (level: string) => {
        const config = {
          critical: { color: 'error', text: '紧急' },
          important: { color: 'warning', text: '重要' },
          normal: { color: 'default', text: '一般' },
        }
        const { color, text } = config[level as keyof typeof config]
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
      width: '9%',
      render: (status: string) => {
        const config = {
          unhandled: { color: 'error', text: '未处理' },
          processing: { color: 'processing', text: '处理中' },
          resolved: { color: 'success', text: '已解决' },
          ignored: { color: 'default', text: '已忽略' },
        }
        const { color, text } = config[status as keyof typeof config]
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_, record) => {
        if (record.status === 'unhandled') {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                onClick={() => onHandle(record.id)}
                style={{ width: '60px' }}
              >
                处理
              </Button>
              <Button
                size="small"
                onClick={() => onIgnore(record.id)}
                style={{ width: '60px' }}
              >
                忽略
              </Button>
            </Space>
          )
        } else if (record.status === 'processing') {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => onHandle(record.id)}
              style={{ width: '80px' }}
            >
              继续处理
            </Button>
          )
        } else {
          return (
            <Button
              size="small"
              onClick={() => onView(record.id)}
              style={{ width: '60px' }}
            >
              查看
            </Button>
          )
        }
      },
    },
  ]

  return (
    <Card className="alert-handle-card">
      {/* 卡片头部 */}
      <div className="card-header">
        <h2 className="card-title">
          告警处置
        </h2>
      </div>

      {/* 统计和筛选区域 */}
      <div className="filter-stats-row">
        {/* 左侧：数量统计 */}
        <Space size="middle" className="stats">
          <span className="stat-item">
            <span className="stat-dot stat-critical"></span>
            紧急: {stats.critical}
          </span>
          <span className="stat-item">
            <span className="stat-dot stat-important"></span>
            重要: {stats.important}
          </span>
          <span className="stat-item">
            <span className="stat-dot stat-normal"></span>
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
          <Radio.Button value="ignored">已忽略</Radio.Button>
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
    </Card>
  )
}

export default AlertHandleCard
