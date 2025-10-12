import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  setOrganizations,
  setSystems,
  setMetrics,
  setSelectedOrganization,
  expandOrganizationNode
} from '../../store/slices/dashboardSlice'
import {
  mockBusinessDomains,
  generateBusinessDomainSystems,
  generateSystemsForBusinessDomain,
  getAssetsForBusinessDomain,
  mockMetrics
} from '../../mock/data'

import OrganizationTree from '../../components/dashboard/OrganizationTree'
import KPICards from '../../components/dashboard/KPICards'
import HealthMatrix from '../../components/dashboard/HealthMatrix'
import SystemDetail from '../../components/dashboard/SystemDetail'
import AlertPanel from '../../components/dashboard/AlertPanel'

import './index.css'


const BusinessPanorama: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // 初始化业务领域数据
    dispatch(setOrganizations(mockBusinessDomains))

    // 自动展开所有一级板块，加载二级业务分类
    mockBusinessDomains.forEach(domain => {
      const children = generateSystemsForBusinessDomain(domain.id)
      dispatch(expandOrganizationNode({ nodeId: domain.id, children }))
    })

    // 选择第一个板块
    if (mockBusinessDomains.length > 0) {
      dispatch(setSelectedOrganization(mockBusinessDomains[0]))
    }
    dispatch(setSystems(generateBusinessDomainSystems()))
    dispatch(setMetrics(mockMetrics))
  }, [dispatch])

  return (
    <div className="dashboard-layout">
      {/* 主体区域 */}
      <div className="dashboard-body">
        {/* 左侧业务板块 */}
        <div className="dashboard-sider">
          <OrganizationTree
            showHeader={false}
            generateSystemsFunction={generateBusinessDomainSystems}
            generateSystemsForNodeFunction={generateSystemsForBusinessDomain}
            getAssetsForNodeFunction={getAssetsForBusinessDomain}
            labelConfig={{ rootChildren: '板块' }}
          />
        </div>

        {/* 中间主内容区 */}
        <div className="main-content">
          {/* 顶部KPI卡片 - 横向撑满 */}
          <div className="content-section-full">
            <KPICards />
          </div>

          {/* 中间部分 - 矩阵图和详情面板并排 */}
          <div className="middle-section">
            <div className="matrix-section">
              <HealthMatrix />
            </div>

            {/* 右侧系统详情面板 */}
            <div className="detail-panel">
              <SystemDetail />
            </div>
          </div>

          {/* 底部告警面板 - 横向撑满 */}
          <div className="content-section-full">
            <AlertPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessPanorama