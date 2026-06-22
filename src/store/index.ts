import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'
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

const taroStorage = {
  getItem: (name: string): string | null => {
    try {
      return Taro.getStorageSync(name) || null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      Taro.setStorageSync(name, value)
    } catch {
      /* ignore */
    }
  },
  removeItem: (name: string): void => {
    try {
      Taro.removeStorageSync(name)
    } catch {
      /* ignore */
    }
  }
}

const initialState = {
  customers: [...mockCustomers],
  cards: [...mockCards],
  tasks: [...mockTasks],
  records: [...mockRecords],
  churnMarks: [] as ChurnMark[]
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

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
    }),
    {
      name: 'beauty-crm-storage',
      storage: createJSONStorage(() => taroStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        records: state.records,
        cards: state.cards,
        churnMarks: state.churnMarks
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.customers = initialState.customers
        }
      }
    }
  )
)
