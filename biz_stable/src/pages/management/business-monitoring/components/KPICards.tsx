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
    <div className="kpi-cards-container">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <MetricCard metric={kpis.healthScore} />
        </Col>
        <Col span={8}>
          <MetricCard metric={kpis.accessVolume} />
        </Col>
        <Col span={8}>
          <MetricCard metric={kpis.logVolume} />
        </Col>
        <Col span={8}>
          <MetricCard metric={kpis.errorRate} />
        </Col>
        <Col span={8}>
          <MetricCard metric={kpis.responseTime} />
        </Col>
        <Col span={8}>
          <MetricCard metric={kpis.sla} />
        </Col>
      </Row>
    </div>
  )
}

export default KPICards
