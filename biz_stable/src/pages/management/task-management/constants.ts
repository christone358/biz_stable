import type { TaskType } from './types'

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  alert: '运行告警处置',
  vulnerability: '脆弱性处置',
  asset: '资产运营',
}

export const TASK_CENTER_CURRENT_USER = '陈晨'
