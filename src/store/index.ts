import { create } from 'zustand'
import { Customer, Card, FollowTask, CommunicationRecord, ChurnMark, TaskStatus } from '@/types'
import { mockCustomers } from '@/data/customers'
import { mockCards } from '@/data/cards'
import { mockTasks } from '@/data/tasks'
import { mockRecords } from '@/data/records'
import { generateId } from '@/utils'

interface AppState {
  customers: Customer[]
  cards: Card[]
  tasks: FollowTask[]
  records: CommunicationRecord[]
  churnMarks: ChurnMark[]

  addTask: (task: Omit<FollowTask, 'id' | 'createdAt'>) => void
  updateTaskStatus: (id: string, status: TaskStatus) => void
  addRecord: (record: Omit<CommunicationRecord, 'id'>) => void
  addChurnMark: (mark: ChurnMark) => void
  linkRenewalCard: (newCardId: string, originalCardId: string) => void
  addCard: (card: Omit<Card, 'id'>) => string
}

export const useAppStore = create<AppState>((set) => ({
  customers: [...mockCustomers],
  cards: [...mockCards],
  tasks: [...mockTasks],
  records: [...mockRecords],
  churnMarks: [],

  addTask: (task) => {
    const newTask: FollowTask = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    set((state) => ({ tasks: [newTask, ...state.tasks] }))
  },

  updateTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t))
    }))
  },

  addRecord: (record) => {
    const newRecord: CommunicationRecord = {
      ...record,
      id: generateId()
    }
    set((state) => ({ records: [newRecord, ...state.records] }))
  },

  addChurnMark: (mark) => {
    set((state) => ({
      churnMarks: [...state.churnMarks.filter((m) => m.customerId !== mark.customerId), mark]
    }))
  },

  linkRenewalCard: (newCardId, originalCardId) => {
    set((state) => ({
      cards: state.cards.map((card) => {
        if (card.id === newCardId) {
          return { ...card, originalCardId }
        }
        return card
      })
    }))
  },

  addCard: (card) => {
    const id = generateId()
    set((state) => ({
      cards: [...state.cards, { ...card, id }]
    }))
    return id
  }
}))
