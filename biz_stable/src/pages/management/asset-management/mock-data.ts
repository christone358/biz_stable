import type { BusinessInfo, HoneycombData, AssetItem, DependencyNode } from './types'

// 业务数据
export const businessDataList: BusinessInfo[] = [
  {
    id: 'businessA',
    name: '一网通办门户',
    group: 'yiliang',
    status: 'normal',
    assetCount: 64,
    info: {
      id: 'PORTAL-2023-001',
      status: '正常运行',
      createTime: '2021-03-15',
      sla: '99.9%',
      visits: '1.2亿/月',
      users: '4500万',
      description: '政务服务统一入口，提供一站式在线办事服务'
    },
    responsible: {
      owner: {
        org: '市大数据中心',
        contact: '张主任',
        phone: '138****1234'
      },
      developer: {
        org: '市信息化发展公司',
        contact: '王工程师',
        phone: '139****5678'
      },
      operator: {
        org: '市政务云运营中心',
        contact: '李运维',
        phone: '136****9012'
      }
    },
    assets: {
      app: { total: 12, running: 10, abnormal: 2, change: 2 },
      compute: { total: 28, running: 25, abnormal: 3, change: -1 },
      storage: { total: 15, running: 15, abnormal: 0, change: 3 },
      network: { total: 9, running: 9, abnormal: 0, change: 0 }
    }
  },
  {
    id: 'businessB',
    name: '随申办APP',
    group: 'yiliang',
    status: 'normal',
    assetCount: 39,
    info: {
      id: 'APP-2023-002',
      status: '正常运行',
      createTime: '2020-08-10',
      sla: '99.95%',
      visits: '8000万/月',
      users: '3200万',
      description: '移动端政务服务应用，提供便捷的掌上办事体验'
    },
    responsible: {
      owner: {
        org: '市大数据中心',
        contact: '赵主任',
        phone: '137****3456'
      },
      developer: {
        org: '市信息化发展公司',
        contact: '刘工程师',
        phone: '135****7890'
      },
      operator: {
        org: '市政务云运营中心',
        contact: '陈运维',
        phone: '139****2345'
      }
    },
    assets: {
      app: { total: 8, running: 7, abnormal: 1, change: 1 },
      compute: { total: 15, running: 14, abnormal: 1, change: 0 },
      storage: { total: 10, running: 10, abnormal: 0, change: 2 },
      network: { total: 6, running: 6, abnormal: 0, change: 0 }
    }
  },
  {
    id: 'businessC',
    name: '小程序',
    group: 'yiliang',
    status: 'warning',
    assetCount: 28,
    info: {
      id: 'MINI-2023-003',
      status: '部分异常',
      createTime: '2021-05-20',
      sla: '99.5%',
      visits: '5000万/月',
      users: '2800万',
      description: '微信小程序版政务服务应用'
    },
    responsible: {
      owner: {
        org: '市大数据中心',
        contact: '孙主任',
        phone: '136****5678'
      },
      developer: {
        org: '市信息化发展公司',
        contact: '周工程师',
        phone: '138****9012'
      },
      operator: {
        org: '市政务云运营中心',
        contact: '吴运维',
        phone: '137****3456'
      }
    },
    assets: {
      app: { total: 6, running: 5, abnormal: 1, change: 0 },
      compute: { total: 12, running: 11, abnormal: 1, change: 0 },
      storage: { total: 7, running: 7, abnormal: 0, change: 1 },
      network: { total: 3, running: 3, abnormal: 0, change: 0 }
    }
  }
]

// 蜂窝矩阵数据
export const honeycombDataMap: Record<string, HoneycombData[]> = {
  app: [
    { type: '前端应用', count: 5, color: '#fa541c', status: 'normal', assets: ['门户首页', '用户中心', '办事大厅', '我的办件', '消息中心'] },
    { type: '后端服务', count: 6, color: '#722ed1', status: 'normal', assets: ['用户服务', '认证服务', '办件服务', '支付服务', '消息服务', '文件服务'] },
    { type: '中间件', count: 1, color: '#13c2c2', status: 'abnormal', assets: ['消息队列'] }
  ],
  compute: [
    { type: '云服务器', count: 18, color: '#52c41a', status: 'normal', assets: ['WEB-01', 'WEB-02', 'WEB-03', 'APP-01', 'APP-02', 'DB-01', 'DB-02', 'CACHE-01', 'CACHE-02', 'SEARCH-01', 'SEARCH-02', 'FILE-01', 'FILE-02', 'AUTH-01', 'AUTH-02', 'PAY-01', 'PAY-02', 'MSG-01'] },
    { type: '容器集群', count: 8, color: '#1890ff', status: 'normal', assets: ['K8S-MASTER', 'K8S-NODE-01', 'K8S-NODE-02', 'K8S-NODE-03', 'K8S-NODE-04', 'K8S-NODE-05', 'K8S-NODE-06', 'K8S-NODE-07'] },
    { type: '函数计算', count: 2, color: '#faad14', status: 'abnormal', assets: ['FC-IMAGE', 'FC-DOC'] }
  ],
  storage: [
    { type: '对象存储', count: 8, color: '#722ed1', status: 'normal', assets: ['OSS-USER', 'OSS-FILE', 'OSS-IMAGE', 'OSS-VIDEO', 'OSS-BACKUP', 'OSS-TEMP', 'OSS-LOG', 'OSS-ARCHIVE'] },
    { type: '块存储', count: 4, color: '#1890ff', status: 'normal', assets: ['DISK-DB', 'DISK-CACHE', 'DISK-SEARCH', 'DISK-BACKUP'] },
    { type: '文件存储', count: 3, color: '#13c2c2', status: 'normal', assets: ['NAS-SHARE', 'NAS-BACKUP', 'NAS-TEMP'] }
  ],
  network: [
    { type: '负载均衡', count: 3, color: '#fa8c16', status: 'normal', assets: ['SLB-WEB', 'SLB-APP', 'SLB-API'] },
    { type: 'VPN网关', count: 2, color: '#52c41a', status: 'normal', assets: ['VPN-OFFICE', 'VPN-MOBILE'] },
    { type: 'NAT网关', count: 2, color: '#1890ff', status: 'normal', assets: ['NAT-PUBLIC', 'NAT-BACKUP'] },
    { type: 'CDN', count: 2, color: '#eb2f96', status: 'normal', assets: ['CDN-STATIC', 'CDN-VIDEO'] }
  ]
}

// 台账数据示例 - 应用层
export const assetTableData: Record<string, AssetItem[]> = {
  app: [
    { name: '门户首页', type: '前端应用', status: 'running', address: 'https://zwdt.sh.gov.cn', config: 'Vue 3.0', owner: '前端团队', operation: '详情' },
    { name: '用户中心', type: '前端应用', status: 'running', address: 'https://user.zwdt.sh.gov.cn', config: 'React 18', owner: '前端团队', operation: '详情' },
    { name: '办事大厅', type: '前端应用', status: 'running', address: 'https://service.zwdt.sh.gov.cn', config: 'Vue 3.0', owner: '前端团队', operation: '详情' },
    { name: '我的办件', type: '前端应用', status: 'running', address: 'https://my.zwdt.sh.gov.cn', config: 'React 18', owner: '前端团队', operation: '详情' },
    { name: '消息中心', type: '前端应用', status: 'abnormal', address: 'https://message.zwdt.sh.gov.cn', config: 'Vue 3.0', owner: '前端团队', operation: '详情' },
    { name: '用户服务', type: '后端服务', status: 'running', address: '10.0.1.1:8080', config: 'Java Spring', owner: '后端团队', operation: '详情' }
  ],
  compute: [
    { name: 'WEB-01', type: '云服务器', status: 'running', address: '192.168.1.1', config: '4核8G', owner: '运维团队', operation: '详情' },
    { name: 'WEB-02', type: '云服务器', status: 'running', address: '192.168.1.2', config: '4核8G', owner: '运维团队', operation: '详情' },
    { name: 'WEB-03', type: '云服务器', status: 'running', address: '192.168.1.3', config: '4核8G', owner: '运维团队', operation: '详情' }
  ],
  storage: [
    { name: 'OSS-USER', type: '对象存储', status: 'running', address: 'oss://user-bucket', config: '100GB', owner: '存储团队', operation: '详情' },
    { name: 'OSS-FILE', type: '对象存储', status: 'running', address: 'oss://file-bucket', config: '500GB', owner: '存储团队', operation: '详情' }
  ],
  network: [
    { name: 'SLB-WEB', type: '负载均衡', status: 'running', address: 'slb.zwdt.sh.gov.cn', config: 'HTTP/HTTPS', owner: '网络团队', operation: '详情' },
    { name: 'SLB-APP', type: '负载均衡', status: 'running', address: 'api.zwdt.sh.gov.cn', config: 'HTTP/HTTPS', owner: '网络团队', operation: '详情' }
  ]
}

// 依赖图数据
export const dependencyGraphData: DependencyNode[] = [
  {
    id: 'businessA',
    type: 'business',
    name: '一网通办门户',
    x: 300,
    y: 100,
    connections: ['web-app', 'payment-app', 'user-app']
  },
  {
    id: 'web-app',
    type: 'app',
    name: 'Web应用',
    x: 150,
    y: 200,
    connections: ['web-service', 'load-balancer']
  },
  {
    id: 'payment-app',
    type: 'app',
    name: '支付应用',
    x: 300,
    y: 200,
    connections: ['payment-service', 'payment-db']
  },
  {
    id: 'user-app',
    type: 'app',
    name: '用户应用',
    x: 450,
    y: 200,
    connections: ['user-service', 'user-db']
  },
  {
    id: 'web-service',
    type: 'service',
    name: 'Web服务',
    x: 100,
    y: 300,
    connections: ['app-server-1']
  },
  {
    id: 'payment-service',
    type: 'service',
    name: '支付服务',
    x: 250,
    y: 300,
    connections: ['payment-db']
  },
  {
    id: 'user-service',
    type: 'service',
    name: '用户服务',
    x: 400,
    y: 300,
    connections: ['user-db']
  },
  {
    id: 'load-balancer',
    type: 'resource',
    name: '负载均衡',
    x: 150,
    y: 400
  },
  {
    id: 'app-server-1',
    type: 'resource',
    name: '应用服务器1',
    x: 50,
    y: 400
  },
  {
    id: 'payment-db',
    type: 'database',
    name: '支付数据库',
    x: 250,
    y: 400
  },
  {
    id: 'user-db',
    type: 'database',
    name: '用户数据库',
    x: 400,
    y: 400
  }
]
