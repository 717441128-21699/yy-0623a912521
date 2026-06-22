import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import FilterBar from '@/components/FilterBar'
import CustomerCard from '@/components/CustomerCard'
import { useAppStore } from '@/store'
import { getRemainder, getDaysRemaining, getDaysSince } from '@/utils'
import { Customer, Card } from '@/types'
import styles from './index.module.scss'

type FilterType =
  | 'all'
  | 'low_remainder'
  | 'expiring'
  | 'water'
  | 'photo'
  | 'hair'
  | 'antiaging'
  | 'treatment_7d'
  | 'treatment_30d'
  | 'treatment_over30'

const TodayPage: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>('all')
  const customers = useAppStore((s) => s.customers)
  const cards = useAppStore((s) => s.cards)

  const filterOptions = [
    { key: 'all', label: '全部' },
    { key: 'low_remainder', label: '次数不足' },
    { key: 'expiring', label: '即将到期' },
    { key: 'water', label: '水光' },
    { key: 'photo', label: '光电' },
    { key: 'hair', label: '脱毛' },
    { key: 'antiaging', label: '抗衰' },
    { key: 'treatment_7d', label: '7天内治疗' },
    { key: 'treatment_30d', label: '30天内治疗' },
    { key: 'treatment_over30', label: '超30天未治' }
  ]

  const todayCustomers = useMemo(() => {
    return customers.slice(0, 6)
  }, [customers])

  const filteredCustomers = useMemo(() => {
    const list = todayCustomers

    switch (filterType) {
      case 'low_remainder':
        return list.filter((customer) => {
          const customerCards = cards.filter((card) => card.customerId === customer.id)
          return customerCards.some((card) => getRemainder(card.usedTimes, card.totalTimes) <= 2)
        })
      case 'expiring':
        return list.filter((customer) => {
          const customerCards = cards.filter((card) => card.customerId === customer.id)
          return customerCards.some((card) => {
            const days = getDaysRemaining(card.expiryDate)
            return days <= 30 && days >= 0
          })
        })
      case 'water':
      case 'photo':
      case 'hair':
      case 'antiaging':
        return list.filter((customer) => {
          const customerCards = cards.filter((card) => card.customerId === customer.id)
          return customerCards.some((card) => card.category === filterType)
        })
      case 'treatment_7d':
        return list.filter((customer) => {
          const customerCards = cards.filter((card) => card.customerId === customer.id)
          return customerCards.some((card) => getDaysSince(card.lastTreatmentDate) <= 7)
        })
      case 'treatment_30d':
        return list.filter((customer) => {
          const customerCards = cards.filter((card) => card.customerId === customer.id)
          return customerCards.some((card) => getDaysSince(card.lastTreatmentDate) <= 30)
        })
      case 'treatment_over30':
        return list.filter((customer) => {
          const customerCards = cards.filter((card) => card.customerId === customer.id)
          return customerCards.some((card) => getDaysSince(card.lastTreatmentDate) > 30)
        })
      default:
        return list
    }
  }, [todayCustomers, cards, filterType])

  const lowRemainderCount = useMemo(() => {
    return cards.filter((card) => getRemainder(card.usedTimes, card.totalTimes) <= 2).length
  }, [cards])

  const expiringCount = useMemo(() => {
    return cards.filter((card) => {
      const days = getDaysRemaining(card.expiryDate)
      return days <= 30 && days >= 0
    }).length
  }, [cards])

  const handleCustomerClick = (customer: Customer) => {
    Taro.navigateTo({
      url: `/pages/customer-detail/index?id=${customer.id}`
    })
  }

  const handleRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  const getCustomerCards = (customerId: string): Card[] => {
    return cards.filter((card) => card.customerId === customerId)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.greeting}>早上好，张咨询师</Text>
        <Text className={styles.subGreeting}>今天有 {todayCustomers.length} 位客户需要跟进</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{todayCustomers.length}</Text>
            <Text className={styles.statLabel}>今日跟进</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{lowRemainderCount}</Text>
            <Text className={styles.statLabel}>次数不足</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{expiringCount}</Text>
            <Text className={styles.statLabel}>即将到期</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <FilterBar
          options={filterOptions}
          activeKey={filterType}
          onChange={(key) => setFilterType(key as FilterType)}
        />

        <Text className={styles.sectionTitle}>客户列表 ({filteredCustomers.length})</Text>

        <ScrollView
          scrollY
          className={styles.customerList}
          refresherEnabled
          onRefresherRefresh={handleRefresh}
        >
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                cards={getCustomerCards(customer.id)}
                onClick={() => handleCustomerClick(customer)}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyText}>暂无符合条件的客户</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default TodayPage
