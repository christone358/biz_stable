import React, { useEffect, useRef, useMemo } from 'react'
import { Card } from 'antd'
import * as d3 from 'd3'
import { AssetTopologyData, AssetNode } from '../types'
import './AssetTopology.css'

interface AssetTopologyProps {
  data: AssetTopologyData
  selectedAssetId?: string | null
}

const AssetTopology: React.FC<AssetTopologyProps> = ({ data, selectedAssetId }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // 节点类型配置
  const nodeConfig = {
    application: { color: '#1890FF', size: 60, label: '应用' },
    service: { color: '#52C41A', size: 50, label: '服务' },
    middleware: { color: '#FAAD14', size: 45, label: '中间件' },
    server: { color: '#8C8C8C', size: 40, label: '服务器' }
  }

  // 健康状态颜色
  const healthColors = {
    HEALTHY: '#52C41A',
    WARNING: '#FAAD14',
    CRITICAL: '#FF4D4F',
    UNKNOWN: '#BFBFBF'
  }

  // 计算资产类型统计
  const assetStats = useMemo(() => {
    const stats = data.nodes.reduce((acc: any, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1
      return acc
    }, {})
    return stats
  }, [data.nodes])

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove()

    const containerWidth = svgRef.current.parentElement?.clientWidth || 800
    const containerHeight = 600
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // 创建力导向图
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))

    // 绘制连线
    const links = g.append('g')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('class', 'topology-link')
      .style('stroke', (d) => d.type === 'call' ? '#91D5FF' : '#D9D9D9')
      .style('stroke-width', (d) => d.type === 'call' ? 2 : 1)
      .style('stroke-dasharray', (d) => d.type === 'depend' ? '5,5' : 'none')
      .style('opacity', (d: any) => {
        if (!selectedAssetId) return 0.6
        // 高亮选中节点相关的连线
        if (d.source.id === selectedAssetId || d.target.id === selectedAssetId) {
          return 0.8
        }
        return 0.2
      })

    // 创建节点组
    const nodes = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'topology-node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)

    // 绘制节点圆圈
    nodes.append('circle')
      .attr('r', (d) => nodeConfig[d.type].size / 2)
      .style('fill', (d) => nodeConfig[d.type].color)
      .style('stroke', (d) => healthColors[d.status])
      .style('stroke-width', (d) => d.id === selectedAssetId ? 5 : 3)
      .style('filter', (d) => {
        if (d.id === selectedAssetId) {
          return 'drop-shadow(0 4px 16px rgba(255, 77, 79, 0.6))'
        }
        return 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
      })
      .style('opacity', (d) => {
        if (!selectedAssetId) return 1
        return d.id === selectedAssetId ? 1 : 0.4
      })

    // 添加节点图标（使用文字模拟）
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .style('opacity', (d) => {
        if (!selectedAssetId) return 1
        return d.id === selectedAssetId ? 1 : 0.4
      })
      .text((d) => {
        const typeMap: Record<string, string> = {
          application: 'APP',
          service: 'SVC',
          middleware: 'MW',
          server: 'SRV'
        }
        return typeMap[d.type] || '?'
      })

    // 添加节点名称
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => nodeConfig[d.type].size / 2 + 18)
      .style('font-size', '12px')
      .style('fill', '#262626')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('opacity', (d) => {
        if (!selectedAssetId) return 1
        return d.id === selectedAssetId ? 1 : 0.4
      })
      .text((d) => d.name.length > 10 ? d.name.substring(0, 10) + '...' : d.name)

    // 创建工具提示
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'topology-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', '#fff')
      .style('padding', '12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)

    // 节点悬停事件
    nodes.on('mouseover', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', nodeConfig[d.type].size / 2 * 1.2)
        .style('filter', 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))')

      tooltip.transition()
        .duration(200)
        .style('opacity', 1)

      let metricsHtml = ''
      if (d.metrics) {
        if (d.metrics.cpu !== undefined) metricsHtml += `<div>CPU: ${d.metrics.cpu}%</div>`
        if (d.metrics.memory !== undefined) metricsHtml += `<div>内存: ${d.metrics.memory}%</div>`
        if (d.metrics.responseTime !== undefined) metricsHtml += `<div>响应时间: ${d.metrics.responseTime}ms</div>`
      }

      tooltip.html(`
        <div><strong>${d.name}</strong></div>
        <div>类型: ${nodeConfig[d.type].label}</div>
        <div>状态: ${d.status}</div>
        <div>重要性: ${d.importance}</div>
        ${metricsHtml}
      `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px')
    })
      .on('mouseout', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', nodeConfig[d.type].size / 2)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))')

        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      })

    // 更新位置
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      nodes
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // 拖拽函数
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // 清理函数
    return () => {
      tooltip.remove()
      simulation.stop()
    }
  }, [data, selectedAssetId])

  return (
    <Card className="asset-topology-card" bordered={false}>
      <div className="topology-container" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="topology-svg"></svg>

        {/* 健康度图例 - DOM浮层在左上角 */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'white',
          borderRadius: '6px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          zIndex: 10,
          minWidth: '150px'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>
            健康度图例
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: `3px solid ${healthColors.HEALTHY}`,
              marginRight: '8px'
            }}></div>
            <span>健康</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: `3px solid ${healthColors.WARNING}`,
              marginRight: '8px'
            }}></div>
            <span>告警</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: `3px solid ${healthColors.CRITICAL}`,
              marginRight: '8px'
            }}></div>
            <span>严重</span>
          </div>
        </div>

        {/* 资产类型统计 - DOM浮层在右上角 */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          borderRadius: '6px',
          padding: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          zIndex: 10,
          minWidth: '150px'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>
            资产类型统计
          </div>
          {Object.entries(assetStats).map(([type, count]) => {
            const config = nodeConfig[type as keyof typeof nodeConfig]
            if (!config) return null
            return (
              <div key={type} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: config.color,
                    marginRight: '6px'
                  }}></div>
                  <span>{config.label}</span>
                </div>
                <div style={{ fontWeight: 600 }}>{count}</div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default AssetTopology
