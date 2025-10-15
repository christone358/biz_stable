import React, { useState } from 'react'
import { Card, Tabs, Badge } from 'antd'
import VulnerabilityPanel from './VulnerabilityPanel'
import AlertPanel from './AlertPanel'
import { VulnerabilitySummary, VulnerabilityDetail, AlertSummary, AlertDetail } from '../types'
import './AnomalyPanel.css'

interface AnomalyPanelProps {
  vulnerabilities: {
    summary: VulnerabilitySummary
    details: VulnerabilityDetail[]
  }
  alerts: {
    summary: AlertSummary
    details: AlertDetail[]
  }
}

const AnomalyPanel: React.FC<AnomalyPanelProps> = ({ vulnerabilities, alerts }) => {
  const [activeTab, setActiveTab] = useState<string>('alerts')

  const tabItems = [
    {
      key: 'alerts',
      label: (
        <span>
          运行异常告警
          <Badge
            count={alerts.summary.total}
            style={{ marginLeft: 8 }}
            showZero
          />
        </span>
      ),
      children: (
        <AlertPanel
          summary={alerts.summary}
          details={alerts.details}
        />
      )
    },
    {
      key: 'vulnerabilities',
      label: (
        <span>
          脆弱性动态
          <Badge
            count={vulnerabilities.summary.total}
            style={{ marginLeft: 8 }}
            showZero
          />
        </span>
      ),
      children: (
        <VulnerabilityPanel
          summary={vulnerabilities.summary}
          details={vulnerabilities.details}
        />
      )
    }
  ]

  return (
    <Card bordered={false} className="anomaly-panel-card">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="anomaly-tabs"
      />
    </Card>
  )
}

export default AnomalyPanel
