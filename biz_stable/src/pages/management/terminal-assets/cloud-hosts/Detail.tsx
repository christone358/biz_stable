import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store'
import { Alert, Button, Card, Checkbox, Drawer, Modal, Typography } from 'antd'
import { ClusterOutlined, DatabaseOutlined, DesktopOutlined, HddOutlined, StopOutlined, ThunderboltOutlined, DisconnectOutlined, SafetyCertificateOutlined, SecurityScanOutlined, LockOutlined, RollbackOutlined } from '@ant-design/icons'
import type { CloudHost, ProtectionStatus } from '../../../../types/cloud-host'
import styles from './Detail.module.less'

const { Title } = Typography

type VulnSegment = { key: string; label: string; value: number; color: string; displayValue?: number }
type FieldGroupKey = 'basic' | 'specs' | 'owner' | 'deployment' | 'business'
type InfoFieldDef = { key: string; label: string; render: (host: CloudHost) => React.ReactNode }
type SpecFieldDef = { key: string; label: string; icon: React.ReactNode; render: (host: CloudHost) => React.ReactNode }

const CONTROL_MEASURES = [
  { key: 'networkIsolation', label: '网络隔离', description: '通过安全组 / ACL 管控进出流量' },
  { key: 'portBlock', label: '端口封禁', description: '关闭高危端口，限制横向传播' },
  { key: 'trafficThrottle', label: '流量限速', description: '限制带宽，降低攻击面' },
  { key: 'edrQuarantine', label: 'EDR 隔离', description: '终端进入隔离区，仅允许运维' },
  { key: 'vpcFirewall', label: '云防火墙策略', description: '注入特定 VPC/ACL 规则' },
  { key: 'credentialFreeze', label: '凭据冻结', description: '冻结访问密钥/账号' },
  { key: 'snapshotRollback', label: '快照回滚', description: '回退至最新安全快照' }
]

const MEASURE_ICONS: Record<string, React.ReactNode> = {
  networkIsolation: <DisconnectOutlined />,
  portBlock: <StopOutlined />,
  trafficThrottle: <ThunderboltOutlined />,
  edrQuarantine: <SecurityScanOutlined />,
  vpcFirewall: <SafetyCertificateOutlined />,
  credentialFreeze: <LockOutlined />,
  snapshotRollback: <RollbackOutlined />
}

const FIELD_CONFIG_STORAGE_KEY = 'cloudHostFieldConfig'

const formatDateTime = (value?: string) => (value ? value.slice(0, 19).replace('T', ' ') : '-')
const formatDate = (value?: string) => (value ? value.slice(0, 10) : '—')
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

const formatList = (values?: string[]) => (values && values.length ? values.join(' / ') : '—')
const formatTrustedCategory = (value?: CloudHost['trustedCategory']) => {
  if (value === 'TRUSTED_CREATION') return '信创'
  if (value === 'DOMESTIC') return '国产'
  return '标准'
}

const formatProtectionStatus = (status: ProtectionStatus) => {
  if (status === 'PROTECTED') return '已纳入安全防护'
  if (status === 'UNASSIGNED') return '未分配安全域'
  return '未纳入防护'
}

const CloudHostDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = useSelector<RootState, CloudHost | undefined>((s) => s.cloudHosts.items.find(h => h.id === id))
  const [configVisible, setConfigVisible] = useState(false)
  const [measureDetail, setMeasureDetail] = useState<{ key: string; label: string; description: string; start?: string; end?: string } | null>(null)

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

  const basicFields = useMemo<InfoFieldDef[]>(() => ([
    { key: 'hostName', label: '主机名称', render: host => host.hostName },
    { key: 'ipAddresses', label: 'IP地址', render: host => (host.ipAddresses ?? [host.ipAddress]).join(' / ') },
    { key: 'macAddresses', label: 'MAC地址', render: host => formatList(host.macAddresses) },
    { key: 'serialNumber', label: '序列号', render: host => host.serialNumber ?? '—' },
    { key: 'vendor', label: '供应商', render: host => host.vendor ?? host.dataSource.source },
    { key: 'manufactureDate', label: '出厂时间', render: host => formatDate(host.manufactureDate) },
    { key: 'trustedCategory', label: '信创/国产', render: host => formatTrustedCategory(host.trustedCategory) },
    { key: 'description', label: '描述', render: host => host.description ?? '—' },
    { key: 'source', label: '信息来源', render: host => host.dataSource.provider ?? host.platformDetail ?? (host.dataSource.source === 'MANUAL' ? '人工维护' : '云管平台') }
  ]), [])

  const ownerFields = useMemo<InfoFieldDef[]>(() => ([
    { key: 'ownerName', label: '责任人', render: host => host.owner?.name ?? host.systemOwner ?? '未设置' },
    { key: 'ownerPhone', label: '联系电话', render: host => host.owner?.phone ?? '—' },
    { key: 'ownerEmail', label: '邮箱', render: host => host.owner?.email ?? '—' },
    { key: 'ownerOrg', label: '所属单位', render: host => host.owner?.organization ?? host.department }
  ]), [])

  const deploymentFields = useMemo<InfoFieldDef[]>(() => ([
    { key: 'networkSegment', label: '网络/网段', render: host => host.networkSegment ?? '—' },
    { key: 'datacenter', label: '所属机房', render: host => host.datacenter ?? host.region ?? '—' },
    { key: 'nodeRoom', label: '机柜/节点', render: host => host.nodeRoom ?? '—' },
    { key: 'platformDetail', label: '云平台详情', render: host => host.platformDetail ?? host.vendor ?? '—' }
  ]), [])

  const businessFields = useMemo<InfoFieldDef[]>(() => ([
    { key: 'businessBlock', label: '一级系统', render: host => host.businessBlock },
    {
      key: 'businessSystem',
      label: '二级系统',
      render: host => (host.businessSystem
        ? <Link to={`/management/business/${host.businessSystemId ?? ''}`}>{host.businessSystem}</Link>
        : '—')
    },
    { key: 'businessAssetName', label: '关联业务资产', render: host => host.businessAssetName ?? '—' }
  ]), [])

  const specFields = useMemo<SpecFieldDef[]>(() => ([
    { key: 'cpu', label: 'CPU', icon: <ClusterOutlined />, render: host => `${host.cpuModel ?? 'CPU'} · ${host.cpu} 核` },
    { key: 'memory', label: '内存', icon: <DatabaseOutlined />, render: host => `${host.memory} GB${host.memoryType ? ` · ${host.memoryType}` : ''}` },
    { key: 'storage', label: '存储', icon: <HddOutlined />, render: host => host.storage?.map(d => `${d.type} ${d.sizeGB}GB`).join(' / ') ?? `${host.disk} GB` },
    { key: 'os', label: '操作系统', icon: <DesktopOutlined />, render: host => `${host.osType} ${host.osVersion ?? ''}`.trim() },
    { key: 'gpu', label: 'GPU', icon: <ClusterOutlined />, render: host => (host.gpu ? `${host.gpu.model} × ${host.gpu.count}` : '—') }
  ]), [])

  const defaultFieldConfig = useMemo<Record<FieldGroupKey, string[]>>(() => ({
    basic: basicFields.map(field => field.key),
    specs: specFields.map(field => field.key),
    owner: ownerFields.map(field => field.key),
    deployment: deploymentFields.map(field => field.key),
    business: businessFields.map(field => field.key)
  }), [basicFields, specFields, ownerFields, deploymentFields, businessFields])

  const [fieldConfig, setFieldConfig] = useState<Record<FieldGroupKey, string[]>>(() => {
    if (typeof window === 'undefined') return defaultFieldConfig
    try {
      const stored = window.localStorage.getItem(FIELD_CONFIG_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...defaultFieldConfig, ...parsed }
      }
    } catch {
      // ignore parse errors
    }
    return defaultFieldConfig
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(FIELD_CONFIG_STORAGE_KEY, JSON.stringify(fieldConfig))
  }, [fieldConfig])

  const buildInfoRows = (fields: InfoFieldDef[], group: FieldGroupKey, columns = 3) => {
    const visibleKeys = (fieldConfig[group] ?? []).filter(key => fields.some(field => field.key === key))
    const visibleFields = fields.filter(field => visibleKeys.includes(field.key))
    const rows: { label: React.ReactNode; value: React.ReactNode }[][] = []
    for (let i = 0; i < visibleFields.length; i += columns) {
      rows.push(visibleFields.slice(i, i + columns).map(field => ({
        label: field.label,
        value: field.render(item)
      })))
    }
    return rows
  }

  const basicRows = buildInfoRows(basicFields, 'basic')
  const ownerRows = buildInfoRows(ownerFields, 'owner')
  const deploymentRows = buildInfoRows(deploymentFields, 'deployment')
  const businessRows = buildInfoRows(businessFields, 'business')
  const specVisibleKeys = (fieldConfig.specs ?? []).filter(key => specFields.some(field => field.key === key))
  const visibleSpecFields = specFields.filter(field => specVisibleKeys.includes(field.key))

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

  const handleViewAlertList = () => {
    const params = new URLSearchParams({
      hostId: item.id,
      hostIp: item.ipAddress,
      hostName: item.hostName
    })
    navigate(`/management/alert-monitoring?${params.toString()}`)
  }

  const handleFieldConfigChange = (group: FieldGroupKey, values: string[]) => {
    setFieldConfig(prev => ({ ...prev, [group]: values }))
  }

  const configGroups: { key: FieldGroupKey; title: string; fields: (InfoFieldDef | SpecFieldDef)[] }[] = [
    { key: 'basic', title: '基础信息', fields: basicFields },
    { key: 'specs', title: '规格信息', fields: specFields },
    { key: 'owner', title: '责任主体', fields: ownerFields },
    { key: 'deployment', title: '部署位置', fields: deploymentFields },
    { key: 'business', title: '业务关联', fields: businessFields }
  ]

  const dataSourceLabel = item.dataSource.provider ?? item.platformDetail ?? (item.dataSource.source === 'MANUAL' ? '人工维护' : '云管平台')

  return (
    <div className={styles.pageBackground}>
      <div className={styles.detailPage}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarActions}>
            <Button type="link" onClick={() => navigate('/management/terminal-assets/cloud-hosts')}>← 返回云主机列表</Button>
          </div>
          <div className={styles.toolbarActions}>
            <div className={styles.ghostButton}><Button onClick={() => setConfigVisible(true)}>字段配置</Button></div>
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
              <span>{formatTrustedCategory(item.trustedCategory)}</span>
              <span>{item.vendor ?? item.dataSource.source}</span>
              {item.businessSystem && <span>{item.businessSystem}</span>}
            </div>
            <div className={styles.heroMetaLight}>
              <span>来源：{dataSourceLabel}</span>
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
              {basicRows.length > 0 && (
                <Card className={styles.groupCard}>
                  <div className={styles.groupTitle}>基础信息</div>
                  <div className={styles.infoPairs}>
                    {basicRows.map((row, rowIndex) => (
                      <div key={`basic-row-${rowIndex}`} className={styles.infoPairRow}>
                        {row.map(field => (
                          <div key={`basic-field-${field.label}`} className={styles.infoField}>
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {visibleSpecFields.length > 0 && (
                <Card className={styles.groupCard}>
                  <div className={styles.groupTitle}>规格信息</div>
                  <div className={styles.specCluster}>
                    {visibleSpecFields.map(metric => (
                      <div key={metric.key} className={styles.specCard}>
                        <div className={styles.specIconBadge}>{metric.icon}</div>
                        <div>
                          <div className={styles.specLabel}>{metric.label}</div>
                          <div className={styles.specValue}>{metric.render(item)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {ownerRows.length > 0 && (
                <Card className={styles.groupCard}>
                  <div className={styles.groupTitle}>责任主体</div>
                  <div className={styles.infoPairs}>
                    {ownerRows.map((row, rowIndex) => (
                      <div key={`owner-row-${rowIndex}`} className={styles.infoPairRow}>
                        {row.map(field => (
                          <div key={`owner-field-${field.label}`} className={styles.infoField}>
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {deploymentRows.length > 0 && (
                <Card className={styles.groupCard}>
                  <div className={styles.groupTitle}>部署位置</div>
                  <div className={styles.infoPairs}>
                    {deploymentRows.map((row, rowIndex) => (
                      <div key={`deploy-row-${rowIndex}`} className={styles.infoPairRow}>
                        {row.map(field => (
                          <div key={`deploy-field-${field.label}`} className={styles.infoField}>
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {businessRows.length > 0 && (
                <Card className={styles.groupCard}>
                  <div className={styles.groupTitle}>业务关联</div>
                  <div className={styles.infoPairs}>
                    {businessRows.map((row, rowIndex) => (
                      <div key={`biz-summary-${rowIndex}`} className={styles.infoPairRow}>
                        {row.map(field => (
                          <div key={`biz-field-${field.label}`} className={styles.infoField}>
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className={styles.groupCard}>
                <div className={styles.groupTitle}>准入认证</div>
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
                <div className={styles.guardGrid}>
                  <div className={`${styles.guardCard} ${item.edrInstalled ? styles.guardCardSafe : styles.guardCardAlert}`}>
                    <div className={styles.guardCardHeader}>
                      <div>
                        <div className={styles.guardLabel}>EDR代理</div>
                        <div className={styles.guardSub}>{item.edrInstalled ? `品牌：${item.edrBrand ?? '—'}` : '未纳入EDR防护'}</div>
                      </div>
                      <span className={`${styles.guardStatus} ${item.edrInstalled ? (item.edrOnline ? styles.statusOnline : styles.statusOffline) : styles.statusOffline}`}>
                        {item.edrInstalled ? (item.edrOnline ? '在线' : '离线') : '未安装'}
                      </span>
                    </div>
                    {item.edrInstalled ? (
                      <ul>
                        <li><span>代理版本</span><strong>{item.edrAgentVersion ?? '未知'}</strong></li>
                        <li><span>病毒库</span><strong>{item.edrVirusDbVersion ?? '未知'}</strong></li>
                        <li><span>最近心跳</span><strong>{item.edrLastHeartbeat ? formatDateTime(item.edrLastHeartbeat) : '—'}</strong></li>
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
                        {/* 管控生效时间在弹窗中展示 */}
                        <div className={styles.controlMeasures}>
                          {controlMeasures.map(measure => (
                            <div
                              key={measure.key}
                              className={styles.measureCard}
                              onClick={() => setMeasureDetail({
                                ...measure,
                                start: item.blockedAt ?? item.dataSource.lastSyncTime,
                                end: undefined
                              })}
                              role="button"
                            >
                              <span className={styles.measureIcon}>{MEASURE_ICONS[measure.key] ?? <SecurityScanOutlined />}</span>
                              <strong>{measure.label}</strong>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className={styles.guardSafeMessage}>未采取安全管控措施，保持绿色通行</p>
                    )}
                    
                  </div>
                </div>
                <div className={styles.securitySection}>
                  <div className={styles.sectionHeadline}>安全风险</div>
                  <div className={styles.trendPanel}>
                    <div className={styles.panelHeader}>
                      <div className={styles.sectionLabel}>24小时告警趋势</div>
                      <Button type="link" size="small" onClick={handleViewAlertList}>查看详情</Button>
                    </div>
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
                    <div className={styles.panelHeader}>
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

          </div>
        </div>

        <Drawer
          title="字段展示配置"
          placement="right"
          width={360}
          open={configVisible}
          onClose={() => setConfigVisible(false)}
        >
          {configGroups.map(group => {
            const optionKeys = group.fields.map(field => field.key)
            const groupValue = (fieldConfig[group.key] ?? []).filter(key => optionKeys.includes(key))
            return (
              <div key={group.key} className={styles.configGroup}>
                <div className={styles.configGroupTitle}>{group.title}</div>
                <Checkbox.Group
                  value={groupValue}
                  onChange={values => handleFieldConfigChange(group.key, values as string[])}
                >
                  <div className={styles.configOptions}>
                    {group.fields.map(field => (
                      <Checkbox key={field.key} value={field.key}>{field.label}</Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </div>
            )
          })}
        </Drawer>
        <Modal open={!!measureDetail} title="管控措施详情" onCancel={() => setMeasureDetail(null)} footer={null}>
          {measureDetail && (
            <div className={styles.measureDetail}>
              <div className={styles.measureDetailHeader}>
                <span className={styles.measureDetailIcon}>{MEASURE_ICONS[measureDetail.key] ?? <SecurityScanOutlined />}</span>
                <strong>{measureDetail.label}</strong>
              </div>
              <ul className={styles.measureDetailList}>
                <li><span>措施说明</span><strong>{measureDetail.description}</strong></li>
                <li><span>开始时间</span><strong>{formatDateTime(measureDetail.start)}</strong></li>
                <li><span>结束时间</span><strong>{measureDetail.end ? formatDateTime(measureDetail.end) : '—'}</strong></li>
              </ul>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default CloudHostDetail
