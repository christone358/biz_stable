/**
 * 运营概况组件
 * 支持两种视角：受影响业务、责任单位
 */

import React, { useState } from 'react'
import { Card, List, Typography, Button, Empty, Segmented, Space, Tag } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import type { AffectedBusinessStats, DepartmentTaskStats } from '../types'
import './DepartmentDynamics.css'

const { Text, Title } = Typography

type ViewType = 'business' | 'department'

interface OperationsOverviewProps {
  affectedBusinessList: AffectedBusinessStats[]
  departmentTaskList: DepartmentTaskStats[]
  onBusinessClick?: (businessId: string, businessName: string) => void
  onDepartmentClick?: (departmentId: string, departmentName: string) => void
}

const OperationsOverview: React.FC<OperationsOverviewProps> = ({
  affectedBusinessList,
  departmentTaskList,
  onBusinessClick,
  onDepartmentClick
}) => {
  const [viewType, setViewType] = useState<ViewType>('business')

  const handleBusinessClick = (businessId: string, businessName: string) => {
    if (onBusinessClick) {
      onBusinessClick(businessId, businessName)
    }
  }

  const handleDepartmentClick = (departmentId: string, departmentName: string) => {
    if (onDepartmentClick) {
      onDepartmentClick(departmentId, departmentName)
    }
  }

  // 渲染受影响业务列表
  const renderBusinessList = () => {
    if (affectedBusinessList.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无受影响业务"
          style={{ padding: '40px 0' }}
        />
      )
    }

    return (
      <List
        className="operations-list"
        dataSource={affectedBusinessList}
        renderItem={(item) => (
          <List.Item
            className="operations-item"
            onClick={() => handleBusinessClick(item.businessId, item.businessName)}
          >
            <div className="operations-content">
              <div className="operations-main">
                <div className="business-info">
                  <Text strong className="business-name">{item.businessName}</Text>
                  <Space size={8} className="problem-stats">
                    <Tag color="orange">无主: {item.orphanCount}</Tag>
                    <Tag color="red">未知: {item.unknownCount}</Tag>
                    <Tag color="volcano">不合规: {item.nonCompliantCount}</Tag>
                  </Space>
                </div>
                <Text className="total-count">{item.totalCount}</Text>
              </div>
            </div>
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleBusinessClick(item.businessId, item.businessName)
              }}
            />
          </List.Item>
        )}
      />
    )
  }

  // 渲染责任单位列表
  const renderDepartmentList = () => {
    if (departmentTaskList.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无责任单位任务"
          style={{ padding: '40px 0' }}
        />
      )
    }

    return (
      <List
        className="operations-list"
        dataSource={departmentTaskList}
        renderItem={(item) => (
          <List.Item
            className="operations-item"
            onClick={() => handleDepartmentClick(item.departmentId, item.departmentName)}
          >
            <div className="operations-content">
              <div className="operations-main">
                <div className="department-info">
                  <Text strong className="department-name">{item.departmentName}</Text>
                  <Space size={12} className="task-stats">
                    <Text type="secondary">处理中: {item.processingCount}</Text>
                    <Text type="danger">超期: {item.overdueCount}</Text>
                  </Space>
                </div>
              </div>
            </div>
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleDepartmentClick(item.departmentId, item.departmentName)
              }}
            />
          </List.Item>
        )}
      />
    )
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>
            运营概况
          </Title>
          <Segmented
            value={viewType}
            onChange={(value) => setViewType(value as ViewType)}
            options={[
              { label: '受影响业务', value: 'business' },
              { label: '责任单位', value: 'department' }
            ]}
            size="small"
          />
        </div>
      }
      className="operations-overview-card"
      bodyStyle={{ padding: 0 }}
    >
      {viewType === 'business' ? renderBusinessList() : renderDepartmentList()}
    </Card>
  )
}

export default OperationsOverview
