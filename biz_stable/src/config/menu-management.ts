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
        key: '/management/asset-panorama',
        label: '资产全景',
      },
      // 旧的资产管理页面已隐藏，将使用新的资产全景页面替代
      // {
      //   key: '/management/asset-management',
      //   label: '资产管理',
      // },
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
