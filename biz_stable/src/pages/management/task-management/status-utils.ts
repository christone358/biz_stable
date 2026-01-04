import type { TaskStatus, TaskStatusView } from './types'

export const STATUS_VIEW_TO_STATUSES: Record<Exclude<TaskStatusView, 'all'>, TaskStatus[]> = {
  inProgress: ['pending', 'processing', 'overdue'],
  completed: ['completed'],
  voided: ['ignored'],
}

export const STATUS_VIEW_LABELS: Record<Exclude<TaskStatusView, 'all'>, string> = {
  inProgress: '处置中',
  completed: '已完成',
  voided: '已作废',
}

export const matchesStatusView = (status: TaskStatus, view: TaskStatusView = 'all'): boolean => {
  if (view === 'all') return true
  return STATUS_VIEW_TO_STATUSES[view].includes(status)
}

export const getViewStatusByTaskStatus = (status: TaskStatus): Exclude<TaskStatusView, 'all'> => {
  if (STATUS_VIEW_TO_STATUSES.completed.includes(status)) {
    return 'completed'
  }
  if (STATUS_VIEW_TO_STATUSES.voided.includes(status)) {
    return 'voided'
  }
  return 'inProgress'
}

export const getStatusViewOptions = () => [
  { value: 'all' as TaskStatusView, label: '全部任务' },
  { value: 'inProgress' as TaskStatusView, label: STATUS_VIEW_LABELS.inProgress },
  { value: 'completed' as TaskStatusView, label: STATUS_VIEW_LABELS.completed },
  { value: 'voided' as TaskStatusView, label: STATUS_VIEW_LABELS.voided },
]
