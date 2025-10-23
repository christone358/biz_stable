/**
 * 任务管理 - 类型定义
 */

// 任务类型
export type TaskType = 'alert' | 'vulnerability' | 'asset'

// 任务状态
export type TaskStatus =
  | 'pending'      // 待处理
  | 'processing'   // 处理中
  | 'completed'    // 已完成
  | 'overdue'      // 已逾期
  | 'ignored'      // 已忽略

// 任务优先级
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

// 责任单位
export type ResponsibleUnit =
  | '运维开发部'
  | '安全管理部'
  | '网络管理部'
  | '系统管理部'
  | '数据管理部'

// 协同任务
export interface CollaborationTask {
  id: string
  taskNo: string                    // 任务编号
  type: TaskType                    // 任务类型
  title: string                     // 任务标题
  description: string               // 任务描述
  status: TaskStatus                // 任务状态
  priority: TaskPriority            // 优先级
  responsibleUnit: ResponsibleUnit  // 责任单位
  responsiblePerson?: string        // 责任人
  affectedBusiness: string          // 影响业务
  createdAt: string                 // 创建时间
  deadline: string                  // 截止时间
  startedAt?: string                // 开始处理时间
  completedAt?: string              // 完成时间
  progress: number                  // 进度百分比 0-100

  // 特定任务类型的附加字段
  alertInfo?: {
    alertId: string
    alertLevel: 'critical' | 'important' | 'normal'
    relatedAsset: string
  }
  vulnerabilityInfo?: {
    cveId: string
    riskLevel: 'high' | 'medium' | 'low'
    affectedAsset: string
  }
  assetInfo?: {
    assetId: string
    assetName: string
    assetType: string
    disposalType: 'claim' | 'compliance' | 'responsibility'
  }
}

// 任务执行记录
export interface TaskExecutionRecord {
  id: string
  taskId: string
  action: string          // 操作动作
  operator: string        // 操作人
  description: string     // 描述
  timestamp: string       // 时间
  status: string          // 状态
}

// 任务统计数据
export interface TaskStatistics {
  total: number           // 总任务数
  pending: number         // 待处理
  processing: number      // 处理中
  completed: number       // 已完成
  overdue: number         // 已逾期
  ignored: number         // 已忽略

  // 按类型分类
  byType: {
    alert: number
    vulnerability: number
    asset: number
  }

  // 按责任单位分类
  byUnit: Record<ResponsibleUnit, number>

  // 按优先级分类
  byPriority: {
    urgent: number
    high: number
    medium: number
    low: number
  }
}

// 筛选条件
export interface TaskFilters {
  type?: TaskType | 'all'
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  responsibleUnit?: ResponsibleUnit | 'all'
  searchText?: string
  dateRange?: [string, string]
}
