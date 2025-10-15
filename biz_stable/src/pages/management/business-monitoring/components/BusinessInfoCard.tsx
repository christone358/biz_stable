import React from 'react'
import { Card, Space, Tag, Divider, Tooltip, Typography, Row, Col } from 'antd'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  UserOutlined,
  CodeOutlined,
  ToolOutlined
} from '@ant-design/icons'
import { ApplicationInfo } from '../types'
import './BusinessInfoCard.css'

const { Title, Text } = Typography

interface BusinessInfoCardProps {
  businessInfo: ApplicationInfo
}

// 责任主体详情Tooltip内容
const ResponsibilityTooltip: React.FC<{ data: ApplicationInfo['responsibilities']['owner'] }> = ({ data }) => (
  <div className="responsibility-tooltip">
    <div><Text style={{ color: '#fff' }}>单位/组织：{data.organization}</Text></div>
    <div><Text style={{ color: '#fff' }}>责任人：{data.contact}</Text></div>
    <div><Text style={{ color: '#fff' }}>联系电话：{data.phone}</Text></div>
    {data.email && <div><Text style={{ color: '#fff' }}>邮箱：{data.email}</Text></div>}
  </div>
)

const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({ businessInfo }) => {
  // 状态图标和颜色
  const getStatusConfig = () => {
    switch (businessInfo.status) {
      case 'running':
        return {
          icon: <CheckCircleOutlined />,
          color: 'success',
          text: '运行中'
        }
      case 'warning':
        return {
          icon: <WarningOutlined />,
          color: 'warning',
          text: '告警'
        }
      case 'error':
        return {
          icon: <CloseCircleOutlined />,
          color: 'error',
          text: '异常'
        }
      case 'stopped':
        return {
          icon: <CloseCircleOutlined />,
          color: 'default',
          text: '已停止'
        }
      default:
        return {
          icon: <CheckCircleOutlined />,
          color: 'default',
          text: '未知'
        }
    }
  }

  const statusConfig = getStatusConfig()

  // 业务类型标签
  const getTypeTag = () => {
    return businessInfo.type === 'core'
      ? <Tag color="blue">核心业务</Tag>
      : <Tag color="default">一般业务</Tag>
  }

  return (
    <Card className="business-info-card" bordered={false}>
      {/* 第一行：业务名称和状态 */}
      <div className="business-header">
        <Title level={3} style={{ margin: 0 }}>{businessInfo.name}</Title>
        <Space>
          <Tag icon={statusConfig.icon} color={statusConfig.color}>
            {statusConfig.text}
          </Tag>
          {getTypeTag()}
        </Space>
      </div>

      {/* 第二行：资产统计和责任主体（分两栏） */}
      <Row gutter={48} className="info-content">
        {/* 左侧：资产统计 */}
        <Col flex="auto">
          <Space split={<Divider type="vertical" />} size="middle" align="center">
            <div className="section-title">
              <AppstoreOutlined style={{ marginRight: 6, color: '#1890ff' }} />
              <Text strong>资产统计</Text>
            </div>
            <span className="stat-item-inline">
              <CloudServerOutlined style={{ marginRight: 4, color: '#52c41a' }} />
              主机 <Text strong style={{ color: '#1890ff' }}>{businessInfo.assetStatistics.hosts}</Text> 台
            </span>
            <span className="stat-item-inline">
              <DatabaseOutlined style={{ marginRight: 4, color: '#faad14' }} />
              中间件 <Text strong style={{ color: '#1890ff' }}>{businessInfo.assetStatistics.middleware}</Text> 个
            </span>
            <span className="stat-item-inline">
              <AppstoreOutlined style={{ marginRight: 4, color: '#13c2c2' }} />
              应用服务 <Text strong style={{ color: '#1890ff' }}>{businessInfo.assetStatistics.services}</Text> 个
            </span>
          </Space>
        </Col>

        {/* 右侧：责任主体 */}
        <Col flex="auto">
          <Space split={<Divider type="vertical" />} size="middle" align="center">
            <div className="section-title">
              <UserOutlined style={{ marginRight: 6, color: '#1890ff' }} />
              <Text strong>责任主体</Text>
            </div>
            <Tooltip
              title={<ResponsibilityTooltip data={businessInfo.responsibilities.owner} />}
              placement="bottom"
              overlayClassName="responsibility-tooltip-overlay"
            >
              <span className="responsibility-item">
                <UserOutlined style={{ marginRight: 4, color: '#722ed1' }} />
                {businessInfo.responsibilities.owner.organization}（{businessInfo.responsibilities.owner.contact}）
              </span>
            </Tooltip>

            <Tooltip
              title={<ResponsibilityTooltip data={businessInfo.responsibilities.developer} />}
              placement="bottom"
              overlayClassName="responsibility-tooltip-overlay"
            >
              <span className="responsibility-item">
                <CodeOutlined style={{ marginRight: 4, color: '#13c2c2' }} />
                {businessInfo.responsibilities.developer.organization}（{businessInfo.responsibilities.developer.contact}）
              </span>
            </Tooltip>

            <Tooltip
              title={<ResponsibilityTooltip data={businessInfo.responsibilities.operator} />}
              placement="bottom"
              overlayClassName="responsibility-tooltip-overlay"
            >
              <span className="responsibility-item">
                <ToolOutlined style={{ marginRight: 4, color: '#fa8c16' }} />
                {businessInfo.responsibilities.operator.organization}（{businessInfo.responsibilities.operator.contact}）
              </span>
            </Tooltip>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default BusinessInfoCard
