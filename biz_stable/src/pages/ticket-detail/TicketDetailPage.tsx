import { useMemo, useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Card, Descriptions, Tag, Space, Typography, Tabs, Timeline, List, Form, Input, Select, Button, message, Upload, Table } from 'antd'
import type { UploadProps } from 'antd'
import { FileTextOutlined, InboxOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type {
  TicketDetailData,
  TicketNavigationState,
  TicketKind,
  HandleModuleSchema,
  TicketAttachment,
  DetailModuleSchema,
  TicketActionType,
} from './types'
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

type HandleFieldConfig = NonNullable<HandleModuleSchema['fields']>[number]

const kindSelectOptions: { label: string; value: TicketKind }[] = [
  { label: '互联网准入', value: 'internet' },
  { label: '政务外网准入', value: 'govnet' },
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
  const [attachments, setAttachments] = useState<TicketAttachment[]>(ticketData.attachments)

  const [handleForm] = Form.useForm()
  const [returnForm] = Form.useForm()
  const [handoverForm] = Form.useForm()
  const actionType: TicketActionType = ticketData.currentActionType ?? 'handle'

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

  const renderActionContent = () => {
    if (actionType === 'return') {
      return (
        <Form layout="vertical" form={returnForm} className="action-form">
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
            <Input.TextArea rows={2} placeholder="可选" />
          </Form.Item>
          <Form.Item label="附件">
            <Upload {...uploadProps}>
              <Button icon={<InboxOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
          <div className="mode-actions">
            <Button onClick={handleSaveDraft}>保存草稿</Button>
            <Button type="primary" danger onClick={submitReturn}>
              提交退回
            </Button>
          </div>
        </Form>
      )
    }

    if (actionType === 'handover') {
      return (
        <Form layout="vertical" form={handoverForm} className="action-form">
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
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={2} placeholder="可选" />
          </Form.Item>
          <Form.Item label="附件">
            <Upload {...uploadProps}>
              <Button icon={<InboxOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
          <div className="mode-actions">
            <Button onClick={handleSaveDraft}>保存草稿</Button>
            <Button type="primary" onClick={submitHandover}>
              确认移交
            </Button>
          </div>
        </Form>
      )
    }

    return (
      <Form layout="vertical" form={handleForm} className="action-form">
        {renderHandleModules()}
        <Form.Item label="备注" name="handleRemark">
          <Input.TextArea rows={2} placeholder="补充说明" />
        </Form.Item>
        <Form.Item label="附件">
          <Upload {...uploadProps}>
            <Button icon={<InboxOutlined />}>上传附件</Button>
          </Upload>
        </Form.Item>
        <div className="mode-actions">
          <Button onClick={handleSaveDraft}>保存草稿</Button>
          <Button type="primary" onClick={handleSubmitResult}>
            提交结果
          </Button>
        </div>
      </Form>
    )
  }

  const formDetailModules = useMemo(
    () => ticketData.detailModules?.filter(module => module.type === 'formGrid') ?? [],
    [ticketData.detailModules],
  )
  const tableDetailModules = useMemo(
    () => ticketData.detailModules?.filter(module => module.type === 'dataTable') ?? [],
    [ticketData.detailModules],
  )

  const detailKVBlocks = useMemo(() => {
    const formBlocks = formDetailModules.map(module => ({
      key: module.id,
      title: module.title,
      fields: module.fields ?? [],
    }))

    const tableBlocks = tableDetailModules.flatMap(module => {
      if (!module.columns?.length) {
        return []
      }
      if (!module.rows?.length) {
        return [{ key: `${module.id}-empty`, title: module.title, fields: [] }]
      }
      return module.rows.map((row, index) => ({
        key: row.id ?? `${module.id}-${index}`,
        title: module.rows!.length > 1 ? `${module.title}（${index + 1}）` : module.title,
        fields: module.columns!.map(col => ({
          key: col.key,
          label: col.title,
          value: row[col.key],
        })),
      }))
    })

    return [...formBlocks, ...tableBlocks]
  }, [formDetailModules, tableDetailModules])

  const renderHandleField = (field: HandleFieldConfig) => {
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
    <div className="handle-modules">
      {ticketData.handleModules.map(module => (
        <div key={module.id} className="form-group">
          <div className="form-group-title">{module.title}</div>
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
                <div className="data-table">
                  <div className="table-toolbar">
                    <Button type="link" onClick={() => add()}>
                      + 新增行
                    </Button>
                  </div>
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
                            col.required ? [{ required: true, message: `${col.title}不能为空` }] : undefined
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
              )}
            </Form.List>
          )}
        </div>
      ))}
    </div>
  )

  const renderFormDetailModule = (module: DetailModuleSchema) => {
    const fields = module.fields ?? []
    return (
      <div key={module.id} className="detail-subsection">
        <div className="detail-module-title">{module.title}</div>
        {fields.length ? (
          <Descriptions
            column={2}
            size="small"
            labelStyle={{ width: 140, color: 'var(--text-secondary)' }}
            contentStyle={{ color: 'var(--text-primary)' }}
          >
            {fields.map(field => (
              <Descriptions.Item key={field.key} label={field.label}>
                {field.value || '—'}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <div className="detail-kv-empty">暂无数据</div>
        )}
      </div>
    )
  }

  const renderDetailTable = (module: DetailModuleSchema) => {
    if (!module.columns?.length) {
      return <div className="detail-kv-empty">暂无数据</div>
    }
    const rows = module.rows ?? []
    if (!rows.length) {
      return <div className="detail-kv-empty">暂无数据</div>
    }

    const columns = module.columns.map(col => ({
      dataIndex: col.key,
      key: col.key,
      title: col.title,
      render: (value: string | undefined) => value ?? '—',
    }))

    return (
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey={(record, index) => record.id ?? `${module.id}-${index ?? 0}`}
        scroll={{ x: 'max-content' }}
      />
    )
  }

  const detailTabContent = (
    <Card size="small" className="info-card">
      <div className="info-section">
        <div className="info-section-header">事项概要信息</div>
        <Descriptions column={2} size="small" labelStyle={{ width: 140, color: 'var(--text-secondary)' }}>
          <Descriptions.Item label="工单编号">{ticketData.ticketNo}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ticketData.createdAt}</Descriptions.Item>
          <Descriptions.Item label="发起人">{ticketData.creator}</Descriptions.Item>
          <Descriptions.Item label="业务系统">
            {ticketData.businessSystem.level1}
            {ticketData.businessSystem.level2 ? ` / ${ticketData.businessSystem.level2}` : ''}
          </Descriptions.Item>
          {ticketData.summary?.map(item => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>

      {(formDetailModules.length > 0 || tableDetailModules.length > 0) && (
        <div className="info-section">
          <div className="info-section-header">任务明细信息</div>
          {formDetailModules.length > 0 && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {formDetailModules.map(renderFormDetailModule)}
            </Space>
          )}
          {tableDetailModules.length > 0 && (
            <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 16 }}>
              {tableDetailModules.map(module => (
                <div key={module.id} className="detail-module">
                  <div className="detail-module-title">{module.title}</div>
                  {renderDetailTable(module)}
                </div>
              ))}
            </Space>
          )}
        </div>
      )}

      <div className="info-section">
        <div className="info-section-header">附件信息</div>
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
  )

  const historyTabContent = (
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
                {record.detail && <div className="history-detail">{record.detail}</div>}
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  )

  const tabItems = [
    { key: 'details', label: '工单详情', children: detailTabContent },
    { key: 'history', label: '处理历史', children: historyTabContent },
  ]

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

      <div className="ticket-body">
        <section className="ticket-panel ticket-panel-main">
          <Tabs
            className="ticket-tabs"
            activeKey={activeTab}
            onChange={key => setActiveTab(key as 'details' | 'history')}
            items={tabItems}
          />
        </section>
        <div className="ticket-panel-divider" />
        <section className="ticket-panel ticket-panel-actions">
          <div className="action-panel">
            <div className="action-panel-header">
              <Title level={5} style={{ margin: 0 }}>工单办理</Title>
            </div>
            {renderActionContent()}
          </div>
        </section>
      </div>
    </div>
  )
}

export default TicketDetailPage
