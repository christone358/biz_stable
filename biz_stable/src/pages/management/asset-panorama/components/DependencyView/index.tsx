import React from 'react'
import { Card, Empty } from 'antd'
import './index.css'

const DependencyView: React.FC = () => {
  return (
    <Card className="dependency-view-card" bordered={false}>
      <Empty
        description="依赖分析视图功能开发中"
        style={{ padding: '100px 0' }}
      />
    </Card>
  )
}

export default DependencyView
