import React, { useMemo } from 'react'
import { Card, Row, Col, Spin, Tag } from 'antd'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import {
  AssetPerformanceData,
  TimeSeriesData
} from '../../../../mock/asset-performance-data'
import { AssetLayerType } from './AssetTree/types'
import './PerformanceCharts.css'

interface PerformanceChartsProps {
  performanceData: AssetPerformanceData | null
  loading?: boolean
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ performanceData, loading = false }) => {
  // 通用图表配置生成函数
  const createChartOption = (
    title: string,
    data: TimeSeriesData[] | undefined,
    yAxisName: string,
    unit: string,
    color: string,
    chartType: 'line' | 'bar' = 'line',
    max?: number
  ) => {
    if (!data || data.length === 0) {
      return null
    }

    return {
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].name).format('MM-DD HH:mm')
          return `${time}<br/>${title}: ${params[0].value.toFixed(2)}${unit}`
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
        data: data.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        max: max,
        axisLabel: {
          formatter: `{value}${unit}`
        }
      },
      series: [
        {
          name: title,
          type: chartType,
          smooth: chartType === 'line',
          data: data.map(d => d.value),
          ...(chartType === 'line' ? {
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: `${color}40` },
                  { offset: 1, color: `${color}08` }
                ]
              }
            },
            lineStyle: { color, width: 2 },
            markLine: {
              data: [{ type: 'average', name: '平均值' }],
              lineStyle: { color: '#FAAD14', type: 'dashed' }
            }
          } : {
            itemStyle: { color }
          })
        }
      ]
    }
  }

  // 根据资产层级生成不同的图表配置
  const charts = useMemo(() => {
    if (!performanceData) return []

    const { layer, metrics } = performanceData

    if (layer === AssetLayerType.COMPUTE) {
      // 计算资源：CPU、内存、磁盘IO、网络流量、响应时间、吞吐量
      return [
        createChartOption('CPU使用率', metrics.cpu, 'CPU(%)', '%', '#1890FF', 'line', 100),
        createChartOption('内存使用率', metrics.memory, '内存(%)', '%', '#52C41A', 'line', 100),
        createChartOption('磁盘IO', metrics.diskIO, '磁盘IO(MB/s)', 'MB/s', '#722ED1', 'line'),
        createChartOption('网络流量', metrics.networkTraffic, '流量(MB/s)', 'MB/s', '#13C2C2', 'line'),
        createChartOption('响应时间', metrics.responseTime, '响应时间(ms)', 'ms', '#FAAD14', 'line'),
        createChartOption('吞吐量', metrics.throughput, '吞吐量(req/s)', 'req/s', '#8543E0', 'line')
      ].filter(Boolean)
    } else if (layer === AssetLayerType.STORAGE) {
      // 存储资源：CPU、内存、QPS、连接数、响应时间、错误率
      return [
        createChartOption('CPU使用率', metrics.cpu, 'CPU(%)', '%', '#1890FF', 'line', 100),
        createChartOption('内存使用率', metrics.memory, '内存(%)', '%', '#52C41A', 'line', 100),
        createChartOption('QPS', metrics.qps, 'QPS(次/秒)', '次/s', '#722ED1', 'line'),
        createChartOption('连接数', metrics.connections, '连接数', '个', '#13C2C2', 'line'),
        createChartOption('响应时间', metrics.responseTime, '响应时间(ms)', 'ms', '#FAAD14', 'line'),
        createChartOption('错误率', metrics.errorRate, '错误率(%)', '%', '#FF4D4F', 'bar')
      ].filter(Boolean)
    } else if (layer === AssetLayerType.NETWORK) {
      // 网络资源：吞吐量、连接数、错误率、响应时间、网络流量、请求数
      return [
        createChartOption('吞吐量', metrics.throughput, '吞吐量(req/s)', 'req/s', '#8543E0', 'line'),
        createChartOption('连接数', metrics.connections, '连接数', '个', '#13C2C2', 'line'),
        createChartOption('错误率', metrics.errorRate, '错误率(%)', '%', '#FF4D4F', 'bar'),
        createChartOption('响应时间', metrics.responseTime, '响应时间(ms)', 'ms', '#FAAD14', 'line'),
        createChartOption('网络流量', metrics.networkTraffic, '流量(MB/s)', 'MB/s', '#1890FF', 'line'),
        createChartOption('请求数', metrics.requestCount, '请求数', '次', '#52C41A', 'bar')
      ].filter(Boolean)
    }

    return []
  }, [performanceData])

  if (loading) {
    return (
      <div className="performance-charts-loading">
        <Spin size="large" tip="加载性能数据..." />
      </div>
    )
  }

  if (!performanceData) {
    return (
      <Card bordered={false} className="performance-charts-card">
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8c8c8c' }}>
          请从左侧选择资产查看性能监控数据
        </div>
      </Card>
    )
  }

  const getLayerName = (layer: AssetLayerType) => {
    const names = {
      [AssetLayerType.COMPUTE]: '计算资源',
      [AssetLayerType.STORAGE]: '存储资源',
      [AssetLayerType.NETWORK]: '网络资源'
    }
    return names[layer]
  }

  return (
    <Card
      title={
        <div className="performance-charts-header">
          <span className="chart-title">📊 当前监控资产</span>
          <div className="asset-info">
            <span className="asset-name">{performanceData.assetName}</span>
            <Tag color="blue">{getLayerName(performanceData.layer)}</Tag>
            <span className="asset-type">{performanceData.assetType}</span>
          </div>
        </div>
      }
      bordered={false}
      className="performance-charts-card"
    >
      <Row gutter={[24, 24]}>
        {charts.map((chartOption, index) => (
          <Col xs={24} lg={12} key={index}>
            <div className="chart-wrapper">
              {chartOption && (
                <ReactECharts
                  option={chartOption}
                  style={{ height: '300px' }}
                  opts={{ renderer: 'canvas' }}
                />
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default PerformanceCharts
