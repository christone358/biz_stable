import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, List, Tag, Empty, Button, Badge, Divider } from 'antd'
import { AlertOutlined, BugOutlined, ReloadOutlined, WifiOutlined } from '@ant-design/icons'
import { RootState } from '../../../store'
import { generateMockAlerts, generateMockVulnerabilities } from '../../../mock/data'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import './index.css'

dayjs.extend(relativeTime)

interface AlertPanelItem {
  id: string
  type: 'ALERT' | 'VULNERABILITY'
  timestamp: string
  level: string
  systemName: string
  title: string
  description: string
  department: string
}

const AlertPanel: React.FC = () => {
  const { selectedOrganization, selectedDepartmentId, systems, filteredAssets } = useSelector((state: RootState) => state.dashboard)
  const [items, setItems] = useState<AlertPanelItem[]>([])
  const [loading, setLoading] = useState(false)
  const [connected, _setConnected] = useState(true)
  const [autoScroll, _setAutoScroll] = useState(true)

  const loadData = () => {
    setLoading(true)

    setTimeout(() => {
      const alerts = generateMockAlerts().slice(0, 30) // 最近30条告警
      const vulnerabilities = generateMockVulnerabilities().slice(0, 20) // 最近20个漏洞

      const alertItems: AlertPanelItem[] = alerts.map(alert => ({
        id: alert.id,
        type: 'ALERT',
        timestamp: alert.timestamp,
        level: alert.level,
        systemName: alert.systemName,
        title: alert.title,
        description: alert.description,
        department: alert.department,
      }))

      const vulnItems: AlertPanelItem[] = vulnerabilities.map(vuln => ({
        id: vuln.id,
        type: 'VULNERABILITY',
        timestamp: vuln.discoveryDate,
        level: vuln.severity,
        systemName: vuln.systemName,
        title: vuln.title,
        description: vuln.description,
        department: vuln.department,
      }))

      // 合并并按时间排序
      let allItems = [...alertItems, ...vulnItems]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // 根据左侧选择进行筛选
      if (selectedOrganization && selectedOrganization.type !== 'root') {
        if (selectedOrganization.type === 'department') {
          // 选择了部门，筛选该部门的告警
          allItems = allItems.filter(item => item.department === selectedOrganization.name)
        } else if (selectedOrganization.type === 'system') {
          // 选择了系统，筛选该系统的告警
          allItems = allItems.filter(item => item.systemName === selectedOrganization.name)
        } else if (selectedOrganization.type === 'asset' && filteredAssets.length > 0) {
          // 选择了资产，筛选该资产所属系统的告警
          const asset = filteredAssets[0]
          const parentSystem = systems.find(sys => sys.id === asset.systemId)
          if (parentSystem) {
            allItems = allItems.filter(item => item.systemName === parentSystem.name)
          }
        }
      } else if (selectedDepartmentId) {
        // 通过departmentId筛选
        const selectedDept = systems.find(s => s.departmentId === selectedDepartmentId)?.department
        if (selectedDept) {
          allItems = allItems.filter(item => item.department === selectedDept)
        }
      }

      allItems = allItems.slice(0, 50) // 限制显示50条
      setItems(allItems)
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    loadData()
  }, [selectedOrganization, selectedDepartmentId, filteredAssets]) // 当选择变化时重新加载数据

  useEffect(() => {
    // 模拟实时数据更新
    const interval = setInterval(() => {
      if (connected && autoScroll) {
        // 模拟新数据到达
        const shouldAddNew = Math.random() < 0.3 // 30%概率添加新数据

        if (shouldAddNew) {
          const isAlert = Math.random() < 0.7 // 70%概率是告警，30%是漏洞

          let newItem: AlertPanelItem

          if (isAlert) {
            const alertTypes = ['系统异常', '数据库连接失败', '网络延迟过高', '性能异常']
            const levels = ['P0', 'P1', 'P2']
            const systems = ['执法系统', '管理平台', '服务平台', '监控系统']
            const departments = ['市公安局', '市民政局', '市教委', '市卫生健康委']

            newItem = {
              id: `ALT_${Date.now()}_NEW`,
              type: 'ALERT',
              timestamp: new Date().toISOString(),
              level: levels[Math.floor(Math.random() * levels.length)],
              systemName: systems[Math.floor(Math.random() * systems.length)],
              title: alertTypes[Math.floor(Math.random() * alertTypes.length)],
              description: '系统出现异常，需要立即处理',
              department: departments[Math.floor(Math.random() * departments.length)],
            }
          } else {
            const vulnTypes = ['SQL注入漏洞', 'XSS跨站脚本', '权限提升漏洞']
            const severities = ['CRITICAL', 'HIGH', 'MEDIUM']

            newItem = {
              id: `VUL_${Date.now()}_NEW`,
              type: 'VULNERABILITY',
              timestamp: new Date().toISOString(),
              level: severities[Math.floor(Math.random() * severities.length)],
              systemName: '管理平台',
              title: vulnTypes[Math.floor(Math.random() * vulnTypes.length)],
              description: '发现安全漏洞，建议及时修复',
              department: '市公安局',
            }
          }

          setItems(prevItems => [newItem, ...prevItems.slice(0, 49)])
        }
      }
    }, 10000) // 每10秒检查一次

    return () => clearInterval(interval)
  }, [connected, autoScroll])

  const getLevelTag = (type: string, level: string) => {
    if (type === 'ALERT') {
      const alertConfig = {
        P0: { color: 'red', text: '告警-P0', blink: true },
        P1: { color: 'orange', text: '告警-P1', blink: false },
        P2: { color: 'yellow', text: '告警-P2', blink: false },
        P3: { color: 'blue', text: '告警-P3', blink: false },
      }
      const config = alertConfig[level as keyof typeof alertConfig] || { color: 'default', text: level, blink: false }
      return (
        <Tag
          color={config.color}
          className={config.blink ? 'blink-tag' : ''}
        >
          {config.text}
        </Tag>
      )
    } else {
      const vulnConfig = {
        CRITICAL: { color: 'red', text: '漏洞-高危' },
        HIGH: { color: 'orange', text: '漏洞-高危' },
        MEDIUM: { color: 'yellow', text: '漏洞-中危' },
        LOW: { color: 'blue', text: '漏洞-低危' },
      }
      const config = vulnConfig[level as keyof typeof vulnConfig] || { color: 'default', text: level }
      return <Tag color={config.color}>{config.text}</Tag>
    }
  }

  const getPriorityOrder = (item: AlertPanelItem) => {
    if (item.type === 'ALERT') {
      const alertPriority = { P0: 100, P1: 90, P2: 80, P3: 70 }
      return alertPriority[item.level as keyof typeof alertPriority] || 60
    } else {
      const vulnPriority = { CRITICAL: 85, HIGH: 85, MEDIUM: 75, LOW: 65 }
      return vulnPriority[item.level as keyof typeof vulnPriority] || 50
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    const priorityDiff = getPriorityOrder(b) - getPriorityOrder(a)
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const handleItemClick = (item: AlertPanelItem) => {
    console.log('查看详情:', item.type, item.id)
    // 这里可以添加弹窗显示详细信息的逻辑
  }

  return (
    <div className="alert-panel-container">
      <Card
        title={
          <div className="panel-header">
            <span>实时告警与漏洞摘要</span>
            <div className="connection-status">
              <WifiOutlined
                style={{
                  color: connected ? '#52c41a' : '#ff4d4f',
                  marginRight: 4
                }}
              />
              {connected ? '已连接' : '连接中断'}
            </div>
          </div>
        }
        size="small"
        extra={
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={loadData}
            loading={loading}
            size="small"
          >
            刷新
          </Button>
        }
        className="alert-panel-card"
      >
        <div className="panel-stats">
          <div className="stat-item">
            <Badge count={items.filter(i => i.type === 'ALERT').length} color="#ff4d4f">
              <AlertOutlined style={{ fontSize: 16, color: '#ff4d4f' }} />
            </Badge>
            <span>告警</span>
          </div>
          <div className="stat-item">
            <Badge count={items.filter(i => i.type === 'VULNERABILITY').length} color="#fa8c16">
              <BugOutlined style={{ fontSize: 16, color: '#fa8c16' }} />
            </Badge>
            <span>漏洞</span>
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="alerts-list-container">
          {sortedItems.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无告警信息"
              style={{ margin: '40px 0' }}
            />
          ) : (
            <List
              dataSource={sortedItems}
              loading={loading}
              size="small"
              renderItem={(item) => (
                <List.Item
                  className="alert-item"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="alert-content">
                    <div className="alert-header">
                      <span className="alert-time">
                        {dayjs(item.timestamp).format('HH:mm')}
                      </span>
                      {getLevelTag(item.type, item.level)}
                    </div>
                    <div className="alert-body">
                      <div className="alert-title">
                        <span className="system-name">{item.systemName}</span>
                        <span className="separator">：</span>
                        <span className="alert-description">{item.title}</span>
                      </div>
                      <div className="alert-department">
                        {item.department}
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        <div className="panel-footer">
          <span className="data-info">
            显示最近24小时内的记录 · 自动滚动{autoScroll ? '开启' : '关闭'}
          </span>
        </div>
      </Card>
    </div>
  )
}

export default AlertPanel