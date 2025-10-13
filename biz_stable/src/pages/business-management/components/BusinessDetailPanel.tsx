import React from 'react'
import { Tabs, Form, Input, Select, Radio, Checkbox, Button, Space, Empty, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { BusinessDetail, BusinessNode, BusinessImportanceConfig, BusinessTypeOptions, ServiceTargetOptions, OperationTimeOptions, OperationStatusConfig } from '../types'
import './BusinessDetailPanel.css'

interface BusinessDetailPanelProps {
  selectedNode: BusinessNode | null
  businessDetail: BusinessDetail | null
  isEditing: boolean
  onSave: (detail: Partial<BusinessDetail>) => void
  onStartEdit: () => void
  onCancelEdit: () => void
}

const BusinessDetailPanel: React.FC<BusinessDetailPanelProps> = ({
  selectedNode,
  businessDetail,
  isEditing,
  onSave,
  onStartEdit,
  onCancelEdit
}) => {
  const [form] = Form.useForm()

  // 如果没有选中节点
  if (!selectedNode) {
    return (
      <div className="business-detail-panel">
        <div className="business-detail-empty">
          <Empty description="请选择业务查看详细信息" />
        </div>
      </div>
    )
  }

  // 如果选中的是一级板块（无详细信息）
  if (selectedNode.level === 1 || !selectedNode.hasDetail) {
    return (
      <div className="business-detail-panel">
        <div className="business-detail-header">
          <h2>{selectedNode.name}</h2>
        </div>
        <div className="business-detail-content">
          <Empty description="此板块无详细信息，请选择具体业务" />
        </div>
      </div>
    )
  }

  // 如果没有加载详细信息
  if (!businessDetail) {
    return (
      <div className="business-detail-panel">
        <div className="business-detail-empty">
          <Empty description="加载中..." />
        </div>
      </div>
    )
  }

  // 保存处理
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      onSave(values)
      message.success('保存成功')
    } catch (error) {
      message.error('请检查表单填写')
    }
  }

  // Tab items
  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={businessDetail}
          disabled={!isEditing}
        >
          <Form.Item label="业务名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入业务名称" />
          </Form.Item>

          <Form.Item label="业务编码" name="code" rules={[{ required: true }]}>
            <Input placeholder="请输入业务编码" />
          </Form.Item>

          <Form.Item label="业务类型" name="businessType" rules={[{ required: true }]}>
            <Select placeholder="请选择业务类型">
              {BusinessTypeOptions.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="业务重要性" name="importance" rules={[{ required: true }]}>
            <Radio.Group>
              {Object.entries(BusinessImportanceConfig).map(([key, config]) => (
                <Radio key={key} value={key}>{config.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item label="运行状态" name="operationStatus" rules={[{ required: true }]}>
            <Select placeholder="请选择运行状态">
              {Object.entries(OperationStatusConfig).map(([key, config]) => (
                <Select.Option key={key} value={key}>
                  {config.icon} {config.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="业务描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入业务描述" />
          </Form.Item>

          <Form.Item label="服务对象" name="serviceTarget">
            <Checkbox.Group options={ServiceTargetOptions} />
          </Form.Item>

          <Form.Item label="服务范围" name="serviceScope">
            <Input placeholder="如：全市范围" />
          </Form.Item>

          <Form.Item label="运行时间" name="operationTime">
            <Radio.Group options={OperationTimeOptions} />
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'responsible',
      label: '责任单位',
      children: (
        <div style={{ padding: 16 }}>
          <h3>主责单位</h3>
          <p>单位名称: {businessDetail.responsibleUnit.unitName}</p>
          <p>主要负责人: {businessDetail.responsibleUnit.primaryContact.name} - {businessDetail.responsibleUnit.primaryContact.role}</p>
          <p>联系电话: {businessDetail.responsibleUnit.primaryContact.phone}</p>
          <p>邮箱: {businessDetail.responsibleUnit.primaryContact.email}</p>

          <h3 style={{ marginTop: 24 }}>运维单位</h3>
          <p>单位名称: {businessDetail.operationUnit.unitName}</p>
          <p>主要负责人: {businessDetail.operationUnit.primaryContact.name}</p>

          <h3 style={{ marginTop: 24 }}>开发单位</h3>
          <p>单位名称: {businessDetail.developmentUnit.unitName}</p>
          <p>主要负责人: {businessDetail.developmentUnit.primaryContact.name}</p>

          {!isEditing && (
            <p style={{ marginTop: 24, color: '#8c8c8c' }}>
              责任单位详细编辑功能将在后续完善
            </p>
          )}
        </div>
      )
    },
    {
      key: 'relation',
      label: '业务关系',
      children: (
        <div style={{ padding: 16 }}>
          <h3>上游业务</h3>
          <p>{businessDetail.upstreamBusinessIds.length > 0 ? businessDetail.upstreamBusinessIds.join(', ') : '暂无'}</p>

          <h3 style={{ marginTop: 24 }}>下游业务</h3>
          <p>{businessDetail.downstreamBusinessIds.length > 0 ? businessDetail.downstreamBusinessIds.join(', ') : '暂无'}</p>

          {!isEditing && (
            <p style={{ marginTop: 24, color: '#8c8c8c' }}>
              业务关系编辑功能将在后续完善
            </p>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="business-detail-panel">
      <div className="business-detail-header">
        <h2>{selectedNode.name}</h2>
        <Space>
          {!isEditing ? (
            <Button type="primary" onClick={onStartEdit}>编辑</Button>
          ) : (
            <>
              <Button onClick={onCancelEdit}>取消</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
            </>
          )}
        </Space>
      </div>

      <div className="business-detail-content">
        <Tabs items={tabItems} />
      </div>
    </div>
  )
}

export default BusinessDetailPanel
