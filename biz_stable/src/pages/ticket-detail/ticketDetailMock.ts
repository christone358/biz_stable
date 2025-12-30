import dayjs from 'dayjs'
import type {
  TicketDetailData,
  TicketKind,
  HandleModuleSchema,
  TicketAttachment,
  TicketHistoryRecord,
} from './types'

const baseAttachments: TicketAttachment[] = [
  {
    id: 'att-1',
    name: '执行前截图.png',
    size: '1.2MB',
    uploader: '系统自动',
    time: '2025-01-10 09:00',
  },
  {
    id: 'att-2',
    name: '变更审批单.pdf',
    size: '890KB',
    uploader: '安全管理部',
    time: '2025-01-10 08:45',
  },
]

const historySample: TicketHistoryRecord[] = [
  {
    id: 'hist-1',
    type: 'submit',
    operator: '安全加固一组',
    time: '2025-01-10 10:30',
    summary: '提交办理结果：成功 3 / 失败 1',
    detail: '失败原因：目标设备 192.168.1.33 超出维护窗口',
  },
  {
    id: 'hist-2',
    type: 'transfer',
    operator: '安全运营中心',
    time: '2025-01-09 18:15',
    summary: '转派给 应急支援组',
  },
  {
    id: 'hist-3',
    type: 'return',
    operator: '业务系统负责人',
    time: '2025-01-08 16:05',
    summary: '退回：信息不完整，缺少二级系统说明',
  },
]

const detailTemplates: Record<TicketKind, Partial<TicketDetailData>> = {
  internet: {
    title: '互联网准入申请单',
    businessSystem: { level1: '互联网准入', level2: '网络安全服务' },
    summary: [
      { label: '联系人', value: '李四' },
      { label: '联系手机', value: '139****4444' },
      { label: '政务网账号', value: 'GOV-INET-001' },
      { label: '互联网访问', value: '开通' },
      { label: '部门', value: '市政务服务中心' },
      { label: '姓名', value: '李四' },
      { label: '计算机名', value: 'PC-LS-01' },
      { label: 'IP地址', value: '10.10.20.10' },
      { label: 'MAC地址', value: 'BB-CC-DD-44-55-66' },
      { label: '用途', value: '政务数据采集' },
    ],
  },
  govnet: {
    title: '政务外网准入办理单',
    businessSystem: { level1: '政务外网准入', level2: '网络安全服务' },
    summary: [
      { label: '申请人', value: '张三' },
      { label: '联系手机', value: '138****3333' },
      { label: '设备类型', value: '笔记本' },
      { label: '政务网IP', value: '10.10.10.12' },
      { label: '系统', value: '政务办公系统' },
      { label: '使用人', value: '张三' },
      { label: '联系方式', value: '138****3333' },
      { label: '厂商型号', value: '联想 ThinkPad X1' },
      { label: '目的', value: '政务业务联网' },
      { label: '申请说明', value: '用于政务外网访问任务' },
    ],
  },
  inspection: {
    title: '专项检查任务单',
    businessSystem: { level1: '专项检查', level2: '安全自查' },
    summary: [
      { label: '检查主题', value: '网络安全专项检查' },
      { label: '牵头单位', value: '安全运营中心' },
    ],
  },
  assessment: {
    title: '测评支持任务单',
    businessSystem: { level1: '测评支持', level2: '等保测评' },
    summary: [
      { label: '测评系统', value: '政务服务平台' },
      { label: '测评阶段', value: '复测' },
    ],
  },
  'system-online': {
    title: '系统上线申请单',
    businessSystem: { level1: '系统上线', level2: '变更管理' },
    summary: [
      { label: '系统名称', value: '政务服务门户' },
      { label: '上线窗口', value: '2025-01-15 01:00-03:00' },
    ],
  },
  'resource-recycle': {
    title: '资源回收申请单',
    businessSystem: { level1: '资源回收', level2: '资源池' },
    summary: [
      { label: '资源类型', value: '云主机' },
      { label: '回收数量', value: '3 台' },
    ],
  },
  'security-hardening': {
    title: '安全加固任务单',
    businessSystem: { level1: '安全加固', level2: '运行保障' },
    summary: [
      { label: '任务来源', value: '安全检查' },
      { label: '影响系统', value: '财政支付系统' },
    ],
  },
  emergency: {
    title: '应急处置任务单',
    businessSystem: { level1: '应急处置', level2: '事件响应' },
    summary: [
      { label: '事件名称', value: '资产入侵事件' },
      { label: '事件级别', value: 'P1' },
    ],
  },
}

const handleTemplates: Record<TicketKind, HandleModuleSchema[]> = {
  internet: [
    {
      id: 'receipt',
      title: '准入回执',
      type: 'formGrid',
      fields: [
        { key: 'receiptApplicant', label: '申请人', type: 'text', required: true },
        { key: 'receiptPhone', label: '联系手机', type: 'text', required: true },
        { key: 'result', label: '回执结果', type: 'select', required: true, options: [
          { label: '通过', value: 'pass' },
          { label: '不通过', value: 'reject' },
        ] },
        { key: 'resultDesc', label: '回执描述', type: 'textarea' },
      ],
    },
  ],
  govnet: [
    {
      id: 'receipt',
      title: '准入回执',
      type: 'formGrid',
      fields: [
        { key: 'receiptApplicant', label: '申请人', type: 'text', required: true },
        { key: 'receiptPhone', label: '联系手机', type: 'text', required: true },
        { key: 'result', label: '回执结果', type: 'select', required: true, options: [
          { label: '通过', value: 'pass' },
          { label: '不通过', value: 'reject' },
        ] },
        { key: 'resultDesc', label: '回执描述', type: 'textarea' },
      ],
    },
  ],
  inspection: [
    {
      id: 'basic',
      title: '专项检查计划',
      type: 'formGrid',
      fields: [
        { key: 'subject', label: '检查主题', type: 'text', required: true },
        { key: 'owner', label: '牵头单位', type: 'text', required: true },
        { key: 'period', label: '检查周期', type: 'text', required: true },
        { key: 'scope', label: '检查范围', type: 'textarea', required: true },
        { key: 'lead', label: '检查负责人', type: 'text' },
      ],
    },
    {
      id: 'items',
      title: '问题整改跟踪',
      type: 'dataTable',
      columns: [
        { key: 'item', title: '检查项', required: true },
        { key: 'responsible', title: '责任单位', required: true },
        { key: 'deadline', title: '整改期限', required: true },
        { key: 'status', title: '状态', required: true },
        { key: 'remark', title: '说明' },
      ],
    },
  ],
  assessment: [
    {
      id: 'support',
      title: '测评支撑概要',
      type: 'formGrid',
      fields: [
        { key: 'system', label: '系统名称', type: 'text', required: true },
        { key: 'phase', label: '测评阶段', type: 'select', required: true, options: [
          { label: '初测', value: 'initial' },
          { label: '复测', value: 'second' },
        ] },
        { key: 'window', label: '支撑窗口', type: 'text', required: true },
        { key: 'requirement', label: '支撑需求', type: 'textarea', required: true },
      ],
    },
    {
      id: 'components',
      title: '测评对象明细',
      type: 'dataTable',
      columns: [
        { key: 'asset', title: '组件/资产', required: true },
        { key: 'type', title: '类型', required: true },
        { key: 'contact', title: '联系人', required: true },
        { key: 'deliverable', title: '支撑内容', required: true },
        { key: 'status', title: '状态', required: true },
      ],
    },
  ],
  'system-online': [
    {
      id: 'online-info',
      title: '上线信息',
      type: 'formGrid',
      fields: [
        { key: 'system', label: '系统名称', type: 'text', required: true },
        { key: 'version', label: '版本/补丁', type: 'text' },
        { key: 'window', label: '上线窗口', type: 'text', required: true },
        { key: 'risk', label: '风险评估', type: 'textarea', required: true },
        { key: 'rollback', label: '回滚方案', type: 'textarea' },
      ],
    },
    {
      id: 'steps',
      title: '上线步骤',
      type: 'dataTable',
      columns: [
        { key: 'step', title: '步骤', required: true },
        { key: 'owner', title: '责任人', required: true },
        { key: 'start', title: '计划开始', required: true },
        { key: 'end', title: '计划结束', required: true },
        { key: 'status', title: '状态', required: true },
        { key: 'remark', title: '备注' },
      ],
    },
  ],
  'resource-recycle': [
    {
      id: 'resource',
      title: '回收申请',
      type: 'formGrid',
      fields: [
        { key: 'requestDept', label: '申请部门', type: 'text', required: true },
        { key: 'contact', label: '联系人', type: 'text', required: true },
        { key: 'reason', label: '回收原因', type: 'textarea', required: true },
        { key: 'deadline', label: '完成期限', type: 'text', required: true },
      ],
    },
    {
      id: 'resource-items',
      title: '资源明细',
      type: 'dataTable',
      columns: [
        { key: 'type', title: '资源类型', required: true },
        { key: 'identifier', title: '标识/ID', required: true },
        { key: 'spec', title: '规格', required: true },
        { key: 'owner', title: '当前占用人', required: true },
        { key: 'status', title: '处理状态', required: true },
        { key: 'remark', title: '备注' },
      ],
    },
  ],
  'security-hardening': [
    {
      id: 'hardening',
      title: '加固方案',
      type: 'formGrid',
      fields: [
        { key: 'plan', label: '方案名称', type: 'text', required: true },
        { key: 'window', label: '执行窗口', type: 'text', required: true },
        { key: 'rollBack', label: '回滚预案', type: 'textarea', required: true },
        { key: 'risk', label: '风险提示', type: 'textarea' },
      ],
    },
    {
      id: 'checklist',
      title: '加固清单',
      type: 'dataTable',
      columns: [
        { key: 'asset', title: '资产/设备', required: true },
        { key: 'item', title: '加固项', required: true },
        { key: 'expect', title: '期望状态', required: true },
        { key: 'status', title: '执行状态', required: true },
        { key: 'reason', title: '说明' },
      ],
    },
  ],
  emergency: [
    {
      id: 'emergency',
      title: '事件概要',
      type: 'formGrid',
      fields: [
        { key: 'event', label: '事件名称', type: 'text', required: true },
        { key: 'level', label: '事件级别', type: 'select', required: true, options: [
          { label: 'P0', value: 'P0' },
          { label: 'P1', value: 'P1' },
          { label: 'P2', value: 'P2' },
        ] },
        { key: 'startTime', label: '开始时间', type: 'text', required: true },
        { key: 'lead', label: '指挥负责人', type: 'text', required: true },
        { key: 'summary', label: '事件概述', type: 'textarea', required: true },
      ],
    },
    {
      id: 'actions',
      title: '处置动作记录',
      type: 'dataTable',
      columns: [
        { key: 'action', title: '动作', required: true },
        { key: 'owner', title: '责任人', required: true },
        { key: 'start', title: '开始时间', required: true },
        { key: 'end', title: '结束时间', required: true },
        { key: 'status', title: '状态', required: true },
        { key: 'remark', title: '说明' },
      ],
    },
  ],
}

const randomId = () => Math.random().toString(36).slice(2, 10)

export const buildTicketTemplate = (
  kind: TicketKind = 'security-hardening',
  overrides?: Partial<TicketDetailData>,
): TicketDetailData => {
  const now = dayjs().format('YYYY-MM-DD HH:mm')
  const detail = detailTemplates[kind] ?? {}
  const base: TicketDetailData = {
    id: overrides?.id ?? detail.id ?? randomId(),
    title: overrides?.title ?? detail.title ?? '通用工单示例',
    ticketNo:
      overrides?.ticketNo ?? detail.ticketNo ?? `TKT-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random() * 1000)}`,
    status: overrides?.status ?? detail.status ?? 'processing',
    priority: overrides?.priority ?? detail.priority ?? 'P2',
    createdAt: overrides?.createdAt ?? detail.createdAt ?? now,
    creator: overrides?.creator ?? detail.creator ?? '系统分派',
    businessSystem:
      overrides?.businessSystem ??
      detail.businessSystem ?? {
        level1: '政务服务平台',
        level2: '运行保障',
      },
    summary: overrides?.summary ?? detail.summary ?? [
      { label: '当前节点', value: '安全加固执行' },
      { label: '责任单位', value: '安全运营中心' },
    ],
    attachments: overrides?.attachments ?? detail.attachments ?? baseAttachments,
    handleModules: overrides?.handleModules ?? handleTemplates[kind] ?? handleTemplates.task,
    history: overrides?.history ?? detail.history ?? historySample,
  }
  return base
}
