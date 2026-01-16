import React, { useState, useMemo } from 'react'
import { Card, Space, Input, Select, DatePicker, Button, message, TreeSelect, AutoComplete, Modal, Radio } from 'antd'
import { SearchOutlined, FilterOutlined, TeamOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import ScopeCards, { type TicketScope } from './components/ScopeCards'
import TaskList from '../../management/task-management/components/TaskList'
import { generateCollaborationTasks, generateTaskStatistics } from '../../management/task-management/mock/task-data'
import type { CollaborationTask, TaskType, TaskFilters } from '../../management/task-management/types'
import { buildInitiatorOptions, buildSubCategoryOptions, filterTasks } from '../../management/task-management/filter-utils'
// 状态视图选择器已从筛选条移除，保留内部逻辑由“顶层分类”控制
import { TASK_CENTER_CURRENT_USER } from '../../management/task-management/constants'
import { mapTaskToTicketOverrides } from '../../management/task-management/mappers'
import { useNavigate } from 'react-router-dom'
import '../../management/task-management/index.css'
import './index.css'

const { RangePicker } = DatePicker

const TaskCenter: React.FC = () => {
  const navigate = useNavigate()
  const [allTasks] = useState<CollaborationTask[]>(() => generateCollaborationTasks())

  // 顶层分类：默认“我的待办”
  const [scope, setScope] = useState<TicketScope>('myTodo')

  // 任务类型层级筛选：支持选择一级/二级；默认不选等价“全部”
  const [selectedTypeKeys, setSelectedTypeKeys] = useState<string[]>([])

  // 默认视图：我的待办（处置中）
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'inProgress',
    responsibleUnit: 'all',
    initiator: 'all',
    subCategory: 'all',
    searchText: '',
    dateRange: undefined,
  })

  // 基础筛选（不含任务类型树）
  const baseFilteredTasks = useMemo(() => filterTasks(allTasks, 'all', filters), [allTasks, filters])

  // 任务类型层级：定义与映射（一级→TaskType，二级→subCategory 名称）
  const TASK_TYPE_TREE = useMemo(
    () => [
      { title: '告警处置', value: 'cat:告警处置', children: [ { title: '告警处置', value: 'sub:告警处置' } ] },
      { title: '事件处置', value: 'cat:事件处置', children: [ { title: '事件处置', value: 'sub:事件处置' } ] },
      { title: '芮错行处置', value: 'cat:芮错行处置', children: [
        { title: '弱口令', value: 'sub:弱口令' },
        { title: '主机漏洞', value: 'sub:主机漏洞' },
        { title: 'web漏洞', value: 'sub:web漏洞' },
        { title: '配置核查', value: 'sub:配置核查' },
      ] },
      { title: '远程访问', value: 'cat:远程访问', children: [ { title: '远程访问', value: 'sub:远程访问' } ] },
      { title: '网络准入', value: 'cat:网络准入', children: [
        { title: '互联网准入', value: 'sub:互联网准入' },
        { title: '政务外网准入', value: 'sub:政务外网准入' },
      ] },
      { title: '专项检查', value: 'cat:专项检查', children: [
        { title: '专项检查', value: 'sub:专项检查' },
        { title: '测评支持', value: 'sub:测评支持' },
      ] },
      { title: '资源发布', value: 'cat:资源发布', children: [
        { title: '系统上线', value: 'sub:系统上线' },
        { title: '资源回收', value: 'sub:资源回收' },
      ] },
      { title: '安全加固', value: 'cat:安全加固', children: [
        { title: '安全加固', value: 'sub:安全加固' },
        { title: '应急处置', value: 'sub:应急处置' },
      ] },
    ],
    [],
  )

  const MAP_CATEGORY_TO_TASKTYPE: Record<string, TaskType | undefined> = {
    '告警处置': 'alert',
    '芮错行处置': 'vulnerability',
    // 其他一级类型与现有三类任务类型不完全对齐，保持 undefined（仅依赖二级匹配）
  }

  // 应用任务类型树筛选
  const filteredTasks = useMemo(() => {
    // 先应用顶层分类再套其它条件
    let tasks = baseFilteredTasks
    if (scope === 'myTodo') {
      tasks = tasks.filter(t => t.currentProcessor === TASK_CENTER_CURRENT_USER && (t.status === 'pending' || t.status === 'processing' || t.status === 'overdue'))
    } else if (scope === 'mySubmitted') {
      tasks = tasks.filter(t => t.initiator === TASK_CENTER_CURRENT_USER)
    } else if (scope === 'myDone') {
      tasks = tasks.filter(t => t.status === 'completed' && (
        t.currentProcessor === TASK_CENTER_CURRENT_USER ||
        t.responsiblePerson === TASK_CENTER_CURRENT_USER ||
        t.initiator === TASK_CENTER_CURRENT_USER
      ))
    }

    if (!selectedTypeKeys.length) return tasks

    // 解析选择项
    const selectedCats = new Set(
      selectedTypeKeys
        .filter(k => k.startsWith('cat:'))
        .map(k => k.slice(4)),
    )
    const selectedSubs = new Set(
      selectedTypeKeys
        .filter(k => k.startsWith('sub:'))
        .map(k => k.slice(4)),
    )

    return tasks.filter(task => {
      // 一级命中（按任务大类）
      for (const cat of selectedCats) {
        const mapped = MAP_CATEGORY_TO_TASKTYPE[cat]
        if (mapped && task.type === mapped) return true
      }
      // 二级命中（按具体细分类型）
      if (selectedSubs.size > 0 && selectedSubs.has(task.subCategory)) return true
      return selectedCats.size === 0 && selectedSubs.size === 0
    })
  }, [baseFilteredTasks, selectedTypeKeys, scope])
  const statistics = useMemo(() => generateTaskStatistics(filteredTasks), [filteredTasks])

  const initiatorOptions = useMemo(() => buildInitiatorOptions(allTasks), [allTasks])
  const unitOptions = useMemo(() => Array.from(new Set(allTasks.map(t => t.responsibleUnit))), [allTasks])

  // 输入检索框的本地受控值（回车或选择时生效）
  const [initiatorInput, setInitiatorInput] = useState('')
  const [unitInput, setUnitInput] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createType, setCreateType] = useState<'security_hardening' | 'emergency_response'>('security_hardening')

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
      status: 'inProgress', // 回到“我的待办”
      responsibleUnit: 'all',
      initiator: 'all',
      subCategory: 'all',
      searchText: '',
      dateRange: undefined,
    })
    setSelectedTypeKeys([])
    setScope('myTodo')
    message.info('已恢复默认视图：我的待办')
  }

  // 顶层分类统计
  const scopeCounts = useMemo(() => {
    const inProgressSet = new Set(['pending', 'processing', 'overdue'])
    return {
      myTodo: allTasks.filter(t => t.currentProcessor === TASK_CENTER_CURRENT_USER && inProgressSet.has(t.status)).length,
      mySubmitted: allTasks.filter(t => t.initiator === TASK_CENTER_CURRENT_USER).length,
      myDone: allTasks.filter(t => t.status === 'completed' && (t.currentProcessor === TASK_CENTER_CURRENT_USER || t.responsiblePerson === TASK_CENTER_CURRENT_USER || t.initiator === TASK_CENTER_CURRENT_USER)).length,
      all: allTasks.length,
    }
  }, [allTasks])

  const onScopeChange = (next: TicketScope) => {
    setScope(next)
    // 切换时同步一套合理的状态默认值
    if (next === 'myTodo') {
      setFilters(prev => ({ ...prev, status: 'inProgress' }))
    } else if (next === 'myDone') {
      setFilters(prev => ({ ...prev, status: 'completed' }))
    } else {
      setFilters(prev => ({ ...prev, status: 'all' }))
    }
  }

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

      <ScopeCards active={scope} counts={scopeCounts} onChange={onScopeChange} />

      <Card size="small" style={{ marginBottom: 16 }}>
        <div className="task-filter-row">
          <Space wrap>
            <Input
              placeholder="搜索任务编号、标题、描述..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 320 }}
              value={filters.searchText}
              onChange={e => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
            />

          <TreeSelect
            style={{ width: 320 }}
            allowClear
            treeCheckable
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            maxTagCount={2}
            placeholder="任务类型（一级/二级多选）"
            treeData={TASK_TYPE_TREE}
            value={selectedTypeKeys}
            onChange={(keys) => setSelectedTypeKeys(keys as string[])}
          />

          {/* 处置状态筛选项已移除，状态由顶部范围卡片（我的待办/我的已办等）决定 */}

          <AutoComplete
            value={initiatorInput}
            onChange={setInitiatorInput}
            onSelect={(val) => { setFilters(prev => ({ ...prev, initiator: val as any })); setInitiatorInput(String(val)) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setFilters(prev => ({ ...prev, initiator: initiatorInput as any }))
            }}
            options={initiatorOptions.map(n => ({ value: n }))}
            style={{ width: 200 }}
            allowClear
            placeholder="输入发起人，回车或选择确认"
          />

          <AutoComplete
            value={unitInput}
            onChange={setUnitInput}
            onSelect={(val) => { setFilters(prev => ({ ...prev, responsibleUnit: val as any })); setUnitInput(String(val)) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setFilters(prev => ({ ...prev, responsibleUnit: unitInput as any }))
            }}
            options={unitOptions.map(u => ({ value: u }))}
            style={{ width: 200 }}
            allowClear
            placeholder="输入发起单位，回车或选择确认"
          />

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
          <Button type="primary" onClick={() => setCreateOpen(true)}>
            新建工单
          </Button>
        </div>

        <Modal
          open={createOpen}
          title="选择任务类型"
          onCancel={() => setCreateOpen(false)}
          onOk={() => { window.open(`/collaboration/tickets/new?type=${createType}`, '_blank'); setCreateOpen(false) }}
          okText="下一步"
          cancelText="取消"
        >
          <Radio.Group value={createType} onChange={e => setCreateType(e.target.value)}>
            <Radio value="security_hardening">安全加固</Radio>
            <Radio value="emergency_response">应急处置</Radio>
          </Radio.Group>
        </Modal>

        <div className="task-filter-summary">
          共 <span className="task-highlight">{filteredTasks.length}</span> 个任务
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
