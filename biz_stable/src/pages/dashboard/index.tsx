import React, { useEffect } from 'react'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SettingOutlined } from '@ant-design/icons'
import { setOrganizations, setSystems, setMetrics, setSelectedOrganization } from '../../store/slices/dashboardSlice'
import { mockOrganizations, generateMockSystems, mockMetrics } from '../../mock/data'

import OrganizationTree from '../../components/dashboard/OrganizationTree'
import KPICards from '../../components/dashboard/KPICards'
import HealthMatrix from '../../components/dashboard/HealthMatrix'
import SystemsList from '../../components/dashboard/SystemsList'
import AlertPanel from '../../components/dashboard/AlertPanel'

import './index.css'


const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // 初始化数据
    dispatch(setOrganizations(mockOrganizations))
    dispatch(setSelectedOrganization(mockOrganizations[0])) // 选择根节点
    dispatch(setSystems(generateMockSystems()))
    dispatch(setMetrics(mockMetrics))
  }, [dispatch])

  return (
    <div className="dashboard-layout">
      {/* 顶部标题栏 */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>XX市大数据中心业务健康总览页</h1>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => navigate('/mock-config')}
              style={{ marginRight: '16px' }}
            >
              Mock配置
            </Button>
            <span>实时监控</span>
            <div className="status-indicator active"></div>
          </div>
        </div>
      </div>

      {/* 主体区域 */}
      <div className="dashboard-body">
        {/* 左侧组织架构 */}
        <div className="dashboard-sider">
          <OrganizationTree />
        </div>

        {/* 中间主内容区 */}
        <div className="main-content">
          {/* 顶部KPI卡片 - 横向撑满 */}
          <div className="content-section-full">
            <KPICards />
          </div>

          {/* 下半部分 - 矩阵图和告警面板并排 */}
          <div className="bottom-section">
            <div className="matrix-section">
              <div className="content-section">
                <HealthMatrix />
              </div>
              <div className="content-section">
                <SystemsList />
              </div>
            </div>

            {/* 右侧告警面板 */}
            <div className="alert-panel">
              <AlertPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard