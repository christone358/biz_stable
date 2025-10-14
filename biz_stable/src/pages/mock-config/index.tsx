import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Divider,
  Descriptions,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import {
  MockDataConfig,
  setConfigs,
  addConfig,
  updateConfig,
  deleteConfig,
  setSelectedConfig,
  setIsEditing,
  toggleConfigEnabled,
} from '../../store/slices/mockConfigSlice'
import { setSystemConfig } from '../../store/slices/systemConfigSlice'
import { saveSystemConfig, getSystemConfig, SystemConfig } from '../../mock/system-config'
import { generateMockSystems, mockOrganizations, mockMetrics } from '../../mock/data'
import type { ColumnsType } from 'antd/es/table'
import './index.css'

const { Header, Content } = Layout
const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const MockConfig: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { configs, selectedConfig, isEditing, loading } = useSelector(
    (state: RootState) => state.mockConfig
  )
  const currentSystemConfig = useSelector((state: RootState) => state.systemConfig.config)

  const [form] = Form.useForm()
  const [systemConfigForm] = Form.useForm()
  const [previewData, setPreviewData] = useState<any>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [isEditingSystemConfig, setIsEditingSystemConfig] = useState(false)

  // 初始化Mock配置数据
  useEffect(() => {
    const initialConfigs: MockDataConfig[] = [
      {
        id: 'org-config-1',
        name: '组织架构配置',
        type: 'organization',
        data: mockOrganizations,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'system-config-1',
        name: '业务系统配置',
        type: 'system',
        data: generateMockSystems(),
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'metric-config-1',
        name: 'KPI指标配置',
        type: 'metric',
        data: mockMetrics,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    dispatch(setConfigs(initialConfigs))
  }, [dispatch])

  const handleCreate = () => {
    form.resetFields()
    dispatch(setSelectedConfig(null))
    dispatch(setIsEditing(true))
  }

  const handleEdit = (config: MockDataConfig) => {
    form.setFieldsValue({
      name: config.name,
      type: config.type,
      data: JSON.stringify(config.data, null, 2),
      enabled: config.enabled,
    })
    dispatch(setSelectedConfig(config))
    dispatch(setIsEditing(true))
  }

  const handleDelete = (id: string) => {
    dispatch(deleteConfig(id))
    message.success('删除成功')
  }

  const handlePreview = (config: MockDataConfig) => {
    setPreviewData(config.data)
    setPreviewVisible(true)
  }

  const handleToggleEnabled = (id: string) => {
    dispatch(toggleConfigEnabled(id))
    message.success('状态更新成功')
  }

  // 系统基本信息配置相关处理
  const handleEditSystemConfig = () => {
    systemConfigForm.setFieldsValue({
      systemName: currentSystemConfig?.systemName || ''
    })
    setIsEditingSystemConfig(true)
  }

  const handleSaveSystemConfig = async () => {
    try {
      const values = await systemConfigForm.validateFields()
      const config: SystemConfig = {
        systemName: values.systemName
      }
      // 保存到localStorage
      saveSystemConfig(config)
      // 更新Redux状态
      dispatch(setSystemConfig(config))
      setIsEditingSystemConfig(false)
      message.success('系统配置保存成功')
    } catch (error) {
      message.error('请检查表单填写')
    }
  }

  const handleCancelSystemConfig = () => {
    setIsEditingSystemConfig(false)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      let parsedData
      try {
        parsedData = JSON.parse(values.data)
      } catch (e) {
        message.error('数据格式错误，请检查JSON格式')
        return
      }

      const config: MockDataConfig = {
        id: selectedConfig?.id || `config-${Date.now()}`,
        name: values.name,
        type: values.type,
        data: parsedData,
        enabled: values.enabled,
        createdAt: selectedConfig?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (selectedConfig) {
        dispatch(updateConfig(config))
        message.success('更新成功')
      } else {
        dispatch(addConfig(config))
        message.success('创建成功')
      }

      dispatch(setIsEditing(false))
      dispatch(setSelectedConfig(null))
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  const handleCancel = () => {
    dispatch(setIsEditing(false))
    dispatch(setSelectedConfig(null))
  }

  const getTypeTag = (type: string) => {
    const typeConfig = {
      organization: { color: 'blue', text: '组织架构' },
      system: { color: 'green', text: '业务系统' },
      metric: { color: 'orange', text: 'KPI指标' },
      alert: { color: 'red', text: '告警数据' },
      vulnerability: { color: 'purple', text: '漏洞数据' },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || {
      color: 'default',
      text: type,
    }

    return <Tag color={config.color}>{config.text}</Tag>
  }

  const columns: ColumnsType<MockDataConfig> = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => getTypeTag(type),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled, record) => (
        <Switch
          size="small"
          checked={enabled}
          onChange={() => handleToggleEnabled(record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '数据量',
      key: 'dataSize',
      width: 100,
      render: (_, record) => {
        const data = record.data
        if (Array.isArray(data)) {
          return `${data.length} 条`
        } else if (typeof data === 'object' && data !== null) {
          return `${Object.keys(data).length} 项`
        }
        return '-'
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (time) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此配置吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const getPreviewContent = (data: any) => {
    if (Array.isArray(data)) {
      return (
        <div>
          <Text strong>数组数据 ({data.length} 项)</Text>
          <pre className="preview-code">
            {JSON.stringify(data.slice(0, 3), null, 2)}
            {data.length > 3 && '\n...'}
          </pre>
        </div>
      )
    } else {
      return (
        <pre className="preview-code">
          {JSON.stringify(data, null, 2)}
        </pre>
      )
    }
  }

  return (
    <Layout className="mock-config-layout">
      <Header className="mock-config-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard')}
            >
              返回仪表板
            </Button>
            <Divider type="vertical" />
            <Title level={4} style={{ margin: 0, color: '#fff' }}>
              Mock数据可视化配置
            </Title>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建配置
            </Button>
          </div>
        </div>
      </Header>

      <Content className="mock-config-content">
        {/* 系统基本信息配置区域 */}
        <Card
          title="系统基本信息配置"
          style={{ marginBottom: 24 }}
          extra={
            !isEditingSystemConfig ? (
              <Button type="primary" onClick={handleEditSystemConfig}>
                编辑配置
              </Button>
            ) : (
              <Space>
                <Button onClick={handleCancelSystemConfig}>取消</Button>
                <Button type="primary" onClick={handleSaveSystemConfig}>
                  保存
                </Button>
              </Space>
            )
          }
        >
          {!isEditingSystemConfig ? (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="系统名称" span={2}>
                {currentSystemConfig?.systemName || <Text type="secondary">未配置</Text>}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Form
              form={systemConfigForm}
              layout="horizontal"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
            >
              <Form.Item
                label="系统名称"
                name="systemName"
                rules={[{ required: true, message: '请输入系统名称' }]}
              >
                <Input placeholder="请输入系统名称，将显示在页面顶部" />
              </Form.Item>
            </Form>
          )}
        </Card>

        <Row gutter={24}>
          <Col span={isEditing ? 12 : 24}>
            <Card
              title="Mock数据配置列表"
              extra={
                <Space>
                  <Text type="secondary">共 {configs.length} 个配置</Text>
                </Space>
              }
            >
              <Table
                columns={columns}
                dataSource={configs}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                }}
                size="middle"
              />
            </Card>
          </Col>

          {isEditing && (
            <Col span={12}>
              <Card
                title={selectedConfig ? '编辑配置' : '新建配置'}
                extra={
                  <Space>
                    <Button onClick={handleCancel}>取消</Button>
                    <Button type="primary" onClick={handleSave}>
                      保存
                    </Button>
                  </Space>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{ enabled: true }}
                >
                  <Form.Item
                    label="配置名称"
                    name="name"
                    rules={[{ required: true, message: '请输入配置名称' }]}
                  >
                    <Input placeholder="请输入配置名称" />
                  </Form.Item>

                  <Form.Item
                    label="数据类型"
                    name="type"
                    rules={[{ required: true, message: '请选择数据类型' }]}
                  >
                    <Select placeholder="请选择数据类型">
                      <Option value="organization">组织架构</Option>
                      <Option value="system">业务系统</Option>
                      <Option value="metric">KPI指标</Option>
                      <Option value="alert">告警数据</Option>
                      <Option value="vulnerability">漏洞数据</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Mock数据 (JSON格式)"
                    name="data"
                    rules={[
                      { required: true, message: '请输入Mock数据' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve()
                          try {
                            JSON.parse(value)
                            return Promise.resolve()
                          } catch (e) {
                            return Promise.reject(new Error('请输入有效的JSON格式'))
                          }
                        },
                      },
                    ]}
                  >
                    <TextArea
                      rows={12}
                      placeholder="请输入JSON格式的Mock数据"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>

                  <Form.Item label="启用状态" name="enabled" valuePropName="checked">
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          )}
        </Row>

        {/* 数据预览模态框 */}
        <Modal
          title="数据预览"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewVisible(false)}>
              关闭
            </Button>,
          ]}
          width={800}
        >
          {previewData && getPreviewContent(previewData)}
        </Modal>
      </Content>
    </Layout>
  )
}

export default MockConfig