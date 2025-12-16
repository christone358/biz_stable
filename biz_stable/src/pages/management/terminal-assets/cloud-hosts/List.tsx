import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../../store'
import { Button, Input, Tooltip, Tag } from 'antd'
import type { CloudHost } from '../../../../types/cloud-host'
import { useNavigate } from 'react-router-dom'
import styles from './List.module.less'
import { SafetyCertificateFilled, DisconnectOutlined, StopOutlined, DatabaseOutlined, SafetyOutlined } from '@ant-design/icons'

// 运行状态以色点在 IP 旁边展示，不再使用状态 chip

const protectionTag = (host: CloudHost) => {
  if (host.edrInstalled === undefined || host.edrOnline === undefined) return null
  if (!host.edrInstalled) {
    return (
      <Tooltip title="未防护：未安装 EDR">
        <StopOutlined className={`${styles.stateIcon} ${styles.iconProtDanger}`} />
      </Tooltip>
    )
  }
  if (!host.edrOnline) {
    return (
      <Tooltip title="EDR 离线：代理未上报/心跳异常">
        <DisconnectOutlined className={`${styles.stateIcon} ${styles.iconProtWarn}`} />
      </Tooltip>
    )
  }
  return (
    <Tooltip title="防护中：EDR 在线">
      <SafetyCertificateFilled className={`${styles.stateIcon} ${styles.iconProtSafe}`} />
    </Tooltip>
  )
}

// protectionText removed; chip already conveys EDR state succinctly

const riskTag = (host: CloudHost) => {
  const alerts = host.pendingAlerts
  const vulns = host.vulnerabilities
  if (alerts == null && vulns == null) return null
  let level: 'OK' | 'MEDIUM' | 'HIGH' = 'OK'
  if ((vulns ?? 0) > 0 || (alerts ?? 0) >= 3) level = 'HIGH'
  else if ((alerts ?? 0) > 0) level = 'MEDIUM'
  const title = `风险：${level === 'HIGH' ? '高' : level === 'MEDIUM' ? '中' : '正常'}${alerts != null || vulns != null ? `（告警${alerts ?? 0}、高危漏洞${vulns ?? 0}）` : ''}`
  const filled = level === 'HIGH' ? 1 : level === 'MEDIUM' ? 2 : 3
  return (
    <Tooltip title={title}>
      <div className={styles.riskMeter} aria-label={title} role="img">
        {[0,1,2].map(i => (
          <span
            key={i}
            className={`${styles.riskCell} ${i < filled ? (level === 'HIGH' ? styles.riskCellHigh : level === 'MEDIUM' ? styles.riskCellMed : styles.riskCellOk) : styles.riskCellNeutral}`}
          />
        ))}
      </div>
    </Tooltip>
  )
}

const statusDot = (status?: string) => {
  if (!status) return null
  const cls = status === 'RUNNING' ? styles.runDotOk : status === 'STOPPED' ? styles.runDotStop : styles.runDotUnknown
  const title = status === 'RUNNING' ? '运行中' : status === 'STOPPED' ? '已停止' : '未知'
  return <span className={`${styles.runDot} ${cls}`} title={title} aria-label={title} />
}

type RiskLevel = 'OK' | 'MEDIUM' | 'HIGH'

// preview popover type removed with hover preview cleanup

const CloudHostList = () => {
  const items = useSelector<RootState, CloudHost[]>(s => s.cloudHosts.items)
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | undefined>()
  const [protFilter, setProtFilter] = useState<'UNINSTALLED' | 'OFFLINE' | 'ONLINE' | undefined>()
  const [runFilter, setRunFilter] = useState<'RUNNING' | 'STOPPED' | 'UNKNOWN' | undefined>()
  // hover preview removed per design: keep list concise and reduce distractions

  const total = items.length
  const runningCount = items.filter(i => i.status === 'RUNNING').length
  const edrNotInstalledCount = items.filter(i => !i.edrInstalled).length
  const edrOfflineCount = items.filter(i => i.edrInstalled && !i.edrOnline).length
  const pendingAlertsTotal = items.reduce((sum, host) => sum + (host.pendingAlerts ?? 0), 0)
  const vulnerabilitiesTotal = items.reduce((sum, host) => sum + (host.vulnerabilities ?? 0), 0)

  const filteredItems = useMemo(() => items.filter(item => {
    if (runFilter && item.status !== runFilter) return false
    if (protFilter) {
      const prot = !item.edrInstalled ? 'UNINSTALLED' : (item.edrOnline ? 'ONLINE' : 'OFFLINE')
      if (prot !== protFilter) return false
    }
    if (riskFilter) {
      const alerts = item.pendingAlerts ?? 0
      const vulns = item.vulnerabilities ?? 0
      const level: RiskLevel = (vulns > 0 || alerts >= 3) ? 'HIGH' : (alerts > 0 ? 'MEDIUM' : 'OK')
      if (level !== riskFilter) return false
    }
    if (keyword) {
      const key = keyword.toLowerCase()
      const match = [item.hostName, item.ipAddress, item.systemOwner, item.businessAssetName].some(v => v?.toLowerCase().includes(key))
      if (!match) return false
    }
    return true
  }), [items, keyword, protFilter, riskFilter, runFilter])

  // statsCards removed; top stats now use compact inline items

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(`/management/terminal-assets/cloud-hosts/${id}`)
    }
  }

  const riskHighCount = items.filter(h => (h.vulnerabilities ?? 0) > 0 || (h.pendingAlerts ?? 0) >= 3).length
  const riskMedCount = items.filter(h => (h.vulnerabilities ?? 0) === 0 && (h.pendingAlerts ?? 0) > 0 && (h.pendingAlerts ?? 0) < 3).length
  const riskOkCount = Math.max(total - riskHighCount - riskMedCount, 0)
  const installedCount = items.filter(h => h.edrInstalled).length
  const coverageRate = total ? Math.round((installedCount / total) * 100) : 0
  const stoppedCount = items.filter(h => h.status === 'STOPPED').length
  const unknownCount = items.filter(h => h.status === 'UNKNOWN').length
  const riskTotal = riskHighCount + riskMedCount

  return (
    <div className={styles.listPage}>
      <section className={styles.statsShowcase}>
        <div className={styles.statsHeaderBar}>
          <h4>云主机概览</h4>
          <div className={styles.statsActions}>
            <Button type="primary" size="small">新建云主机</Button>
            <Button size="small">导入台账</Button>
            <Button size="small">导出台账</Button>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <DatabaseOutlined className={styles.statIconPrimary} />
            <div className={styles.statCol}>
              <div className={styles.statLabel}>云主机统计</div>
              <div className={styles.statKpiRow}>
                <div className={styles.statValueSm}>{total}</div>
                <div className={styles.statSplit}>
                  <span>运行中 {runningCount}</span>
                  <span>停止 {stoppedCount}</span>
                  <span>未知 {unknownCount}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.statItem}>
            <SafetyOutlined className={styles.statIconNeutral} />
            <div className={styles.statCol}>
              <div className={styles.statLabel}>主机风险</div>
              <div className={styles.statKpiRow}>
                <div className={styles.statValueSm}>{riskTotal}</div>
                <div className={styles.statRiskInline}>
                  <div className={styles.riskLegend}><span className={`${styles.riskCell} ${styles.riskCellHigh}`}></span><span className={styles.riskText}>高 {riskHighCount}</span></div>
                  <div className={styles.riskLegend}><span className={`${styles.riskCell} ${styles.riskCellMed}`}></span><span className={styles.riskText}>中 {riskMedCount}</span></div>
                  <div className={styles.riskLegend}><span className={`${styles.riskCell} ${styles.riskCellOk}`}></span><span className={styles.riskText}>正常 {riskOkCount}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.statItem}>
            <SafetyCertificateFilled className={styles.statIconSuccess} />
            <div className={styles.statCol}>
              <div className={styles.statLabel}>防护覆盖率</div>
              <div className={styles.statKpiRow}>
                <div className={styles.statValueSm}>{coverageRate}%</div>
                <div className={styles.statRightNote}>未安装 {edrNotInstalledCount}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 过滤与搜索移至列表标题右上角，取消独立过滤面板 */}

      <section className={styles.cardsSection}>
        <div className={styles.cardsSectionHeader}>
          <div>
            <h4>云主机资产</h4>
            <span>{filteredItems.length} / {total} 台匹配当前筛选条件</span>
          </div>
          <div className={styles.listHeaderTools}>
            <div className={styles.inlineFilters}>
              <div className={styles.inlineFilterGroup}>
                <span className={styles.inlineFilterLabel}>主机风险</span>
                <div className={styles.inlineChips}>
                  {(['OK','MEDIUM','HIGH'] as RiskLevel[]).map(l => (
                    <Tag.CheckableTag
                      key={l}
                      checked={riskFilter === l}
                      onChange={(checked) => setRiskFilter(checked ? l : undefined)}
                    >
                      {l === 'OK' ? '正常' : l === 'MEDIUM' ? '中' : '高'}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <div className={styles.inlineFilterGroup}>
                <span className={styles.inlineFilterLabel}>主机运行状态</span>
                <div className={styles.inlineChips}>
                  {([
                    {k:'RUNNING',t:'运行中'},
                    {k:'STOPPED',t:'已停止'},
                    {k:'UNKNOWN',t:'未知'}
                  ] as {k:'RUNNING'|'STOPPED'|'UNKNOWN';t:string}[]).map(o => (
                    <Tag.CheckableTag
                      key={o.k}
                      checked={runFilter === o.k}
                      onChange={(checked) => setRunFilter(checked ? o.k : undefined)}
                    >
                      {o.t}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <div className={styles.inlineFilterGroup}>
                <span className={styles.inlineFilterLabel}>防护状态</span>
                <div className={styles.inlineChips}>
                  {([
                    {k:'ONLINE',t:'防护中'},
                    {k:'OFFLINE',t:'离线'},
                    {k:'UNINSTALLED',t:'未防护'}
                  ] as {k:'ONLINE'|'OFFLINE'|'UNINSTALLED';t:string}[]).map(o => (
                    <Tag.CheckableTag
                      key={o.k}
                      checked={protFilter === o.k}
                      onChange={(checked) => setProtFilter(checked ? o.k : undefined)}
                    >
                      {o.t}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
            </div>
            <Input.Search
              className={styles.listSearch}
              placeholder="名称 / IP / 责任人 / 资产 / 标签"
              allowClear
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
        </div>
        {filteredItems.length === 0 ? (
          <div className={styles.cardsEmpty}>没有符合条件的云主机，尝试调整筛选条件。</div>
        ) : (
          <div className={styles.hostCardsGrid}>
              {filteredItems.map(host => {
                return (
                  <div
                    key={host.id}
                    className={styles.hostCard}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/management/terminal-assets/cloud-hosts/${host.id}`)}
                    onKeyDown={event => handleCardKeyDown(event, host.id)}
                  >
                    <div className={styles.hostCardMain}>
                      <div className={styles.hostIdentity}>
                        <div className={styles.hostNameRow}>
                          <span className={styles.hostName} title={host.hostName}>{host.hostName}</span>
                        </div>
                        <div className={styles.hostIpRow}>
                          <span className={styles.hostIp}>{host.ipAddress}</span>
                          {statusDot(host.status)}
                        </div>
                      </div>
                      <div className={styles.hostStatusGroup}>
                        {riskTag(host)}
                        {protectionTag(host)}
                      </div>
                    </div>
                    {/* 管控信息不再单独显示为异常字段 */}
                    <div className={styles.hostInfoLine}>
                      <span className={styles.sourceText}>
                        {host.dataSource?.provider || host.vendor ? (host.dataSource?.provider || host.vendor) : ''}
                      </span>
                      <span className={styles.dotDivider}>·</span>
                      <span className={styles.specText}>
                        {[host.cpu ? `${host.cpu}C` : null, host.memory ? `${host.memory}G` : null, host.disk ? `${host.disk}G` : null]
                          .filter(Boolean)
                          .join('/')}
                      </span>
                    </div>
                    <div className={styles.hostTags}>
                      {host.businessSystem ? <span className={styles.tagChip} title={host.businessSystem}>{host.businessSystem}</span> : null}
                      {host.label ? <span className={styles.tagChip}>{host.label}</span> : null}
                      {host.type ? <span className={styles.tagChip}>{host.type}</span> : null}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </section>
    </div>
  )
}

export default CloudHostList
