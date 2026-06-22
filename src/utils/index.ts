import dayjs from 'dayjs'

export const formatDate = (date: string, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string): string => {
  return dayjs(date).format('MM-DD HH:mm')
}

export const getDaysRemaining = (expiryDate: string): number => {
  return dayjs(expiryDate).diff(dayjs(), 'day')
}

export const getDaysSince = (date: string): number => {
  return dayjs().diff(dayjs(date), 'day')
}

export const isToday = (date: string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

export const isExpiringSoon = (expiryDate: string, days: number = 30): boolean => {
  const remaining = getDaysRemaining(expiryDate)
  return remaining <= days && remaining >= 0
}

export const isLowRemainder = (used: number, total: number): boolean => {
  const remainder = total - used
  return remainder <= 2 && remainder > 0
}

export const getRemainder = (used: number, total: number): number => {
  return total - used
}

export const getProgressPercent = (used: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}

export const formatMoney = (amount: number): string => {
  return `¥${amount.toLocaleString()}`
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const getLevelColor = (level: string): string => {
  const map: Record<string, string> = {
    A: '#e83e8c',
    B: '#722ed1',
    C: '#13c2c2'
  }
  return map[level] || '#86909c'
}

export const getLevelName = (level: string): string => {
  const map: Record<string, string> = {
    A: 'A级客户',
    B: 'B级客户',
    C: 'C级客户'
  }
  return map[level] || level
}

export const getPriorityColor = (priority: string): string => {
  const map: Record<string, string> = {
    high: '#f53f3f',
    medium: '#ff7d00',
    low: '#13c2c2'
  }
  return map[priority] || '#86909c'
}

export const getPriorityName = (priority: string): string => {
  const map: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return map[priority] || priority
}

export const getStatusName = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待跟进',
    in_progress: '跟进中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: '#ff7d00',
    in_progress: '#165dff',
    completed: '#00b42a',
    cancelled: '#86909c'
  }
  return map[status] || '#86909c'
}

export const getAttitudeName = (attitude: string): string => {
  const map: Record<string, string> = {
    positive: '积极',
    neutral: '一般',
    negative: '消极'
  }
  return map[attitude] || attitude
}

export const getAttitudeColor = (attitude: string): string => {
  const map: Record<string, string> = {
    positive: '#00b42a',
    neutral: '#ff7d00',
    negative: '#f53f3f'
  }
  return map[attitude] || '#86909c'
}
