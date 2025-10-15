import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

// 系统二：业务协同管理系统菜单配置
export const collaborationMenuItems: MenuItem[] = [
  {
    key: 'business-operation',
    label: '业务运行保障',
    children: [
      {
        key: '/collaboration/asset-monitoring',
        label: '资产监测',
      },
      {
        key: '/collaboration/runtime-alerts',
        label: '运行告警',
      },
      {
        key: '/collaboration/vulnerability',
        label: '脆弱性',
      },
    ],
  },
  {
    key: 'collaboration-tasks',
    label: '协同任务',
    children: [
      {
        key: '/collaboration/todo-center',
        label: '待办任务中心',
      },
      {
        key: '/collaboration/task-records',
        label: '任务处置记录',
      },
    ],
  },
  {
    key: 'asset-management',
    label: '资产管理',
    children: [
      {
        key: '/collaboration/asset-info',
        label: '资产信息管理',
      },
      {
        key: '/collaboration/asset-issues',
        label: '资产异常问题处置',
      },
    ],
  },
]
