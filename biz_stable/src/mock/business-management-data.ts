// 业务板块管理Mock数据生成

import {
  BusinessNode,
  BusinessDetail,
  ContactPerson,
  ResponsibleUnit,
  CooperativeUnit
} from '../pages/business-management/types'

// 生成联系人
const generateContactPerson = (
  name: string,
  role: string,
  isPrimary: boolean = false
): ContactPerson => ({
  id: `contact-${Date.now()}-${Math.random()}`,
  name,
  role,
  phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
  email: `${name.toLowerCase()}@gov.cn`,
  wechat: `wx_${name}`,
  isPrimary
})

// 生成责任单位
const generateResponsibleUnit = (
  unitName: string,
  primaryContactName: string,
  primaryContactRole: string
): ResponsibleUnit => ({
  unitName,
  unitCode: `UNIT-${Math.floor(1000 + Math.random() * 9000)}`,
  department: '运营保障部',
  primaryContact: generateContactPerson(primaryContactName, primaryContactRole, true),
  backupContacts: [
    generateContactPerson('李四', '副主任', false),
    generateContactPerson('王五', '技术负责人', false)
  ],
  cooperativeUnits: []
})

// 生成业务树数据
export const generateMockBusinessTree = (): BusinessNode[] => {
  return [
    // 一梁
    {
      id: 'beam',
      name: '一梁',
      code: 'BEAM',
      nodeType: 'CATEGORY',
      level: 1,
      parentId: null,
      order: 1,
      hasDetail: false,
      children: [
        {
          id: 'beam-portal',
          name: '一网通办门户',
          code: 'PORTAL-001',
          nodeType: 'CATEGORY',
          level: 2,
          parentId: 'beam',
          order: 1,
          hasDetail: false,
          children: [
            {
              id: 'beam-portal-pc',
              name: 'PC门户',
              code: 'PORTAL-PC-001',
              nodeType: 'BUSINESS',
              level: 3,
              parentId: 'beam-portal',
              order: 1,
              hasDetail: true
            },
            {
              id: 'beam-portal-h5',
              name: 'H5门户',
              code: 'PORTAL-H5-001',
              nodeType: 'BUSINESS',
              level: 3,
              parentId: 'beam-portal',
              order: 2,
              hasDetail: true
            }
          ]
        },
        {
          id: 'beam-app',
          name: '随申办APP',
          code: 'APP-001',
          nodeType: 'CATEGORY',
          level: 2,
          parentId: 'beam',
          order: 2,
          hasDetail: false,
          children: [
            {
              id: 'beam-app-ios',
              name: 'iOS版',
              code: 'APP-IOS-001',
              nodeType: 'BUSINESS',
              level: 3,
              parentId: 'beam-app',
              order: 1,
              hasDetail: true
            },
            {
              id: 'beam-app-android',
              name: 'Android版',
              code: 'APP-ANDROID-001',
              nodeType: 'BUSINESS',
              level: 3,
              parentId: 'beam-app',
              order: 2,
              hasDetail: true
            }
          ]
        },
        {
          id: 'beam-miniapp',
          name: '小程序入口',
          code: 'MINIAPP-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'beam',
          order: 3,
          hasDetail: true
        }
      ]
    },

    // 四柱
    {
      id: 'pillar',
      name: '四柱',
      code: 'PILLAR',
      nodeType: 'CATEGORY',
      level: 1,
      parentId: null,
      order: 2,
      hasDetail: false,
      children: [
        {
          id: 'pillar-payment',
          name: '统一公共支付',
          code: 'PAY-001',
          nodeType: 'CATEGORY',
          level: 2,
          parentId: 'pillar',
          order: 1,
          hasDetail: false,
          children: [
            {
              id: 'pillar-payment-gateway',
              name: '支付网关',
              code: 'PAY-GATEWAY-001',
              nodeType: 'BUSINESS',
              level: 3,
              parentId: 'pillar-payment',
              order: 1,
              hasDetail: true
            },
            {
              id: 'pillar-payment-reconciliation',
              name: '对账服务',
              code: 'PAY-RECON-001',
              nodeType: 'BUSINESS',
              level: 3,
              parentId: 'pillar-payment',
              order: 2,
              hasDetail: true
            }
          ]
        },
        {
          id: 'pillar-auth',
          name: '统一身份认证',
          code: 'AUTH-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'pillar',
          order: 2,
          hasDetail: true
        },
        {
          id: 'pillar-service',
          name: '统一客服',
          code: 'CS-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'pillar',
          order: 3,
          hasDetail: true
        },
        {
          id: 'pillar-logistics',
          name: '统一物流快递',
          code: 'LOGISTICS-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'pillar',
          order: 4,
          hasDetail: true
        }
      ]
    },

    // 一库
    {
      id: 'database',
      name: '一库',
      code: 'DATABASE',
      nodeType: 'CATEGORY',
      level: 1,
      parentId: null,
      order: 3,
      hasDetail: false,
      children: [
        {
          id: 'database-public',
          name: '公共信息库',
          code: 'DB-PUBLIC-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'database',
          order: 1,
          hasDetail: true
        },
        {
          id: 'database-population',
          name: '人口信息库',
          code: 'DB-POP-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'database',
          order: 2,
          hasDetail: true
        },
        {
          id: 'database-spatial',
          name: '空间地理信息库',
          code: 'DB-SPATIAL-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'database',
          order: 3,
          hasDetail: true
        }
      ]
    },

    // 多应用
    {
      id: 'applications',
      name: '多应用',
      code: 'APPS',
      nodeType: 'CATEGORY',
      level: 1,
      parentId: null,
      order: 4,
      hasDetail: false,
      children: [
        {
          id: 'app-enterprise',
          name: '企业开办一件事',
          code: 'APP-ENT-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'applications',
          order: 1,
          hasDetail: true
        },
        {
          id: 'app-birth',
          name: '出生一件事',
          code: 'APP-BIRTH-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'applications',
          order: 2,
          hasDetail: true
        },
        {
          id: 'app-marriage',
          name: '结婚落户一件事',
          code: 'APP-MARRIAGE-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'applications',
          order: 3,
          hasDetail: true
        },
        {
          id: 'app-innovation',
          name: '创新创业一件事',
          code: 'APP-INNO-001',
          nodeType: 'BUSINESS',
          level: 2,
          parentId: 'applications',
          order: 4,
          hasDetail: true
        }
      ]
    }
  ]
}

// 生成业务详细信息
export const generateMockBusinessDetail = (businessId: string, businessName: string): BusinessDetail => {
  const now = new Date()

  return {
    id: `detail-${businessId}`,
    businessId,

    // 基本信息
    name: businessName,
    code: businessId.toUpperCase(),
    description: `${businessName}是XX市大数据中心的核心业务系统，为市民和企业提供便捷的政务服务。`,
    businessType: '支撑平台',
    importance: 'CRITICAL',
    operationStatus: 'RUNNING',

    // 业务特性
    serviceScope: '全市范围',
    serviceTarget: ['市民', '企业'],
    operationTime: '7×24',
    annualVisits: Math.floor(1000000 + Math.random() * 9000000),
    coverageRate: Math.floor(85 + Math.random() * 15),

    // 责任单位
    responsibleUnit: generateResponsibleUnit(
      'XX市大数据中心',
      '张三',
      '中心主任'
    ),
    operationUnit: generateResponsibleUnit(
      'XX科技运维公司',
      '赵六',
      '运维经理'
    ),
    developmentUnit: generateResponsibleUnit(
      'XX软件开发公司',
      '孙七',
      '技术总监'
    ),

    // 业务关系
    upstreamBusinessIds: [],
    downstreamBusinessIds: [],

    // 元数据
    createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: '系统管理员',
    updatedBy: '张三'
  }
}

// 扁平化业务树，获取所有节点
export const flattenBusinessTree = (nodes: BusinessNode[]): BusinessNode[] => {
  const result: BusinessNode[] = []

  const flatten = (node: BusinessNode) => {
    result.push(node)
    if (node.children) {
      node.children.forEach(flatten)
    }
  }

  nodes.forEach(flatten)
  return result
}

// 根据ID查找业务节点
export const findBusinessNodeById = (
  tree: BusinessNode[],
  id: string
): BusinessNode | null => {
  for (const node of tree) {
    if (node.id === id) {
      return node
    }
    if (node.children) {
      const found = findBusinessNodeById(node.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 获取节点的完整路径
export const getBusinessPath = (
  tree: BusinessNode[],
  targetId: string
): BusinessNode[] => {
  const path: BusinessNode[] = []

  const findPath = (nodes: BusinessNode[], target: string): boolean => {
    for (const node of nodes) {
      path.push(node)
      if (node.id === target) {
        return true
      }
      if (node.children && findPath(node.children, target)) {
        return true
      }
      path.pop()
    }
    return false
  }

  findPath(tree, targetId)
  return path
}
