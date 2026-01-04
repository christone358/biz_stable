import React, { useState, useMemo } from 'react'
import { Card, Tabs, Space, Input, Select, DatePicker, Button, message } from 'antd'
import { SearchOutlined, FilterOutlined, TeamOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import TaskStatisticsCards from '../../management/task-management/components/TaskStatisticsCards'
import TaskList from '../../management/task-management/components/TaskList'
import { generateCollaborationTasks, generateTaskStatistics } from '../../management/task-management/mock/task-data'
import type { CollaborationTask, TaskType, TaskFilters } from '../../management/task-management/types'
import { buildInitiatorOptions, buildSubCategoryOptions, filterTasks } from '../../management/task-management/filter-utils'
import { getStatusViewOptions } from '../../management/task-management/status-utils'
import { TASK_CENTER_CURRENT_USER, TASK_TYPE_LABELS } from '../../management/task-management/constants'
import { mapTaskToTicketOverrides } from '../../management/task-management/mappers'
import { useNavigate } from 'react-router-dom'
import '../../management/task-management/index.css'
import './index.css'

const { RangePicker } = DatePicker

const TaskCenter: React.FC = () => {
  const navigate = useNavigate()
  const [allTasks] = useState<CollaborationTask[]>(() =>
    generateCollaborationTasks().filter(task => task.currentProcessor === TASK_CENTER_CURRENT_USER),
  )

  const [selectedType, setSelectedType] = useState<TaskType | 'all'>('all')
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    responsibleUnit: 'all',
    initiator: 'all',
    subCategory: 'all',
    searchText: '',
    dateRange: undefined,
  })

  const filteredTasks = useMemo(() => filterTasks(allTasks, selectedType, filters), [allTasks, selectedType, filters])
  const statistics = useMemo(() => generateTaskStatistics(filteredTasks), [filteredTasks])

  const taskCountByType = useMemo(() => {
    return {
      alert: allTasks.filter(t => t.type === 'alert').length,
      vulnerability: allTasks.filter(t => t.type === 'vulnerability').length,
      asset: allTasks.filter(t => t.type === 'asset').length,
    }
  }, [allTasks])

  const initiatorOptions = useMemo(() => buildInitiatorOptions(allTasks), [allTasks])
  const subCategoryOptions = useMemo(
    () => buildSubCategoryOptions(allTasks, selectedType),
    [allTasks, selectedType],
  )
  const statusOptions = useMemo(() => getStatusViewOptions(), [])

  const handleViewDetail = (task: CollaborationTask) => {
    navigate(`/collaboration/tickets/${task.id}`, {
      state: {
        ticketKind: 'security-hardening',
        ticketOverrides: mapTaskToTicketOverrides(task),
      },
    })
  }

  const handleReset = () => {
    setFilters({
      status: 'all',
      responsibleUnit: 'all',
      initiator: 'all',
      subCategory: 'all',
      searchText: '',
      dateRange: undefined,
    })
    setSelectedType('all')
    message.info('筛选条件已恢复默认')
  }

  const tabItems = [
    { key: 'all', label: `全部任务 (${allTasks.length})` },
    ...(['alert', 'vulnerability', 'asset'] as TaskType[]).map(type => ({
      key: type,
      label: `${TASK_TYPE_LABELS[type]} (${taskCountByType[type]})`,
    })),
  ]

  return (
    <div className="task-management-page personal-task-page">
      <div className="task-management-header">
        <div className="header-left">
          <div className="department-icon">
            <UserOutlined />
          </div>
          <div>
            <h1 className="page-title">
              我的任务
              <span className="page-subtitle">任务中心</span>
            </h1>
            <p className="page-description">集中查看并处置指派给我的协同任务</p>
          </div>
        </div>
        <div className="header-left">
          <Space>
            <span className="task-center-user">当前处理人：{TASK_CENTER_CURRENT_USER}</span>
          </Space>
        </div>
      </div>

      <TaskStatisticsCards statistics={statistics} onCardClick={status => setFilters(prev => ({ ...prev, status }))} />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={selectedType}
          onChange={key => setSelectedType(key as TaskType | 'all')}
          items={tabItems}
        />
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索任务编号、标题、描述..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 320 }}
            value={filters.searchText}
            onChange={e => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
          />

          <Select
            value={filters.status}
            onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            style={{ width: 140 }}
            suffixIcon={<FilterOutlined />}
          >
            {statusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={filters.subCategory}
            onChange={value => setFilters(prev => ({ ...prev, subCategory: value }))}
            style={{ width: 200 }}
            placeholder="二级分类"
            suffixIcon={<FilterOutlined />}
            disabled={!subCategoryOptions.length}
          >
            <Select.Option value="all">全部二级分类</Select.Option>
            {subCategoryOptions.map(category => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={filters.initiator}
            onChange={value => setFilters(prev => ({ ...prev, initiator: value }))}
            style={{ width: 160 }}
            placeholder="流程发起人"
            suffixIcon={<FilterOutlined />}
          >
            <Select.Option value="all">全部发起人</Select.Option>
            {initiatorOptions.map(name => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={filters.responsibleUnit}
            onChange={value => setFilters(prev => ({ ...prev, responsibleUnit: value }))}
            style={{ width: 160 }}
            suffixIcon={<TeamOutlined />}
          >
            <Select.Option value="all">全部单位</Select.Option>
            <Select.Option value="运维开发部">运维开发部</Select.Option>
            <Select.Option value="安全管理部">安全管理部</Select.Option>
            <Select.Option value="网络管理部">网络管理部</Select.Option>
            <Select.Option value="系统管理部">系统管理部</Select.Option>
            <Select.Option value="数据管理部">数据管理部</Select.Option>
          </Select>

          <RangePicker
            value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
            onChange={dates => {
              setFilters(prev => ({
                ...prev,
                dateRange: dates ? [dates[0]!.toISOString(), dates[1]!.toISOString()] : undefined,
              }))
            }}
            placeholder={['创建开始时间', '创建结束时间']}
            style={{ width: 280 }}
          />
        </Space>

        <div className="task-filter-summary">
          共 <span className="task-highlight">{filteredTasks.length}</span> 个待处理任务
          <span className="task-inline-stat">处置中 {statistics.inProgress}</span>
          <span className="task-inline-stat">已完成 {statistics.completed}</span>
          <span className="task-inline-stat">已作废 {statistics.voided}</span>
          {statistics.overdue > 0 && <span className="task-inline-alert">包含 {statistics.overdue} 个逾期任务</span>}
          <Button type="link" size="small" icon={<ReloadOutlined />} onClick={handleReset}>
            重置筛选
          </Button>
        </div>
      </Card>

      <TaskList
        tasks={filteredTasks}
        onViewDetail={handleViewDetail}
      />
    </div>
  )
}

export default TaskCenter
