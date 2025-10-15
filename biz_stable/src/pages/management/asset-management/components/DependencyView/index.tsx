import React from 'react'
import { Card, Empty } from 'antd'
import type { DependencyNode } from '../../panorama-types'
import './index.css'

interface DependencyViewProps {
  dependencyData?: DependencyNode[]
}

const DependencyView: React.FC<DependencyViewProps> = ({ dependencyData }) => {
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
