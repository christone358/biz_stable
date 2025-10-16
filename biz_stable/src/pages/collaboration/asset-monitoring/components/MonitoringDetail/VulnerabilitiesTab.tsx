import React, { useState, useMemo } from 'react'
import { Table, Tag, Button, Space, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MonitoringVulnerability, MonitoringVulnerabilityStatus } from '../../types'

interface VulnerabilitiesTabProps {
  vulnerabilities: MonitoringVulnerability[]
}

/**
 * 脆弱性Tab组件
 */
const VulnerabilitiesTab: React.FC<VulnerabilitiesTabProps> = ({ vulnerabilities }) => {
  const [filter, setFilter] = useState<'all' | MonitoringVulnerabilityStatus>('all')

  // 筛选后的数据
  const filteredData = useMemo(() => {
    if (filter === 'all') return vulnerabilities
    return vulnerabilities.filter(vuln => vuln.status === filter)
  }, [vulnerabilities, filter])

  // 统计数据
  const stats = useMemo(() => {
    const high = vulnerabilities.filter(v => v.riskLevel === 'high').length
    const medium = vulnerabilities.filter(v => v.riskLevel === 'medium').length
    const low = vulnerabilities.filter(v => v.riskLevel === 'low').length
    return { high, medium, low }
  }, [vulnerabilities])

  const columns: ColumnsType<MonitoringVulnerability> = [
    {
      title: '漏洞名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.cveId}</div>
        </div>
      ),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: '10%',
      render: (level: string) => {
        const config = {
          high: { color: 'error', text: '高危' },
          medium: { color: 'warning', text: '中危' },
          low: { color: 'default', text: '低危' },
        }
        const { color, text } = config[level as keyof typeof config]
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '影响资产',
      key: 'affectedAsset',
      width: '20%',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.affectedAsset.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.affectedAsset.ipAddress}</div>
        </div>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: '12%',
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
          completed: { color: 'success', text: '已完成' },
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
          <Button type="primary" size="small" style={{ width: '80px' }}>
            {record.status === 'processing' ? '继续处理' : '处理'}
          </Button>
          <Button size="small" style={{ width: '60px' }}>
            查看
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="vulnerabilities-tab">
      {/* 统计和筛选区域 */}
      <div className="filter-stats-row" style={{ marginBottom: 16 }}>
        {/* 左侧：数量统计 */}
        <Space size="middle">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4f' }}></span>
            高危: {stats.high}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#faad14' }}></span>
            中危: {stats.medium}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d9d9d9' }}></span>
            低危: {stats.low}
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
          <Radio.Button value="completed">已完成</Radio.Button>
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

export default VulnerabilitiesTab
