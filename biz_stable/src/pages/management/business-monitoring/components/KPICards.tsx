import React from 'react'
import { Row, Col } from 'antd'
import MetricCard from './MetricCard'
import { ApplicationKPIs } from '../types'
import './KPICards.css'

interface KPICardsProps {
  kpis: ApplicationKPIs
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  return (
    <div className="kpi-cards-wrapper">
      <div className="kpi-cards-scroll-container">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <MetricCard metric={kpis.healthScore} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <MetricCard metric={kpis.accessVolume} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <MetricCard metric={kpis.logVolume} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <MetricCard metric={kpis.errorRate} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <MetricCard metric={kpis.responseTime} />
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <MetricCard metric={kpis.sla} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default KPICards
