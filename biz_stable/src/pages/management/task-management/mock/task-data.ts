import dayjs from 'dayjs'
import type {
  CollaborationTask,
  TaskStatistics,
  TaskExecutionRecord,
  TaskType,
  TaskStatus,
  TaskPriority,
  ResponsibleUnit
} from '../types'
import { TASK_CENTER_CURRENT_USER } from '../constants'

/**
 * 生成确定性随机数
 */
function seededRandom(seed: number): number {
const x = Math.sin(seed++) * 10000
return x - Math.floor(x)
}

const INITIATOR_POOL = ['张敏', '李倩', '王磊', '赵婷', '刘畅', '黄蕾', '陈晨']
const APPROVER_POOL = ['周勇', '钱莉', '孙浩', '吴楠', '郑凯']
const PROCESSOR_POOL = ['陈晨', '赵凯', '王超', '李佳', '刘峰', '苏颖']

const SUB_CATEGORY_POOL: Record<TaskType, string[]> = {
  alert: ['系统性能', '资源使用', '网络异常', '安全威胁'],
  vulnerability: ['漏洞修复', '弱口令', '配置风险', '补丁更新'],
  asset: ['资产认领', '责任确认', '资源回收', '生命周期管理'],
}

const pickFromPool = (pool: string[], seed: number): string => {
  const index = Math.floor(seededRandom(seed) * pool.length)
  return pool[index]
}

const getSubCategory = (type: TaskType, seed: number) => {
  const pool = SUB_CATEGORY_POOL[type]
  return pool[Math.floor(seededRandom(seed) * pool.length)]
}

const getProcessor = (seed: number) => {
  if (seed % 3 === 0) {
    return TASK_CENTER_CURRENT_USER
  }
  return pickFromPool(PROCESSOR_POOL, seed + 13)
}

/**
 * 生成任务编号
 */
function generateTaskNo(type: TaskType, index: number): string {
  const prefix = {
    alert: 'ALT',
    vulnerability: 'VUL',
    asset: 'AST'
  }[type]
  return `${prefix}-${dayjs().format('YYYYMMDD')}-${String(index).padStart(4, '0')}`
}

/**
 * 生成协同任务Mock数据
 */
export function generateCollaborationTasks(): CollaborationTask[] {
  const tasks: CollaborationTask[] = []

  // 告警处置任务 (42个)
  const alertTasks = [
    {
      title: 'CPU使用率超阈值告警处理',
      description: '政务服务平台Web服务器CPU使用率持续超过85%,影响系统响应速度',
      affectedBusiness: '政务服务平台',
      priority: 'urgent' as TaskPriority,
      status: 'processing' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      responsiblePerson: '张三',
      progress: 60,
      alertInfo: {
        alertId: 'ALT-20251022-001',
        alertLevel: 'critical' as const,
        relatedAsset: 'web-server-01.gov.cn'
      }
    },
    {
      title: '数据库连接池耗尽告警',
      description: '社保系统数据库连接池使用率达到95%,存在连接泄漏风险',
      affectedBusiness: '社会保障系统',
      priority: 'urgent' as TaskPriority,
      status: 'pending' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      progress: 0,
      alertInfo: {
        alertId: 'ALT-20251023-002',
        alertLevel: 'critical' as const,
        relatedAsset: 'db-server-03.gov.cn'
      }
    },
    {
      title: '磁盘空间不足告警',
      description: '医疗信息平台日志服务器磁盘使用率超过90%',
      affectedBusiness: '医疗信息平台',
      priority: 'high' as TaskPriority,
      status: 'pending' as TaskStatus,
      responsibleUnit: '系统管理部' as ResponsibleUnit,
      progress: 0,
      alertInfo: {
        alertId: 'ALT-20251023-003',
        alertLevel: 'important' as const,
        relatedAsset: 'log-server-02.gov.cn'
      }
    },
    {
      title: '应用服务响应超时告警',
      description: '不动产登记系统API响应时间超过5秒,用户反馈系统卡顿',
      affectedBusiness: '不动产登记系统',
      priority: 'high' as TaskPriority,
      status: 'overdue' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      responsiblePerson: '李四',
      progress: 30,
      alertInfo: {
        alertId: 'ALT-20251020-004',
        alertLevel: 'critical' as const,
        relatedAsset: 'app-server-05.gov.cn'
      }
    },
    {
      title: '网络带宽占用过高',
      description: '教育管理平台网络出口带宽使用率持续超过80%',
      affectedBusiness: '教育管理平台',
      priority: 'medium' as TaskPriority,
      status: 'processing' as TaskStatus,
      responsibleUnit: '网络管理部' as ResponsibleUnit,
      responsiblePerson: '王五',
      progress: 45,
      alertInfo: {
        alertId: 'ALT-20251022-005',
        alertLevel: 'important' as const,
        relatedAsset: 'network-gateway-01'
      }
    },
    {
      title: '内存使用率异常告警',
      description: '公积金管理系统应用服务器内存使用率达到92%',
      affectedBusiness: '公积金管理系统',
      priority: 'medium' as TaskPriority,
      status: 'completed' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      responsiblePerson: '赵六',
      progress: 100,
      alertInfo: {
        alertId: 'ALT-20251021-006',
        alertLevel: 'important' as const,
        relatedAsset: 'app-server-08.gov.cn'
      }
    }
  ]

  alertTasks.forEach((task, index) => {
    const createdAt = dayjs().subtract(seededRandom(index) * 72, 'hour').toISOString()
    const deadline = dayjs(createdAt).add(task.priority === 'urgent' ? 24 : task.priority === 'high' ? 48 : 72, 'hour').toISOString()
    const seed = index + 1

    tasks.push({
      id: `task-alert-${index + 1}`,
      taskNo: generateTaskNo('alert', index + 1),
      type: 'alert',
      subCategory: getSubCategory('alert', seed),
      initiator: pickFromPool(INITIATOR_POOL, seed),
      previousApprover: pickFromPool(APPROVER_POOL, seed + 5),
      currentProcessor: seed % 3 === 0 ? TASK_CENTER_CURRENT_USER : (task.responsiblePerson ?? getProcessor(seed + 8)),
      createdAt,
      deadline,
      startedAt: task.status !== 'pending' ? dayjs(createdAt).add(seededRandom(index + 100) * 2, 'hour').toISOString() : undefined,
      completedAt: task.status === 'completed' ? dayjs(createdAt).add(seededRandom(index + 200) * 24, 'hour').toISOString() : undefined,
      ...task
    })
  })

  // 脆弱性处置任务 (28个)
  const vulnerabilityTasks = [
    {
      title: 'Apache Struts2远程代码执行漏洞修复',
      description: 'CVE-2023-50164高危漏洞,允许攻击者通过特制请求执行任意代码',
      affectedBusiness: '政务服务平台',
      priority: 'urgent' as TaskPriority,
      status: 'overdue' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      responsiblePerson: '张三',
      progress: 30,
      vulnerabilityInfo: {
        cveId: 'CVE-2023-50164',
        riskLevel: 'high' as const,
        affectedAsset: 'web-server-01.gov.cn'
      }
    },
    {
      title: 'OpenSSL心脏滴血漏洞修复',
      description: 'CVE-2023-0286中危漏洞,可能导致敏感信息泄露',
      affectedBusiness: '社会保障系统',
      priority: 'high' as TaskPriority,
      status: 'processing' as TaskStatus,
      responsibleUnit: '安全管理部' as ResponsibleUnit,
      responsiblePerson: '李四',
      progress: 65,
      vulnerabilityInfo: {
        cveId: 'CVE-2023-0286',
        riskLevel: 'medium' as const,
        affectedAsset: 'ssl-gateway-02.gov.cn'
      }
    },
    {
      title: 'MySQL注入漏洞修复',
      description: 'CVE-2023-1234低危漏洞,特定查询条件下可能导致SQL注入',
      affectedBusiness: '医疗信息平台',
      priority: 'medium' as TaskPriority,
      status: 'pending' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      progress: 0,
      vulnerabilityInfo: {
        cveId: 'CVE-2023-1234',
        riskLevel: 'low' as const,
        affectedAsset: 'db-server-03.gov.cn'
      }
    },
    {
      title: 'Spring Framework RCE漏洞修复',
      description: 'CVE-2023-20863高危漏洞,Spring Core存在远程代码执行风险',
      affectedBusiness: '不动产登记系统',
      priority: 'urgent' as TaskPriority,
      status: 'processing' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      responsiblePerson: '王五',
      progress: 75,
      vulnerabilityInfo: {
        cveId: 'CVE-2023-20863',
        riskLevel: 'high' as const,
        affectedAsset: 'app-server-05.gov.cn'
      }
    },
    {
      title: 'Tomcat文件上传漏洞',
      description: 'CVE-2023-5678中危漏洞,可能允许恶意文件上传',
      affectedBusiness: '教育管理平台',
      priority: 'medium' as TaskPriority,
      status: 'completed' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      responsiblePerson: '赵六',
      progress: 100,
      vulnerabilityInfo: {
        cveId: 'CVE-2023-5678',
        riskLevel: 'medium' as const,
        affectedAsset: 'tomcat-server-06.gov.cn'
      }
    }
  ]

  vulnerabilityTasks.forEach((task, index) => {
    const createdAt = dayjs().subtract(seededRandom(index + 50) * 120, 'hour').toISOString()
    const deadline = dayjs(createdAt).add(
      task.vulnerabilityInfo?.riskLevel === 'high' ? 24 :
      task.vulnerabilityInfo?.riskLevel === 'medium' ? 72 : 168,
      'hour'
    ).toISOString()
    const seed = index + 101

    tasks.push({
      id: `task-vuln-${index + 1}`,
      taskNo: generateTaskNo('vulnerability', index + 1),
      type: 'vulnerability',
      subCategory: getSubCategory('vulnerability', seed),
      initiator: pickFromPool(INITIATOR_POOL, seed),
      previousApprover: pickFromPool(APPROVER_POOL, seed + 7),
      currentProcessor: seed % 4 === 0 ? TASK_CENTER_CURRENT_USER : (task.responsiblePerson ?? getProcessor(seed + 11)),
      createdAt,
      deadline,
      startedAt: task.status !== 'pending' ? dayjs(createdAt).add(seededRandom(index + 150) * 4, 'hour').toISOString() : undefined,
      completedAt: task.status === 'completed' ? dayjs(createdAt).add(seededRandom(index + 250) * 48, 'hour').toISOString() : undefined,
      ...task
    })
  })

  // 资产运营任务 (15个)
  const assetTasks = [
    {
      title: '未知资产认领',
      description: '扫描发现IP 192.168.10.45的Linux服务器,请确认是否为本单位资产',
      affectedBusiness: '待确认',
      priority: 'medium' as TaskPriority,
      status: 'pending' as TaskStatus,
      responsibleUnit: '运维开发部' as ResponsibleUnit,
      progress: 0,
      assetInfo: {
        assetId: 'ASSET-00245',
        assetName: 'unknown-server-45',
        assetType: 'Linux服务器',
        disposalType: 'claim' as const
      }
    },
    {
      title: '异常资产合规处置',
      description: '信创区域发现非信创资产Windows Server 2019,需要进行合规处置',
      affectedBusiness: '政务服务平台',
      priority: 'high' as TaskPriority,
      status: 'processing' as TaskStatus,
      responsibleUnit: '系统管理部' as ResponsibleUnit,
      responsiblePerson: '钱七',
      progress: 40,
      assetInfo: {
        assetId: 'ASSET-00156',
        assetName: 'win-server-156',
        assetType: 'Windows服务器',
        disposalType: 'compliance' as const
      }
    },
    {
      title: '无主资产责任确认',
      description: 'Oracle数据库服务器db-oracle-08无责任人信息,请确认归属',
      affectedBusiness: '社会保障系统',
      priority: 'medium' as TaskPriority,
      status: 'pending' as TaskStatus,
      responsibleUnit: '数据管理部' as ResponsibleUnit,
      progress: 0,
      assetInfo: {
        assetId: 'ASSET-00089',
        assetName: 'db-oracle-08',
        assetType: 'Oracle数据库',
        disposalType: 'responsibility' as const
      }
    },
    {
      title: '资产信息补全',
      description: '交换机switch-core-02缺少物理位置、责任人等关键信息',
      affectedBusiness: '网络基础设施',
      priority: 'low' as TaskPriority,
      status: 'completed' as TaskStatus,
      responsibleUnit: '网络管理部' as ResponsibleUnit,
      responsiblePerson: '孙八',
      progress: 100,
      assetInfo: {
        assetId: 'ASSET-00312',
        assetName: 'switch-core-02',
        assetType: '核心交换机',
        disposalType: 'responsibility' as const
      }
    }
  ]

  assetTasks.forEach((task, index) => {
    const createdAt = dayjs().subtract(seededRandom(index + 80) * 48, 'hour').toISOString()
    const deadline = dayjs(createdAt).add(task.priority === 'high' ? 48 : task.priority === 'medium' ? 120 : 240, 'hour').toISOString()
    const seed = index + 201

    tasks.push({
      id: `task-asset-${index + 1}`,
      taskNo: generateTaskNo('asset', index + 1),
      type: 'asset',
      subCategory: getSubCategory('asset', seed),
      initiator: pickFromPool(INITIATOR_POOL, seed),
      previousApprover: pickFromPool(APPROVER_POOL, seed + 9),
      currentProcessor: seed % 5 === 0 ? TASK_CENTER_CURRENT_USER : (task.responsiblePerson ?? getProcessor(seed + 15)),
      createdAt,
      deadline,
      startedAt: task.status !== 'pending' ? dayjs(createdAt).add(seededRandom(index + 180) * 6, 'hour').toISOString() : undefined,
      completedAt: task.status === 'completed' ? dayjs(createdAt).add(seededRandom(index + 280) * 72, 'hour').toISOString() : undefined,
      ...task
    })
  })

  return tasks
}

/**
 * 生成任务统计数据
 */
export function generateTaskStatistics(tasks: CollaborationTask[]): TaskStatistics {
  const stats: TaskStatistics = {
    total: tasks.length,
    inProgress: 0,
    completed: 0,
    voided: 0,
    overdue: 0,
    byType: {
      alert: 0,
      vulnerability: 0,
      asset: 0
    },
    byUnit: {
      '运维开发部': 0,
      '安全管理部': 0,
      '网络管理部': 0,
      '系统管理部': 0,
      '数据管理部': 0
    }
  }

  tasks.forEach(task => {
    if (task.status === 'completed') {
      stats.completed++
    } else if (task.status === 'ignored') {
      stats.voided++
    } else {
      stats.inProgress++
    }

    if (task.status === 'overdue') {
      stats.overdue++
    }

    // 按类型统计
    stats.byType[task.type]++

    // 按责任单位统计
    stats.byUnit[task.responsibleUnit]++
  })

  return stats
}

/**
 * 生成任务执行记录
 */
export function generateTaskExecutionRecords(task: CollaborationTask): TaskExecutionRecord[] {
  const records: TaskExecutionRecord[] = [
    {
      id: `${task.id}-record-1`,
      taskId: task.id,
      action: '任务创建',
      operator: '系统自动',
      description: `检测到${task.type === 'alert' ? '告警' : task.type === 'vulnerability' ? '脆弱性' : '资产异常'},自动创建协同任务`,
      timestamp: task.createdAt,
      status: 'created'
    }
  ]

  if (task.status !== 'pending') {
    records.push({
      id: `${task.id}-record-2`,
      taskId: task.id,
      action: '任务指派',
      operator: '管理员',
      description: `任务已指派给${task.responsibleUnit}${task.responsiblePerson ? ` - ${task.responsiblePerson}` : ''}`,
      timestamp: dayjs(task.createdAt).add(1, 'hour').toISOString(),
      status: 'assigned'
    })
  }

  if (task.startedAt) {
    records.push({
      id: `${task.id}-record-3`,
      taskId: task.id,
      action: '开始处理',
      operator: task.responsiblePerson || task.responsibleUnit,
      description: '已确认任务,开始处理',
      timestamp: task.startedAt,
      status: 'processing'
    })
  }

  if (task.progress > 0 && task.progress < 100) {
    records.push({
      id: `${task.id}-record-4`,
      taskId: task.id,
      action: '进度更新',
      operator: task.responsiblePerson || task.responsibleUnit,
      description: `任务进度更新至${task.progress}%`,
      timestamp: dayjs(task.startedAt).add(Math.floor(seededRandom(parseInt(task.id.slice(-2))) * 24), 'hour').toISOString(),
      status: 'progress'
    })
  }

  if (task.completedAt) {
    records.push({
      id: `${task.id}-record-5`,
      taskId: task.id,
      action: '任务完成',
      operator: task.responsiblePerson || task.responsibleUnit,
      description: '任务已完成处理,等待验收',
      timestamp: task.completedAt,
      status: 'completed'
    })

    records.push({
      id: `${task.id}-record-6`,
      taskId: task.id,
      action: '验收通过',
      operator: '管理员',
      description: '任务处理结果已验收通过',
      timestamp: dayjs(task.completedAt).add(2, 'hour').toISOString(),
      status: 'accepted'
    })
  }

  if (task.status === 'overdue') {
    records.push({
      id: `${task.id}-record-overdue`,
      taskId: task.id,
      action: '任务逾期',
      operator: '系统自动',
      description: '任务已超过截止时间,标记为逾期',
      timestamp: task.deadline,
      status: 'overdue'
    })
  }

  return records
}
