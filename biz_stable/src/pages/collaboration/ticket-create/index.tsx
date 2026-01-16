import React, { useState } from 'react'
import { Card, Form, Input, Select, Button, Upload, message, Space, Typography, DatePicker, Table, Tag } from 'antd'
import { useLocation } from 'react-router-dom'
import type { UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import './index.css'

const { Title, Text } = Typography

type CreateTaskType = 'security_hardening' | 'emergency_response'
const TASK_TYPE_OPTIONS: { label: string; value: CreateTaskType }[] = [
  { label: '安全加固', value: 'security_hardening' },
  { label: '应急处置', value: 'emergency_response' },
]

const TicketCreatePage: React.FC = () => {
  const [form] = Form.useForm()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialType = ((): CreateTaskType => {
    const t = searchParams.get('type')
    return (t === 'security_hardening' || t === 'emergency_response') ? t : 'security_hardening'
  })()
  const [taskType, setTaskType] = useState<CreateTaskType>(initialType)
  const [attachments, setAttachments] = useState<{ id: string; name: string }[]>([])

  const uploadProps: UploadProps = {
    multiple: true,
    beforeUpload: () => false,
    showUploadList: false,
    customRequest: () => undefined,
    onChange: ({ file }) => {
      setAttachments(prev => [...prev, { id: String(file.uid), name: file.name }])
      message.success(`${file.name} 已添加`)
    },
  }

  const renderTypeSpecific = () => {
    if (taskType === 'security_hardening') {
      return (
        <>
          <div className="form-group-title">漏洞信息列表</div>
          <Form.List name={['hardening', 'vulnerabilities']}>
            {(fields, { add, remove }) => {
              const dataSource = fields.map((f, idx) => ({ key: f.key, idx }))
              const columns = [
                {
                  title: '漏洞ID',
                  dataIndex: 'vulnId',
                  render: (_: any, __: any, index: number) => (
                    <Form.Item name={[fields[index].name, 'vulnId']} rules={[{ required: true, message: '请输入漏洞ID' }]} style={{ margin: 0 }}>
                      <Input placeholder="如：CVE-XXXX-YYYY" />
                    </Form.Item>
                  ),
                },
                {
                  title: '漏洞类型',
                  dataIndex: 'vulnType',
                  render: (_: any, __: any, index: number) => (
                    <Form.Item name={[fields[index].name, 'vulnType']} rules={[{ required: true, message: '请输入漏洞类型' }]} style={{ margin: 0 }}>
                      <Input placeholder="SQL注入/弱口令/配置风险..." />
                    </Form.Item>
                  ),
                },
                {
                  title: '漏洞等级',
                  dataIndex: 'riskLevel',
                  render: (_: any, __: any, index: number) => (
                    <Form.Item name={[fields[index].name, 'riskLevel']} rules={[{ required: true, message: '请选择漏洞等级' }]} style={{ margin: 0 }}>
                      <Select options={[{ value: '高', label: '高' }, { value: '中', label: '中' }, { value: '低', label: '低' }]} placeholder="选择等级" />
                    </Form.Item>
                  ),
                },
                {
                  title: '发现时间',
                  dataIndex: 'foundAt',
                  render: (_: any, __: any, index: number) => (
                    <Form.Item name={[fields[index].name, 'foundAt']} rules={[{ required: true, message: '请选择发现时间' }]} style={{ margin: 0 }}>
                      <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                  ),
                },
                {
                  title: '漏洞描述',
                  dataIndex: 'desc',
                  width: 260,
                  render: (_: any, __: any, index: number) => (
                    <Form.Item name={[fields[index].name, 'desc']} rules={[{ required: true, message: '请输入漏洞描述' }]} style={{ margin: 0 }}>
                      <Input.TextArea rows={1} placeholder="简要描述漏洞细节" />
                    </Form.Item>
                  ),
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_: any, __: any, index: number) => (
                    <Button type="link" danger onClick={() => remove(fields[index].name)}>删除</Button>
                  ),
                },
              ]
              return (
                <>
                  <Table size="small" bordered pagination={false} dataSource={dataSource} columns={columns as any} />
                  <div style={{ marginTop: 8 }}>
                    <Button type="dashed" onClick={() => add()} block>
                      + 新增漏洞
                    </Button>
                  </div>
                </>
              )
            }}
          </Form.List>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <Form.Item label="安全工程师姓名" name={['hardening', 'engineerName']} rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item label="安全工程师电话" name={['hardening', 'engineerPhone']} rules={[{ required: true, message: '请输入联系电话' }]}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item label="安全加固提出时间" name={['hardening', 'proposedAt']} rules={[{ required: true, message: '请选择时间' }]}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="安全加固完成要求时间" name={['hardening', 'dueAt']} rules={[{ required: true, message: '请选择时间' }]}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </>
      )
    }
    // emergency_response
    return (
      <>
        <div className="form-group-title">应急事件通报列表</div>
        <Form.List name={['emergency', 'incidents']}>
          {(fields, { add, remove }) => {
            const dataSource = fields.map((f, idx) => ({ key: f.key, idx }))
            const columns = [
              {
                title: '事件发生时间',
                dataIndex: 'occurredAt',
                render: (_: any, __: any, index: number) => (
                  <Form.Item name={[fields[index].name, 'occurredAt']} rules={[{ required: true, message: '请选择时间' }]} style={{ margin: 0 }}>
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                ),
              },
              {
                title: '事件类型描述',
                dataIndex: 'typeDesc',
                render: (_: any, __: any, index: number) => (
                  <Form.Item name={[fields[index].name, 'typeDesc']} rules={[{ required: true, message: '请输入类型描述' }]} style={{ margin: 0 }}>
                    <Input placeholder="如：服务中断/异常登录..." />
                  </Form.Item>
                ),
              },
              {
                title: '事件影响描述',
                dataIndex: 'impactDesc',
                width: 260,
                render: (_: any, __: any, index: number) => (
                  <Form.Item name={[fields[index].name, 'impactDesc']} rules={[{ required: true, message: '请输入影响描述' }]} style={{ margin: 0 }}>
                    <Input.TextArea rows={1} placeholder="对业务影响范围与程度" />
                  </Form.Item>
                ),
              },
              {
                title: '操作',
                key: 'action',
                render: (_: any, __: any, index: number) => (
                  <Button type="link" danger onClick={() => remove(fields[index].name)}>删除</Button>
                ),
              },
            ]
            return (
              <>
                <Table size="small" bordered pagination={false} dataSource={dataSource} columns={columns as any} />
                <div style={{ marginTop: 8 }}>
                  <Button type="dashed" onClick={() => add()} block>
                    + 新增事件
                  </Button>
                </div>
              </>
            )
          }}
        </Form.List>

        <div className="form-grid" style={{ marginTop: 12 }}>
          <Form.Item label="安全工程师姓名" name={['emergency', 'engineerName']} rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="安全工程师电话" name={['emergency', 'engineerPhone']} rules={[{ required: true, message: '请输入联系电话' }]}>
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item label="应急处置提出时间" name={['emergency', 'proposedAt']} rules={[{ required: true, message: '请选择时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="应急处置完成要求时间" name={['emergency', 'dueAt']} rules={[{ required: true, message: '请选择时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </>
    )
  }

  const submitCreate = async () => {
    await form.validateFields()
    message.success('工单已提交创建')
  }

  return (
    <div className="ticket-create-page">
      <Card className="summary-bar" bordered={false}>
        <div className="summary-left">
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>新建工单</Title>
            {/* removed hint text under title per request */}
          </div>
          <div className="kind-switcher">
            <Text type="secondary" style={{ marginRight: 8 }}>任务类型</Text>
            <Tag color={taskType === 'security_hardening' ? 'blue' : 'volcano'}>
              {taskType === 'security_hardening' ? '安全加固' : '应急处置'}
            </Tag>
          </div>
        </div>
      </Card>

      <div className="ticket-body">
        <section className="ticket-panel ticket-panel-main">
          <Card size="small" className="info-card">
            <div className="info-section">
              <div className="info-section-header">事项概要</div>
              <Form
                layout="horizontal"
                labelAlign="right"
                labelCol={{ flex: '120px' }}
                wrapperCol={{ flex: 'auto' }}
                form={form}
                className="create-form"
                size="middle"
              >
                <div className="form-grid">
                  <Form.Item label="所属系统-一级系统" name={['summary', 'systemL1']} rules={[{ required: true, message: '请选择一级系统' }]}>
                    <Select placeholder="请选择" options={[{ value: '政务服务平台', label: '政务服务平台' }, { value: '人口管理平台', label: '人口管理平台' }]} />
                  </Form.Item>
                  <Form.Item label="所属系统-二级系统" name={['summary', 'systemL2']}>
                    <Select placeholder="可选" options={[{ value: '网络安全服务', label: '网络安全服务' }, { value: '基础支撑', label: '基础支撑' }]} allowClear />
                  </Form.Item>
                </div>

                <div className="info-section" style={{ padding: 0 }}>
                  <div className="info-section-header">任务明细</div>
                  {renderTypeSpecific()}
                </div>

                <div className="info-section" style={{ padding: 0 }}>
                  <div className="info-section-header">附件</div>
                  <Upload {...uploadProps}>
                    <Button icon={<InboxOutlined />}>上传附件</Button>
                  </Upload>
                  {attachments.length > 0 && (
                    <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
                      {attachments.map(a => (
                        <Text key={a.id} type="secondary">{a.name}</Text>
                      ))}
                    </Space>
                  )}
                </div>

                <div className="mode-actions" style={{ marginTop: 12 }}>
                  <Button type="primary" onClick={submitCreate}>提交</Button>
                </div>
              </Form>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default TicketCreatePage
