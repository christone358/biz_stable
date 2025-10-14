import React from 'react'
import { Tabs, Form, Input, Select, Radio, Checkbox, Button, Space, Empty, message, Descriptions, Tag, Divider, Card } from 'antd'
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
      <div className="b2b-business-detail-panel">
        <div className="b2b-business-detail-empty">
          <Empty description="请选择业务查看详细信息" />
        </div>
      </div>
    )
  }

  // 如果选中的是一级板块（无详细信息）
  if (selectedNode.level === 1 || !selectedNode.hasDetail) {
    return (
      <div className="b2b-business-detail-panel">
        <div className="b2b-business-detail-header">
          <h2>{selectedNode.name}</h2>
        </div>
        <div className="b2b-business-detail-content">
          <Empty description="此板块无详细信息，请选择具体业务" />
        </div>
      </div>
    )
  }

  // 如果没有加载详细信息
  if (!businessDetail) {
    return (
      <div className="b2b-business-detail-panel">
        <div className="b2b-business-detail-empty">
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
      children: isEditing ? (
        // 编辑模式：使用表单
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={businessDetail}
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

          <Form.Item label="业务描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入业务描述" />
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

          <Form.Item label="服务对象" name="serviceTarget">
            <Checkbox.Group options={ServiceTargetOptions} />
          </Form.Item>

          <Form.Item label="服务范围" name="serviceScope">
            <Input placeholder="如：全市范围" />
          </Form.Item>

          <Form.Item label="运行时间" name="operationTime">
            <Radio.Group options={OperationTimeOptions} />
          </Form.Item>

          <Form.Item label="年访问量" name="annualVisits">
            <Input type="number" placeholder="请输入年访问量" />
          </Form.Item>

          <Form.Item label="覆盖率(%)" name="coverageRate">
            <Input type="number" placeholder="请输入覆盖率" />
          </Form.Item>
        </Form>
      ) : (
        // 展示模式：使用Descriptions
        <div>
          <div className="b2b-section-title">
            <span className="b2b-section-title-bar"></span>
            <span className="b2b-section-title-text">基本描述</span>
          </div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="业务名称" span={2}>
              {businessDetail.name}
            </Descriptions.Item>
            <Descriptions.Item label="业务编码">
              {businessDetail.code}
            </Descriptions.Item>
            <Descriptions.Item label="业务类型">
              <Tag color="blue">{businessDetail.businessType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="业务描述" span={2}>
              {businessDetail.description}
            </Descriptions.Item>
          </Descriptions>

          <div className="b2b-section-title">
            <span className="b2b-section-title-bar"></span>
            <span className="b2b-section-title-text">运行状态</span>
          </div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="业务重要性">
              <Tag color={BusinessImportanceConfig[businessDetail.importance].color}>
                {BusinessImportanceConfig[businessDetail.importance].label}
              </Tag>
              <span style={{ marginLeft: 8, color: '#8c8c8c' }}>
                {BusinessImportanceConfig[businessDetail.importance].description}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="运行状态">
              <span style={{ marginRight: 8 }}>
                {OperationStatusConfig[businessDetail.operationStatus].icon}
              </span>
              <Tag color={OperationStatusConfig[businessDetail.operationStatus].color}>
                {OperationStatusConfig[businessDetail.operationStatus].label}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <div className="b2b-section-title">
            <span className="b2b-section-title-bar"></span>
            <span className="b2b-section-title-text">服务信息</span>
          </div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="服务对象">
              {businessDetail.serviceTarget.map(target => (
                <Tag key={target} color="green" style={{ marginBottom: 4 }}>
                  {target}
                </Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="服务范围">
              {businessDetail.serviceScope}
            </Descriptions.Item>
            <Descriptions.Item label="运行时间" span={2}>
              {businessDetail.operationTime}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )
    },
    {
      key: 'responsible',
      label: '责任单位',
      children: (
        <div className="b2b-responsible-units-container">
          {/* 主责单位 */}
          <div className="b2b-section-title">
            <span className="b2b-section-title-bar"></span>
            <span className="b2b-section-title-text">主责单位</span>
          </div>
          <Card size="small" style={{ marginBottom: 24 }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="单位名称" span={2}>
                {businessDetail.responsibleUnit.unitName}
              </Descriptions.Item>
              <Descriptions.Item label="单位编码">
                {businessDetail.responsibleUnit.unitCode}
              </Descriptions.Item>
              <Descriptions.Item label="所属部门">
                {businessDetail.responsibleUnit.department}
              </Descriptions.Item>
            </Descriptions>

            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.85)',
              margin: '16px 0 12px 0'
            }}>
              主要负责人
            </div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="姓名">
                <Tag color="blue">{businessDetail.responsibleUnit.primaryContact.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="职务">
                {businessDetail.responsibleUnit.primaryContact.role}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {businessDetail.responsibleUnit.primaryContact.phone}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {businessDetail.responsibleUnit.primaryContact.email}
              </Descriptions.Item>
            </Descriptions>

            {businessDetail.responsibleUnit.backupContacts.length > 0 && (
              <>
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(0, 0, 0, 0.85)',
                  margin: '16px 0 12px 0'
                }}>
                  备用联系人
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {businessDetail.responsibleUnit.backupContacts.map(contact => (
                    <div key={contact.id} style={{
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>
                        <Tag>{contact.name}</Tag>
                        <span style={{ marginLeft: 8, color: '#595959' }}>{contact.role}</span>
                      </span>
                      <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                        {contact.phone} | {contact.email}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* 运维单位 */}
          <div className="b2b-section-title">
            <span className="b2b-section-title-bar"></span>
            <span className="b2b-section-title-text">运维单位</span>
          </div>
          <Card size="small" style={{ marginBottom: 24 }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="单位名称" span={2}>
                {businessDetail.operationUnit.unitName}
              </Descriptions.Item>
              <Descriptions.Item label="单位编码">
                {businessDetail.operationUnit.unitCode}
              </Descriptions.Item>
              <Descriptions.Item label="所属部门">
                {businessDetail.operationUnit.department}
              </Descriptions.Item>
            </Descriptions>

            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.85)',
              margin: '16px 0 12px 0'
            }}>
              主要负责人
            </div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="姓名">
                <Tag color="green">{businessDetail.operationUnit.primaryContact.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="职务">
                {businessDetail.operationUnit.primaryContact.role}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {businessDetail.operationUnit.primaryContact.phone}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {businessDetail.operationUnit.primaryContact.email}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 开发单位 */}
          <div className="b2b-section-title">
            <span className="b2b-section-title-bar"></span>
            <span className="b2b-section-title-text">开发单位</span>
          </div>
          <Card size="small">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="单位名称" span={2}>
                {businessDetail.developmentUnit.unitName}
              </Descriptions.Item>
              <Descriptions.Item label="单位编码">
                {businessDetail.developmentUnit.unitCode}
              </Descriptions.Item>
              <Descriptions.Item label="所属部门">
                {businessDetail.developmentUnit.department}
              </Descriptions.Item>
            </Descriptions>

            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.85)',
              margin: '16px 0 12px 0'
            }}>
              主要负责人
            </div>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="姓名">
                <Tag color="orange">{businessDetail.developmentUnit.primaryContact.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="职务">
                {businessDetail.developmentUnit.primaryContact.role}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {businessDetail.developmentUnit.primaryContact.phone}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱">
                {businessDetail.developmentUnit.primaryContact.email}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )
    },
    {
      key: 'relation',
      label: '业务关系',
      children: (
        <div className="b2b-business-relation-container">
          <Card
            title="上游业务"
            size="small"
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f0f5ff', fontWeight: 600 }}
          >
            {businessDetail.upstreamBusinessIds.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {businessDetail.upstreamBusinessIds.map(id => (
                  <Tag key={id} color="blue" style={{ fontSize: 13, padding: '4px 12px' }}>
                    {id}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty
                description="暂无上游业务"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '20px 0' }}
              />
            )}
          </Card>

          <Card
            title="下游业务"
            size="small"
            headStyle={{ backgroundColor: '#f6ffed', fontWeight: 600 }}
          >
            {businessDetail.downstreamBusinessIds.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {businessDetail.downstreamBusinessIds.map(id => (
                  <Tag key={id} color="green" style={{ fontSize: 13, padding: '4px 12px' }}>
                    {id}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty
                description="暂无下游业务"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ padding: '20px 0' }}
              />
            )}
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="b2b-business-detail-panel">
      <div className="b2b-business-detail-header">
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

      <div className="b2b-business-detail-content">
        <Tabs items={tabItems} />
      </div>
    </div>
  )
}

export default BusinessDetailPanel
