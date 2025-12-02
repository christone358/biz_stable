import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store'
import { Alert, Button, Card, Collapse, Typography } from 'antd'
import { ClusterOutlined, DatabaseOutlined, DesktopOutlined, HddOutlined } from '@ant-design/icons'
import type { CloudHost } from '../../../../types/cloud-host'
import styles from './Detail.module.less'

const { Title } = Typography

type VulnSegment = { key: string; label: string; value: number; color: string; displayValue?: number }

const CONTROL_MEASURES = [
  { key: 'networkIsolation', label: '网络隔离', description: '通过安全组 / ACL 管控进出流量' },
  { key: 'portBlock', label: '端口封禁', description: '关闭高危端口，限制横向传播' },
  { key: 'trafficThrottle', label: '流量限速', description: '限制带宽，降低攻击面' },
  { key: 'edrQuarantine', label: 'EDR 隔离', description: '终端进入隔离区，仅允许运维' },
  { key: 'vpcFirewall', label: '云防火墙策略', description: '注入特定 VPC/ACL 规则' },
  { key: 'credentialFreeze', label: '凭据冻结', description: '冻结访问密钥/账号' },
  { key: 'snapshotRollback', label: '快照回滚', description: '回退至最新安全快照' }
]

const formatDateTime = (value?: string) => (value ? value.slice(0, 19).replace('T', ' ') : '-')
const formatDuration = (start?: string) => {
  if (!start) return '-'
  const diffMs = Date.now() - new Date(start).getTime()
  if (diffMs <= 0) return '0分钟'
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时`
  const days = Math.floor(hours / 24)
  return `${days} 天`
}

const CloudHostDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = useSelector<RootState, CloudHost | undefined>((s) => s.cloudHosts.items.find(h => h.id === id))

  if (!item) {
    return <Alert type="error" message="未找到云主机" showIcon />
  }

  const topAlerts: React.ReactNode[] = []
  if (item.blocked) topAlerts.push(<Alert key="blk" type="error" message={`已触发安全管控：${item.blockedReason ?? ''}`} showIcon />)
  if (!item.edrInstalled) topAlerts.push(<Alert key="noedr" type="warning" message="EDR 未安装" showIcon />)

  const blockedDescription = item.blocked
    ? `管控开始 ${formatDateTime(item.blockedAt)} · 持续 ${formatDuration(item.blockedAt)}`
    : '未触发安全管控'

  const protectionDescription = item.edrInstalled
    ? `最近同步 ${formatDateTime(item.dataSource.lastSyncTime)} · 病毒库 ${item.edrVirusDbVersion ?? '未知'}`
    : '未纳入防护体系'

  const summaryStats = [
    { key: 'alerts', label: '未处理告警', value: item.pendingAlerts, desc: '业务告警统一入池', tone: item.pendingAlerts ? 'danger' : 'good' },
    { key: 'vuln', label: '脆弱性', value: item.vulnerabilities, desc: '来自资产监测的脆弱性', tone: item.vulnerabilities ? 'warn' : 'good' },
    { key: 'block', label: '安全管控', value: item.blocked ? '已管控' : '未管控', desc: blockedDescription, tone: item.blocked ? 'danger' : 'good' },
    { key: 'coverage', label: '安全防护', value: item.edrInstalled ? (item.edrOnline ? 'EDR在线' : 'EDR未运行') : '未安装', desc: protectionDescription, tone: item.edrInstalled && item.edrOnline ? 'good' : item.edrInstalled ? 'warn' : 'danger' }
  ]

  const identityRows = [
    [
      { label: '主机名称', value: item.hostName },
      { label: 'IP地址', value: item.ipAddress }
    ],
    [
      { label: '类型', value: item.type === 'TRUSTED_CREATION' ? '信创' : '非信创' },
      { label: '来源', value: item.vendor ?? item.dataSource.source }
    ]
  ]

  const admissionRows = [
    [
      { label: '准入状态', value: item.admissionStatus === 'ALLOWED' ? '允许' : item.admissionStatus === 'DENIED' ? '拒绝' : '受限' },
      { label: '最近核验', value: formatDateTime(item.dataSource.lastSyncTime) }
    ],
    [
      {
        label: '准入说明',
        value: item.admissionStatus === 'ALLOWED' ? '业务网络已授权' : item.admissionStatus === 'DENIED' ? '需解除限制' : '待人工核验'
      },
      { label: '准入来源', value: item.dataSource.source === 'CLOUD_PLATFORM' ? '云管同步' : '人工登记' }
    ]
  ]

  const specMetrics = [
    { key: 'cpu', label: 'CPU', value: `${item.cpu} 核`, icon: <ClusterOutlined /> },
    { key: 'memory', label: '内存', value: `${item.memory} GB`, icon: <DatabaseOutlined /> },
    { key: 'disk', label: '磁盘', value: `${item.disk} GB`, icon: <HddOutlined /> },
    { key: 'os', label: '操作系统', value: `${item.osType} ${item.osVersion ?? ''}`.trim(), icon: <DesktopOutlined /> }
  ]

  const businessHighlights = [
    { label: '一级系统', value: item.businessBlock },
    { label: '二级系统', value: item.businessSystem }
  ]

  const responsibilitySummary = [
    { label: '责任人', value: item.systemOwner ?? '未设置' },
    { label: '责任单位', value: item.department },
    { label: '申请人', value: item.requester ?? '—' },
    { label: '交付时间', value: item.deliveredAt ? formatDateTime(item.deliveredAt) : '—' }
  ]

  const toRows = (fields: { label: React.ReactNode; value: React.ReactNode }[], size = 2) => {
    const rows: { label: React.ReactNode; value: React.ReactNode }[][] = []
    for (let i = 0; i < fields.length; i += size) rows.push(fields.slice(i, i + size))
    return rows
  }

  const businessRows = toRows(businessHighlights)
  const responsibilitySummaryRows = toRows(responsibilitySummary)

  const activityGroups = [
    {
      key: 'provision',
      label: '主机申请',
      events: [
        { time: item.requestedAt ? formatDateTime(item.requestedAt) : '—', content: `${item.requester ?? '责任人'} 提交云主机申请` },
        { time: item.deliveredAt ? formatDateTime(item.deliveredAt) : '—', content: '审批通过，完成交付并纳管' }
      ]
    },
    {
      key: 'security',
      label: '策略与安全',
      events: [
        item.blocked
          ? { time: item.blockedAt ? formatDateTime(item.blockedAt) : '—', content: '触发安全管控措施' }
          : { time: formatDateTime(item.dataSource.lastSyncTime), content: '未触发安全管控，持续监测' },
        { time: formatDateTime(item.dataSource.lastSyncTime), content: '安全策略同步 / 准入校验完成' }
      ]
    }
  ]

  const activityEntries = activityGroups.flatMap(group =>
    group.events.map((event, index) => ({
      key: `${group.key}-${index}`,
      title: event.content,
      time: event.time,
      detail: `${group.label} · ${event.content}。当前状态：${item.status === 'RUNNING' ? '运行中' : '已停止'}。`
    }))
  )

  const activityPanels = activityEntries.map(entry => ({
    key: entry.key,
    label: (
      <div className={styles.activityHeader}>
        <strong>{entry.title}</strong>
        <span>{entry.time}</span>
      </div>
    ),
    children: <p className={styles.activityDetail}>{entry.detail}</p>
  }))

  const hostSeed = Number(item.id.replace(/\D/g, '')) || 1
  const controlMeasures = item.blocked
    ? Array.from({ length: Math.min(3, 1 + (hostSeed % 3)) }, (_, idx) => CONTROL_MEASURES[(hostSeed + idx * 2) % CONTROL_MEASURES.length])
    : []

  const hourMarkers = ['-24h', '-20h', '-16h', '-12h', '-8h', '-4h']
  const alertTrendPoints = hourMarkers.map((label, index) => {
    const base = ((hostSeed + index * 3) % 6) + 1
    return {
      label,
      high: base,
      medium: base + (index % 2 === 0 ? 2 : 1),
      low: base + 2
    }
  })
  const alertTotals = alertTrendPoints.reduce((tot, point) => ({
    high: tot.high + point.high,
    medium: tot.medium + point.medium,
    low: tot.low + point.low
  }), { high: 0, medium: 0, low: 0 })

  const hasVulnerability = item.vulnerabilities > 0
  let systemVuln = hasVulnerability ? Math.max(0, Math.round(item.vulnerabilities * 0.45)) : 0
  let appVuln = hasVulnerability ? Math.max(0, Math.round(item.vulnerabilities * 0.35)) : 0
  let policyVuln = hasVulnerability ? Math.max(0, item.vulnerabilities - systemVuln - appVuln) : 0
  if (hasVulnerability) {
    const diff = item.vulnerabilities - (systemVuln + appVuln + policyVuln)
    policyVuln += diff
  }
  const vulnSegments: VulnSegment[] = hasVulnerability
    ? [
        { key: 'system', label: '系统配置', value: systemVuln, color: '#5c7bff' },
        { key: 'component', label: '应用组件', value: appVuln, color: '#62d2ff' },
        { key: 'policy', label: '基线策略', value: policyVuln, color: '#f5b56b' }
      ].filter(segment => segment.value > 0)
    : [{ key: 'clean', label: '暂无脆弱性', value: 1, color: '#dbe2ff', displayValue: 0 }]
  const vulnTotalValue = vulnSegments.reduce((sum, segment) => sum + segment.value, 0)
  const vulnPieStops: string[] = []
  let cursor = 0
  vulnSegments.forEach(segment => {
    const start = (cursor / vulnTotalValue) * 100
    cursor += segment.value
    const end = (cursor / vulnTotalValue) * 100
    vulnPieStops.push(`${segment.color} ${start}% ${end}%`)
  })
  const vulnPieStyle = { background: `conic-gradient(${vulnPieStops.join(', ')})` }

  const severityLoop = ['high', 'medium', 'low'] as const
  const severityCounts: Record<typeof severityLoop[number], number> = {
    high: 0,
    medium: 0,
    low: 0
  }
  if (hasVulnerability) {
    for (let i = 0; i < item.vulnerabilities; i++) {
      const bucket = severityLoop[(hostSeed + i) % severityLoop.length]
      severityCounts[bucket] += 1
    }
  }
  const vulnSeverityStats = severityLoop.map(level => ({
    key: level,
    label: level === 'high' ? '高危' : level === 'medium' ? '中危' : '低危',
    value: severityCounts[level],
    accent: level === 'high' ? '#ef5b77' : level === 'medium' ? '#f6a854' : '#35a3ff'
  }))

  const handleViewVulnerabilityList = () => {
    const params = new URLSearchParams({
      view: 'management',
      hostId: item.id,
      hostName: item.hostName,
      hostIp: item.ipAddress
    })
    navigate(`/management/vulnerability?${params.toString()}`)
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.detailPage}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarActions}>
            <div className={styles.ghostButton}><Button onClick={() => navigate('/management/terminal-assets/cloud-hosts')}>返回列表</Button></div>
            <div className={styles.ghostButton}><Button>导出</Button></div>
          </div>
          <div className={styles.toolbarActions}>
            <div className={styles.ghostButton}><Button>同步</Button></div>
            <div className={styles.primaryGlow}><Button type="primary">编辑</Button></div>
          </div>
        </div>

        {topAlerts.length > 0 && <div className={styles.alertStack}>{topAlerts}</div>}

        <section className={styles.hero}>
          <div className={styles.heroPrimary}>
            <Title level={3} className={styles.heroTitle}>
              {item.hostName}
              <span className={styles.statusBadge}>
                {item.status === 'RUNNING' ? '运行中' : item.status === 'STOPPED' ? '未运行' : '未知'}
              </span>
            </Title>
            <div className={styles.heroTags}>
              <span>{item.type === 'TRUSTED_CREATION' ? '信创' : '非信创'}</span>
              <span>{item.vendor ?? item.dataSource.source}</span>
              {item.businessSystem && <span>{item.businessSystem}</span>}
            </div>
            <div className={styles.heroMetaLight}>
              <span>最后更新：{formatDateTime(item.dataSource.lastSyncTime)}</span>
            </div>
          </div>
          <div className={styles.heroStats}>
            {summaryStats.map(stat => (
              <div key={stat.key} className={styles.statCardSmall}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={`${styles.statValueSmall} ${styles[stat.tone]}`}>{stat.value}</div>
                <div className={styles.statDesc}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.mainPanel}>
          <div className={styles.mainContent}>
            <div className={`${styles.infoColumn} ${styles.columnWithDivider}`}>
              <Card className={styles.groupCard}>
                <div className={styles.groupTitle}>基本信息</div>
                <div className={styles.infoPairs}>
                  {identityRows.map((row, rowIndex) => (
                    <div key={`identity-row-${rowIndex}`} className={styles.infoPairRow}>
                      {row.map(field => (
                        <div key={field.label} className={styles.infoField}>
                          <span>{field.label}</span>
                          <strong>{field.value}</strong>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className={styles.clusterDivider} />
                <div className={styles.groupTitle}>规格信息</div>
                <div className={styles.specCluster}>
                  {specMetrics.map(metric => (
                    <div key={metric.key} className={styles.specCard}>
                      <div className={styles.specIconBadge}>{metric.icon}</div>
                      <div>
                        <div className={styles.specLabel}>{metric.label}</div>
                        <div className={styles.specValue}>{metric.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.clusterDivider} />
                <div className={styles.groupTitle}>准入信息</div>
                <div className={styles.infoPairs}>
                  {admissionRows.map((row, rowIndex) => (
                    <div key={`admission-row-${rowIndex}`} className={styles.infoPairRow}>
                      {row.map(field => (
                        <div key={field.label} className={styles.infoField}>
                          <span>{field.label}</span>
                          <strong>{field.value}</strong>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className={`${styles.securityColumn} ${styles.columnWithDivider}`}>
              <Card className={styles.securityStatusCard} title={<div className={styles.securityTitle}><span className={styles.securityIcon}>🛡️</span>安全防护与状态</div>}>
                <div className={styles.securitySection}>
                  <div className={styles.sectionHeadline}>安全防护</div>
                  <div className={styles.guardGrid}>
                    <div className={`${styles.guardCard} ${item.edrInstalled ? styles.guardCardSafe : styles.guardCardAlert}`}>
                      <div className={styles.guardCardHeader}>
                        <div>
                          <div className={styles.guardLabel}>EDR代理</div>
                          <div className={styles.guardSub}>{item.edrInstalled ? `客户端版本：${item.edrAgentVersion ?? '未知'}` : '未纳入EDR防护'}</div>
                        </div>
                        <span className={`${styles.guardStatus} ${item.edrInstalled ? (item.edrOnline ? styles.statusOnline : styles.statusOffline) : styles.statusOffline}`}>
                          {item.edrInstalled ? (item.edrOnline ? '在线' : '离线') : '未安装'}
                        </span>
                      </div>
                      {item.edrInstalled ? (
                        <ul>
                          <li><span>病毒库</span><strong>{item.edrVirusDbVersion ?? '未知'}</strong></li>
                          <li><span>最近同步</span><strong>{formatDateTime(item.dataSource.lastSyncTime)}</strong></li>
                        </ul>
                      ) : (
                        <p className={styles.guardAlert}>未安装EDR防护措施，建议尽快纳入</p>
                      )}
                    </div>
                    <div className={`${styles.guardCard} ${item.blocked ? styles.guardCardAlert : styles.guardCardSafe}`}>
                      <div className={styles.guardCardHeader}>
                        <div>
                          <div className={styles.guardLabel}>安全管控</div>
                          <div className={styles.guardSub}>{item.blocked ? `管控原因：${item.blockedReason ?? '未知'}` : '当前未触发安全管控'}</div>
                        </div>
                        <span className={`${styles.guardStatus} ${item.blocked ? styles.statusBlocked : styles.statusOnline}`}>
                          {item.blocked ? '已管控' : '正常'}
                        </span>
                      </div>
                      {item.blocked ? (
                        <>
                          <div className={styles.stateMeta}>管控生效 {formatDateTime(item.blockedAt)}</div>
                          <div className={styles.controlMeasures}>
                            {controlMeasures.map(measure => (
                              <div key={measure.key} className={styles.measureCard}>
                                <strong>{measure.label}</strong>
                                <span>{measure.description}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className={styles.guardSafeMessage}>未采取安全管控措施，保持绿色通行</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.securitySection}>
                  <div className={styles.sectionHeadline}>安全风险</div>
                  <div className={styles.trendPanel}>
                    <div className={styles.sectionLabel}>24小时告警趋势</div>
                    <div className={styles.alertChart}>
                      {alertTrendPoints.map(point => {
                        const total = point.high + point.medium + point.low
                        const highPercent = total ? (point.high / total) * 100 : 0
                        const mediumPercent = total ? (point.medium / total) * 100 : 0
                        const gradientStops = total
                          ? `linear-gradient(180deg, #f63a55 0% ${highPercent}%, #ff9540 ${highPercent}% ${highPercent + mediumPercent}%, #35b9f3 ${highPercent + mediumPercent}% 100%)`
                          : 'linear-gradient(180deg, #dfe5ff, #c9d4ff)'
                        return (
                          <div key={point.label} className={styles.alertBar}>
                            <div
                              className={styles.alertColumn}
                              style={{ height: `${Math.max(total, 1) * 6}px`, background: gradientStops }}
                            />
                            <span className={styles.alertLabel}>{point.label}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className={styles.alertStatsRow}>
                      <div className={`${styles.alertSummary} ${styles.alertSummaryHigh}`}>
                        <span>高危</span>
                        <strong>{alertTotals.high}</strong>
                      </div>
                      <div className={`${styles.alertSummary} ${styles.alertSummaryMedium}`}>
                        <span>中危</span>
                        <strong>{alertTotals.medium}</strong>
                      </div>
                      <div className={`${styles.alertSummary} ${styles.alertSummaryLow}`}>
                        <span>低危</span>
                        <strong>{alertTotals.low}</strong>
                      </div>
                    </div>
                  </div>
                  <div className={styles.vulnPanel}>
                    <div className={styles.vulnPanelHeader}>
                      <div>
                        <div className={styles.sectionLabel}>脆弱性分布</div>
                        <div className={styles.panelTitle}>类型 · 未修复统计</div>
                      </div>
                      <Button type="link" size="small" onClick={handleViewVulnerabilityList}>查看详情</Button>
                    </div>
                    <div className={styles.vulnContentRow}>
                      <div className={styles.pieWrapper}>
                        <div className={styles.pieChart} style={vulnPieStyle}>
                          <div className={styles.pieInner}>
                            <strong>{hasVulnerability ? item.vulnerabilities : 0}</strong>
                            <span>条</span>
                          </div>
                        </div>
                        <ul className={styles.pieLegend}>
                          {vulnSegments.map(segment => (
                            <li key={segment.key}>
                              <i style={{ background: segment.color }} />
                              <span>{segment.label}</span>
                              <strong>{segment.displayValue ?? segment.value}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.severityBoard}>
                        <div className={styles.severityTitle}>未修复脆弱性</div>
                        <div className={styles.severityTotal}>
                          <strong>{item.vulnerabilities}</strong>
                          <span>条未修复</span>
                        </div>
                        <ul className={styles.severityList}>
                          {vulnSeverityStats.map(stat => (
                            <li key={stat.key} className={`${styles.severityItem} ${styles[`severity${stat.key}`]}`}>
                              <span>{stat.label}</span>
                              <div className={styles.severityValue}>
                                <strong>{stat.value}</strong>
                                <small>条</small>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className={styles.insightColumn}>
              <Card className={`${styles.insightCard} ${styles.metaCard}`}>
                <div className={styles.metaSection}>
                  <div className={styles.metaTitle}>关联业务</div>
                  <div className={styles.infoPairs}>
                    {businessRows.map((row, rowIndex) => (
                      <div key={`biz-summary-${rowIndex}`} className={styles.infoPairRow}>
                        {row.map(field => (
                          <div key={`biz-field-${field.label}`} className={styles.infoField}>
                            <span>{field.label}</span>
                            <strong>
                              {field.label === '二级系统' && item.businessSystem
                                ? (
                                    <Button type="link" size="small" onClick={() => navigate(`/management/business/${item.businessSystemId ?? ''}`)}>
                                      {field.value}
                                    </Button>
                                  )
                                : field.value}
                            </strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.metaSection}>
                  <div className={styles.metaTitle}>责任主体</div>
                  <div className={styles.infoPairs}>
                    {responsibilitySummaryRows.map((row, rowIndex) => (
                      <div key={`resp-summary-${rowIndex}`} className={styles.infoPairRow}>
                        {row.map(field => (
                          <div key={`resp-field-${field.label}`} className={styles.infoField}>
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.metaSection}>
                  <div className={styles.metaTitle}>动态信息</div>
                  <Collapse items={activityPanels} bordered={false} defaultActiveKey={activityPanels.map(panel => panel.key)} className={styles.activityCollapse} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CloudHostDetail
