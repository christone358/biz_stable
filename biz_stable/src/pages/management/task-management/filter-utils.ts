import dayjs from 'dayjs'
import type { CollaborationTask, TaskFilters, TaskType } from './types'
import { matchesStatusView } from './status-utils'

export const filterTasks = (
  tasks: CollaborationTask[],
  selectedType: TaskType | 'all',
  filters: TaskFilters,
): CollaborationTask[] => {
  return tasks.filter(task => {
    if (selectedType !== 'all' && task.type !== selectedType) {
      return false
    }

    if (filters.status && !matchesStatusView(task.status, filters.status)) {
      return false
    }

    if (filters.subCategory && filters.subCategory !== 'all' && task.subCategory !== filters.subCategory) {
      return false
    }

    if (filters.responsibleUnit && filters.responsibleUnit !== 'all' && task.responsibleUnit !== filters.responsibleUnit) {
      return false
    }

    if (filters.initiator && filters.initiator !== 'all' && task.initiator !== filters.initiator) {
      return false
    }

    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase()
      const target = [
        task.title,
        task.taskNo,
        task.description,
        task.subCategory,
        task.initiator,
        task.previousApprover || '',
        task.currentProcessor || '',
      ].join(' ').toLowerCase()
      if (!target.includes(searchText)) {
        return false
      }
    }

    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const createdAt = dayjs(task.createdAt)
      if (
        createdAt.isBefore(dayjs(filters.dateRange[0])) ||
        createdAt.isAfter(dayjs(filters.dateRange[1]))
      ) {
        return false
      }
    }

    return true
  })
}

export const buildSubCategoryOptions = (tasks: CollaborationTask[], selectedType: TaskType | 'all'): string[] => {
  const categories = new Set<string>()
  tasks.forEach(task => {
    if (selectedType === 'all' || task.type === selectedType) {
      categories.add(task.subCategory)
    }
  })
  return Array.from(categories)
}

export const buildInitiatorOptions = (tasks: CollaborationTask[]): string[] => {
  return Array.from(new Set(tasks.map(task => task.initiator)))
}
