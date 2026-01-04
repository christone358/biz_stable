import dayjs from 'dayjs'
import type {
  TicketDetailData,
  TicketKind,
  HandleModuleSchema,
  TicketAttachment,
  TicketHistoryRecord,
  TicketActionType,
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
      { label: '需求类型', value: '互联网准入' },
      { label: '所属部门', value: '市政务服务中心' },
    ],
    detailModules: [
      {
        id: 'internet-core',
        title: '申请详情',
        type: 'formGrid',
        fields: [
          { key: 'contact', label: '联系人', value: '李四' },
          { key: 'phone', label: '联系手机', value: '139****4444' },
          { key: 'department', label: '部门', value: '市政务服务中心' },
          { key: 'userName', label: '姓名', value: '李四' },
          { key: 'purpose', label: '用途', value: '政务数据采集' },
          { key: 'internetAccess', label: '互联网访问', value: '开通' },
        ],
      },
      {
        id: 'access-users',
        title: '访问用户明细列表',
        type: 'dataTable',
        columns: [
          { key: 'govAccount', title: '政务网账号' },
          { key: 'internetAccess', title: '互联网访问' },
          { key: 'dept', title: '部门' },
          { key: 'user', title: '姓名' },
          { key: 'computer', title: '计算机名' },
          { key: 'ip', title: 'IP地址' },
          { key: 'mac', title: 'MAC地址' },
          { key: 'use', title: '用途' },
        ],
        rows: [
          {
            id: 'inet-1',
            govAccount: 'GOV-INET-001',
            internetAccess: '开通',
            dept: '政务中心',
            user: '李四',
            computer: 'PC-LS-01',
            ip: '10.10.20.10',
            mac: 'BB-CC-DD-44-55-66',
            use: '政务数据采集',
          },
          {
            id: 'inet-2',
            govAccount: 'GOV-INET-002',
            internetAccess: '开通',
            dept: '数据资源局',
            user: '王敏',
            computer: 'PC-WM-02',
            ip: '10.10.20.11',
            mac: 'AA-BB-CC-11-22-33',
            use: '数据共享访问',
          },
        ],
      },
    ],
  },
  govnet: {
    title: '政务外网准入办理单',
    businessSystem: { level1: '政务外网准入', level2: '网络安全服务' },
    summary: [
      { label: '需求类型', value: '政务外网准入' },
      { label: '申请部门', value: '市政务办' },
    ],
    detailModules: [
      {
        id: 'govnet-core',
        title: '申请详情',
        type: 'formGrid',
        fields: [
          { key: 'applicant', label: '申请人', value: '张三' },
          { key: 'phone', label: '联系手机', value: '138****3333' },
          { key: 'deviceType', label: '设备类型', value: '笔记本' },
          { key: 'govIp', label: '政务网IP', value: '10.10.10.12' },
          { key: 'system', label: '系统', value: '政务办公系统' },
          { key: 'purpose', label: '目的', value: '政务业务联网' },
        ],
      },
      {
        id: 'device-table',
        title: '设备/账户明细',
        type: 'dataTable',
        columns: [
          { key: 'deviceType', title: '设备类型' },
          { key: 'govIp', title: '政务网IP' },
          { key: 'system', title: '系统' },
          { key: 'user', title: '使用人' },
          { key: 'contact', title: '联系方式' },
          { key: 'vendor', title: '厂商型号' },
          { key: 'purpose', title: '目的' },
          { key: 'desc', title: '申请说明' },
        ],
        rows: [
          {
            id: 'govnet-1',
            deviceType: '笔记本',
            govIp: '10.10.10.12',
            system: '政务办公系统',
            user: '张三',
            contact: '138****3333',
            vendor: '联想 ThinkPad X1',
            purpose: '政务业务联网',
            desc: '用于外联业务审批',
          },
        ],
      },
    ],
  },
}

const actionTypeDefaults: Record<TicketKind, TicketActionType> = {
  internet: 'handle',
  govnet: 'handle',
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
          { label: '驳回', value: 'reject' },
        ] },
        { key: 'desc', label: '回执描述', type: 'textarea' },
      ],
    },
  ],
  govnet: [
    {
      id: 'govnet-result',
      title: '准入回执',
      type: 'formGrid',
      fields: [
        { key: 'applicant', label: '申请人', type: 'text', required: true },
        { key: 'phone', label: '联系手机', type: 'text', required: true },
        { key: 'result', label: '回执结果', type: 'select', required: true, options: [
          { label: '通过', value: 'pass' },
          { label: '驳回', value: 'reject' },
        ] },
        { key: 'desc', label: '回执描述', type: 'textarea' },
      ],
    },
  ],
}

const randomId = () => Math.random().toString(36).slice(2, 10)

export const buildTicketTemplate = (
  kind: TicketKind = 'internet',
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
    detailModules: overrides?.detailModules ?? detail.detailModules,
    attachments: overrides?.attachments ?? detail.attachments ?? baseAttachments,
    handleModules: overrides?.handleModules ?? handleTemplates[kind],
    history: overrides?.history ?? detail.history ?? historySample,
    currentActionType:
      overrides?.currentActionType ?? detail.currentActionType ?? actionTypeDefaults[kind] ?? 'handle',
  }
  return base
}
