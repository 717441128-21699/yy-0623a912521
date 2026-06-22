import React, { useState, useMemo } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { taskTemplates } from '@/data/tasks'
import { useAppStore } from '@/store'
import { TaskPriority } from '@/types'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const CreateTaskPage: React.FC = () => {
  const router = useRouter()
  const customerId = router.params.customerId
  const cardId = router.params.cardId

  const customers = useAppStore((s) => s.customers)
  const cards = useAppStore((s) => s.cards)
  const addTask = useAppStore((s) => s.addTask)

  const customer = useMemo(() => {
    return customers.find((c) => c.id === customerId)
  }, [customers, customerId])

  const card = useMemo(() => {
    return cards.find((c) => c.id === cardId)
  }, [cards, cardId])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'))
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const handleTemplateSelect = (templateId: string) => {
    const template = taskTemplates.find((t) => t.id === templateId)
    if (template) {
      setTitle(template.title)
      setContent(template.content)
      setSelectedTemplateId(templateId)
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    addTask({
      customerId: customerId || '',
      customerName: customer?.name || '',
      cardId: cardId || undefined,
      cardName: card?.name || undefined,
      title,
      content,
      status: 'pending',
      priority,
      dueDate,
      templateId: selectedTemplateId || undefined
    })

    Taro.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  const handleCancel = () => {
    Taro.navigateBack()
  }

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>任务信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>客户</Text>
            <View className={styles.formInput} style={{ lineHeight: '80rpx' }}>
              <Text>{customer?.name || '请选择客户'}</Text>
            </View>
          </View>

          {card && (
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>关联疗程卡</Text>
              <View className={styles.formInput} style={{ lineHeight: '80rpx' }}>
                <Text>{card.name}</Text>
              </View>
            </View>
          )}

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>任务标题</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入任务标题"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>任务内容</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请输入任务内容"
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              maxlength={500}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>优先级</Text>
            <View className={styles.priorityOptions}>
              <View
                className={`${styles.priorityOption} ${priority === 'high' ? styles.active : ''}`}
                onClick={() => setPriority('high')}
              >
                <Text>高</Text>
              </View>
              <View
                className={`${styles.priorityOption} ${priority === 'medium' ? styles.active : ''}`}
                onClick={() => setPriority('medium')}
              >
                <Text>中</Text>
              </View>
              <View
                className={`${styles.priorityOption} ${priority === 'low' ? styles.active : ''}`}
                onClick={() => setPriority('low')}
              >
                <Text>低</Text>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>截止日期</Text>
            <View className={styles.datePicker}>
              <Text>{dueDate}</Text>
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>快捷模板</Text>
          <View className={styles.templates}>
            {taskTemplates.slice(0, 5).map((template) => (
              <View
                key={template.id}
                className={`${styles.templateItem} ${selectedTemplateId === template.id ? styles.active : ''}`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <Text className={styles.templateTitle}>{template.title}</Text>
                <Text className={styles.templateDesc}>
                  {template.content.substring(0, 50)}...
                </Text>
                <Text className={styles.templateCondition}>
                  触发条件：{template.triggerCondition}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={`${styles.btn} ${styles.outline}`} onClick={handleCancel}>
          <Text>取消</Text>
        </View>
        <View className={`${styles.btn} ${styles.primary}`} onClick={handleSubmit}>
          <Text>创建任务</Text>
        </View>
      </View>
    </View>
  )
}

export default CreateTaskPage
