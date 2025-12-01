import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store'
import { Button, Input, Select } from 'antd'
import type { CloudHost } from '../../../../types/cloud-host'
import { useNavigate } from 'react-router-dom'
import styles from './List.module.less'

const statusTag = (status: string) => {
  const cls =
    status === 'RUNNING'
      ? styles.statusChipRunning
      : status === 'STOPPED'
        ? styles.statusChipStopped
        : styles.statusChipUnknown
  const label = status === 'RUNNING' ? '运行中' : status === 'STOPPED' ? '已停止' : '未知'
  return <span className={`${styles.statusChip} ${cls}`}>{label}</span>
}

const protectionTag = (host: CloudHost) => {
  if (!host.edrInstalled) return <span className={`${styles.statusChip} ${styles.protectionChipDanger}`}>EDR 未安装</span>
  if (host.edrInstalled && !host.edrOnline) return <span className={`${styles.statusChip} ${styles.protectionChipWarn}`}>EDR 未运行</span>
  return <span className={`${styles.statusChip} ${styles.protectionChipSafe}`}>受保护</span>
}

const protectionText = (host: CloudHost) => {
  if (!host.edrInstalled) return 'EDR 未安装'
  if (!host.edrOnline) return 'EDR 未运行'
  return '已受保护'
}

const quickOptions = [
  { key: 'unprotected', label: '未受防护' },
  { key: 'blocked', label: '已管控' },
  { key: 'running', label: '仅运行中' },
] as const

type PreviewPositionStyle = React.CSSProperties & { '--arrow-offset'?: string }

const CloudHostList = () => {
  const items = useSelector<RootState, CloudHost[]>(s => s.cloudHosts.items)
  const navigate = useNavigate()
  const [selectedBlock, setSelectedBlock] = useState<string | undefined>()
  const [selectedSystem, setSelectedSystem] = useState<string | undefined>()
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()
  const [selectedProtection, setSelectedProtection] = useState<string | undefined>()
  const [keyword, setKeyword] = useState('')
  const [quickFilter, setQuickFilter] = useState<typeof quickOptions[number]['key'] | null>(null)
  const [previewHost, setPreviewHost] = useState<CloudHost | null>(null)
  const [previewStyle, setPreviewStyle] = useState<PreviewPositionStyle | null>(null)
  const [previewPlacement, setPreviewPlacement] = useState<'above' | 'below'>('below')
  const previewClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelPreviewClear = () => {
    if (previewClearTimer.current) {
      clearTimeout(previewClearTimer.current)
      previewClearTimer.current = null
    }
  }

  const schedulePreviewClear = () => {
    cancelPreviewClear()
    previewClearTimer.current = setTimeout(() => {
      setPreviewHost(null)
      setPreviewStyle(null)
    }, 160)
  }

  useEffect(() => () => cancelPreviewClear(), [])

  useEffect(() => {
    const handleWindowChange = () => {
      cancelPreviewClear()
      setPreviewHost(null)
      setPreviewStyle(null)
    }
    window.addEventListener('scroll', handleWindowChange)
    window.addEventListener('resize', handleWindowChange)
    return () => {
      window.removeEventListener('scroll', handleWindowChange)
      window.removeEventListener('resize', handleWindowChange)
    }
  }, [])

  const updatePreview = (host: CloudHost, element: HTMLElement) => {
    cancelPreviewClear()
    const rect = element.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const overlayWidth = 360
    const estimatedHeight = 240
    const diagonalOffset = 20
    const shouldShowAbove = rect.bottom + estimatedHeight + diagonalOffset > viewportHeight && rect.top - estimatedHeight > 0
    const rawTop = shouldShowAbove ? rect.top - estimatedHeight - diagonalOffset : rect.bottom + diagonalOffset
    const top = Math.min(Math.max(rawTop, 12), viewportHeight - estimatedHeight - 12)
    const horizontalBias = shouldShowAbove ? rect.width * 0.15 : rect.width * 0.35
    const rawLeft = rect.left + horizontalBias
    const left = Math.min(Math.max(rawLeft, 12), viewportWidth - overlayWidth - 12)
    const arrowCenterRaw = rect.left + rect.width / 2 - left
    const arrowCenter = Math.min(Math.max(arrowCenterRaw, 24), overlayWidth - 24)
    setPreviewPlacement(shouldShowAbove ? 'above' : 'below')
    setPreviewStyle({ top, left, width: overlayWidth, '--arrow-offset': `${arrowCenter}px` })
    setPreviewHost(host)
  }

  const total = items.length
  const runningCount = items.filter(i => i.status === 'RUNNING').length
  const unprotectedCount = items.filter(i => !i.edrInstalled || !i.edrOnline).length
  const blockedCount = items.filter(i => i.blocked).length

  const filteredItems = useMemo(() => items.filter(item => {
    if (selectedBlock && item.businessBlock !== selectedBlock) return false
    if (selectedSystem && item.businessSystem !== selectedSystem) return false
    if (selectedAsset && item.businessAssetName !== selectedAsset) return false
    if (selectedStatus && item.status !== selectedStatus) return false
    if (selectedProtection) {
      if (selectedProtection === 'UNINSTALLED' && item.edrInstalled) return false
      if (selectedProtection === 'NOT_RUNNING' && !(item.edrInstalled && !item.edrOnline)) return false
      if (selectedProtection === 'PROTECTED' && !(item.edrInstalled && item.edrOnline)) return false
    }
    if (quickFilter === 'unprotected' && item.edrInstalled && item.edrOnline) return false
    if (quickFilter === 'blocked' && !item.blocked) return false
    if (quickFilter === 'running' && item.status !== 'RUNNING') return false
    if (keyword) {
      const key = keyword.toLowerCase()
      const match = [item.hostName, item.ipAddress, item.systemOwner, item.businessAssetName].some(v => v?.toLowerCase().includes(key))
      if (!match) return false
    }
    return true
  }), [items, selectedBlock, selectedSystem, selectedAsset, selectedStatus, selectedProtection, keyword, quickFilter])

  const blockOptions = [...new Set(items.map(i => i.businessBlock))].map(v => ({ label: v, value: v }))
  const systemOptions = [...new Set(items.map(i => i.businessSystem))].map(v => ({ label: v, value: v }))
  const assetOptions = [...new Set(items.map(i => i.businessAssetName))].filter(Boolean).map(v => ({ label: String(v), value: String(v) }))

  const metrics = [
    { key: 'total', label: '纳管云主机', value: total, trend: '+8% QoQ' },
    { key: 'online', label: '运行中', value: runningCount, trend: `${total ? Math.round((runningCount / total) * 100) : 0}% 在线率` },
    { key: 'unprotected', label: '未受防护', value: unprotectedCount, trend: '需要补齐防护' },
    { key: 'blocked', label: '安全管控', value: blockedCount, trend: '实时联动管控' },
  ]

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(`/management/terminal-assets/cloud-hosts/${id}`)
    }
  }

  return (
    <div className={styles.listPage}>
      <div className={styles.pageHeading}>
        <h2>终端资产 · 云主机矩阵</h2>
        <span>聚合云管与安全中心的实时资产画像</span>
      </div>

      <section className={styles.statsShowcase}>
        <div className={styles.statsIntro}>
          <div className={styles.statsIntroTag}>统计视角</div>
          <h3>云主机纳管概览</h3>
          <p>以数量、运行与防护情况同步评估资产健康度，辅助安全与运维统一指挥。</p>
        </div>
        <div className={styles.statsGrid}>
          {metrics.map(metric => (
            <div key={metric.key} className={styles.statCard}>
              <div className={styles.statLabel}>{metric.label}</div>
              <div className={styles.statValue}>{metric.value}</div>
              <div className={styles.statTrend}>{metric.trend}</div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.filtersPanel}>
        <div className={styles.filtersHeader}>
          <div>
            <h4>条件筛选</h4>
            <p>通过业务视角组合条件，快速聚焦异常终端。</p>
          </div>
          <div className={styles.actionBar}>
            <Button type="primary">新建云主机</Button>
            <Button>导入台账</Button>
            <Button>导出台账</Button>
          </div>
        </div>
        <div className={styles.filterGroup}>
          <Select placeholder="业务板块" allowClear value={selectedBlock} onChange={setSelectedBlock} options={blockOptions} />
          <Select placeholder="业务系统" allowClear value={selectedSystem} onChange={setSelectedSystem} options={systemOptions} />
          <Select placeholder="业务资产" allowClear value={selectedAsset} onChange={setSelectedAsset} options={assetOptions} />
          <Select placeholder="运行状态" allowClear value={selectedStatus} onChange={setSelectedStatus} options={[{ value: 'RUNNING', label: '运行中' }, { value: 'STOPPED', label: '停止' }, { value: 'UNKNOWN', label: '未知' }]} />
          <Select
            placeholder="防护状态"
            allowClear
            value={selectedProtection}
            onChange={setSelectedProtection}
            options={[{ value: 'UNINSTALLED', label: '未安装EDR' }, { value: 'NOT_RUNNING', label: 'EDR未运行' }, { value: 'PROTECTED', label: '受保护' }]}
          />
          <Input.Search placeholder="名称 / IP / 责任人 / 资产" allowClear value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
        <div className={styles.quickFilters}>
          {quickOptions.map(option => (
            <div
              key={option.key}
              className={`${styles.quickTag} ${quickFilter === option.key ? styles.quickTagActive : ''}`}
              onClick={() => setQuickFilter(quickFilter === option.key ? null : option.key)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      <section className={styles.cardsSection}>
        <div className={styles.cardsSectionHeader}>
          <div>
            <h4>云主机资产</h4>
            <span>{filteredItems.length} / {total} 台匹配当前筛选条件</span>
          </div>
        </div>
        {filteredItems.length === 0 ? (
          <div className={styles.cardsEmpty}>没有符合条件的云主机，尝试调整筛选条件。</div>
        ) : (
          <div className={styles.hostCardsGrid}>
              {filteredItems.map(host => (
                <div
                  key={host.id}
                  className={styles.hostCard}
                  role="button"
                  tabIndex={0}
                  onMouseEnter={event => updatePreview(host, event.currentTarget)}
                  onMouseLeave={schedulePreviewClear}
                  onFocus={event => updatePreview(host, event.currentTarget)}
                  onBlur={schedulePreviewClear}
                  onClick={() => navigate(`/management/terminal-assets/cloud-hosts/${host.id}`)}
                  onKeyDown={event => handleCardKeyDown(event, host.id)}
                >
                  <div className={styles.hostCardMain}>
                    <div className={styles.hostIdentity}>
                      <div className={styles.hostNameRow}>
                        <span className={styles.hostName}>{host.hostName}</span>
                        {host.blocked ? <span className={styles.blockedBadge}>已管控</span> : null}
                      </div>
                      <span className={styles.hostIp}>{host.ipAddress}</span>
                    </div>
                    <div className={styles.hostStatusGroup}>
                      {statusTag(host.status)}
                      {protectionTag(host)}
                    </div>
                  </div>
                  <div className={styles.hostSpecsStrip}>
                    <span>{host.cpu}C</span>
                    <span>{host.memory}G 内存</span>
                    <span>{host.disk}G 磁盘</span>
                  </div>
                  <div className={styles.hostMeta}>
                    <div>
                      <label>责任人</label>
                      <span>{host.systemOwner}</span>
                    </div>
                    <div>
                      <label>部门</label>
                      <span>{host.department}</span>
                    </div>
                    <div>
                      <label>业务资产</label>
                      <span>{host.businessAssetName ?? '未映射'}</span>
                    </div>
                    <div>
                      <label>业务归属</label>
                      <span>{host.businessBlock} / {host.businessSystem}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
      {previewHost && previewStyle ? (
        <div
          className={`${styles.previewPopover} ${previewPlacement === 'above' ? styles.previewPopoverAbove : styles.previewPopoverBelow}`}
          style={previewStyle}
          onMouseEnter={cancelPreviewClear}
          onMouseLeave={schedulePreviewClear}
        >
          <div className={styles.previewHeader}>
            <div>
              <h5>{previewHost.hostName}</h5>
              <span>{previewHost.ipAddress}</span>
            </div>
            <div className={styles.previewStatus}>
              {statusTag(previewHost.status)}
              {protectionTag(previewHost)}
            </div>
          </div>
          <div className={styles.previewGrid}>
            <div>
              <label>规格</label>
              <strong>{`${previewHost.cpu}C / ${previewHost.memory}G / ${previewHost.disk}G`}</strong>
            </div>
            <div>
              <label>类型</label>
              <strong>{previewHost.type}</strong>
            </div>
            <div>
              <label>业务链路</label>
              <strong>{previewHost.businessBlock} · {previewHost.businessSystem}</strong>
            </div>
            <div>
              <label>业务资产</label>
              <strong>{previewHost.businessAssetName ?? '未映射'}</strong>
            </div>
            <div>
              <label>责任人</label>
              <strong>{previewHost.systemOwner}</strong>
            </div>
            <div>
              <label>部门</label>
              <strong>{previewHost.department}</strong>
            </div>
            <div>
              <label>安全管控</label>
              <strong>{previewHost.blocked ? '已管控' : '未管控'}</strong>
            </div>
            <div>
              <label>防护状态</label>
              <strong>{protectionText(previewHost)}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CloudHostList
