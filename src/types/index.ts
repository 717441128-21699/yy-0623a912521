export type CardCategory = 'water' | 'photo' | 'hair' | 'antiaging'

export interface TreatmentRecord {
  id: string
  date: string
  doctor: string
  therapist?: string
  feedback: string
  nextInterval: number
}

export interface Card {
  id: string
  name: string
  category: CardCategory
  totalTimes: number
  usedTimes: number
  expiryDate: string
  lastTreatmentDate: string
  customerId: string
  treatmentRecords: TreatmentRecord[]
  originalCardId?: string
  price: number
}

export interface Customer {
  id: string
  name: string
  avatar: string
  phone: string
  level: 'A' | 'B' | 'C'
  lastVisitDate: string
  cards: Card[]
  tags: string[]
  age?: number
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface FollowTask {
  id: string
  customerId: string
  customerName: string
  cardId?: string
  cardName?: string
  title: string
  content: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  templateId?: string
}

export type CommunicationType = 'phone' | 'wechat' | 'visit'
export type CustomerAttitude = 'positive' | 'neutral' | 'negative'

export interface CommunicationRecord {
  id: string
  customerId: string
  customerName: string
  type: CommunicationType
  date: string
  attitude: CustomerAttitude
  concerns: string[]
  content: string
  result: string
  nextFollowDate?: string
  consultant: string
}

export type ChurnReason = 'price' | 'recovery' | 'effect' | 'other'

export interface ChurnMark {
  customerId: string
  reason: ChurnReason
  remark: string
  date: string
}

export interface DashboardStats {
  followCompletionRate: number
  followTotal: number
  followCompleted: number
  churnCustomers: number
  renewalConversion: number
  renewalTotal: number
  renewalCount: number
  todayFollowCount: number
  todayCompletedCount: number
  upcomingExpiryCount: number
  lowRemainderCount: number
}

export interface TaskTemplate {
  id: string
  title: string
  content: string
  category: CardCategory | 'general'
  triggerCondition: string
}
