import React from 'react'
import { Card, Row, Col, Tag, Empty, Space } from 'antd'
import { ArrowRightOutlined, ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { SystemNode } from '../../types'

interface CallChainTabProps {
  data: {
    upstream: SystemNode[]    // 上游系统
    downstream: SystemNode[]  // 下游系统
  }
  systemName: string
}

/**
 * 调用链Tab组件
 */
const CallChainTab: React.FC<CallChainTabProps> = ({ data, systemName }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '正常'
      case 'warning':
        return '警告'
      case 'error':
        return '异常'
      default:
        return '未知'
    }
  }

  const renderSystemNode = (node: SystemNode, isUpstream: boolean) => {
    return (
      <Card
        key={node.systemId}
        size="small"
        hoverable
        style={{ marginBottom: 12 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isUpstream && <ArrowRightOutlined style={{ color: '#1890ff', fontSize: 16 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{node.systemName}</div>
            <Space size="small">
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                调用次数: {node.callCount.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                <ClockCircleOutlined /> 平均响应: {node.avgResponseTime}ms
              </span>
              <Tag color={getStatusColor(node.status)} style={{ margin: 0 }}>
                {getStatusText(node.status)}
              </Tag>
            </Space>
          </div>
          {!isUpstream && <ArrowLeftOutlined style={{ color: '#52c41a', fontSize: 16 }} />}
        </div>
      </Card>
    )
  }

  return (
    <div className="call-chain-tab">
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h3>{systemName} - 调用链关系图</h3>
      </div>

      <Row gutter={24}>
        {/* 上游系统 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <ArrowRightOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                上游系统 ({data.upstream.length})
              </span>
            }
            bordered={false}
          >
            {data.upstream.length > 0 ? (
              data.upstream.map(node => renderSystemNode(node, true))
            ) : (
              <Empty description="无上游系统依赖" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* 下游系统 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <ArrowLeftOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                下游系统 ({data.downstream.length})
              </span>
            }
            bordered={false}
          >
            {data.downstream.length > 0 ? (
              data.downstream.map(node => renderSystemNode(node, false))
            ) : (
              <Empty description="无下游系统调用" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
        <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 12 }}>
          提示：点击系统卡片可跳转到对应系统的监控页面（功能待实现）
        </div>
      </div>
    </div>
  )
}

export default CallChainTab
