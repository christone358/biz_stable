import React from 'react'
import { Card, Typography, Empty } from 'antd'
import { MonitorOutlined } from '@ant-design/icons'
import './index.css'

const { Title, Paragraph } = Typography

/**
 * 资产监测页面
 *
 * 功能：
 * - 实时监控资产运行状态
 * - 展示资产性能指标
 * - 提供资产健康度评估
 */
const AssetMonitoring: React.FC = () => {
  return (
    <div className="asset-monitoring-page">
      <Card>
        <Empty
          image={<MonitorOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
          description={
            <div style={{ marginTop: 16 }}>
              <Title level={4}>资产监测</Title>
              <Paragraph type="secondary">
                该功能正在开发中...
              </Paragraph>
              <Paragraph type="secondary">
                此页面将提供资产实时监控、性能指标展示和健康度评估功能
              </Paragraph>
            </div>
          }
        />
      </Card>
    </div>
  )
}

export default AssetMonitoring
