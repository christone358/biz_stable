import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Card, Spin, Empty } from 'antd'
import { RootState } from '../../../store'
import { ImportanceLevel } from '../../../types'
import * as d3 from 'd3'
import './index.css'

const HealthMatrix: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const { systems, loading, selectedOrganization, filteredAssets } = useSelector((state: RootState) => state.dashboard)

  const importanceOrder: ImportanceLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
  const colorScale = {
    HEALTHY: '#52C41A',
    WARNING: '#FAAD14',
    CRITICAL: '#FF4D4F',
    UNKNOWN: '#BFBFBF'
  }

  // 生成六边形路径
  const generateHexagon = (x: number, y: number, radius: number) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      const px = x + radius * Math.cos(angle)
      const py = y + radius * Math.sin(angle)
      points.push([px, py])
    }
    return `M${points.map(p => p.join(',')).join('L')}Z`
  }

  // 渲染蜂窝图（当选择了具体系统时）
  const renderHoneycombChart = () => {
    if (!filteredAssets.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const containerWidth = svgRef.current.parentElement?.clientWidth || 800
    const containerHeight = 500
    const margin = { top: 60, right: 80, bottom: 80, left: 100 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.bottom - margin.top

    const g = svg
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // 按资产类型分组：基础设施、中间件、应用服务
    const assetGroups = {
      infrastructure: filteredAssets.filter(asset =>
        ['服务器', '数据库', '网络设备', '存储设备', '安全设备'].includes(asset.type)
      ),
      middleware: filteredAssets.filter(asset =>
        ['中间件'].includes(asset.type)
      ),
      application: filteredAssets.filter(asset =>
        ['应用服务'].includes(asset.type)
      )
    }

    const sectionWidth = width / 3
    const hexRadius = 25
    const hexSpacing = hexRadius * 2.2

    // 渲染三个区域的标题
    const titles = [
      { text: '基础设施', x: sectionWidth * 0.5, group: 'infrastructure' },
      { text: '中间件', x: sectionWidth * 1.5, group: 'middleware' },
      { text: '应用服务', x: sectionWidth * 2.5, group: 'application' }
    ]

    titles.forEach(title => {
      g.append('text')
        .attr('x', title.x)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#262626')
        .text(title.text)
    })

    // 创建工具提示
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'honeycomb-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', '#fff')
      .style('padding', '12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)

    // 渲染每个组的六边形
    Object.entries(assetGroups).forEach(([_, assets], groupIndex) => {
      const baseX = sectionWidth * (groupIndex + 0.5)
      const cols = Math.ceil(Math.sqrt(assets.length))
      const rows = Math.ceil(assets.length / cols)

      assets.forEach((asset, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)

        const x = baseX + (col - (cols - 1) / 2) * hexSpacing * 0.75
        const y = 60 + (row - (rows - 1) / 2) * hexSpacing + (col % 2) * hexSpacing * 0.5

        g.append('path')
          .attr('d', generateHexagon(x, y, hexRadius))
          .style('fill', colorScale[asset.healthStatus as keyof typeof colorScale])
          .style('stroke', '#fff')
          .style('stroke-width', 2)
          .style('cursor', 'pointer')
          .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))')
          .on('mouseover', function(event) {
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke', '#1677FF')
              .style('stroke-width', 3)
              .attr('transform', `scale(1.1)`)
              .style('transform-origin', `${x}px ${y}px`)

            tooltip.transition()
              .duration(200)
              .style('opacity', 1)

            tooltip.html(`
              <div><strong>${asset.name}</strong></div>
              <div>类型: ${asset.type}</div>
              <div>健康状态: ${asset.healthStatus}</div>
              <div>错误率: ${asset.errorRate.toFixed(2)}%</div>
              <div>响应时间: ${asset.responseTime}ms</div>
              <div>可用性: ${asset.availability.toFixed(1)}%</div>
              ${asset.alertCount > 0 ? `<div style="color: #FF4D4F">告警数量: ${asset.alertCount}条</div>` : ''}
              ${asset.vulnerabilityCount > 0 ? `<div style="color: #FF4D4F">漏洞数量: ${asset.vulnerabilityCount}个</div>` : ''}
            `)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px')
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .style('stroke', '#fff')
              .style('stroke-width', 2)
              .attr('transform', 'scale(1)')

            tooltip.transition()
              .duration(500)
              .style('opacity', 0)
          })
          .on('click', function() {
            console.log('点击资产:', asset.name)
          })

        // 添加资产名称（简化显示）
        g.append('text')
          .attr('x', x)
          .attr('y', y + 4)
          .attr('text-anchor', 'middle')
          .style('font-size', '8px')
          .style('fill', '#fff')
          .style('pointer-events', 'none')
          .text(asset.name.length > 6 ? asset.name.substring(0, 6) + '...' : asset.name)
      })
    })

    // 添加图例
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 100}, ${height - 120})`)

    const legendData = [
      { status: 'HEALTHY', color: colorScale.HEALTHY, label: '健康' },
      { status: 'WARNING', color: colorScale.WARNING, label: '警告' },
      { status: 'CRITICAL', color: colorScale.CRITICAL, label: '故障' },
      { status: 'UNKNOWN', color: colorScale.UNKNOWN, label: '未知' }
    ]

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`)

    legendItems.append('circle')
      .attr('r', 6)
      .style('fill', d => d.color)

    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 4)
      .style('font-size', '12px')
      .style('fill', '#595959')
      .text(d => d.label)

    // 清理函数
    return () => {
      tooltip.remove()
    }
  }

  const renderChart = () => {
    if (!systems.length || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // 获取容器的实际宽度
    const containerWidth = svgRef.current.parentElement?.clientWidth || 800
    const containerHeight = 500

    const margin = { top: 60, right: 80, bottom: 80, left: 100 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.bottom - margin.top

    const g = svg
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // 获取部门和重要性数据
    const departments = Array.from(new Set(systems.map(s => s.department))).sort()
    const importanceLevels = importanceOrder

    // 创建比例尺
    const xScale = d3
      .scaleBand()
      .domain(departments)
      .range([0, width])
      .padding(0.1)

    const yScale = d3
      .scaleBand()
      .domain(importanceLevels)
      .range([height, 0])
      .padding(0.1)

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(systems, d => d.assetCount) || 100])
      .range([8, 30])

    // 绘制背景网格
    g.selectAll('.grid-line-x')
      .data(departments)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', d => (xScale(d) || 0) + xScale.bandwidth() / 2)
      .attr('x2', d => (xScale(d) || 0) + xScale.bandwidth() / 2)
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', '#f5f5f5')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '2,2')

    g.selectAll('.grid-line-y')
      .data(importanceLevels)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => (yScale(d) || 0) + yScale.bandwidth() / 2)
      .attr('y2', d => (yScale(d) || 0) + yScale.bandwidth() / 2)
      .style('stroke', '#f5f5f5')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '2,2')

    // 绘制坐标轴
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#595959')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#595959')

    // 轴标签
    g.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 20)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#262626')
      .text('重要性等级')

    g.append('text')
      .attr('class', 'axis-label')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#262626')
      .text('委办单位')

    // 创建气泡数据
    const bubbleData = systems.map(system => {
      const xPos = (xScale(system.department) || 0) + xScale.bandwidth() / 2
      const yPos = (yScale(system.importance) || 0) + yScale.bandwidth() / 2

      // 添加随机偏移避免重叠
      const jitterX = (Math.random() - 0.5) * 30
      const jitterY = (Math.random() - 0.5) * 20

      return {
        ...system,
        x: xPos + jitterX,
        y: yPos + jitterY,
        radius: radiusScale(system.assetCount),
        color: colorScale[system.healthStatus as keyof typeof colorScale]
      }
    })

    // 创建工具提示
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'matrix-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', '#fff')
      .style('padding', '12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)

    // 绘制气泡
    g.selectAll('.system-bubble')
      .data(bubbleData)
      .enter()
      .append('circle')
      .attr('class', 'system-bubble')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .style('fill', d => d.color)
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.radius * 1.2)
          .style('stroke', '#1677FF')
          .style('stroke-width', 3)

        tooltip.transition()
          .duration(200)
          .style('opacity', 1)

        tooltip.html(`
          <div><strong>${d.name}</strong></div>
          <div>归属单位: ${d.department}</div>
          <div>重要性等级: ${d.importance}</div>
          <div>健康状态: ${d.healthStatus}</div>
          <div>资产数量: ${d.assetCount}个</div>
          <div>错误率: ${d.errorRate.toFixed(2)}%</div>
          <div>响应时间: ${d.responseTime}ms</div>
          ${d.alertCount > 0 ? `<div style="color: #FF4D4F">未处理告警: ${d.alertCount}条</div>` : ''}
          ${d.vulnerabilityCount > 0 ? `<div style="color: #FF4D4F">高危漏洞: ${d.vulnerabilityCount}个</div>` : ''}
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
      })
      .on('mouseout', function(_, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', d.radius)
          .style('stroke', '#fff')
          .style('stroke-width', 2)

        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      })
      .on('click', function(_, d) {
        console.log('点击系统:', d.name)
        // 这里可以添加跳转到系统详情页的逻辑
      })

    // 添加图例
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 20}, 20)`)

    const legendData = [
      { status: 'HEALTHY', color: colorScale.HEALTHY, label: '健康' },
      { status: 'WARNING', color: colorScale.WARNING, label: '警告' },
      { status: 'CRITICAL', color: colorScale.CRITICAL, label: '故障' },
      { status: 'UNKNOWN', color: colorScale.UNKNOWN, label: '未知' }
    ]

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`)
      .style('cursor', 'pointer')

    legendItems.append('circle')
      .attr('r', 6)
      .style('fill', d => d.color)

    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 4)
      .style('font-size', '12px')
      .style('fill', '#595959')
      .text(d => d.label)

    // 清理函数
    return () => {
      tooltip.remove()
    }
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined

    // 根据选择的组织类型决定渲染哪种图表
    if (selectedOrganization?.type === 'system' && filteredAssets.length > 0) {
      // 选择了具体系统，渲染蜂窝图
      cleanup = renderHoneycombChart()
    } else {
      // 其他情况渲染传统矩阵图
      cleanup = renderChart()
    }

    // 监听窗口大小变化
    const handleResize = () => {
      setTimeout(() => {
        if (selectedOrganization?.type === 'system' && filteredAssets.length > 0) {
          renderHoneycombChart()
        } else {
          renderChart()
        }
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (cleanup) cleanup()
    }
  }, [systems, selectedOrganization, filteredAssets])

  // 动态生成标题
  const getChartTitle = () => {
    if (selectedOrganization?.type === 'system' && filteredAssets.length > 0) {
      return `${selectedOrganization.name} - 资产健康状态蜂窝图`
    }
    return '业务健康状态矩阵图'
  }

  if (loading) {
    return (
      <Card title={getChartTitle()} className="health-matrix-card">
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </Card>
    )
  }

  if (!systems.length && (!selectedOrganization || selectedOrganization.type !== 'system')) {
    return (
      <Card title={getChartTitle()} className="health-matrix-card">
        <Empty description="暂无系统数据" />
      </Card>
    )
  }

  if (selectedOrganization?.type === 'system' && !filteredAssets.length) {
    return (
      <Card title={getChartTitle()} className="health-matrix-card">
        <Empty description="该系统暂无资产数据" />
      </Card>
    )
  }

  return (
    <Card title={getChartTitle()} className="health-matrix-card">
      <div className="matrix-container">
        <svg ref={svgRef} className="matrix-svg"></svg>
      </div>
    </Card>
  )
}

export default HealthMatrix