import React, { useState, useMemo } from 'react'
import { Card, Table, Tag, Button, Space, Radio } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'
import type { Asset, FilterStatus, AssetDisposalType } from '../types'
import type { ColumnsType } from 'antd/es/table'
import './AssetClaimCard.css'

interface AssetClaimCardProps {
  data: Asset[]
  onClaim: (id: string) => void
  onReject: (id: string) => void
  onView: (id: string) => void
}

/**
 * 异常资产卡片组件
 */
const AssetClaimCard: React.FC<AssetClaimCardProps> = ({ data, onClaim, onReject, onView }) => {
  const [filter, setFilter] = useState<FilterStatus | AssetDisposalType>('all')

  // 筛选后的数据
  const filteredData = useMemo(() => {
    if (filter === 'all') return data
    // 如果是处置类型筛选
    if (filter === 'claim' || filter === 'compliance' || filter === 'responsibility') {
      return data.filter(item => item.disposalType === filter)
    }
    // 如果是状态筛选
    return data.filter(item => item.status === filter)
  }, [data, filter])

  // 统计数据 - 按处置类型统计
  const stats = useMemo(() => {
    const claim = data.filter(a => a.disposalType === 'claim').length
    const compliance = data.filter(a => a.disposalType === 'compliance').length
    const responsibility = data.filter(a => a.disposalType === 'responsibility').length
    return { claim, compliance, responsibility }
  }, [data])

  // 表格列配置
  const columns: ColumnsType<Asset> = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      width: '16%',
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: '13%',
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
      title: '影响业务',
      dataIndex: 'affectedBusiness',
      key: 'affectedBusiness',
      width: '13%',
    },
    {
      title: '发现时间',
      dataIndex: 'discoveryTime',
      key: 'discoveryTime',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => {
        const config = {
          unclaimed: { color: 'warning', text: '未认领' },
          claimed: { color: 'success', text: '已认领' },
          rejected: { color: 'error', text: '已拒绝' },
        }
        const { color, text } = config[status as keyof typeof config]
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '13%',
      render: (_, record) => {
        if (record.status === 'unclaimed') {
          return (
            <Space size="small">
              <Button
                type="primary"
                size="small"
                onClick={() => onClaim(record.id)}
                style={{ width: '60px' }}
              >
                认领
              </Button>
              <Button
                size="small"
                onClick={() => onReject(record.id)}
                style={{ width: '60px' }}
              >
                拒绝
              </Button>
            </Space>
          )
        } else if (record.status === 'claimed') {
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
        return null
      },
    },
  ]

  return (
    <Card className="asset-claim-card">
      {/* 卡片头部 */}
      <div className="card-header">
        <h2 className="card-title">
          异常资产
        </h2>
      </div>

      {/* 统计和筛选区域 */}
      <div className="filter-stats-row">
        {/* 左侧：数量统计 */}
        <Space size="middle" className="stats">
          <span
            className={`stat-item stat-clickable ${filter === 'claim' ? 'stat-active' : ''}`}
            onClick={() => setFilter('claim')}
          >
            <span className="stat-dot stat-claim"></span>
            资产认领: {stats.claim}
          </span>
          <span
            className={`stat-item stat-clickable ${filter === 'compliance' ? 'stat-active' : ''}`}
            onClick={() => setFilter('compliance')}
          >
            <span className="stat-dot stat-compliance"></span>
            不合规资产处理: {stats.compliance}
          </span>
          <span
            className={`stat-item stat-clickable ${filter === 'responsibility' ? 'stat-active' : ''}`}
            onClick={() => setFilter('responsibility')}
          >
            <span className="stat-dot stat-responsibility"></span>
            责任人确认: {stats.responsibility}
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
          <Radio.Button value="claim">资产认领</Radio.Button>
          <Radio.Button value="compliance">不合规资产</Radio.Button>
          <Radio.Button value="responsibility">责任人确认</Radio.Button>
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

export default AssetClaimCard
