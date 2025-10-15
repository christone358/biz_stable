import React from 'react'
import { Card, Tag, Row, Col, Descriptions } from 'antd'
import { UserOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons'
import type { BusinessInfo as BusinessInfoType, ResponsibleInfo } from '../../panorama-types'
import './index.css'

interface BusinessInfoProps {
  business: BusinessInfoType
  responsible: ResponsibleInfo
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ business, responsible }) => {
  return (
    <Card className="business-info-panel" bordered={false}>
      <div className="info-header">
        <div className="info-title">业务基础信息</div>
        <div className="info-badges">
          {business.badges.map((badge, index) => (
            <Tag key={index} color={index === 0 ? "blue" : "green"}>{badge}</Tag>
          ))}
        </div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="业务ID">{business.id}</Descriptions.Item>
        <Descriptions.Item label="业务状态">{business.status}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{business.createTime}</Descriptions.Item>
        <Descriptions.Item label="SLA等级">{business.sla}</Descriptions.Item>
        <Descriptions.Item label="访问量">{business.visits}</Descriptions.Item>
        <Descriptions.Item label="用户数">{business.users}</Descriptions.Item>
        <Descriptions.Item label="业务描述" span={2}>{business.description}</Descriptions.Item>
      </Descriptions>

      <div className="info-header">
        <div className="info-title">责任主体</div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" title={<><UserOutlined /> 责任主体</>} className="responsible-card">
            <p><span className="card-label">单位/组织:</span> {responsible.owner.org}</p>
            <p><span className="card-label">联系人:</span> {responsible.owner.contact}</p>
            <p><span className="card-label">联系电话:</span> {responsible.owner.phone}</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" title={<><CodeOutlined /> 开发主体</>} className="responsible-card">
            <p><span className="card-label">单位/组织:</span> {responsible.developer.org}</p>
            <p><span className="card-label">联系人:</span> {responsible.developer.contact}</p>
            <p><span className="card-label">联系电话:</span> {responsible.developer.phone}</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" title={<><ToolOutlined /> 运维主体</>} className="responsible-card">
            <p><span className="card-label">单位/组织:</span> {responsible.operator.org}</p>
            <p><span className="card-label">联系人:</span> {responsible.operator.contact}</p>
            <p><span className="card-label">联系电话:</span> {responsible.operator.phone}</p>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default BusinessInfo
