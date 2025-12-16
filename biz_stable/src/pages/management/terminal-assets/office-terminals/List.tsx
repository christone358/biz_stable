import React, { useMemo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Input, Tag, Tooltip, Tree, List, Space, message } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { DatabaseOutlined, SafetyCertificateFilled, SafetyOutlined, DisconnectOutlined, StopOutlined, AuditOutlined } from '@ant-design/icons'
import type { RootState } from '../../../../store'
import type {
  OfficeTerminal,
  TerminalDeviceType,
  TerminalOSFamily,
  TerminalRegistrationStatus,
} from '../../../../types/office-terminal'
import styles from './List.module.less'

const { Search } = Input

const osLabels: Record<TerminalOSFamily, string> = {
  Windows: 'Windows',
  macOS: 'macOS',
  Linux: 'Linux',
  Other: '其他',
}

const deviceTypeLabels: Record<TerminalDeviceType, string> = {
  DESKTOP: '台式机',
  LAPTOP: '笔记本',
  SERVER: '服务器',
  VDI: 'VDI 虚拟桌面',
  THIN: '瘦终端',
  OTHER: '其他',
}

const registrationLabels: Record<TerminalRegistrationStatus, string> = {
  PENDING: '待注册',
  IN_REVIEW: '审核中',
  APPROVED: '审核通过',
  REJECTED: '驳回',
  DEREGISTERED: '注销',
}

type ProtectionState = 'PROTECTED' | 'OFFLINE' | 'UNINSTALLED'

type RiskLevel = 'OK' | 'MEDIUM' | 'HIGH'

type TreeNode = DataNode & { count: number }

function formatProtectionState(item: OfficeTerminal): ProtectionState {
  if (!item.edrInstalled) return 'UNINSTALLED'
  return item.edrOnline ? 'PROTECTED' : 'OFFLINE'
}

function riskLevel(item: OfficeTerminal): RiskLevel {
  const alerts = item.pendingAlerts ?? 0
  const vulns = item.vulnerabilities ?? 0
  if (vulns > 0 || alerts >= 3) return 'HIGH'
  if (alerts > 0) return 'MEDIUM'
  return 'OK'
}

function statusDot(status?: OfficeTerminal['runStatus']) {
  if (!status) return null
  const cls = status === 'RUNNING' ? styles.statusDotRun : status === 'STOPPED' ? styles.statusDotStop : styles.statusDotUnknown
  const text = status === 'RUNNING' ? '运行中' : status === 'STOPPED' ? '已关机' : '未知'
  return <span className={`${styles.statusDot} ${cls}`} title={text} aria-label={text} />
}

const protectionIcon = (item: OfficeTerminal) => {
  const state = formatProtectionState(item)
  const summary = state === 'UNINSTALLED'
    ? '未防护：未安装 EDR'
    : state === 'OFFLINE'
      ? 'EDR 离线：代理心跳异常'
      : '防护中：EDR 在线'

  const softwareList = item.securitySoftwares?.length ? (
    <div className={styles.tooltipSoftList}>
      {item.securitySoftwares.map(soft => (
        <div key={soft.id} className={styles.tooltipSoftRow}>
          <span className={styles.tooltipSoftName}>{soft.productName}</span>
          {soft.clientVersion && <span className={styles.tooltipSoftMeta}>{soft.clientVersion}</span>}
          <span className={styles.tooltipSoftMeta}>{soft.onlineStatus === 'OFFLINE' ? '离线' : '在线'}</span>
        </div>
      ))}
    </div>
  ) : <div className={styles.tooltipSoftEmpty}>暂无安全软件明细</div>

  const tooltip = (
    <div>
      <div className={styles.tooltipSoftTitle}>{summary}</div>
      {softwareList}
    </div>
  )

  if (state === 'UNINSTALLED') {
    return (
      <Tooltip title={tooltip} overlayClassName={styles.tooltipSoftWrapper}>
        <StopOutlined className={`${styles.stateIcon} ${styles.iconProtDanger}`} />
      </Tooltip>
    )
  }
  if (state === 'OFFLINE') {
    return (
      <Tooltip title={tooltip} overlayClassName={styles.tooltipSoftWrapper}>
        <DisconnectOutlined className={`${styles.stateIcon} ${styles.iconProtWarn}`} />
      </Tooltip>
    )
  }
  return (
    <Tooltip title={tooltip} overlayClassName={styles.tooltipSoftWrapper}>
      <SafetyCertificateFilled className={`${styles.stateIcon} ${styles.iconProtSafe}`} />
    </Tooltip>
  )
}

const riskBar = (item: OfficeTerminal) => {
  const level = riskLevel(item)
  const filled = level === 'HIGH' ? 3 : level === 'MEDIUM' ? 2 : 1
  const title = `风险：${level === 'HIGH' ? '高' : level === 'MEDIUM' ? '中' : '正常'}（告警${item.pendingAlerts ?? 0}、高危漏洞${item.vulnerabilities ?? 0}）`
  return (
    <Tooltip title={title}>
      <div className={styles.riskMeter} role="img" aria-label={title}>
        {[0, 1, 2].map(idx => (
          <span
            key={idx}
            className={`${styles.riskCell} ${idx < filled ? (level === 'HIGH' ? styles.riskCellHigh : level === 'MEDIUM' ? styles.riskCellMed : styles.riskCellOk) : styles.riskCellNeutral}`}
          />
        ))}
      </div>
    </Tooltip>
  )
}

const registrationIcon = (status?: TerminalRegistrationStatus) => {
  if (!status) return null
  const classMap: Record<TerminalRegistrationStatus, string> = {
    APPROVED: styles.iconRegApproved,
    IN_REVIEW: styles.iconRegReview,
    PENDING: styles.iconRegPending,
    REJECTED: styles.iconRegRejected,
    DEREGISTERED: styles.iconRegDeregistered,
  }
  const title = `准入状态：${registrationLabels[status]}`
  return (
    <Tooltip title={title}>
      <AuditOutlined className={`${styles.stateIcon} ${classMap[status]}`} />
    </Tooltip>
  )
}

function buildOrgTree(items: OfficeTerminal[]): TreeNode[] {
  const root = new Map<string, any>()
  items.forEach(item => {
    const segments = item.departmentPath.split('/')
    let current = root
    let path = ''
    segments.forEach((seg, index) => {
      path = index === 0 ? seg : `${path}/${seg}`
      if (!current.has(seg)) {
        current.set(seg, { key: path, name: seg, count: 0, children: new Map<string, any>() })
      }
      const node = current.get(seg)
      node.count += 1
      current = node.children
    })
  })

  const convert = (map: Map<string, any>): TreeNode[] => {
    return Array.from(map.values()).map((node) => ({
      title: `${node.name} (${node.count})`,
      key: node.key,
      count: node.count,
      children: convert(node.children)
    }))
  }

  return convert(root)
}

const osOptions: TerminalOSFamily[] = ['Windows', 'macOS', 'Linux']
const deviceOptions: TerminalDeviceType[] = ['DESKTOP', 'LAPTOP', 'SERVER', 'VDI', 'THIN']
const orderedRegistration: TerminalRegistrationStatus[] = ['APPROVED', 'IN_REVIEW', 'PENDING', 'REJECTED', 'DEREGISTERED']

const OfficeTerminalList = () => {
  const items = useSelector<RootState, OfficeTerminal[]>(s => s.officeTerminals.items)
  const [keyword, setKeyword] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<string>()
  const [orgSearch, setOrgSearch] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectedOsFamilies, setSelectedOsFamilies] = useState<TerminalOSFamily[]>([])
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<TerminalDeviceType[]>([])
  const [runFilter, setRunFilter] = useState<OfficeTerminal['runStatus'] | undefined>()
  const [protectionFilter, setProtectionFilter] = useState<ProtectionState | undefined>()
  const [registrationFilter, setRegistrationFilter] = useState<TerminalRegistrationStatus | undefined>()

  const total = items.length
  const orgTree = useMemo(() => buildOrgTree(items), [items])
  const defaultExpandedKeys = useMemo(() => orgTree.map(node => node.key as string), [orgTree])
  useEffect(() => {
    setExpandedKeys(prev => (prev.length ? prev : defaultExpandedKeys))
  }, [defaultExpandedKeys])
  const matchingOrgKeys = useMemo(() => {
    if (!orgSearch) return []
    const keys: string[] = []
    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (String(node.title).includes(orgSearch)) keys.push(node.key as string)
        if (node.children) traverse(node.children as TreeNode[])
      })
    }
    traverse(orgTree)
    return keys
  }, [orgSearch, orgTree])

  const baseSet = useMemo(() => {
    if (!selectedOrg) return items
    return items.filter(item => item.departmentPath.startsWith(selectedOrg))
  }, [items, selectedOrg])

  const osCount = useMemo(() => {
    const map = new Map<TerminalOSFamily, number>()
    baseSet.forEach(item => {
      map.set(item.osFamily, (map.get(item.osFamily) ?? 0) + 1)
    })
    return map
  }, [baseSet])

  const deviceCount = useMemo(() => {
    const map = new Map<TerminalDeviceType, number>()
    baseSet.forEach(item => {
      map.set(item.deviceType, (map.get(item.deviceType) ?? 0) + 1)
    })
    return map
  }, [baseSet])

  const filteredItems = useMemo(() => {
    return baseSet.filter(item => {
      if (selectedOsFamilies.length && !selectedOsFamilies.includes(item.osFamily)) return false
      if (selectedDeviceTypes.length && !selectedDeviceTypes.includes(item.deviceType)) return false
      if (runFilter && item.runStatus !== runFilter) return false
      if (protectionFilter && formatProtectionState(item) !== protectionFilter) return false
      if (registrationFilter && item.registrationStatus !== registrationFilter) return false
      if (keyword) {
        const key = keyword.toLowerCase()
        const match = [item.deviceName, item.assetNumber, item.ipAddress, item.macAddress, item.user?.name, item.user?.account]
          .some(val => val?.toLowerCase().includes(key))
        if (!match) return false
      }
      return true
    })
  }, [baseSet, selectedOsFamilies, selectedDeviceTypes, runFilter, protectionFilter, registrationFilter, keyword])

  const clearAllFilters = () => {
    setSelectedOrg(undefined)
    setSelectedOsFamilies([])
    setSelectedDeviceTypes([])
    setRunFilter(undefined)
    setProtectionFilter(undefined)
    setRegistrationFilter(undefined)
    setKeyword('')
  }

  const runningCount = items.filter(i => i.runStatus === 'RUNNING').length
  const stoppedCount = items.filter(i => i.runStatus === 'STOPPED').length
  const unknownCount = total - runningCount - stoppedCount
  const installedCount = items.filter(i => i.edrInstalled).length
  const coverageRate = total ? Math.round((installedCount / total) * 100) : 0
  const riskHighCount = items.filter(i => riskLevel(i) === 'HIGH').length
  const riskMedCount = items.filter(i => riskLevel(i) === 'MEDIUM').length
  const riskOkCount = total - riskHighCount - riskMedCount

  const handleOrgSelect = (keys: React.Key[]) => {
    setSelectedOrg(keys[0] as string)
  }

  return (
    <div className={styles.page}>
      <section className={styles.statsShowcase}>
        <div className={styles.statsHeader}>
          <div>
            <h3>办公终端概览</h3>
            <p>终端基础态势与防护覆盖率</p>
          </div>
          <div className={styles.statsActions}>
            <Button type="primary" size="small">新建终端</Button>
            <Button size="small">导入台账</Button>
            <Button size="small">导出台账</Button>
          </div>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <DatabaseOutlined className={styles.statIconPrimary} />
            <div>
              <div className={styles.statLabel}>终端统计</div>
              <div className={styles.statValue}>{total}</div>
              <div className={styles.statSplit}>运行中 {runningCount} · 已关机 {stoppedCount} · 未知 {unknownCount}</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <SafetyOutlined className={styles.statIconNeutral} />
            <div>
              <div className={styles.statLabel}>终端风险</div>
              <div className={styles.statValue}>{riskHighCount + riskMedCount}</div>
              <div className={styles.statRiskRow}>
                <span><span className={`${styles.riskLegend} ${styles.riskCellHigh}`}></span>高 {riskHighCount}</span>
                <span><span className={`${styles.riskLegend} ${styles.riskCellMed}`}></span>中 {riskMedCount}</span>
                <span><span className={`${styles.riskLegend} ${styles.riskCellOk}`}></span>正常 {riskOkCount}</span>
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <SafetyCertificateFilled className={styles.statIconSuccess} />
            <div>
              <div className={styles.statLabel}>防护覆盖率</div>
              <div className={styles.statValue}>{coverageRate}%</div>
              <div className={styles.statSplit}>未安装 {items.filter(i => !i.edrInstalled).length}</div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.contentArea}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarHeader}>分组 · 组织</div>
            <Search
              placeholder="搜索组织"
              allowClear
              size="small"
              className={styles.orgSearch}
              value={orgSearch}
              onChange={e => setOrgSearch(e.target.value)}
            />
            <Tree
              className={styles.orgTree}
              treeData={orgTree}
              selectedKeys={selectedOrg ? [selectedOrg] : []}
              expandedKeys={orgSearch ? matchingOrgKeys : expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
              onSelect={handleOrgSelect}
              filterTreeNode={orgSearch ? node => String(node.title).includes(orgSearch) : undefined}
            />
            {selectedOrg && (
              <Button type="link" size="small" className={styles.clearOrgBtn} onClick={() => setSelectedOrg(undefined)}>清除组织筛选</Button>
            )}
          </div>
        </aside>

        <section className={styles.listArea}>
          <header className={styles.listHeader}>
            <div>
              <h3>办公终端列表</h3>
              <span>{filteredItems.length} / {baseSet.length} 台（已按当前分组/分类筛选）</span>
            </div>
            <div className={styles.listHeaderTools}>
              <Search
                placeholder="名称 / IP / 用户 / 资产"
                allowClear
                size="middle"
                className={styles.listSearch}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </header>

          <div className={styles.filterStatsRow}>
            <div>操作系统分布：{osOptions.map(value => `${osLabels[value]} ${osCount.get(value) ?? 0}`).join(' · ')}</div>
            <div>设备类型分布：{deviceOptions.map(value => `${deviceTypeLabels[value]} ${deviceCount.get(value) ?? 0}`).join(' · ')}</div>
          </div>

          <div className={styles.filterToolbar}>
            <div className={styles.inlineFilters}>
              <div className={styles.inlineFilterGroup}>
                <span>运行状态</span>
                <div className={styles.inlineChips}>
                  {(['RUNNING', 'STOPPED', 'UNKNOWN'] as OfficeTerminal['runStatus'][]).map(status => (
                    <Tag.CheckableTag
                      key={status}
                      checked={runFilter === status}
                      onChange={checked => setRunFilter(checked ? status : undefined)}
                    >
                      {status === 'RUNNING' ? '运行中' : status === 'STOPPED' ? '已关机' : '未知'}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <div className={styles.inlineFilterGroup}>
                <span>防护状态</span>
                <div className={styles.inlineChips}>
                  {(['PROTECTED', 'OFFLINE', 'UNINSTALLED'] as ProtectionState[]).map(state => (
                    <Tag.CheckableTag
                      key={state}
                      checked={protectionFilter === state}
                      onChange={checked => setProtectionFilter(checked ? state : undefined)}
                    >
                      {state === 'PROTECTED' ? '防护中' : state === 'OFFLINE' ? '离线' : '未防护'}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <div className={styles.inlineFilterGroup}>
                <span>准入状态</span>
                <div className={styles.inlineChips}>
                  {orderedRegistration.map(state => (
                    <Tag.CheckableTag
                      key={state}
                      checked={registrationFilter === state}
                      onChange={checked => setRegistrationFilter(checked ? state : undefined)}
                    >
                      {registrationLabels[state]}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <div className={styles.inlineFilterGroup}>
                <span>操作系统</span>
                <div className={styles.inlineChips}>
                  {osOptions.map(value => (
                    <Tag.CheckableTag
                      key={value}
                      checked={selectedOsFamilies.includes(value)}
                      onChange={(checked) => {
                        setSelectedOsFamilies(prev => (
                          checked
                            ? (prev.includes(value) ? prev : [...prev, value])
                            : prev.filter(item => item !== value)
                        ))
                      }}
                    >
                      {osLabels[value]}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
              <div className={styles.inlineFilterGroup}>
                <span>设备类型</span>
                <div className={styles.inlineChips}>
                  {deviceOptions.map(value => (
                    <Tag.CheckableTag
                      key={value}
                      checked={selectedDeviceTypes.includes(value)}
                      onChange={(checked) => {
                        setSelectedDeviceTypes(prev => (
                          checked
                            ? (prev.includes(value) ? prev : [...prev, value])
                            : prev.filter(item => item !== value)
                        ))
                      }}
                    >
                      {deviceTypeLabels[value]}
                    </Tag.CheckableTag>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.filterActions}>
              <Button type="link" size="small" onClick={clearAllFilters}>清空全部筛选</Button>
            </div>
          </div>

          <List
            className={styles.cardList}
            dataSource={filteredItems}
            itemLayout="vertical"
            pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (totalCount) => `共 ${totalCount} 台终端` }}
            renderItem={(item) => (
              <List.Item key={item.id} className={styles.cardListItem}>
                <div className={styles.terminalCard} role="group" aria-label={item.deviceName}>
                  <div className={styles.cardHeaderRow}>
                    <div>
                      <div className={styles.cardTitleRow}>
                        <span className={styles.cardTitle}>{item.deviceName}</span>
                        {item.assetNumber && <span className={styles.cardTag}>{item.assetNumber}</span>}
                        {item.edrClientType && <Tag color="blue" className={styles.statusTag}>{item.edrClientType}</Tag>}
                      </div>
                      <div className={styles.cardMetaRow}>
                        {statusDot(item.runStatus)}
                        <span className={styles.metaText}>{item.ipAddress ?? '未上报 IP'}</span>
                        {item.macAddress && <span className={styles.metaText}>· {item.macAddress}</span>}
                      </div>
                    </div>
                    <div className={styles.cardStatusGroup}>
                      {riskBar(item)}
                      {protectionIcon(item)}
                      {registrationIcon(item.registrationStatus)}
                      <div className={styles.statusFooter}>最近更新时间：{item.lastActiveAt ? new Date(item.lastActiveAt).toLocaleString() : '未上报'}</div>
                    </div>
                  </div>

                  <div className={styles.cardInfoGrid}>
                    <div>
                      <div className={styles.infoLabel}>操作系统</div>
                      <div className={styles.infoValue}>
                        {item.osName || osLabels[item.osFamily]}
                        {item.osVersion && ` ${item.osVersion}`}
                      </div>
                    </div>
                    <div>
                      <div className={styles.infoLabel}>设备类型</div>
                      <div className={styles.infoValue}>{deviceTypeLabels[item.deviceType]}</div>
                    </div>
                    <div>
                      <div className={styles.infoLabel}>使用人</div>
                      <div className={styles.infoValue}>
                        {item.user?.name ?? '未分配'}
                        {item.user?.account && <span className={styles.metaTextThin}>（{item.user.account}）</span>}
                      </div>
                    </div>
                    <div>
                      <div className={styles.infoLabel}>所属组织</div>
                      <div className={styles.infoValue}>{item.departmentPath}</div>
                    </div>
                    <div className={styles.cardActions}>
                      <Space>
                        <Button type="link" size="small" onClick={() => message.info('详情页建设中')}>查看详情</Button>
                        <Button type="link" size="small">更多操作</Button>
                      </Space>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </section>
      </div>
    </div>
  )
}

export default OfficeTerminalList
