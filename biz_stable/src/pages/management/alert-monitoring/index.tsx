import React, { useState, useEffect, useMemo } from 'react'
import { Breadcrumb, DatePicker, Switch, Select, Space, message } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import ResourceTree from './components/ResourceTree'
import QuickFilter from './components/QuickFilter'
import AlertTable from './components/AlertTable'
import type { ResourceCategory, AlertRecord, AlertLevel, AlertStatus, PaginationConfig } from './types'
import { generateMockAlertRecords, generateResourceCategories } from '../../../mock/alert-monitoring-data'
import './index.css'

const { RangePicker } = DatePicker

const AlertMonitoring: React.FC = () => {
  // 状态管理
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([])
  const [alertRecords, setAlertRecords] = useState<AlertRecord[]>([])
  const [selectedLevel, setSelectedLevel] = useState<AlertLevel | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'all'>('all')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs('2023-07-15'),
    dayjs('2023-07-16')
  ])
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // 初始化数据
  useEffect(() => {
    setResourceCategories(generateResourceCategories())
    loadAlertRecords()
  }, [])

  // 加载告警记录
  const loadAlertRecords = () => {
    setLoading(true)
    // 模拟异步加载
    setTimeout(() => {
      const records = generateMockAlertRecords()
      setAlertRecords(records)
      setPagination((prev) => ({ ...prev, total: records.length }))
      setLoading(false)
    }, 500)
  }

  // 自动刷新逻辑
  useEffect(() => {
    if (!autoRefresh) return

    const timer = setInterval(() => {
      loadAlertRecords()
    }, refreshInterval * 1000)

    return () => clearInterval(timer)
  }, [autoRefresh, refreshInterval])

  // 资源选择变化处理
  const handleResourceChange = (categoryId: string, itemId: string, checked: boolean) => {
    setResourceCategories((prev) =>
      prev.map((category) => {
        if (category.id !== categoryId) return category

        // 如果选择"全部"，取消其他选项
        if (itemId === 'all' && checked) {
          return {
            ...category,
            items: category.items.map((item) => ({
              ...item,
              checked: item.id === 'all'
            }))
          }
        }

        // 如果选择其他选项，取消"全部"
        return {
          ...category,
          items: category.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, checked }
            }
            if (item.id === 'all') {
              return { ...item, checked: false }
            }
            return item
          })
        }
      })
    )
  }

  // 筛选后的告警记录
  const filteredAlerts = useMemo(() => {
    return alertRecords.filter((record) => {
      // 等级筛选
      if (selectedLevel !== 'all' && record.level !== selectedLevel) {
        return false
      }
      // 状态筛选
      if (selectedStatus !== 'all' && record.status !== selectedStatus) {
        return false
      }
      return true
    })
  }, [alertRecords, selectedLevel, selectedStatus])

  // 分页数据
  const paginatedAlerts = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredAlerts.slice(start, end)
  }, [filteredAlerts, pagination.current, pagination.pageSize])

  // 分页变化处理
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
      total: filteredAlerts.length
    }))
  }

  // 指派操作
  const handleAssign = (record: AlertRecord) => {
    message.success(`正在指派告警: ${record.name}`)
  }

  // 关闭操作
  const handleClose = (record: AlertRecord) => {
    message.success(`正在关闭告警: ${record.name}`)
  }

  // 批量指派
  const handleBatchAssign = (selectedIds: string[]) => {
    message.success(`批量指派 ${selectedIds.length} 条告警`)
  }

  // 批量关闭
  const handleBatchClose = (selectedIds: string[]) => {
    message.success(`批量关闭 ${selectedIds.length} 条告警`)
  }

  return (
    <div className="alert-monitoring-page">
      {/* 顶部栏 */}
      <div className="page-header">
        <Breadcrumb
          items={[
            { title: '首页' },
            { title: '业务保障管理' },
            { title: '资产告警监测' }
          ]}
        />
        <Space size="large">
          <Space>
            <span className="filter-label">时间范围:</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              format="YYYY-MM-DD"
              suffixIcon={<CalendarOutlined />}
            />
          </Space>
          <Space>
            <span className="filter-label">自动刷新:</span>
            <Switch checked={autoRefresh} onChange={setAutoRefresh} />
            <Select
              value={refreshInterval}
              onChange={setRefreshInterval}
              style={{ width: 100 }}
              disabled={!autoRefresh}
              options={[
                { value: 10, label: '10秒' },
                { value: 30, label: '30秒' },
                { value: 60, label: '60秒' }
              ]}
            />
          </Space>
        </Space>
      </div>

      {/* 内容区 */}
      <div className="page-content">
        <div className="content-layout">
          {/* 左侧资源目录 */}
          <ResourceTree
            categories={resourceCategories}
            onResourceChange={handleResourceChange}
          />

          {/* 右侧内容区 */}
          <div className="content-right">
            {/* 快速筛选 */}
            <QuickFilter
              selectedLevel={selectedLevel}
              selectedStatus={selectedStatus}
              onLevelChange={setSelectedLevel}
              onStatusChange={setSelectedStatus}
            />

            {/* 告警列表 */}
            <AlertTable
              data={paginatedAlerts}
              loading={loading}
              pagination={{
                ...pagination,
                total: filteredAlerts.length
              }}
              onPageChange={handlePageChange}
              onAssign={handleAssign}
              onClose={handleClose}
              onBatchAssign={handleBatchAssign}
              onBatchClose={handleBatchClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertMonitoring
