import React, { useMemo } from 'react'
import { Card, Row, Col, Tabs } from 'antd'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import { PerformanceMetrics } from '../types'
import './PerformanceCharts.css'

interface PerformanceChartsProps {
  metrics: PerformanceMetrics
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ metrics }) => {
  // CPU使用率图表配置
  const cpuChartOption = useMemo(() => {
    return {
      title: {
        text: 'CPU使用率',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>CPU: ${params[0].value.toFixed(2)}%`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.cpu.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: 'CPU(%)',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: 'CPU使用率',
          type: 'line',
          smooth: true,
          data: metrics.cpu.map(d => d.value),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
              ]
            }
          },
          lineStyle: { color: '#1890FF', width: 2 },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
            lineStyle: { color: '#FAAD14', type: 'dashed' }
          }
        }
      ]
    }
  }, [metrics.cpu])

  // 内存使用率图表配置
  const memoryChartOption = useMemo(() => {
    return {
      title: {
        text: '内存使用率',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>内存: ${params[0].value.toFixed(2)}%`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.memory.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '内存(%)',
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '内存使用率',
          type: 'line',
          smooth: true,
          data: metrics.memory.map(d => d.value),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
              ]
            }
          },
          lineStyle: { color: '#52C41A', width: 2 },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
            lineStyle: { color: '#FAAD14', type: 'dashed' }
          }
        }
      ]
    }
  }, [metrics.memory])

  // 响应时间图表配置
  const responseTimeChartOption = useMemo(() => {
    return {
      title: {
        text: '响应时间',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>响应时间: ${params[0].value.toFixed(0)}ms`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.responseTime.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '响应时间(ms)',
        axisLabel: {
          formatter: '{value}ms'
        }
      },
      series: [
        {
          name: '响应时间',
          type: 'line',
          smooth: true,
          data: metrics.responseTime.map(d => d.value),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(250, 173, 20, 0.3)' },
                { offset: 1, color: 'rgba(250, 173, 20, 0.05)' }
              ]
            }
          },
          lineStyle: { color: '#FAAD14', width: 2 },
          markLine: {
            data: [
              { type: 'average', name: '平均值' },
              { yAxis: 500, name: '阈值', lineStyle: { color: '#FF4D4F', type: 'solid' } }
            ],
            lineStyle: { type: 'dashed' }
          }
        }
      ]
    }
  }, [metrics.responseTime])

  // 错误率图表配置
  const errorRateChartOption = useMemo(() => {
    return {
      title: {
        text: '错误率',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>错误率: ${params[0].value.toFixed(3)}%`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.errorRate.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '错误率(%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '错误率',
          type: 'bar',
          data: metrics.errorRate.map(d => d.value),
          itemStyle: {
            color: (params: any) => {
              return params.value > 1 ? '#FF4D4F' : params.value > 0.5 ? '#FAAD14' : '#52C41A'
            }
          },
          markLine: {
            data: [
              { yAxis: 1, name: '告警阈值', lineStyle: { color: '#FF4D4F', type: 'solid' } }
            ]
          }
        }
      ]
    }
  }, [metrics.errorRate])

  // 吞吐量图表配置
  const throughputChartOption = useMemo(() => {
    return {
      title: {
        text: '吞吐量',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>吞吐量: ${params[0].value.toFixed(0)} req/s`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.throughput.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '吞吐量(req/s)',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '吞吐量',
          type: 'line',
          smooth: true,
          data: metrics.throughput.map(d => d.value),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(135, 67, 224, 0.3)' },
                { offset: 1, color: 'rgba(135, 67, 224, 0.05)' }
              ]
            }
          },
          lineStyle: { color: '#8743E0', width: 2 }
        }
      ]
    }
  }, [metrics.throughput])

  // 请求数图表配置
  const requestCountChartOption = useMemo(() => {
    return {
      title: {
        text: '请求数',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>请求数: ${params[0].value.toFixed(0)}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: metrics.requestCount.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '请求数',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '请求数',
          type: 'bar',
          data: metrics.requestCount.map(d => d.value),
          itemStyle: {
            color: '#13C2C2'
          }
        }
      ]
    }
  }, [metrics.requestCount])

  return (
    <Card title="性能监控分析" className="performance-charts-card">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="chart-wrapper">
            <ReactECharts option={cpuChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-wrapper">
            <ReactECharts option={memoryChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-wrapper">
            <ReactECharts option={responseTimeChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-wrapper">
            <ReactECharts option={errorRateChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-wrapper">
            <ReactECharts option={throughputChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="chart-wrapper">
            <ReactECharts option={requestCountChartOption} style={{ height: '300px' }} />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default PerformanceCharts
