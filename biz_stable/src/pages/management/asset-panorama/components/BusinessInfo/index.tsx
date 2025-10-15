import React from 'react'
import { Card, Tag, Row, Col, Descriptions } from 'antd'
import { UserOutlined, CodeOutlined, ToolOutlined } from '@ant-design/icons'
import type { BusinessInfo as BusinessInfoType } from '../../types'
import './index.css'

interface BusinessInfoProps {
  business: BusinessInfoType
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ business }) => {
  return (
    <Card className="business-info-panel" bordered={false}>
      <div className="info-header">
        <div className="info-title">业务基础信息</div>
        <div className="info-badges">
          <Tag color="blue">运行中</Tag>
          <Tag color="green">核心业务</Tag>
        </div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="业务ID">{business.info.id}</Descriptions.Item>
        <Descriptions.Item label="业务状态">{business.info.status}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{business.info.createTime}</Descriptions.Item>
        <Descriptions.Item label="SLA等级">{business.info.sla}</Descriptions.Item>
        <Descriptions.Item label="访问量">{business.info.visits}</Descriptions.Item>
        <Descriptions.Item label="用户数">{business.info.users}</Descriptions.Item>
        <Descriptions.Item label="业务描述" span={2}>{business.info.description}</Descriptions.Item>
      </Descriptions>

      <div className="info-header">
        <div className="info-title">责任主体</div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" title={<><UserOutlined /> 责任主体</>} className="responsible-card">
            <p><span className="card-label">单位/组织:</span> {business.responsible.owner.org}</p>
            <p><span className="card-label">联系人:</span> {business.responsible.owner.contact}</p>
            <p><span className="card-label">联系电话:</span> {business.responsible.owner.phone}</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" title={<><CodeOutlined /> 开发主体</>} className="responsible-card">
            <p><span className="card-label">单位/组织:</span> {business.responsible.developer.org}</p>
            <p><span className="card-label">联系人:</span> {business.responsible.developer.contact}</p>
            <p><span className="card-label">联系电话:</span> {business.responsible.developer.phone}</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card size="small" title={<><ToolOutlined /> 运维主体</>} className="responsible-card">
            <p><span className="card-label">单位/组织:</span> {business.responsible.operator.org}</p>
            <p><span className="card-label">联系人:</span> {business.responsible.operator.contact}</p>
            <p><span className="card-label">联系电话:</span> {business.responsible.operator.phone}</p>
          </Card>
        </Col>
      </Row>
    </Card>
  )
}

export default BusinessInfo
