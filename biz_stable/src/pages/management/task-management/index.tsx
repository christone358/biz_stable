import React, { useState, useMemo } from 'react'
import { Card, Tabs, Space, Input, Select, DatePicker, Button, message } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  TeamOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import TaskStatisticsCards from './components/TaskStatisticsCards'
import TaskList from './components/TaskList'
import { generateCollaborationTasks, generateTaskStatistics } from './mock/task-data'
import type { CollaborationTask, TaskType, TaskFilters } from './types'
import { filterTasks, buildSubCategoryOptions, buildInitiatorOptions } from './filter-utils'
import { getStatusViewOptions } from './status-utils'
import { TASK_TYPE_LABELS } from './constants'
import { mapTaskToTicketOverrides } from './mappers'
import './index.css'
import { useNavigate } from 'react-router-dom'

const { RangePicker } = DatePicker

/**
 * 任务管理页面
 * 协同任务看板 - 统一管理各类协同任务
 */
const TaskManagement: React.FC = () => {
  // 任务数据
  const [allTasks] = useState<CollaborationTask[]>(generateCollaborationTasks())

  // 筛选条件
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    responsibleUnit: 'all',
    initiator: 'all',
    subCategory: 'all',
    searchText: '',
    dateRange: undefined
  })

  const navigate = useNavigate()

  // 选中的任务类型Tab
  const [selectedType, setSelectedType] = useState<TaskType | 'all'>('all')

  // 筛选任务
  const filteredTasks = useMemo(() => {
    return filterTasks(allTasks, selectedType, filters)
  }, [allTasks, selectedType, filters])

  // 统计数据
  const statistics = useMemo(() => {
    return generateTaskStatistics(filteredTasks)
  }, [filteredTasks])

  // 按类型分组的任务数量
  const taskCountByType = useMemo(() => {
    return {
      alert: allTasks.filter(t => t.type === 'alert').length,
      vulnerability: allTasks.filter(t => t.type === 'vulnerability').length,
      asset: allTasks.filter(t => t.type === 'asset').length
    }
  }, [allTasks])

  const initiatorOptions = useMemo(() => buildInitiatorOptions(allTasks), [allTasks])
  const subCategoryOptions = useMemo(
    () => buildSubCategoryOptions(allTasks, selectedType),
    [allTasks, selectedType],
  )
  const statusOptions = useMemo(() => getStatusViewOptions(), [])

  // 处理卡片点击 - 按状态筛选
  const handleStatCardClick = (status: TaskFilters['status']) => {
    setFilters(prev => ({
      ...prev,
      status
    }))
  }

  // 查看任务详情
  const handleViewDetail = (task: CollaborationTask) => {
    navigate(`/management/tickets/${task.id}`, {
      state: {
        ticketKind: 'security-hardening',
        ticketOverrides: mapTaskToTicketOverrides(task),
      },
    })
  }

  // 催办任务
  const handleRemind = (task: CollaborationTask) => {
    message.success(`已向${task.responsibleUnit}发送催办提醒`)
  }

  // 升级任务
  const handleEscalate = (task: CollaborationTask) => {
    message.warning(`任务${task.taskNo}已升级处理`)
  }

  // 重置筛选
  const handleReset = () => {
    setFilters({
      status: 'all',
      responsibleUnit: 'all',
      initiator: 'all',
      subCategory: 'all',
      searchText: '',
      dateRange: undefined
    })
    setSelectedType('all')
    message.info('筛选条件已恢复默认')
  }

  // Tab切换
  const tabItems = [
    {
      key: 'all',
      label: `全部任务 (${allTasks.length})`
    },
    ...(['alert', 'vulnerability', 'asset'] as TaskType[]).map(type => ({
      key: type,
      label: `${TASK_TYPE_LABELS[type]} (${taskCountByType[type]})`
    }))
  ]

  return (
    <div className="task-management-page">
      {/* 页面标题 */}
      <div className="task-management-header">
        <div className="header-left">
          <div className="department-icon">
            <TeamOutlined />
          </div>
          <div>
            <h1 className="page-title">
              协同任务管理
              <span className="page-subtitle">任务看板</span>
            </h1>
            <p className="page-description">统一管理各类协同任务,跟踪处置进度</p>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <TaskStatisticsCards
        statistics={statistics}
        onCardClick={handleStatCardClick}
      />

      {/* 任务类型Tab */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={selectedType}
          onChange={(key) => setSelectedType(key as TaskType | 'all')}
          items={tabItems}
        />
      </Card>

      {/* 筛选工具栏 */}
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
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
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
            onChange={(value) => setFilters(prev => ({ ...prev, subCategory: value }))}
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
            onChange={(value) => setFilters(prev => ({ ...prev, responsibleUnit: value }))}
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
            onChange={(dates) => {
              setFilters(prev => ({
                ...prev,
                dateRange: dates ? [dates[0]!.toISOString(), dates[1]!.toISOString()] : undefined
              }))
            }}
            placeholder={['创建开始时间', '创建结束时间']}
            style={{ width: 280 }}
          />
        </Space>

        <div className="task-filter-summary">
          共筛选出 <span className="task-highlight">{filteredTasks.length}</span> 个任务
          <span className="task-inline-stat">处置中 {statistics.inProgress}</span>
          <span className="task-inline-stat">已完成 {statistics.completed}</span>
          <span className="task-inline-stat">已作废 {statistics.voided}</span>
          {statistics.overdue > 0 && (
            <span className="task-inline-alert">
              包含 {statistics.overdue} 个逾期任务
            </span>
          )}
          <Button
            type="link"
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            重置筛选
          </Button>
        </div>
      </Card>

      {/* 任务列表 */}
      <TaskList
        tasks={filteredTasks}
        onViewDetail={handleViewDetail}
        onRemind={handleRemind}
        onEscalate={handleEscalate}
      />

    </div>
  )
}

export default TaskManagement
