import { useMemo, useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Card, Descriptions, Tag, Space, Typography, Tabs, Timeline, List, Form, Input, Select, Button, message, Upload, Radio } from 'antd'
import type { UploadProps, RadioChangeEvent } from 'antd'
import {
  FileTextOutlined,
  CloudServerOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { TicketDetailData, TicketNavigationState, TicketKind, HandleModuleSchema, TicketAttachment } from './types'
import { buildTicketTemplate } from './ticketDetailMock'
import './ticket-detail.css'

const { Text, Title } = Typography

const STATUS_COLOR: Record<string, string> = {
  draft: 'default',
  processing: 'processing',
  returned: 'warning',
  on_hold: 'purple',
  resolved: 'success',
  closed: 'success',
  canceled: 'error',
}

const PRIORITY_COLOR: Record<string, string> = {
  P0: 'error',
  P1: 'warning',
  P2: 'processing',
  P3: 'default',
}

type Mode = 'handle' | 'return' | 'handover'

const modeOptions = [
  { label: '办理', value: 'handle' },
  { label: '退回', value: 'return' },
  { label: '移交', value: 'handover' },
]

const kindSelectOptions: { label: string; value: TicketKind }[] = [
  { label: '互联网准入', value: 'internet' },
  { label: '政务外网准入', value: 'govnet' },
  { label: '专项检查', value: 'inspection' },
  { label: '测评支持', value: 'assessment' },
  { label: '系统上线', value: 'system-online' },
  { label: '资源回收', value: 'resource-recycle' },
  { label: '安全加固', value: 'security-hardening' },
  { label: '应急处置', value: 'emergency' },
]

const TicketDetailPage = () => {
  const { id: routeId } = useParams()
  const location = useLocation()
  const { ticketKind, ticketOverrides } = (location.state as TicketNavigationState) ?? {}

  const allowedKinds = kindSelectOptions.map(option => option.value)
  const initialKind = allowedKinds.includes(ticketKind as TicketKind)
    ? (ticketKind as TicketKind)
    : kindSelectOptions[0].value
  const [currentKind, setCurrentKind] = useState<TicketKind>(initialKind)

  const activeOverrides = useMemo(() => {
    if (ticketKind && currentKind === ticketKind) {
      return ticketOverrides
    }
    return undefined
  }, [currentKind, ticketKind, ticketOverrides])

  const ticketData: TicketDetailData = useMemo(
    () => buildTicketTemplate(currentKind, { id: routeId, ...activeOverrides }),
    [routeId, currentKind, activeOverrides],
  )

  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details')
  const [mode, setMode] = useState<Mode>('handle')
  const [attachments, setAttachments] = useState<TicketAttachment[]>(ticketData.attachments)

  const [handleForm] = Form.useForm()
  const [returnForm] = Form.useForm()
  const [handoverForm] = Form.useForm()

  const uploadProps: UploadProps = {
    multiple: true,
    beforeUpload: () => false,
    showUploadList: false,
    customRequest: () => undefined,
    onChange: ({ file }) => {
      const createdAt = dayjs().format('YYYY-MM-DD HH:mm')
      setAttachments(prev => [
        ...prev,
        {
          id: `${file.uid}`,
          name: file.name,
          size: file.size ? `${(file.size / 1024).toFixed(0)}KB` : '—',
          uploader: '当前用户',
          time: createdAt,
        },
      ])
      message.success(`${file.name} 已添加`)
    },
  }

  const handleSaveDraft = () => {
    message.success('草稿已保存')
  }

  const handleSubmitResult = async () => {
    await handleForm.validateFields()
    message.success('办理结果已提交')
  }

  const submitReturn = async () => {
    await returnForm.validateFields()
    message.success('已退回到指定节点')
    returnForm.resetFields()
  }

  const submitHandover = async () => {
    await handoverForm.validateFields()
    message.success('已移交给新的责任人')
    handoverForm.resetFields()
  }

  useEffect(() => {
    setAttachments(ticketData.attachments)
    handleForm.resetFields()
    returnForm.resetFields()
    handoverForm.resetFields()
  }, [ticketData, handleForm, returnForm, handoverForm])

  const renderHandleField = (field: HandleModuleSchema['fields'][number]) => {
    switch (field.type) {
      case 'textarea':
        return <Input.TextArea rows={3} placeholder={field.placeholder} />
      case 'select':
        return (
          <Select placeholder={field.placeholder} options={field.options} allowClear />
        )
      case 'number':
        return <Input type="number" placeholder={field.placeholder} />
      default:
        return <Input placeholder={field.placeholder} />
    }
  }

  const renderHandleModules = () => (
    <Space direction="vertical" size={16} className="handle-modules">
      {ticketData.handleModules.map(module => (
        <Card key={module.id} title={module.title} size="small">
          {module.type === 'formGrid' && (
            <div className="form-grid">
              {module.fields?.map(field => (
                <Form.Item
                  key={field.key}
                  name={['modules', module.id, field.key]}
                  label={field.label}
                  rules={field.required ? [{ required: true, message: `${field.label}不能为空` }] : undefined}
                >
                  {renderHandleField(field)}
                </Form.Item>
              ))}
            </div>
          )}
          {module.type === 'dataTable' && (
            <Form.List name={['modules', module.id, 'rows']}>
              {(fields, { add, remove }) => (
                <>
                  <div className="table-header">
                    <Button type="link" onClick={() => add()}>
                      + 新增行
                    </Button>
                  </div>
                  <div className="data-table">
                    {fields.length === 0 && (
                      <div className="table-empty">暂无数据，点击“新增行”进行填写</div>
                    )}
                    {fields.map(field => (
                      <div key={field.key} className="table-row">
                        {module.columns?.map(col => (
                          <Form.Item
                            key={col.key}
                            name={[field.name, col.key]}
                            rules={
                              col.required
                                ? [{ required: true, message: `${col.title}不能为空` }]
                                : undefined
                            }
                            label={col.title}
                          >
                            <Input placeholder={`请输入${col.title}`} />
                          </Form.Item>
                        ))}
                        <Button type="link" danger onClick={() => remove(field.name)}>
                          删除
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Form.List>
          )}
        </Card>
      ))}
    </Space>
  )

  const renderHistoryTab = () => (
    <div className="history-panel">
      <Card title="时间线" size="small">
        <Timeline
          items={ticketData.history.map(record => ({
            children: (
              <div>
                <div className="history-line">
                  <Text strong>{record.summary}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {record.operator}
                  </Text>
                </div>
                <div className="history-line">
                  <Text type="secondary">{record.time}</Text>
                </div>
                {record.detail && (
                  <div className="history-detail">{record.detail}</div>
                )}
              </div>
            ),
          }))}
        />
      </Card>
      <Card title="记录列表" size="small" style={{ marginTop: 16 }}>
        <List
          dataSource={ticketData.history}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space size={8}>
                    <Text strong>{item.summary}</Text>
                    <Tag>{item.type}</Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">{item.operator}</Text>
                    <Text type="secondary">{item.time}</Text>
                    {item.detail && <Text>{item.detail}</Text>}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )

  return (
    <div className="ticket-detail-page">
      <Card className="summary-bar" bordered={false}>
        <div className="summary-left">
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              {ticketData.title}
            </Title>
            <Space size={12} wrap>
              <span className="ticket-no">工单号：{ticketData.ticketNo}</span>
              <Tag color={STATUS_COLOR[ticketData.status] || 'default'}>{ticketData.status}</Tag>
              <Tag color={PRIORITY_COLOR[ticketData.priority] || 'default'}>优先级 {ticketData.priority}</Tag>
            </Space>
          </div>
          <div className="kind-switcher">
            <Text type="secondary">工单模板</Text>
            <Select
              size="middle"
              value={currentKind}
              onChange={value => setCurrentKind(value as TicketKind)}
              options={kindSelectOptions}
              style={{ width: 240 }}
            />
          </div>
        </div>
      </Card>

      <div className="ticket-content">
        <Tabs
          className="ticket-tabs"
          activeKey={activeTab}
          onChange={key => setActiveTab(key as 'details' | 'history')}
          items={[
            { key: 'details', label: '工单详情', children: (
            <div className="ticket-body">
              <div className="ticket-main">
                <Card size="small" className="info-card">
                  <div className="info-section">
                    <div className="info-section-header">事项概要</div>
                    <Descriptions
                      column={2}
                      size="small"
                      labelStyle={{ width: 140, color: 'var(--text-secondary)' }}
                    >
                      <Descriptions.Item label="工单号">
                        <Text strong>{ticketData.ticketNo}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="创建时间">{ticketData.createdAt}</Descriptions.Item>
                      <Descriptions.Item label="发起人">{ticketData.creator}</Descriptions.Item>
                      <Descriptions.Item label="业务系统">
                        {ticketData.businessSystem.level1}
                        {ticketData.businessSystem.level2 ? ` / ${ticketData.businessSystem.level2}` : ''}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>

                  {ticketData.summary && (
                    <div className="info-section">
                      <div className="info-section-header">详细信息</div>
                      <Descriptions
                        column={ticketData.summary.length > 2 ? 3 : 2}
                        size="small"
                        labelStyle={{ width: 140, color: 'var(--text-secondary)' }}
                        contentStyle={{ fontWeight: 500, color: 'var(--text-primary)' }}
                      >
                        {ticketData.summary.map(item => (
                          <Descriptions.Item key={item.label} label={item.label}>
                            {item.value}
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    </div>
                  )}

                  <div className="info-section">
                    <div className="info-section-header">附件</div>
                    <List
                      dataSource={attachments}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <Space size={8}>
                            <FileTextOutlined />
                            <span>{item.name}</span>
                            <Text type="secondary">{item.size}</Text>
                            <Text type="secondary">{item.uploader}</Text>
                            <Text type="secondary">{item.time}</Text>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </div>

              <div className="ticket-actions">
                <div className="mode-panel">
                  <Radio.Group
                    options={modeOptions}
                    optionType="button"
                    buttonStyle="solid"
                    value={mode}
                    onChange={(event: RadioChangeEvent) => setMode(event.target.value as Mode)}
                  />

                    {mode === 'handle' && (
                      <Form layout="vertical" form={handleForm} className="mode-form">
                        <div className="mode-section-title">准入回执</div>
                        {renderHandleModules()}
                        <Form.Item label="备注" name={['handle', 'remark']}>
                          <Input.TextArea rows={3} placeholder="补充说明" />
                        </Form.Item>
                        <div className="uploader-wrapper">
                          <Upload.Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                              <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">拖拽或点击上传办理佐证</p>
                          </Upload.Dragger>
                        </div>
                        <Space>
                          <Button onClick={handleSaveDraft}>保存草稿</Button>
                          <Button type="primary" onClick={handleSubmitResult}>
                            提交结果
                          </Button>
                        </Space>
                      </Form>
                    )}

                  {mode === 'return' && (
                    <div className="mode-section">
                      <div className="mode-section-title">退回信息</div>
                      <Form layout="vertical" form={returnForm} className="mode-form">
                        <Form.Item label="退回节点" name="targetNode" rules={[{ required: true, message: '请选择退回节点' }]}>
                          <Select
                            placeholder="选择历史节点"
                            options={ticketData.history.map(record => ({ label: record.summary, value: record.id }))}
                          />
                        </Form.Item>
                        <Form.Item label="退回原因" name="reason" rules={[{ required: true, message: '请填写退回原因' }]}>
                          <Input.TextArea rows={3} placeholder="说明退回原因" />
                        </Form.Item>
                        <Form.Item label="备注" name="remark">
                          <Input.TextArea rows={2} />
                        </Form.Item>
                        <div className="uploader-wrapper">
                          <Upload.Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                              <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">上传退回佐证（可选）</p>
                          </Upload.Dragger>
                        </div>
                        <Space>
                          <Button onClick={handleSaveDraft}>保存草稿</Button>
                          <Button type="primary" danger onClick={submitReturn}>
                            提交退回
                          </Button>
                        </Space>
                      </Form>
                    </div>
                  )}

                  {mode === 'handover' && (
                    <div className="mode-section">
                      <div className="mode-section-title">移交信息</div>
                      <Form layout="vertical" form={handoverForm} className="mode-form">
                        <Form.Item label="移交对象" name="targets" rules={[{ required: true, message: '请选择移交对象' }]}>
                          <Select
                            mode="multiple"
                            placeholder="选择责任人/团队"
                            options={[
                              { label: '安全加固一组', value: 'team-a' },
                              { label: '应急支援组', value: 'team-b' },
                              { label: '外协团队', value: 'vendor' },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item label="移交说明" name="note">
                          <Input.TextArea rows={3} placeholder="可选" />
                        </Form.Item>
                        <div className="uploader-wrapper">
                          <Upload.Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                              <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">上传移交佐证（可选）</p>
                          </Upload.Dragger>
                        </div>
                        <Space>
                          <Button onClick={handleSaveDraft}>保存草稿</Button>
                          <Button type="primary" onClick={submitHandover}>
                            确认移交
                          </Button>
                        </Space>
                      </Form>
                    </div>
                  )}

                  <div className="mode-tips">
                    <Space direction="vertical">
                      <Space>
                        <ExclamationCircleOutlined />
                        <Text>操作后将在“处理历史”中留痕，请确保信息准确。</Text>
                      </Space>
                      <Space>
                        <CloudServerOutlined />
                        <Text>附件支持拖拽，单文件不超过 50MB。</Text>
                      </Space>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          )},
          { key: 'history', label: '处理历史', children: (
            <div className="history-panel">
              <Card title="时间线" size="small">
                <Timeline
                  items={ticketData.history.map(record => ({
                    children: (
                      <div>
                        <div className="history-line">
                          <Text strong>{record.summary}</Text>
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            {record.operator}
                          </Text>
                        </div>
                        <div className="history-line">
                          <Text type="secondary">{record.time}</Text>
                        </div>
                        {record.detail && (
                          <div className="history-detail">{record.detail}</div>
                        )}
                      </div>
                    ),
                  }))}
                />
              </Card>
            </div>
          ) },
        ]}
      />
    </div>
    </div>
  )
}

export default TicketDetailPage
