import React from 'react'
import { Badge, Select, DatePicker, Space, Typography } from 'antd'
import { ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { ApplicationInfo, TimeRange } from '../types'
import './ApplicationHeader.css'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface ApplicationHeaderProps {
  appInfo: ApplicationInfo
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  onApplicationChange: (appId: string) => void
  availableApps: Array<{ id: string; name: string }>
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  appInfo,
  timeRange,
  onTimeRangeChange,
  onApplicationChange,
  availableApps
}) => {
  // 状态图标和颜色映射
  const statusConfig = {
    running: {
      icon: <CheckCircleOutlined />,
      color: '#52C41A',
      text: '运行中',
      status: 'success' as const
    },
    warning: {
      icon: <ExclamationCircleOutlined />,
      color: '#FAAD14',
      text: '告警',
      status: 'warning' as const
    },
    error: {
      icon: <CloseCircleOutlined />,
      color: '#FF4D4F',
      text: '故障',
      status: 'error' as const
    },
    stopped: {
      icon: <SyncOutlined spin />,
      color: '#D9D9D9',
      text: '已停止',
      status: 'default' as const
    }
  }

  const currentStatus = statusConfig[appInfo.status]

  // 时间范围选项
  const timeRangeOptions: TimeRange[] = [
    { label: '最近1小时', value: '1h', hours: 1 },
    { label: '最近6小时', value: '6h', hours: 6 },
    { label: '最近24小时', value: '24h', hours: 24 },
    { label: '最近7天', value: '7d', hours: 168 },
    { label: '最近30天', value: '30d', hours: 720 }
  ]

  return (
    <div className="application-header">
      <div className="header-left">
        <div className="app-title-section">
          <Title level={3} className="app-title">
            {appInfo.displayName}
          </Title>
          <Badge
            status={currentStatus.status}
            text={
              <Space size={4}>
                {currentStatus.icon}
                <span style={{ color: currentStatus.color, fontWeight: 500 }}>
                  {currentStatus.text}
                </span>
              </Space>
            }
          />
        </div>

        <div className="app-meta-info">
          <Space size={24} split={<span className="divider">|</span>}>
            <Space size={8}>
              <Text type="secondary">所属单位:</Text>
              <Text strong>{appInfo.department}</Text>
            </Space>
            <Space size={8}>
              <Text type="secondary">负责人:</Text>
              <Text strong>{appInfo.owner}</Text>
            </Space>
            <Space size={8}>
              <ClockCircleOutlined style={{ color: '#8C8C8C' }} />
              <Text type="secondary">监测时长:</Text>
              <Text strong>{appInfo.monitoringDuration}</Text>
            </Space>
            <Space size={8}>
              <Text type="secondary">最后更新:</Text>
              <Text type="secondary">{dayjs(appInfo.lastUpdateTime).fromNow()}</Text>
            </Space>
          </Space>
        </div>
      </div>

      <div className="header-right">
        <Space size={16}>
          <div className="control-item">
            <Text type="secondary" className="control-label">时间范围</Text>
            <Select
              value={timeRange.value}
              style={{ width: 140 }}
              onChange={(value) => {
                const selected = timeRangeOptions.find(opt => opt.value === value)
                if (selected) {
                  onTimeRangeChange(selected)
                }
              }}
              options={timeRangeOptions.map(opt => ({
                label: opt.label,
                value: opt.value
              }))}
            />
          </div>

          <div className="control-item">
            <Text type="secondary" className="control-label">应用切换</Text>
            <Select
              value={appInfo.id}
              style={{ width: 200 }}
              onChange={onApplicationChange}
              options={availableApps.map(app => ({
                label: app.name,
                value: app.id
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
        </Space>
      </div>
    </div>
  )
}

export default ApplicationHeader
