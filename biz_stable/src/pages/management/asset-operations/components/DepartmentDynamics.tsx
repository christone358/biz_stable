/**
 * 部门资产纳管动态组件
 * 展示部门资产纳管的实时动态信息，支持点击查看部门详情
 */

import React from 'react'
import { Card, List, Tag, Typography, Button, Empty } from 'antd'
import {
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  RightOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { DepartmentDynamic, DynamicType } from '../types'
import { dynamicTypeLabels } from '../../../../mock/asset-operations-data'
import './DepartmentDynamics.css'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text, Title } = Typography

interface DepartmentDynamicsProps {
  dynamics: DepartmentDynamic[]
  onDepartmentClick?: (departmentId: string, departmentName: string) => void
}

// 动态类型颜色映射
const dynamicTypeColors: Record<DynamicType, string> = {
  ASSIGN: 'blue',
  CLAIM: 'green',
  IMPORT: 'purple',
  IGNORE: 'default'
}

const DepartmentDynamics: React.FC<DepartmentDynamicsProps> = ({
  dynamics,
  onDepartmentClick
}) => {
  const handleDepartmentClick = (departmentId: string, departmentName: string) => {
    if (onDepartmentClick) {
      onDepartmentClick(departmentId, departmentName)
    }
  }

  return (
    <Card
      title={
        <div className="dynamics-header">
          <Title level={5} style={{ margin: 0 }}>
            部门资产纳管动态
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            实时更新
          </Text>
        </div>
      }
      className="department-dynamics-card"
      bodyStyle={{ padding: 0 }}
    >
      {dynamics.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无纳管动态"
          style={{ padding: '40px 0' }}
        />
      ) : (
        <List
          className="dynamics-list"
          dataSource={dynamics}
          renderItem={(item) => (
            <List.Item className="dynamics-item">
              <div className="dynamics-content">
                <div className="dynamics-main">
                  <div className="dynamics-title-row">
                    <Tag color={dynamicTypeColors[item.type]}>
                      {dynamicTypeLabels[item.type]}
                    </Tag>
                    <Text strong>{item.assetCount} 个资产</Text>
                  </div>

                  <div className="dynamics-description">
                    <Text>{item.description}</Text>
                  </div>

                  <div className="dynamics-meta">
                    <span className="meta-item">
                      <TeamOutlined />
                      <Button
                        type="link"
                        size="small"
                        className="department-link"
                        onClick={() =>
                          handleDepartmentClick(item.departmentId, item.departmentName)
                        }
                      >
                        {item.departmentName}
                      </Button>
                    </span>
                    <span className="meta-item">
                      <UserOutlined />
                      <Text type="secondary">{item.operator}</Text>
                    </span>
                    <span className="meta-item">
                      <ClockCircleOutlined />
                      <Text type="secondary">
                        {dayjs(item.operateTime).fromNow()}
                      </Text>
                    </span>
                  </div>
                </div>

                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={() =>
                    handleDepartmentClick(item.departmentId, item.departmentName)
                  }
                />
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default DepartmentDynamics
