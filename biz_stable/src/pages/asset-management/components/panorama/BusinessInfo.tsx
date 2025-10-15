import React from 'react'
import { Card, Tag, Descriptions } from 'antd'
import type { BusinessInfo as BusinessInfoType, ResponsibleInfo } from '../../panorama-types'
import './BusinessInfo.css'

interface BusinessInfoProps {
  businessInfo: BusinessInfoType
  responsibleInfo: ResponsibleInfo
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ businessInfo, responsibleInfo }) => {
  return (
    <Card className="business-info-card" bordered={false}>
      <div className="business-info-header">
        <div className="business-info-title">业务基础信息</div>
        <div className="business-info-badges">
          {businessInfo.badges.map((badge, index) => (
            <Tag key={index} color="blue">
              {badge}
            </Tag>
          ))}
        </div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} className="business-info-descriptions">
        <Descriptions.Item label="业务ID">{businessInfo.id}</Descriptions.Item>
        <Descriptions.Item label="业务状态">{businessInfo.status}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{businessInfo.createTime}</Descriptions.Item>
        <Descriptions.Item label="SLA等级">{businessInfo.sla}</Descriptions.Item>
        <Descriptions.Item label="访问量">{businessInfo.visits}</Descriptions.Item>
        <Descriptions.Item label="用户数">{businessInfo.users}</Descriptions.Item>
        <Descriptions.Item label="业务描述" span={2}>
          {businessInfo.description}
        </Descriptions.Item>
      </Descriptions>

      <div className="responsible-section">
        <div className="responsible-section-title">责任主体</div>
        <div className="responsible-cards">
          <Card size="small" className="responsible-card">
            <div className="responsible-card-title">
              <i className="responsible-icon">👔</i>
              <span>责任主体</span>
            </div>
            <div className="responsible-card-content">
              <div className="responsible-item">
                <span className="responsible-label">单位/组织:</span>
                <span className="responsible-value">{responsibleInfo.owner.org}</span>
              </div>
              <div className="responsible-item">
                <span className="responsible-label">联系人:</span>
                <span className="responsible-value">{responsibleInfo.owner.contact}</span>
              </div>
              <div className="responsible-item">
                <span className="responsible-label">联系电话:</span>
                <span className="responsible-value">{responsibleInfo.owner.phone}</span>
              </div>
            </div>
          </Card>

          <Card size="small" className="responsible-card">
            <div className="responsible-card-title">
              <i className="responsible-icon">💻</i>
              <span>开发主体</span>
            </div>
            <div className="responsible-card-content">
              <div className="responsible-item">
                <span className="responsible-label">单位/组织:</span>
                <span className="responsible-value">{responsibleInfo.developer.org}</span>
              </div>
              <div className="responsible-item">
                <span className="responsible-label">联系人:</span>
                <span className="responsible-value">{responsibleInfo.developer.contact}</span>
              </div>
              <div className="responsible-item">
                <span className="responsible-label">联系电话:</span>
                <span className="responsible-value">{responsibleInfo.developer.phone}</span>
              </div>
            </div>
          </Card>

          <Card size="small" className="responsible-card">
            <div className="responsible-card-title">
              <i className="responsible-icon">🔧</i>
              <span>运维主体</span>
            </div>
            <div className="responsible-card-content">
              <div className="responsible-item">
                <span className="responsible-label">单位/组织:</span>
                <span className="responsible-value">{responsibleInfo.operator.org}</span>
              </div>
              <div className="responsible-item">
                <span className="responsible-label">联系人:</span>
                <span className="responsible-value">{responsibleInfo.operator.contact}</span>
              </div>
              <div className="responsible-item">
                <span className="responsible-label">联系电话:</span>
                <span className="responsible-value">{responsibleInfo.operator.phone}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  )
}

export default BusinessInfo
