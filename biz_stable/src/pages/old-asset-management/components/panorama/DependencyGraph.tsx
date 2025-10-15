import React, { useEffect, useRef } from 'react'
import { Card } from 'antd'
import type { DependencyNode } from '../../panorama-types'
import './DependencyGraph.css'

interface DependencyGraphProps {
  nodes: DependencyNode[]
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ nodes }) => {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // 清空画布
    canvasRef.current.innerHTML = ''

    // 创建连接线
    nodes.forEach(node => {
      if (node.connections) {
        node.connections.forEach(targetId => {
          const targetNode = nodes.find(n => n.id === targetId)
          if (targetNode) {
            createConnection(node, targetNode)
          }
        })
      }
    })

    // 创建节点
    nodes.forEach(node => {
      createNode(node)
    })
  }, [nodes])

  const createConnection = (source: DependencyNode, target: DependencyNode) => {
    if (!canvasRef.current) return

    const startX = source.x + 60
    const startY = source.y + 40
    const endX = target.x + 60
    const endY = target.y + 40

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI

    const connection = document.createElement('div')
    connection.className = 'dependency-connection'
    connection.style.width = `${length}px`
    connection.style.left = `${startX}px`
    connection.style.top = `${startY}px`
    connection.style.transform = `rotate(${angle}deg)`

    const arrow = document.createElement('div')
    arrow.className = 'dependency-arrow'
    arrow.style.left = `${length - 5}px`
    arrow.style.top = '-4px'

    connection.appendChild(arrow)
    canvasRef.current.appendChild(connection)
  }

  const createNode = (nodeData: DependencyNode) => {
    if (!canvasRef.current) return

    const node = document.createElement('div')
    node.className = `dependency-node dependency-node-${nodeData.type}`
    node.id = `node-${nodeData.id}`
    node.style.left = `${nodeData.x}px`
    node.style.top = `${nodeData.y}px`

    const iconMap: Record<string, string> = {
      business: '🏢',
      app: '📦',
      service: '⚙️',
      database: '💾',
      resource: '🖥️'
    }

    node.innerHTML = `
      <div class="dependency-node-icon">${iconMap[nodeData.type] || '📦'}</div>
      <div class="dependency-node-title">${nodeData.name}</div>
      <div class="dependency-node-desc">${nodeData.type}</div>
    `

    canvasRef.current.appendChild(node)
  }

  return (
    <Card className="dependency-graph-card" bordered={false}>
      <div className="dependency-graph-header">
        <div className="dependency-graph-title">依赖关系分析</div>
        <div className="dependency-graph-tip">提示：展示业务系统的资产依赖关系</div>
      </div>
      <div className="dependency-canvas" ref={canvasRef} />
    </Card>
  )
}

export default DependencyGraph
