import React, { useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { mockCustomers } from '@/data/customers'
import { mockCards, getCardCategoryName, getCardCategoryColor } from '@/data/cards'
import { mockTasks } from '@/data/tasks'
import { getRemainder, getDaysRemaining, formatDate } from '@/utils'
import styles from './index.module.scss'

const DashboardPage: React.FC = () => {
  const stats = useMemo(() => {
    const totalTasks = mockTasks.length
    const completedTasks = mockTasks.filter(t => t.status === 'completed').length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const churnCustomers = mockCustomers.filter(c => {
      const days = getDaysRemaining(c.lastVisitDate) * -1
      return days > 30
    }).length

    const lowRemainderCount = mockCards.filter(card => {
      const remainder = getRemainder(card.usedTimes, card.totalTimes)
      return remainder <= 2 && remainder > 0
    }).length

    const expiringCount = mockCards.filter(card => {
      const days = getDaysRemaining(card.expiryDate)
      return days <= 30 && days >= 0
    }).length

    const todayTasks = mockTasks.filter(t => {
      return t.dueDate === '2026-06-22'
    }).length

    const todayCompleted = mockTasks.filter(t => {
      return t.dueDate === '2026-06-22' && t.status === 'completed'
    }).length

    const renewalRate = 65

    return {
      completionRate,
      totalTasks,
      completedTasks,
      churnCustomers,
      renewalRate,
      lowRemainderCount,
      expiringCount,
      todayTasks,
      todayCompleted
    }
  }, [])

  const churnCustomers = useMemo(() => {
    return mockCustomers
      .filter(c => {
        const days = getDaysRemaining(c.lastVisitDate) * -1
        return days > 20
      })
      .slice(0, 5)
      .map(c => ({
        ...c,
        daysAgo: getDaysRemaining(c.lastVisitDate) * -1
      }))
  }, [])

  const categoryStats = useMemo(() => {
    const categories = ['water', 'photo', 'hair', 'antiaging']
    return categories.map(cat => ({
      category: cat,
      count: mockCards.filter(card => card.category === cat).length,
      name: getCardCategoryName(cat),
      color: getCardCategoryColor(cat)
    }))
  }, [])

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
            <Text className={styles.statTrend}>↑ 较上周+5%</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.churnCustomers}</Text>
            <Text className={styles.statLabel}>流失风险客户</Text>
            <Text className={styles.statTrend} style={{ color: '#ff7d00' }}>需关注</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.renewalRate}%</Text>
            <Text className={styles.statLabel}>续卡转化率</Text>
            <Text className={styles.statTrend}>↑ 较上月+8%</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.todayCompleted}/{stats.todayTasks}</Text>
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
              <Text className={styles.progressLabel}>
                共 {stats.totalTasks} 个任务
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>即将流失客户</Text>
            <Text
              className={styles.sectionAction}
              onClick={() => {}}
            >
              查看全部
            </Text>
          </View>

          <View className={styles.cardList}>
            {churnCustomers.map(customer => (
              <View
                key={customer.id}
                className={styles.churnCard}
                onClick={() => handleCustomerClick(customer.id)}
              >
                <Image
                  className={styles.avatar}
                  src={customer.avatar}
                  mode="aspectFill"
                />
                <View className={styles.churnInfo}>
                  <Text className={styles.churnName}>{customer.name}</Text>
                  <Text className={styles.churnReason}>
                    上次到店：{formatDate(customer.lastVisitDate)}
                  </Text>
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
            {categoryStats.map(item => (
              <View key={item.category} className={styles.categoryItem}>
                <Text className={styles.categoryName}>{item.name}</Text>
                <Text
                  className={styles.categoryValue}
                  style={{ color: item.color }}
                >
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
                次数不足 {stats.lowRemainderCount} 张
              </Text>
              <Text className={styles.progressLabel}>
                即将到期 {stats.expiringCount} 张
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
