import dayjs from 'dayjs'
import type { CollaborationTask, TaskPriority, TaskType } from './types'
import type { TicketDetailData } from '../../ticket-detail/types'
import { TASK_TYPE_LABELS } from './constants'

const priorityMap: Record<TaskPriority, 'P0' | 'P1' | 'P2' | 'P3'> = {
  urgent: 'P0',
  high: 'P1',
  medium: 'P2',
  low: 'P3',
}

const typeSummaryLabel: Record<TaskType, string> = TASK_TYPE_LABELS

export const mapTaskToTicketOverrides = (task: CollaborationTask): Partial<TicketDetailData> => {
  return {
    id: task.id,
    title: task.title,
    ticketNo: task.taskNo,
    status: task.status === 'completed' ? 'resolved' : task.status === 'ignored' ? 'canceled' : 'processing',
    priority: priorityMap[task.priority],
    createdAt: dayjs(task.createdAt).format('YYYY-MM-DD HH:mm'),
    creator: task.initiator,
    businessSystem: {
      level1: typeSummaryLabel[task.type],
      level2: task.subCategory,
    },
    summary: [
      { label: '流程发起人', value: task.initiator },
      { label: '上一环节审批人', value: task.previousApprover || '—' },
      { label: '当前处理人', value: task.currentProcessor || task.responsibleUnit },
      { label: '任务分类', value: `${typeSummaryLabel[task.type]} / ${task.subCategory}` },
      { label: '责任单位', value: task.responsibleUnit },
    ],
  }
}
