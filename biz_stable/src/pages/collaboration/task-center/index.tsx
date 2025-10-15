import React, { useState } from 'react'
import { Card, Row, Col, Statistic, Space, message } from 'antd'
import { BugOutlined, DatabaseOutlined, AlertOutlined } from '@ant-design/icons'
import type { TaskStatisticsData, TodayStatistics } from './types'
import { generateTaskStatistics, generateTodayStatistics, generateVulnerabilities, generateAssets, generateAlerts } from './mock/task-data'
import VulnerabilityCard from './components/VulnerabilityCard'
import AssetClaimCard from './components/AssetClaimCard'
import AlertHandleCard from './components/AlertHandleCard'
import './index.css'

type TaskType = 'alert' | 'asset' | 'vulnerability'

/**
 * 任务中心页面
 *
 * 功能：
 * - 展示三类任务统计和列表
 * - 脆弱性处置
 * - 资产认领
 * - 告警处置
 */
const TaskCenter: React.FC = () => {
  // 当前选中的任务类型（默认为告警）
  const [selectedTask, setSelectedTask] = useState<TaskType>('alert')

  // 统计数据
  const [taskStats] = useState<TaskStatisticsData>(generateTaskStatistics())
  const [todayStats] = useState<TodayStatistics>(generateTodayStatistics())

  // 任务数据
  const [vulnerabilities] = useState(generateVulnerabilities())
  const [assets] = useState(generateAssets())
  const [alerts] = useState(generateAlerts())

  // 处理脆弱性任务
  const handleVulnerability = (id: string) => {
    message.info(`处理脆弱性任务: ${id}`)
    // TODO: 打开处理模态框
  }

  // 查看脆弱性详情
  const viewVulnerability = (id: string) => {
    message.info(`查看脆弱性详情: ${id}`)
    // TODO: 打开详情模态框
  }

  // 认领资产
  const handleAssetClaim = (id: string) => {
    message.success(`认领资产: ${id}`)
    // TODO: 打开认领确认模态框
  }

  // 拒绝资产
  const handleAssetReject = (id: string) => {
    message.warning(`拒绝资产: ${id}`)
    // TODO: 打开拒绝原因模态框
  }

  // 查看资产详情
  const viewAsset = (id: string) => {
    message.info(`查看资产详情: ${id}`)
    // TODO: 打开资产详情模态框
  }

  // 处理告警
  const handleAlert = (id: string) => {
    message.info(`处理告警: ${id}`)
    // TODO: 打开告警处理模态框
  }

  // 忽略告警
  const handleAlertIgnore = (id: string) => {
    message.warning(`忽略告警: ${id}`)
    // TODO: 打开忽略原因模态框
  }

  // 查看告警详情
  const viewAlert = (id: string) => {
    message.info(`查看告警详情: ${id}`)
    // TODO: 打开告警详情模态框
  }

  return (
    <div className="task-center-page">
      {/* 页面标题栏 */}
      <div className="task-center-header">
        <div className="header-left">
          <div className="department-icon">
            <BugOutlined />
          </div>
          <div>
            <h1 className="page-title">
              运维开发部
              <span className="page-subtitle">任务中心</span>
            </h1>
            <p className="page-description">负责系统漏洞修复、资产维护及异常告警处理</p>
          </div>
        </div>

        <div className="header-right">
          <Space size="large">
            <div className="today-stat">
              <span className="stat-label">今日新增：</span>
              <span className="stat-value stat-primary">{todayStats.newTasks}</span>
            </div>
            <div className="today-stat">
              <span className="stat-label">今日完成：</span>
              <span className="stat-value stat-success">{todayStats.completedTasks}</span>
            </div>
          </Space>
        </div>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} className="task-statistics">
        {/* 告警处置 */}
        <Col xs={24} sm={8}>
          <Card
            className={`stat-card ${selectedTask === 'alert' ? 'stat-card-selected' : ''}`}
            onClick={() => setSelectedTask('alert')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-card-content">
              <Statistic
                title="告警处置"
                value={taskStats.alertHandle}
                valueStyle={{ color: '#1890ff' }}
              />
              <AlertOutlined className="stat-card-icon" style={{ color: '#1890ff' }} />
            </div>
          </Card>
        </Col>
        {/* 异常资产 */}
        <Col xs={24} sm={8}>
          <Card
            className={`stat-card ${selectedTask === 'asset' ? 'stat-card-selected' : ''}`}
            onClick={() => setSelectedTask('asset')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-card-content">
              <Statistic
                title="异常资产"
                value={taskStats.assetClaim}
                valueStyle={{ color: '#faad14' }}
              />
              <DatabaseOutlined className="stat-card-icon" style={{ color: '#faad14' }} />
            </div>
          </Card>
        </Col>
        {/* 脆弱性处置 */}
        <Col xs={24} sm={8}>
          <Card
            className={`stat-card ${selectedTask === 'vulnerability' ? 'stat-card-selected' : ''}`}
            onClick={() => setSelectedTask('vulnerability')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-card-content">
              <Statistic
                title="脆弱性处置"
                value={taskStats.vulnerability}
                valueStyle={{ color: '#ff4d4f' }}
              />
              <BugOutlined className="stat-card-icon" style={{ color: '#ff4d4f' }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 任务卡片 */}
      <div className="task-cards">
        {/* 根据选中的任务类型显示对应的卡片 */}
        {selectedTask === 'alert' && (
          <AlertHandleCard
            data={alerts}
            onHandle={handleAlert}
            onIgnore={handleAlertIgnore}
            onView={viewAlert}
          />
        )}

        {selectedTask === 'asset' && (
          <AssetClaimCard
            data={assets}
            onClaim={handleAssetClaim}
            onReject={handleAssetReject}
            onView={viewAsset}
          />
        )}

        {selectedTask === 'vulnerability' && (
          <VulnerabilityCard
            data={vulnerabilities}
            onHandle={handleVulnerability}
            onView={viewVulnerability}
          />
        )}
      </div>
    </div>
  )
}

export default TaskCenter
