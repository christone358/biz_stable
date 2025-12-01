import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

// 系统一：业务保障管理系统菜单配置
export const managementMenuItems: MenuItem[] = [
  {
    key: 'business-panorama',
    label: '业务全景',
    children: [
      {
        key: '/management/business-panorama',
        label: '业务健康概览',
      },
      {
        key: '/management/business-monitoring',
        label: '业务运行监测',
      },
    ],
  },
  {
    key: 'business-asset',
    label: '业务资产管理',
    children: [
      {
        key: '/management/business-management',
        label: '业务板块管理',
      },
      {
        key: '/management/asset-management',
        label: '业务资产管理',
      },
      {
        key: 'terminal-asset-management',
        label: '终端资产管理',
        children: [
          {
            key: '/management/terminal-assets/overview',
            label: '终端资产概览',
          },
          {
            key: '/management/terminal-assets/cloud-hosts',
            label: '云主机管理',
          },
          {
            key: '/management/terminal-assets/office-terminals',
            label: '办公终端管理',
          },
          {
            key: '/management/terminal-assets/integrations',
            label: '资产集成配置',
          },
          {
            key: '/management/terminal-assets/analytics',
            label: '资产统计分析',
          },
        ],
      },
    ],
  },
  {
    key: 'business-support',
    label: '业务保障管理',
    children: [
      {
        key: '/management/alert-monitoring',
        label: '资产告警监测',
      },
      {
        key: '/management/asset-operations',
        label: '资产运营',
      },
      {
        key: '/management/vulnerability',
        label: '脆弱性管理',
      },
    ],
  },
  {
    key: 'collaboration-center',
    label: '协同工作中心',
    children: [
      {
        key: '/management/task-management',
        label: '协同任务管理',
      },
      {
        key: '/management/task-records',
        label: '任务执行记录',
      },
    ],
  },
]
