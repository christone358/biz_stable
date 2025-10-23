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
import TaskDetailDrawer from './components/TaskDetailDrawer'
import { generateCollaborationTasks, generateTaskStatistics } from './mock/task-data'
import type {
  CollaborationTask,
  TaskType,
  TaskStatus,
  TaskPriority,
  ResponsibleUnit,
  TaskFilters
} from './types'
import './index.css'

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
    type: 'all',
    status: 'all',
    priority: 'all',
    responsibleUnit: 'all',
    searchText: '',
    dateRange: undefined
  })

  // 选中的任务类型Tab
  const [selectedType, setSelectedType] = useState<TaskType | 'all'>('all')

  // 详情抽屉状态
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<CollaborationTask | null>(null)

  // 筛选任务
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      // 类型筛选
      if (selectedType !== 'all' && task.type !== selectedType) {
        return false
      }

      // 状态筛选
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false
      }

      // 优先级筛选
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false
      }

      // 责任单位筛选
      if (filters.responsibleUnit !== 'all' && task.responsibleUnit !== filters.responsibleUnit) {
        return false
      }

      // 搜索文本筛选
      if (filters.searchText) {
        const searchText = filters.searchText.toLowerCase()
        return (
          task.title.toLowerCase().includes(searchText) ||
          task.taskNo.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText) ||
          task.affectedBusiness.toLowerCase().includes(searchText)
        )
      }

      // 日期范围筛选
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const createdAt = dayjs(task.createdAt)
        return createdAt.isAfter(dayjs(filters.dateRange[0])) &&
               createdAt.isBefore(dayjs(filters.dateRange[1]))
      }

      return true
    })
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

  // 处理卡片点击 - 按状态筛选
  const handleStatCardClick = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? 'all' : status as TaskStatus
    }))
  }

  // 查看任务详情
  const handleViewDetail = (task: CollaborationTask) => {
    setSelectedTask(task)
    setDetailVisible(true)
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
      type: 'all',
      status: 'all',
      priority: 'all',
      responsibleUnit: 'all',
      searchText: '',
      dateRange: undefined
    })
    setSelectedType('all')
    message.info('已重置筛选条件')
  }

  // Tab切换
  const tabItems = [
    {
      key: 'all',
      label: `全部任务 (${allTasks.length})`
    },
    {
      key: 'alert',
      label: `运行告警处置 (${taskCountByType.alert})`
    },
    {
      key: 'vulnerability',
      label: `脆弱性处置 (${taskCountByType.vulnerability})`
    },
    {
      key: 'asset',
      label: `资产运营 (${taskCountByType.asset})`
    }
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
          tabBarExtraContent={
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          }
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
            <Select.Option value="all">全部状态</Select.Option>
            <Select.Option value="pending">待处理</Select.Option>
            <Select.Option value="processing">处理中</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="overdue">已逾期</Select.Option>
            <Select.Option value="ignored">已忽略</Select.Option>
          </Select>

          <Select
            value={filters.priority}
            onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
            style={{ width: 120 }}
            suffixIcon={<FilterOutlined />}
          >
            <Select.Option value="all">全部优先级</Select.Option>
            <Select.Option value="urgent">紧急</Select.Option>
            <Select.Option value="high">重要</Select.Option>
            <Select.Option value="medium">一般</Select.Option>
            <Select.Option value="low">低</Select.Option>
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

        <div style={{ marginTop: 12, fontSize: 13, color: '#8c8c8c' }}>
          共筛选出 <span style={{ color: '#1890ff', fontWeight: 600 }}>{filteredTasks.length}</span> 个任务
          {statistics.overdue > 0 && (
            <span style={{ marginLeft: 16, color: '#ff4d4f', fontWeight: 600 }}>
              其中逾期任务 {statistics.overdue} 个
            </span>
          )}
        </div>
      </Card>

      {/* 任务列表 */}
      <TaskList
        tasks={filteredTasks}
        onViewDetail={handleViewDetail}
        onRemind={handleRemind}
        onEscalate={handleEscalate}
      />

      {/* 任务详情抽屉 */}
      <TaskDetailDrawer
        visible={detailVisible}
        task={selectedTask}
        onClose={() => setDetailVisible(false)}
        onRemind={(taskId) => {
          const task = allTasks.find(t => t.id === taskId)
          if (task) {
            handleRemind(task)
          }
        }}
      />
    </div>
  )
}

export default TaskManagement
