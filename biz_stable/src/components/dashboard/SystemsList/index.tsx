import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Table, Card, Tag, Input, Select, Button, Space, Tooltip } from 'antd'
import { ExclamationCircleOutlined, BugOutlined } from '@ant-design/icons'
import { RootState } from '../../../store'
import { BusinessSystem, HealthStatus, ImportanceLevel } from '../../../types'
import type { ColumnsType } from 'antd/es/table'
import './index.css'

const { Search } = Input
const { Option } = Select

const SystemsList: React.FC = () => {
  const { systems, loading, selectedOrganization, filteredAssets } = useSelector((state: RootState) => state.dashboard)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<HealthStatus[]>([])
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([])
  const [importanceFilter, setImportanceFilter] = useState<ImportanceLevel[]>([])

  // 获取当前应该显示的系统数据
  const currentSystems = useMemo(() => {
    if (selectedOrganization?.type === 'asset' && filteredAssets.length > 0) {
      // 当选择单个资产时，只显示包含该资产的系统
      const asset = filteredAssets[0]
      const parentSystem = systems.find(sys => sys.id === asset.systemId)
      return parentSystem ? [parentSystem] : []
    }
    return systems
  }, [systems, selectedOrganization, filteredAssets])

  // 过滤后的数据
  const filteredSystems = useMemo(() => {
    return currentSystems.filter(system => {
      const matchSearch = !searchText ||
        system.name.toLowerCase().includes(searchText.toLowerCase()) ||
        system.department.toLowerCase().includes(searchText.toLowerCase())

      const matchStatus = statusFilter.length === 0 || statusFilter.includes(system.healthStatus)
      const matchDepartment = departmentFilter.length === 0 || departmentFilter.includes(system.department)
      const matchImportance = importanceFilter.length === 0 || importanceFilter.includes(system.importance)

      return matchSearch && matchStatus && matchDepartment && matchImportance
    })
  }, [currentSystems, searchText, statusFilter, departmentFilter, importanceFilter])

  // 获取唯一的部门列表
  const departments = useMemo(() => {
    return Array.from(new Set(currentSystems.map(s => s.department))).sort()
  }, [currentSystems])

  const getStatusTag = (status: HealthStatus) => {
    const statusConfig = {
      HEALTHY: { color: 'success', text: '正常', icon: null },
      WARNING: { color: 'warning', text: '警告', icon: <ExclamationCircleOutlined /> },
      CRITICAL: { color: 'error', text: '故障', icon: <ExclamationCircleOutlined /> },
      UNKNOWN: { color: 'default', text: '未知', icon: null }
    }

    const config = statusConfig[status]
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    )
  }

  const getImportanceTag = (importance: ImportanceLevel) => {
    const importanceConfig = {
      CRITICAL: { color: '#ff4d4f', text: '极高' },
      HIGH: { color: '#faad14', text: '高' },
      MEDIUM: { color: '#52c41a', text: '中' },
      LOW: { color: '#d9d9d9', text: '低' }
    }

    const config = importanceConfig[importance]
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getMetricColor = (value: number, type: 'errorRate' | 'responseTime') => {
    if (type === 'errorRate') {
      if (value < 1) return '#52c41a'
      if (value < 5) return '#faad14'
      return '#ff4d4f'
    } else {
      if (value < 200) return '#52c41a'
      if (value < 1000) return '#faad14'
      return '#ff4d4f'
    }
  }

  const columns: ColumnsType<BusinessSystem> = [
    {
      title: '系统名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      ellipsis: { showTitle: false },
      render: (text, record) => (
        <Tooltip title={text}>
          <Button
            type="link"
            className="system-name-link"
            onClick={() => console.log('查看系统详情:', record.id)}
          >
            {text}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: '归属单位',
      dataIndex: 'department',
      key: 'department',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '重要性',
      dataIndex: 'importance',
      key: 'importance',
      width: '10%',
      render: (importance) => getImportanceTag(importance),
      sorter: (a, b) => {
        const order = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        return order[a.importance] - order[b.importance]
      },
    },
    {
      title: '健康状态',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      width: '12%',
      render: (status) => getStatusTag(status),
      sorter: (a, b) => {
        const order = { CRITICAL: 4, WARNING: 3, UNKNOWN: 2, HEALTHY: 1 }
        return order[a.healthStatus] - order[b.healthStatus]
      },
    },
    {
      title: '高危漏洞',
      dataIndex: 'vulnerabilityCount',
      key: 'vulnerabilityCount',
      width: '10%',
      render: (count) => (
        <span style={{ color: count > 0 ? '#ff4d4f' : '#52c41a' }}>
          {count > 0 ? (
            <>
              <BugOutlined style={{ marginRight: 4 }} />
              {count}个
            </>
          ) : '无'}
        </span>
      ),
      sorter: (a, b) => a.vulnerabilityCount - b.vulnerabilityCount,
    },
    {
      title: '关键指标',
      key: 'metrics',
      width: '18%',
      render: (_, record) => (
        <div className="metrics-cell">
          <div style={{ color: getMetricColor(record.errorRate, 'errorRate') }}>
            错误率 {record.errorRate.toFixed(2)}%
          </div>
          <div style={{ color: getMetricColor(record.responseTime, 'responseTime') }}>
            响应时间 {record.responseTime}ms
          </div>
        </div>
      ),
    },
    {
      title: '未处理告警',
      dataIndex: 'alertCount',
      key: 'alertCount',
      width: '10%',
      render: (count, _record) => {
        if (count === 0) {
          return <span style={{ color: '#52c41a' }}>无</span>
        }

        // 模拟P0/P1告警（假设20%为高优先级）
        const isHighPriority = Math.random() < 0.2

        return (
          <span
            style={{
              color: '#ff4d4f',
              animation: isHighPriority ? 'blink 2s infinite' : 'none'
            }}
          >
            <ExclamationCircleOutlined style={{ marginRight: 4 }} />
            {count}条
          </span>
        )
      },
      sorter: (a, b) => a.alertCount - b.alertCount,
    },
  ]

  const clearFilters = () => {
    setSearchText('')
    setStatusFilter([])
    setDepartmentFilter([])
    setImportanceFilter([])
  }

  return (
    <Card
      title="核心业务系统状态列表"
      className="systems-list-card"
      extra={
        <Space>
          <span className="systems-count">
            共 {filteredSystems.length} 个系统
          </span>
        </Space>
      }
    >
      <div className="filters-container">
        <Space wrap>
          <Search
            placeholder="搜索系统名称或归属单位"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />

          <Select
            mode="multiple"
            placeholder="健康状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="HEALTHY">正常</Option>
            <Option value="WARNING">警告</Option>
            <Option value="CRITICAL">故障</Option>
            <Option value="UNKNOWN">未知</Option>
          </Select>

          <Select
            mode="multiple"
            placeholder="归属单位"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            style={{ width: 150 }}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            placeholder="重要性等级"
            value={importanceFilter}
            onChange={setImportanceFilter}
            style={{ width: 120 }}
          >
            <Option value="CRITICAL">极高</Option>
            <Option value="HIGH">高</Option>
            <Option value="MEDIUM">中</Option>
            <Option value="LOW">低</Option>
          </Select>

          <Button onClick={clearFilters}>
            清空筛选
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSystems}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
        size="middle"
        scroll={{ x: 1000 }}
        rowClassName={(record) => {
          if (record.vulnerabilityCount > 0) return 'critical-row'
          if (record.alertCount > 0 && Math.random() < 0.2) return 'alert-row'
          return ''
        }}
      />
    </Card>
  )
}

export default SystemsList