import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Card, List, Tag, Empty, Button, Badge, Divider, Tabs, Space } from 'antd'
import { AlertOutlined, BugOutlined, SecurityScanOutlined, ReloadOutlined, WifiOutlined } from '@ant-design/icons'
import { RootState } from '../../../store'
import { generateMockAlerts, generateMockVulnerabilities } from '../../../mock/data'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import './index.css'

dayjs.extend(relativeTime)

interface AlertPanelItem {
  id: string
  type: 'RUNTIME' | 'VULNERABILITY' | 'SECURITY'
  timestamp: string
  level: string
  systemName: string
  title: string
  description: string
  department: string
  assetName?: string
}

const AlertPanel: React.FC = () => {
  const { selectedOrganization, selectedDepartmentId, systems, filteredAssets } = useSelector((state: RootState) => state.dashboard)
  const [items, setItems] = useState<AlertPanelItem[]>([])
  const [loading, setLoading] = useState(false)
  const [connected, _setConnected] = useState(true)
  const [activeTab, setActiveTab] = useState('runtime')

  const loadData = () => {
    setLoading(true)

    setTimeout(() => {
      const alerts = generateMockAlerts().slice(0, 50)
      const vulnerabilities = generateMockVulnerabilities().slice(0, 30)

      // 运行告警
      const runtimeAlerts: AlertPanelItem[] = alerts.map(alert => ({
        id: alert.id,
        type: 'RUNTIME',
        timestamp: alert.timestamp,
        level: alert.level,
        systemName: alert.systemName,
        title: alert.title,
        description: alert.description,
        department: alert.department,
      }))

      // 脆弱性告警
      const vulnerabilityAlerts: AlertPanelItem[] = vulnerabilities.map(vuln => ({
        id: vuln.id,
        type: 'VULNERABILITY',
        timestamp: vuln.discoveryDate,
        level: vuln.severity,
        systemName: vuln.systemName,
        title: vuln.title,
        description: vuln.description,
        department: vuln.department,
      }))

      // 安全事件（模拟生成）
      const securityEvents: AlertPanelItem[] = Array.from({ length: 20 }, (_, i) => {
        const system = systems[Math.floor(Math.random() * systems.length)] || alerts[0]
        return {
          id: `SEC_${Date.now()}_${i}`,
          type: 'SECURITY',
          timestamp: new Date(Date.now() - Math.random() * 24 * 3600000).toISOString(),
          level: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
          systemName: system.systemName || system.name,
          title: ['异常登录尝试', '权限提升检测', '恶意文件上传', 'SQL注入攻击', '暴力破解检测'][Math.floor(Math.random() * 5)],
          description: '检测到潜在的安全威胁，建议立即处理',
          department: system.department,
        }
      })

      // 合并所有告警
      let allItems = [...runtimeAlerts, ...vulnerabilityAlerts, ...securityEvents]

      // 根据左侧选择进行筛选
      if (selectedOrganization && selectedOrganization.type !== 'root') {
        if (selectedOrganization.type === 'department') {
          allItems = allItems.filter(item => item.department === selectedOrganization.name)
        } else if (selectedOrganization.type === 'system') {
          allItems = allItems.filter(item => item.systemName === selectedOrganization.name)
        } else if (selectedOrganization.type === 'asset' && filteredAssets.length > 0) {
          const asset = filteredAssets[0]
          const parentSystem = systems.find(sys => sys.id === asset.systemId)
          if (parentSystem) {
            allItems = allItems.filter(item => item.systemName === parentSystem.name)
            // 为资产级别的告警添加资产名称
            allItems = allItems.map(item => ({ ...item, assetName: asset.name }))
          }
        }
      } else if (selectedDepartmentId) {
        const selectedDept = systems.find(s => s.departmentId === selectedDepartmentId)?.department
        if (selectedDept) {
          allItems = allItems.filter(item => item.department === selectedDept)
        }
      }

      // 按时间排序
      allItems = allItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setItems(allItems)
      setLoading(false)
    }, 800)
  }

  useEffect(() => {
    loadData()
  }, [selectedOrganization, selectedDepartmentId, filteredAssets])

  // 按类型分组告警
  const groupedItems = useMemo(() => {
    return {
      runtime: items.filter(item => item.type === 'RUNTIME'),
      vulnerability: items.filter(item => item.type === 'VULNERABILITY'),
      security: items.filter(item => item.type === 'SECURITY')
    }
  }, [items])

  const renderAlertItem = (item: AlertPanelItem) => {
    const getLevelColor = (level: string) => {
      switch (level.toUpperCase()) {
        case 'P0':
        case 'CRITICAL':
        case 'HIGH':
          return '#FF4D4F'
        case 'P1':
        case 'MEDIUM':
          return '#FAAD14'
        case 'P2':
        case 'LOW':
          return '#52C41A'
        default:
          return '#8C8C8C'
      }
    }

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'RUNTIME':
          return <AlertOutlined style={{ color: '#FF4D4F' }} />
        case 'VULNERABILITY':
          return <BugOutlined style={{ color: '#FAAD14' }} />
        case 'SECURITY':
          return <SecurityScanOutlined style={{ color: '#722ED1' }} />
        default:
          return <AlertOutlined />
      }
    }

    return (
      <List.Item key={item.id} className="alert-item">
        <div className="alert-content">
          <div className="alert-header">
            <Space>
              {getTypeIcon(item.type)}
              <span className="alert-title">{item.title}</span>
              <Tag color={getLevelColor(item.level)} size="small">
                {item.level}
              </Tag>
            </Space>
            <span className="alert-time">
              {dayjs(item.timestamp).fromNow()}
            </span>
          </div>
          <div className="alert-details">
            <div className="alert-system">
              {item.assetName && <span className="asset-name">{item.assetName} - </span>}
              <span className="system-name">{item.systemName}</span>
              <span className="department-name">({item.department})</span>
            </div>
            <div className="alert-description">{item.description}</div>
          </div>
        </div>
      </List.Item>
    )
  }

  const tabItems = [
    {
      key: 'runtime',
      label: (
        <Space>
          <AlertOutlined />
          运行告警
          <Badge count={groupedItems.runtime.length} size="small" />
        </Space>
      ),
      children: (
        <List
          size="small"
          dataSource={groupedItems.runtime}
          renderItem={renderAlertItem}
          locale={{ emptyText: '暂无运行告警' }}
        />
      )
    },
    {
      key: 'vulnerability',
      label: (
        <Space>
          <BugOutlined />
          脆弱性
          <Badge count={groupedItems.vulnerability.length} size="small" />
        </Space>
      ),
      children: (
        <List
          size="small"
          dataSource={groupedItems.vulnerability}
          renderItem={renderAlertItem}
          locale={{ emptyText: '暂无脆弱性告警' }}
        />
      )
    },
    {
      key: 'security',
      label: (
        <Space>
          <SecurityScanOutlined />
          安全事件
          <Badge count={groupedItems.security.length} size="small" />
        </Space>
      ),
      children: (
        <List
          size="small"
          dataSource={groupedItems.security}
          renderItem={renderAlertItem}
          locale={{ emptyText: '暂无安全事件' }}
        />
      )
    }
  ]

  return (
    <div className="alert-panel-container">
      <div className="panel-header">
        <div className="header-left">
          <h3>告警监控</h3>
          <div className="connection-status">
            <WifiOutlined style={{ color: connected ? '#52C41A' : '#FF4D4F' }} />
            <span>{connected ? '已连接' : '连接断开'}</span>
          </div>
        </div>
        <div className="header-actions">
          <Button
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
            size="small"
          >
            刷新
          </Button>
        </div>
      </div>

      <div className="alerts-content">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="small"
        />
      </div>
    </div>
  )
}

export default AlertPanel