import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Card, Row, Col, Statistic } from 'antd'
import { AlertOutlined, ExclamationCircleOutlined, SafetyOutlined, DatabaseOutlined } from '@ant-design/icons'
import { RootState } from '../../../store'
import dayjs from 'dayjs'
import './index.css'

const KPICards: React.FC = () => {
  const { systems, filteredAssets, selectedDepartmentId, selectedOrganization } = useSelector((state: RootState) => state.dashboard)

  // 根据当前选择计算动态指标
  const metrics = useMemo(() => {
    const currentSystems = selectedDepartmentId
      ? systems.filter(sys => sys.departmentId === selectedDepartmentId)
      : systems

    const currentAssets = filteredAssets.length > 0 ? filteredAssets :
      (selectedOrganization?.type === 'root' ?
        systems.flatMap(sys => sys.assets || []) :
        currentSystems.flatMap(sys => sys.assets || []))

    // 计算系统统计
    const totalSystems = currentSystems.length
    const abnormalSystems = currentSystems.filter(sys =>
      sys.healthStatus === 'WARNING' || sys.healthStatus === 'CRITICAL'
    )
    const warningCount = currentSystems.filter(sys => sys.healthStatus === 'WARNING').length
    const criticalCount = currentSystems.filter(sys => sys.healthStatus === 'CRITICAL').length

    // 计算资产统计
    const totalAssets = currentAssets.length
    const abnormalAssets = currentAssets.filter(asset =>
      asset.healthStatus === 'WARNING' || asset.healthStatus === 'CRITICAL'
    )

    // 计算告警统计
    const totalAlerts = currentSystems.reduce((sum, sys) => sum + sys.alertCount, 0)
    const urgentAlerts = Math.floor(totalAlerts * 0.3) // 假设30%是紧急告警
    const p0Count = Math.floor(urgentAlerts * 0.2)
    const p1Count = urgentAlerts - p0Count

    // 计算漏洞统计
    const totalVulns = currentSystems.reduce((sum, sys) => sum + sys.vulnerabilityCount, 0)
    const criticalVulns = Math.floor(totalVulns * 0.4) // 假设40%是高危漏洞
    const affectedSystems = currentSystems.filter(sys => sys.vulnerabilityCount > 0).length

    return {
      totalSystems,
      totalAssets,
      abnormalSystems: {
        count: abnormalSystems.length,
        warningCount,
        criticalCount,
        rate: totalSystems > 0 ? abnormalSystems.length / totalSystems : 0,
      },
      abnormalAssets: {
        count: abnormalAssets.length,
        rate: totalAssets > 0 ? abnormalAssets.length / totalAssets : 0,
      },
      urgentAlerts: {
        total: urgentAlerts,
        p0Count,
        p1Count,
        latestTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      },
      criticalVulnerabilities: {
        count: criticalVulns,
        affectedSystems,
        longestUnfixed: Math.floor(Math.random() * 30) + 1,
      }
    }
  }, [systems, filteredAssets, selectedDepartmentId, selectedOrganization])

  if (!metrics) {
    return (
      <div className="kpi-cards-container">
        <Row gutter={24}>
          {[1, 2, 3, 4].map(i => (
            <Col span={6} key={i}>
              <Card loading />
            </Col>
          ))}
        </Row>
      </div>
    )
  }

  const abnormalRate = metrics.abnormalSystems.rate * 100
  const assetAbnormalRate = metrics.abnormalAssets.rate * 100

  const getSelectionLabel = () => {
    if (selectedOrganization?.type === 'root') return '全部'
    if (selectedOrganization?.type === 'department') return selectedOrganization.name
    if (selectedOrganization?.type === 'system') return selectedOrganization.name
    return '当前选择'
  }

  return (
    <div className="kpi-cards-container">
      <Row gutter={24}>
        {/* 业务系统总数 */}
        <Col span={6}>
          <Card className="kpi-card total-systems">
            <div className="card-icon">
              <SafetyOutlined />
            </div>
            <Statistic
              title={`${getSelectionLabel()}业务系统`}
              value={metrics.totalSystems}
              suffix="个系统"
              valueStyle={{ color: '#1677FF', fontSize: '28px', fontWeight: 'bold' }}
            />
            <div className="card-footer">
              <span className="trend-text">
                资产总数: {metrics.totalAssets}个
              </span>
            </div>
          </Card>
        </Col>

        {/* 异常系统 */}
        <Col span={6}>
          <Card className={`kpi-card abnormal-systems ${abnormalRate >= 15 ? 'critical' : abnormalRate >= 5 ? 'warning' : 'normal'}`}>
            <div className="card-icon">
              <ExclamationCircleOutlined />
            </div>
            <Statistic
              title="异常系统"
              value={metrics.abnormalSystems.count}
              suffix="异常系统"
              valueStyle={{
                color: abnormalRate >= 15 ? '#FF4D4F' : abnormalRate >= 5 ? '#FAAD14' : '#52C41A',
                fontSize: '28px',
                fontWeight: 'bold'
              }}
            />
            <div className="card-footer">
              <div className="abnormal-details">
                <span>警告 {metrics.abnormalSystems.warningCount}个</span>
                <span>故障 {metrics.abnormalSystems.criticalCount}个</span>
              </div>
              <div className="abnormal-rate">
                异常率 {abnormalRate.toFixed(1)}%
              </div>
            </div>
          </Card>
        </Col>

        {/* 未处理紧急告警 */}
        <Col span={6}>
          <Card className="kpi-card urgent-alerts">
            <div className="card-icon urgent">
              <AlertOutlined />
            </div>
            <Statistic
              title="未处理紧急告警"
              value={metrics.urgentAlerts.total}
              suffix="紧急告警"
              valueStyle={{
                color: '#FF4D4F',
                fontSize: '28px',
                fontWeight: 'bold',
                animation: metrics.urgentAlerts.total > 0 ? 'blink 2s infinite' : 'none'
              }}
            />
            <div className="card-footer">
              <div className="alert-details">
                <span>P0级 {metrics.urgentAlerts.p0Count}个</span>
                <span>P1级 {metrics.urgentAlerts.p1Count}个</span>
              </div>
              {metrics.urgentAlerts.latestTime && (
                <div className="latest-time">
                  最新 {dayjs(metrics.urgentAlerts.latestTime).fromNow()}
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 资产健康状态 */}
        <Col span={6}>
          <Card className={`kpi-card asset-health ${assetAbnormalRate >= 20 ? 'critical' : assetAbnormalRate >= 10 ? 'warning' : 'normal'}`}>
            <div className="card-icon">
              <DatabaseOutlined />
            </div>
            <Statistic
              title="异常资产"
              value={metrics.abnormalAssets.count}
              suffix="异常资产"
              valueStyle={{
                color: assetAbnormalRate >= 20 ? '#FF4D4F' : assetAbnormalRate >= 10 ? '#FAAD14' : '#52C41A',
                fontSize: '28px',
                fontWeight: 'bold'
              }}
            />
            <div className="card-footer">
              <div className="asset-details">
                <span>总资产: {metrics.totalAssets}个</span>
              </div>
              <div className="asset-rate">
                异常率 {assetAbnormalRate.toFixed(1)}%
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default KPICards