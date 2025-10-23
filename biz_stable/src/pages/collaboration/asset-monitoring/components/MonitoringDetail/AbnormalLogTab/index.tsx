import React, { useState, useMemo } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Input, Select, DatePicker, Drawer, Typography, Empty, Tooltip } from 'antd'
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  LinkOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import type { AbnormalLogSummary, AbnormalLogDetail, AbnormalLogLevel } from '../../../types'
import ReactECharts from 'echarts-for-react'
import './index.css'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

interface AbnormalLogTabProps {
  systemId: string
  systemName: string
  summary: AbnormalLogSummary
  logs: AbnormalLogDetail[]
  onRefresh?: () => void
  onNavigateToCallChain?: (systemId: string) => void  // 跳转到调用链Tab
  onNavigateToTrace?: (traceId: string) => void       // 跳转到链路追踪Tab (NEW)
}

const AbnormalLogTab: React.FC<AbnormalLogTabProps> = ({
  systemId,
  systemName,
  summary,
  logs,
  onRefresh,
  onNavigateToCallChain,
  onNavigateToTrace
}) => {
  // 筛选状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<'all' | AbnormalLogLevel>('all')
  const [selectedAsset, setSelectedAsset] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 详情抽屉状态
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AbnormalLogDetail | null>(null)

  // 级别配置
  const levelConfig = {
    ERROR: { color: '#FF4D4F', icon: <CloseCircleOutlined />, label: '错误' },
    WARN: { color: '#FAAD14', icon: <ExclamationCircleOutlined />, label: '警告' }
  }

  // 分类配置
  const categoryConfig: Record<string, { label: string; color: string }> = {
    database: { label: '数据库', color: 'blue' },
    network: { label: '网络', color: 'purple' },
    application: { label: '应用', color: 'green' },
    system: { label: '系统', color: 'orange' },
    middleware: { label: '中间件', color: 'cyan' }
  }

  // 获取唯一资产列表
  const uniqueAssets = useMemo(() => {
    const assetMap = new Map<string, { id: string; name: string }>()
    logs.forEach(log => {
      if (!assetMap.has(log.assetId)) {
        assetMap.set(log.assetId, { id: log.assetId, name: log.assetName })
      }
    })
    return Array.from(assetMap.values())
  }, [logs])

  // 筛选日志
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // 关键词搜索
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase()
        const matchMessage = log.message.toLowerCase().includes(keyword)
        const matchAsset = log.assetName.toLowerCase().includes(keyword)
        const matchLogger = log.loggerName.toLowerCase().includes(keyword)
        if (!matchMessage && !matchAsset && !matchLogger) return false
      }

      // 级别筛选
      if (selectedLevel !== 'all' && log.level !== selectedLevel) return false

      // 资产筛选
      if (selectedAsset !== 'all' && log.assetId !== selectedAsset) return false

      // 分类筛选
      if (selectedCategory !== 'all' && log.category !== selectedCategory) return false

      return true
    })
  }, [logs, searchKeyword, selectedLevel, selectedAsset, selectedCategory])

  // 时段分布图表配置
  const trendChartOption = useMemo(() => {
    return {
      grid: { left: 50, right: 20, top: 30, bottom: 30 },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = dayjs(params[0].axisValue).format('MM-DD HH:mm')
          let result = `${time}<br/>`
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value}<br/>`
          })
          return result
        }
      },
      legend: {
        data: ['ERROR', 'WARN'],
        top: 0
      },
      xAxis: {
        type: 'category',
        data: summary.trendData.map(d => d.timestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('HH:mm')
        }
      },
      yAxis: {
        type: 'value',
        name: '日志数量'
      },
      series: [
        {
          name: 'ERROR',
          type: 'bar',
          stack: 'total',
          data: summary.trendData.map(d => d.errorCount),
          itemStyle: { color: '#FF4D4F' }
        },
        {
          name: 'WARN',
          type: 'bar',
          stack: 'total',
          data: summary.trendData.map(d => d.warningCount),
          itemStyle: { color: '#FAAD14' }
        }
      ]
    }
  }, [summary.trendData])

  // 表格列定义
  const columns: ColumnsType<AbnormalLogDetail> = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      align: 'center',
      render: (level: AbnormalLogLevel) => {
        const config = levelConfig[level]
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.label}
          </Tag>
        )
      }
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: '13px' }}>{dayjs(timestamp).format('MM-DD HH:mm:ss')}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>{dayjs(timestamp).fromNow()}</Text>
        </Space>
      )
    },
    {
      title: 'TraceID',
      dataIndex: 'traceId',
      key: 'traceId',
      width: 120,
      align: 'center',
      render: (traceId: string | undefined, record: AbnormalLogDetail) => {
        if (!traceId) {
          return <Text type="secondary">-</Text>
        }
        return (
          <Tooltip title={`点击查看链路追踪详情: ${traceId}`}>
            <Button
              type="link"
              size="small"
              style={{ padding: 0, fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation()
                if (onNavigateToTrace) {
                  onNavigateToTrace(traceId)
                }
              }}
            >
              {traceId.slice(0, 8)}...
            </Button>
          </Tooltip>
        )
      }
    },
    {
      title: '资产名称',
      dataIndex: 'assetName',
      key: 'assetName',
      width: 130,
      ellipsis: true,
      render: (text: string, record: AbnormalLogDetail) => (
        <Tooltip title={`${text} (${record.assetType})`}>
          <Text>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 90,
      align: 'center',
      render: (category: string) => {
        const config = categoryConfig[category]
        return <Tag color={config.color}>{config.label}</Tag>
      }
    },
    {
      title: '日志消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: { showTitle: false },
      render: (message: string, record: AbnormalLogDetail) => (
        <Tooltip title={message} placement="topLeft">
          <div>
            <Text>{message}</Text>
            {record.relatedSystemName && (
              <Tag
                icon={<LinkOutlined />}
                color="blue"
                style={{ marginLeft: 8, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (onNavigateToCallChain && record.relatedSystemId) {
                    onNavigateToCallChain(record.relatedSystemId)
                  }
                }}
              >
                {record.relatedSystemName}
              </Tag>
            )}
          </div>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: AbnormalLogDetail) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedLog(record)
            setDetailDrawerVisible(true)
          }}
        >
          详情
        </Button>
      )
    }
  ]

  // 处理刷新
  const handleRefresh = () => {
    onRefresh?.()
  }

  return (
    <div className="abnormal-log-tab-container">
      {/* 统计概览 */}
      <div className="log-summary-section">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card" size="small">
              <Statistic
                title="ERROR日志"
                value={summary.errorCount}
                suffix="条"
                valueStyle={{ color: '#FF4D4F', fontSize: '24px', fontWeight: 600 }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card" size="small">
              <Statistic
                title="WARN日志"
                value={summary.warningCount}
                suffix="条"
                valueStyle={{ color: '#FAAD14', fontSize: '24px', fontWeight: 600 }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="stat-card" size="small" title="时段分布（最近24小时）">
              <ReactECharts
                option={trendChartOption}
                style={{ height: 120 }}
              />
            </Card>
          </Col>
        </Row>

        {/* 调用链关联提示 */}
        {summary.relatedSystemsStats && summary.relatedSystemsStats.length > 0 && (
          <Card className="callchain-hint-card" size="small" style={{ marginTop: 16 }}>
            <div className="hint-content">
              <LinkOutlined style={{ fontSize: 18, color: '#1890ff', marginRight: 12 }} />
              <div className="hint-text">
                <Text strong>调用链关联分析</Text>
                <Text type="secondary" style={{ marginLeft: 12 }}>
                  当前异常日志涉及 {summary.relatedSystemsStats.length} 个相关系统
                </Text>
              </div>
              <Space>
                {summary.relatedSystemsStats.slice(0, 3).map(sys => (
                  <Tag
                    key={sys.systemId}
                    color="blue"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onNavigateToCallChain?.(sys.systemId)}
                  >
                    {sys.systemName} ({sys.logCount}条)
                  </Tag>
                ))}
                {summary.relatedSystemsStats.length > 3 && (
                  <Text type="secondary">等{summary.relatedSystemsStats.length}个系统</Text>
                )}
              </Space>
              <Button
                type="link"
                onClick={() => onNavigateToCallChain?.(systemId)}
              >
                查看调用链关系 →
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* 筛选工具栏 */}
      <Card className="filter-toolbar" size="small" style={{ marginTop: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索日志消息、资产名称..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 280 }}
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
          />

          <Select
            value={selectedLevel}
            onChange={setSelectedLevel}
            style={{ width: 120 }}
          >
            <Option value="all">全部级别</Option>
            <Option value="ERROR">ERROR</Option>
            <Option value="WARN">WARN</Option>
          </Select>

          <Select
            value={selectedAsset}
            onChange={setSelectedAsset}
            style={{ width: 160 }}
            showSearch
            optionFilterProp="children"
          >
            <Option value="all">全部资产</Option>
            {uniqueAssets.map(asset => (
              <Option key={asset.id} value={asset.id}>
                {asset.name}
              </Option>
            ))}
          </Select>

          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 120 }}
          >
            <Option value="all">全部分类</Option>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <Option key={key} value={key}>
                {config.label}
              </Option>
            ))}
          </Select>

          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>

          <Button icon={<DownloadOutlined />}>
            导出
          </Button>
        </Space>
      </Card>

      {/* 日志列表 */}
      <Card className="log-table-card" size="small" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          size="small"
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条异常日志`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无异常日志"
              />
            )
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 日志详情抽屉 */}
      <Drawer
        title="日志详情"
        placement="right"
        width={720}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedLog && (
          <div className="log-detail-content">
            {/* 基本信息 */}
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text type="secondary">日志级别</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag icon={levelConfig[selectedLog.level].icon} color={levelConfig[selectedLog.level].color}>
                      {levelConfig[selectedLog.level].label}
                    </Tag>
                  </div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">分类</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={categoryConfig[selectedLog.category].color}>
                      {categoryConfig[selectedLog.category].label}
                    </Tag>
                  </div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">时间</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>{dayjs(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">资产名称</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>{selectedLog.assetName}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">资产类型</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>{selectedLog.assetType}</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 日志消息 */}
            <Card title="日志消息" size="small" style={{ marginBottom: 16 }}>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {selectedLog.message}
              </pre>
            </Card>

            {/* Logger名称 */}
            <Card title="Logger" size="small" style={{ marginBottom: 16 }}>
              <Text code>{selectedLog.loggerName}</Text>
            </Card>

            {/* 堆栈跟踪 */}
            {selectedLog.stackTrace && (
              <Card title="堆栈跟踪" size="small" style={{ marginBottom: 16 }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  background: '#f5f5f5',
                  padding: 12,
                  borderRadius: 4,
                  fontSize: 12
                }}>
                  {selectedLog.stackTrace}
                </pre>
              </Card>
            )}

            {/* 标签 */}
            {selectedLog.tags && selectedLog.tags.length > 0 && (
              <Card title="标签" size="small" style={{ marginBottom: 16 }}>
                <Space wrap>
                  {selectedLog.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </Card>
            )}

            {/* 关联信息 */}
            <Card title="关联信息" size="small">
              <Row gutter={[16, 16]}>
                {selectedLog.traceId && (
                  <Col span={24}>
                    <Text type="secondary">链路追踪ID</Text>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Text code copyable>{selectedLog.traceId}</Text>
                      {onNavigateToTrace && (
                        <Button
                          type="link"
                          size="small"
                          icon={<LinkOutlined />}
                          onClick={() => {
                            onNavigateToTrace(selectedLog.traceId!)
                            setDetailDrawerVisible(false)
                          }}
                        >
                          查看链路追踪 →
                        </Button>
                      )}
                    </div>
                  </Col>
                )}
                {selectedLog.relatedSystemName && (
                  <Col span={24}>
                    <Text type="secondary">关联系统</Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag
                        icon={<LinkOutlined />}
                        color="blue"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (onNavigateToCallChain && selectedLog.relatedSystemId) {
                            onNavigateToCallChain(selectedLog.relatedSystemId)
                            setDetailDrawerVisible(false)
                          }
                        }}
                      >
                        {selectedLog.relatedSystemName}
                      </Tag>
                      <Button type="link" size="small">
                        查看调用链 →
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default AbnormalLogTab
