import type {
  Vulnerability,
  Asset,
  Alert,
  TaskStatisticsData,
  TodayStatistics,
} from '../types'

/**
 * 生成脆弱性数据
 */
export const generateVulnerabilities = (): Vulnerability[] => {
  return [
    {
      id: 'vuln-1',
      name: 'Apache Log4j2 远程代码执行漏洞',
      cveId: 'CVE-2021-44228',
      riskLevel: 'high',
      affectedAssets: 3,
      affectedBusiness: '一网通办门户',
      publishTime: '2小时前',
      status: 'unhandled',
      description: 'Apache Log4j2存在JNDI注入漏洞，当程序记录包含特殊格式的字符串时，会触发远程代码执行。攻击者可利用该漏洞在目标服务器上执行任意代码。',
    },
    {
      id: 'vuln-2',
      name: 'Nginx 权限绕过漏洞',
      cveId: 'CVE-2021-23017',
      riskLevel: 'medium',
      affectedAssets: 5,
      affectedBusiness: '统一身份认证',
      publishTime: '1天前',
      status: 'unhandled',
    },
    {
      id: 'vuln-3',
      name: 'OpenSSL 信息泄露漏洞',
      cveId: 'CVE-2022-0778',
      riskLevel: 'low',
      affectedAssets: 2,
      affectedBusiness: '随申办APP',
      publishTime: '3天前',
      status: 'processing',
    },
    {
      id: 'vuln-4',
      name: 'MySQL SQL注入漏洞',
      cveId: 'CVE-2023-1001',
      riskLevel: 'high',
      affectedAssets: 4,
      affectedBusiness: '统一公共支付',
      publishTime: '5小时前',
      status: 'unhandled',
    },
    {
      id: 'vuln-5',
      name: 'Redis 未授权访问漏洞',
      cveId: 'CVE-2023-1002',
      riskLevel: 'medium',
      affectedAssets: 6,
      affectedBusiness: '公共信息库',
      publishTime: '2天前',
      status: 'processing',
    },
    {
      id: 'vuln-6',
      name: 'Tomcat 文件包含漏洞',
      cveId: 'CVE-2023-1003',
      riskLevel: 'low',
      affectedAssets: 1,
      affectedBusiness: '企业开办一件事',
      publishTime: '1周前',
      status: 'completed',
    },
  ]
}

/**
 * 生成资产数据
 */
export const generateAssets = (): Asset[] => {
  return [
    {
      id: 'asset-1',
      name: 'ecs-prod-web-01',
      ipAddress: '192.168.1.101',
      type: '云服务器',
      os: 'Linux - CentOS 7.9',
      affectedBusiness: '一网通办门户',
      discoveryTime: '1天前',
      status: 'unclaimed',
      location: '数据中心A区',
      disposalType: 'claim',
    },
    {
      id: 'asset-2',
      name: 'rds-prod-mysql-02',
      ipAddress: '192.168.2.202',
      type: '数据库',
      os: 'MySQL 8.0',
      affectedBusiness: '人口信息库',
      discoveryTime: '2天前',
      status: 'claimed',
      location: '数据中心B区',
      disposalType: 'claim',
    },
    {
      id: 'asset-3',
      name: 'kafka-prod-cluster-03',
      ipAddress: '192.168.3.303',
      type: '中间件',
      os: 'Kafka 2.8',
      affectedBusiness: '统一客服',
      discoveryTime: '3天前',
      status: 'unclaimed',
      location: '数据中心C区',
      disposalType: 'compliance',
    },
    {
      id: 'asset-4',
      name: 'nginx-prod-lb-01',
      ipAddress: '192.168.1.200',
      type: '负载均衡',
      os: 'Nginx 1.20',
      affectedBusiness: '随申办APP',
      discoveryTime: '1小时前',
      status: 'unclaimed',
      location: '数据中心A区',
      disposalType: 'responsibility',
    },
    {
      id: 'asset-5',
      name: 'redis-prod-cache-01',
      ipAddress: '192.168.2.100',
      type: '缓存服务',
      os: 'Redis 6.2',
      affectedBusiness: '统一身份认证',
      discoveryTime: '5小时前',
      status: 'claimed',
      location: '数据中心B区',
      disposalType: 'compliance',
    },
    {
      id: 'asset-6',
      name: 'app-server-03',
      ipAddress: '192.168.3.103',
      type: '应用服务器',
      os: 'Ubuntu 20.04',
      affectedBusiness: '统一公共支付',
      discoveryTime: '6小时前',
      status: 'unclaimed',
      location: '数据中心C区',
      disposalType: 'responsibility',
    },
  ]
}

/**
 * 生成告警数据
 */
export const generateAlerts = (): Alert[] => {
  return [
    {
      id: 'alert-1',
      name: '服务器CPU使用率超过95%',
      relatedAsset: {
        name: 'ecs-prod-app-05',
        ipAddress: '192.168.1.105',
      },
      level: 'critical',
      affectedBusiness: '一网通办门户',
      duration: '15分钟',
      occurTime: '10分钟前',
      status: 'unhandled',
    },
    {
      id: 'alert-2',
      name: '磁盘空间不足 (剩余5%)',
      relatedAsset: {
        name: 'nas-storage-01',
        ipAddress: '192.168.4.101',
      },
      level: 'important',
      affectedBusiness: '公共信息库',
      duration: '2小时',
      occurTime: '3小时前',
      status: 'unhandled',
    },
    {
      id: 'alert-3',
      name: '数据库连接数偏高',
      relatedAsset: {
        name: 'rds-prod-mysql-01',
        ipAddress: '192.168.2.201',
      },
      level: 'normal',
      affectedBusiness: '统一身份认证',
      duration: '30分钟',
      occurTime: '1天前',
      status: 'resolved',
    },
    {
      id: 'alert-4',
      name: '内存使用率持续高位',
      relatedAsset: {
        name: 'ecs-prod-web-02',
        ipAddress: '192.168.1.102',
      },
      level: 'important',
      affectedBusiness: '随申办APP',
      duration: '1小时',
      occurTime: '2小时前',
      status: 'processing',
    },
    {
      id: 'alert-5',
      name: '网络延迟异常',
      relatedAsset: {
        name: 'sw-core-01',
        ipAddress: '192.168.0.1',
      },
      level: 'critical',
      affectedBusiness: '统一公共支付',
      duration: '5分钟',
      occurTime: '30分钟前',
      status: 'unhandled',
    },
  ]
}

/**
 * 生成任务统计数据
 */
export const generateTaskStatistics = (): TaskStatisticsData => {
  const vulnerabilities = generateVulnerabilities()
  const assets = generateAssets()
  const alerts = generateAlerts()

  return {
    vulnerability: vulnerabilities.filter(v => v.status !== 'completed').length,
    assetClaim: assets.filter(a => a.status === 'unclaimed').length,
    alertHandle: alerts.filter(a => a.status !== 'resolved' && a.status !== 'ignored').length,
  }
}

/**
 * 生成今日统计数据
 */
export const generateTodayStatistics = (): TodayStatistics => {
  return {
    newTasks: 7,
    completedTasks: 5,
  }
}
