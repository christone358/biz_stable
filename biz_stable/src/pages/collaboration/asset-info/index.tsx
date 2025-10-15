import React from 'react'
import { Card, Typography, Empty } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'
import './index.css'

const { Title, Paragraph } = Typography

/**
 * 资产信息管理页面
 *
 * 功能：
 * - 资产基础信息维护
 * - 资产配置信息管理
 * - 资产关系管理
 */
const AssetInfo: React.FC = () => {
  return (
    <div className="asset-info-page">
      <Card>
        <Empty
          image={<DatabaseOutlined style={{ fontSize: 64, color: '#1890ff' }} />}
          description={
            <div style={{ marginTop: 16 }}>
              <Title level={4}>资产信息管理</Title>
              <Paragraph type="secondary">
                该功能正在开发中...
              </Paragraph>
              <Paragraph type="secondary">
                此页面将提供资产信息维护、配置管理和关系管理功能
              </Paragraph>
            </div>
          }
        />
      </Card>
    </div>
  )
}

export default AssetInfo
