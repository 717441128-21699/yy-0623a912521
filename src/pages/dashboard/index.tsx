import React, { useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '@/store'
import { getCardCategoryName, getCardCategoryColor } from '@/data/cards'
import { getRemainder, getDaysRemaining, getDaysSince, formatDate } from '@/utils'
import styles from './index.module.scss'

const churnReasonMap: Record<string, string> = {
  price: '价格犹豫',
  recovery: '恢复期不便',
  effect: '效果不明显',
  other: '其他原因'
}

const DashboardPage: React.FC = () => {
  const customers = useAppStore((s) => s.customers)
  const cards = useAppStore((s) => s.cards)
  const tasks = useAppStore((s) => s.tasks)
  const records = useAppStore((s) => s.records)
  const churnMarks = useAppStore((s) => s.churnMarks)

  const stats = useMemo(() => {
    const activeCards = cards.filter((c) => {
      if (c.originalCardId) return true
      const isRenewed = cards.some((other) => other.originalCardId === c.id)
      return !isRenewed
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === 'completed').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const churnCustomers = customers.filter((c) => {
      const days = getDaysSince(c.lastVisitDate)
      return days > 30
    }).length

    const renewedCount = cards.filter((c) => c.originalCardId).length
    const totalExpiringOrLow = activeCards.filter((c) => {
      const remainder = getRemainder(c.usedTimes, c.totalTimes)
      const days = getDaysRemaining(c.expiryDate)
      return (remainder <= 2 && remainder > 0) || (days <= 30 && days >= 0)
    }).length
    const renewalRate = totalExpiringOrLow > 0 ? Math.round((renewedCount / totalExpiringOrLow) * 100) : 0

    const lowRemainderCount = activeCards.filter((card) => {
      const remainder = getRemainder(card.usedTimes, card.totalTimes)
      return remainder <= 2 && remainder > 0
    }).length

    const expiringCount = activeCards.filter((card) => {
      const days = getDaysRemaining(card.expiryDate)
      return days <= 30 && days >= 0
    }).length

    const todayStr = new Date().toISOString().split('T')[0]
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr).length
    const todayCompleted = tasks.filter((t) => t.dueDate === todayStr && t.status === 'completed').length

    return {
      completionRate,
      totalTasks,
      completedTasks,
      churnCustomers,
      renewalRate,
      lowRemainderCount,
      expiringCount,
      todayTasks,
      todayCompleted,
      renewedCount,
      totalExpiringOrLow
    }
  }, [customers, cards, tasks, records])

  const churnCustomerList = useMemo(() => {
    return customers
      .filter((c) => {
        const days = getDaysSince(c.lastVisitDate)
        return days > 20
      })
      .slice(0, 5)
      .map((c) => {
        const churnMark = churnMarks.find((m) => m.customerId === c.id)
        const negativeRecords = records.filter(
          (r) => r.customerId === c.id && r.attitude === 'negative'
        )
        return {
          ...c,
          daysAgo: getDaysSince(c.lastVisitDate),
          churnReason: churnMark ? churnReasonMap[churnMark.reason] || churnMark.remark : null,
          hasNegativeRecord: negativeRecords.length > 0
        }
      })
  }, [customers, churnMarks, records])

  const categoryStats = useMemo(() => {
    const categories = ['water', 'photo', 'hair', 'antiaging']
    return categories.map((cat) => ({
      category: cat,
      count: cards.filter((card) => card.category === cat).length,
      name: getCardCategoryName(cat),
      color: getCardCategoryColor(cat)
    }))
  }, [cards])

  const handleCustomerClick = (customerId: string) => {
    Taro.navigateTo({
      url: `/pages/customer-detail/index?id=${customerId}`
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
        <Text className={styles.title}>业绩看板</Text>
        <Text className={styles.subTitle}>实时掌握跟进和转化数据</Text>

        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.completionRate}%</Text>
            <Text className={styles.statLabel}>跟进完成率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.churnCustomers}</Text>
            <Text className={styles.statLabel}>流失风险客户</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.renewalRate}%</Text>
            <Text className={styles.statLabel}>续卡转化率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {stats.todayCompleted}/{stats.todayTasks}
            </Text>
            <Text className={styles.statLabel}>今日完成/待办</Text>
          </View>
        </View>
      </View>

      <ScrollView
        scrollY
        className={styles.content}
        refresherEnabled
        onRefresherRefresh={handleRefresh}
      >
        <View className={styles.section}>
          <View className={styles.progressCard}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressTitle}>本月跟进完成情况</Text>
              <Text className={styles.progressValue}>{stats.completionRate}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${stats.completionRate}%` }}
              />
            </View>
            <View className={styles.progressLabels}>
              <Text className={styles.progressLabel}>
                已完成 {stats.completedTasks} 个
              </Text>
              <Text className={styles.progressLabel}>共 {stats.totalTasks} 个任务</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>即将流失客户</Text>
            <Text className={styles.sectionAction} onClick={() => {}}>
              查看全部
            </Text>
          </View>

          <View className={styles.cardList}>
            {churnCustomerList.map((customer) => (
              <View
                key={customer.id}
                className={styles.churnCard}
                onClick={() => handleCustomerClick(customer.id)}
              >
                <Image className={styles.avatar} src={customer.avatar} mode="aspectFill" />
                <View className={styles.churnInfo}>
                  <Text className={styles.churnName}>{customer.name}</Text>
                  <Text className={styles.churnReason}>
                    上次到店：{formatDate(customer.lastVisitDate)}
                  </Text>
                  {customer.churnReason && (
                    <Text className={styles.churnTag}>原因：{customer.churnReason}</Text>
                  )}
                  {customer.hasNegativeRecord && !customer.churnReason && (
                    <Text className={styles.churnTagNegative}>有消极沟通记录</Text>
                  )}
                </View>
                <Text className={styles.churnDays}>{customer.daysAgo}天未到店</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>疗程卡分布</Text>
          </View>

          <View className={styles.categoryStats}>
            {categoryStats.map((item) => (
              <View key={item.category} className={styles.categoryItem}>
                <Text className={styles.categoryName}>{item.name}</Text>
                <Text className={styles.categoryValue} style={{ color: item.color }}>
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.progressCard}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressTitle}>续卡转化</Text>
              <Text className={styles.progressValue}>{stats.renewalRate}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${stats.renewalRate}%` }}
              />
            </View>
            <View className={styles.progressLabels}>
              <Text className={styles.progressLabel}>
                已续卡 {stats.renewedCount} 张
              </Text>
              <Text className={styles.progressLabel}>
                待续卡 {stats.totalExpiringOrLow} 张
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default DashboardPage
