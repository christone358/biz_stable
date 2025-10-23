import React, { useState } from 'react'
import { Drawer, Descriptions, Tag, Timeline, Tabs, Card, Alert as AntAlert, Space, Typography, Row, Col, Button } from 'antd'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  DatabaseOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { Asset } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography

interface AssetTaskDetailDrawerProps {
  visible: boolean
  asset: Asset | null
  onClose: () => void
  onClaim?: (id: string) => void
}

/**
 * 资产任务详情抽屉
 * 展示资产任务的详细信息和执行记录
 */
const AssetTaskDetailDrawer: React.FC<AssetTaskDetailDrawerProps> = ({
  visible,
  asset,
  onClose,
  onClaim
}) => {
  const [activeTab, setActiveTab] = useState('basic')

  if (!asset) {
    return null
  }

  // 状态配置
  const statusConfig = {
    unclaimed: { color: 'orange', icon: <ClockCircleOutlined />, label: '待认领' },
    claimed: { color: 'green', icon: <CheckCircleOutlined />, label: '已认领' },
    rejected: { color: 'red', icon: <CloseCircleOutlined />, label: '已拒绝' }
  }

  // 处置类型配置
  const disposalTypeConfig = {
    claim: { label: '资产认领', color: 'blue' },
    compliance: { label: '合规处置', color: 'orange' },
    responsibility: { label: '责任确认', color: 'purple' }
  }

  const statusCfg = statusConfig[asset.status]
  const disposalCfg = disposalTypeConfig[asset.disposalType]

  // 模拟执行记录数据
  const executionRecords = [
    {
      timestamp: asset.discoveryTime,
      action: '资产发现',
      operator: '系统扫描',
      description: `发现异常资产：${asset.name} (${asset.ipAddress})`,
      status: 'discovered'
    },
    {
      timestamp: dayjs(asset.discoveryTime).add(5, 'minute').toISOString(),
      action: '任务创建',
      operator: '系统',
      description: '已自动创建资产认领任务',
      status: 'created'
    }
  ]

  if (asset.status === 'claimed') {
    executionRecords.push({
      timestamp: dayjs(asset.discoveryTime).add(30, 'minute').toISOString(),
      action: '资产认领',
      operator: '王五',
      description: '运维开发部已认领该资产',
      status: 'claimed'
    })
    executionRecords.push({
      timestamp: dayjs(asset.discoveryTime).add(35, 'minute').toISOString(),
      action: '审核通过',
      operator: '审核管理员',
      description: '资产认领已审核通过',
      status: 'approved'
    })
  }

  if (asset.status === 'rejected') {
    executionRecords.push({
      timestamp: dayjs(asset.discoveryTime).add(20, 'minute').toISOString(),
      action: '拒绝认领',
      operator: '运维开发部',
      description: '该资产不属于本部门管理范围',
      status: 'rejected'
    })
  }

  // 基本信息Tab
  const BasicInfoTab = (
    <div style={{ padding: '8px 0' }}>
      {/* 资产概要 */}
      <AntAlert
        message={
          <Space>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>{asset.name}</span>
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
            <Tag color={disposalCfg.color}>{disposalCfg.label}</Tag>
          </Space>
        }
        description={`IP: ${asset.ipAddress} | 类型: ${asset.type}`}
        type={asset.status === 'claimed' ? 'success' : asset.status === 'rejected' ? 'error' : 'warning'}
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 基本信息 */}
      <Card title="资产信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="资产ID">
            <Text code copyable>{asset.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="资产名称">
            <Text strong>{asset.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="IP地址">
            <Text code>{asset.ipAddress}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="资产类型">
            <Tag>{asset.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="操作系统">
            <Text>{asset.os}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="发现时间">
            <Space direction="vertical" size={0}>
              <Text>{dayjs(asset.discoveryTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {dayjs(asset.discoveryTime).fromNow()}
              </Text>
            </Space>
          </Descriptions.Item>
          {asset.location && (
            <Descriptions.Item label="物理位置">
              <Space>
                <EnvironmentOutlined />
                <Text>{asset.location}</Text>
              </Space>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="影响业务">
            <Text strong>{asset.affectedBusiness}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 任务信息 */}
      <Card title="任务信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="任务状态">
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="处置类型">
            <Tag color={disposalCfg.color}>{disposalCfg.label}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 认领信息 (如果已认领) */}
      {asset.status === 'claimed' && (
        <Card title="认领信息" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="认领部门">
              运维开发部
            </Descriptions.Item>
            <Descriptions.Item label="认领人员">
              <Space>
                <UserOutlined />
                <Text>王五</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="认领备注">
              该服务器为我部门新部署的测试环境，已纳入资产管理清单
            </Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <Tag color="green" icon={<CheckCircleOutlined />}>已审核通过</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* 拒绝信息 (如果已拒绝) */}
      {asset.status === 'rejected' && (
        <Card title="拒绝信息" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="拒绝原因">
              该资产不属于本部门管理范围
            </Descriptions.Item>
            <Descriptions.Item label="详细说明">
              经核实，该IP地址为外部供应商提供的SaaS服务，不应纳入本部门资产清单
            </Descriptions.Item>
            <Descriptions.Item label="操作人员">
              <Space>
                <UserOutlined />
                <Text>运维开发部主管</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  )

  // 执行记录Tab
  const ExecutionRecordsTab = (
    <div style={{ padding: '8px 0' }}>
      <Card title="执行时间线" size="small">
        <Timeline
          items={executionRecords.map((record) => {
            const colorMap: Record<string, 'red' | 'blue' | 'green' | 'gray' | 'orange'> = {
              discovered: 'blue',
              created: 'blue',
              claimed: 'green',
              approved: 'green',
              rejected: 'red'
            }

            return {
              color: colorMap[record.status] || 'blue',
              children: (
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong>{record.action}</Text>
                    <Text type="secondary" style={{ marginLeft: 12, fontSize: '12px' }}>
                      {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    操作人: {record.operator}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {record.description}
                  </div>
                </div>
              )
            }
          })}
        />
      </Card>

      {/* 处理统计 */}
      <Card title="处理统计" size="small" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                {executionRecords.length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>执行步骤</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                {dayjs().diff(dayjs(asset.discoveryTime), 'minute')}分钟
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>总耗时</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#fa8c16' }}>
                {executionRecords.filter(r => r.operator !== '系统' && r.operator !== '系统扫描').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>人工操作</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: BasicInfoTab
    },
    {
      key: 'execution',
      label: '执行记录',
      children: ExecutionRecordsTab
    }
  ]

  return (
    <Drawer
      title={
        <Space>
          <span>资产任务详情</span>
          {asset.status === 'unclaimed' && (
            <Tag icon={statusCfg.icon} color={statusCfg.color}>
              {statusCfg.label}
            </Tag>
          )}
        </Space>
      }
      width="65%"
      open={visible}
      onClose={onClose}
      extra={
        asset.status === 'unclaimed' && onClaim && (
          <Button type="primary" onClick={() => onClaim(asset.id)}>
            立即认领
          </Button>
        )
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </Drawer>
  )
}

export default AssetTaskDetailDrawer
