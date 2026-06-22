import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import FilterBar from '@/components/FilterBar'
import TaskItem from '@/components/TaskItem'
import { useAppStore } from '@/store'
import { FollowTask, TaskStatus } from '@/types'
import styles from './index.module.scss'

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed' | 'high'

const TasksPage: React.FC = () => {
  const tasks = useAppStore((s) => s.tasks)
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus)
  const [filterType, setFilterType] = useState<FilterType>('all')

  const filterOptions = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待跟进' },
    { key: 'in_progress', label: '跟进中' },
    { key: 'completed', label: '已完成' },
    { key: 'high', label: '高优先级' }
  ]

  const filteredTasks = useMemo(() => {
    switch (filterType) {
      case 'pending':
        return tasks.filter((t) => t.status === 'pending')
      case 'in_progress':
        return tasks.filter((t) => t.status === 'in_progress')
      case 'completed':
        return tasks.filter((t) => t.status === 'completed')
      case 'high':
        return tasks.filter((t) => t.priority === 'high')
      default:
        return tasks
    }
  }, [tasks, filterType])

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length
    }),
    [tasks]
  )

  const handleTaskClick = (task: FollowTask) => {
    Taro.navigateTo({
      url: `/pages/customer-detail/index?id=${task.customerId}`
    })
  }

  const handleStatusChange = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    if (task.status === 'pending') {
      updateTaskStatus(id, 'in_progress')
    } else if (task.status === 'in_progress') {
      updateTaskStatus(id, 'completed')
    }
  }

  const handleCreateTask = () => {
    Taro.navigateTo({
      url: '/pages/create-task/index'
    })
  }

  const handleRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>跟进任务</Text>
        <Text className={styles.subTitle}>管理您的客户跟进任务</Text>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.total}</Text>
          <Text className={styles.statLabel}>全部</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待跟进</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.inProgress}</Text>
          <Text className={styles.statLabel}>跟进中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{stats.completed}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
      </View>

      <View className={styles.filterBar}>
        <FilterBar
          options={filterOptions}
          activeKey={filterType}
          onChange={(key) => setFilterType(key as FilterType)}
        />
      </View>

      <ScrollView
        scrollY
        className={styles.taskList}
        refresherEnabled
        onRefresherRefresh={handleRefresh}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无跟进任务</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.fab} onClick={handleCreateTask}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  )
}

export default TasksPage
