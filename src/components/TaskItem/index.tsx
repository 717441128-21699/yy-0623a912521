import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import Tag from '../Tag'
import { FollowTask } from '@/types'
import { getPriorityColor, getPriorityName, getStatusName, getStatusColor, formatDate } from '@/utils'
import styles from './index.module.scss'

interface TaskItemProps {
  task: FollowTask
  onClick?: () => void
  onStatusChange?: (id: string) => void
  className?: string
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, onStatusChange, className }) => {
  return (
    <View className={classnames(styles.taskItem, className)} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{task.title}</Text>
          <Tag
            text={getPriorityName(task.priority)}
            color={getPriorityColor(task.priority)}
            bgColor={`${getPriorityColor(task.priority)}15`}
            size="sm"
          />
        </View>
        <Text className={styles.customer}>{task.customerName}</Text>
      </View>

      {task.cardName && (
        <Text className={styles.cardName}>关联卡：{task.cardName}</Text>
      )}

      <Text className={styles.content}>{task.content}</Text>

      <View className={styles.footer}>
        <View className={styles.footerLeft}>
          <Text className={styles.dueDate}>
            截止：{formatDate(task.dueDate)}
          </Text>
          <Tag
            text={getStatusName(task.status)}
            color={getStatusColor(task.status)}
            bgColor={`${getStatusColor(task.status)}15`}
            size="sm"
          />
        </View>
        {task.status === 'pending' && (
          <View
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation()
              onStatusChange?.(task.id)
            }}
          >
            <Text className={styles.actionText}>开始跟进</Text>
          </View>
        )}
        {task.status === 'in_progress' && (
          <View
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation()
              onStatusChange?.(task.id)
            }}
          >
            <Text className={styles.actionText}>完成</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TaskItem
