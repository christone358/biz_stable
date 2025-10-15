import React from 'react'
import { Card, Typography, Empty } from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import './index.css'

const { Title, Paragraph } = Typography

/**
 * 运行告警页面
 *
 * 功能：
 * - 展示实时告警信息
 * - 提供告警确认和处理功能
 * - 告警统计和趋势分析
 */
const RuntimeAlerts: React.FC = () => {
  return (
    <div className="runtime-alerts-page">
      <Card>
        <Empty
          image={<AlertOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />}
          description={
            <div style={{ marginTop: 16 }}>
              <Title level={4}>运行告警</Title>
              <Paragraph type="secondary">
                该功能正在开发中...
              </Paragraph>
              <Paragraph type="secondary">
                此页面将提供实时告警展示、告警处理和统计分析功能
              </Paragraph>
            </div>
          }
        />
      </Card>
    </div>
  )
}

export default RuntimeAlerts
