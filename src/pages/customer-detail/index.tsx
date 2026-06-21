import React, { useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { mockCustomers } from '@/data/customers'
import { mockCards, getCardCategoryName, getCardCategoryColor } from '@/data/cards'
import { mockRecords } from '@/data/records'
import {
  getRemainder,
  getDaysRemaining,
  formatDate,
  getLevelColor,
  getLevelName,
  getProgressPercent
} from '@/utils'
import { Card } from '@/types'
import styles from './index.module.scss'

const CustomerDetailPage: React.FC = () => {
  const router = useRouter()
  const customerId = router.params.id

  const customer = useMemo(() => {
    return mockCustomers.find(c => c.id === customerId) || mockCustomers[0]
  }, [customerId])

  const customerCards = useMemo(() => {
    return mockCards.filter(card => card.customerId === customerId)
  }, [customerId])

  const customerRecords = useMemo(() => {
    return mockRecords.filter(r => r.customerId === customerId).slice(0, 3)
  }, [customerId])

  const handleCardClick = (card: Card) => {
    Taro.navigateTo({
      url: `/pages/card-detail/index?id=${card.id}`
    })
  }

  const handleAddTask = () => {
    Taro.navigateTo({
      url: `/pages/create-task/index?customerId=${customerId}`
    })
  }

  const handleAddRecord = () => {
    Taro.navigateTo({
      url: `/pages/add-record/index?customerId=${customerId}`
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
        <Image
          className={styles.avatar}
          src={customer.avatar}
          mode="aspectFill"
        />
        <View className={styles.info}>
          <Text className={styles.name}>{customer.name}</Text>
          <Text className={styles.phone}>{customer.phone}</Text>
          <View className={styles.tags}>
            <View className={styles.tag}>
              <Text style={{ color: getLevelColor(customer.level) }}>{getLevelName(customer.level)}</Text>
            </View>
            {customer.tags.slice(0, 2).map((tag, index) => (
              <View key={index} className={styles.tag}>
                <Text>{tag}</Text>
              </View>
            ))}
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
          <Text className={styles.sectionTitle}>疗程卡 ({customerCards.length})</Text>

          {customerCards.map(card => {
            const remainder = getRemainder(card.usedTimes, card.totalTimes)
            const expiryDays = getDaysRemaining(card.expiryDate)
            const progress = getProgressPercent(card.usedTimes, card.totalTimes)

            return (
              <View
                key={card.id}
                className={styles.cardItem}
                onClick={() => handleCardClick(card)}
              >
                <View className={styles.cardHeader}>
                  <View
                    className={styles.categoryTag}
                    style={{ backgroundColor: getCardCategoryColor(card.category) }}
                  >
                    <Text>{getCardCategoryName(card.category)}</Text>
                  </View>
                  <Text className={styles.cardName}>{card.name}</Text>
                </View>

                <View className={styles.progressRow}>
                  <View className={styles.progressInfo}>
                    <Text className={styles.progressLabel}>疗程进度</Text>
                    <Text className={styles.progressValue}>
                      {card.usedTimes}/{card.totalTimes} 次
                    </Text>
                  </View>
                  <View className={styles.progressBar}>
                    <View
                      className={styles.progressFill}
                      style={{
                        width: `${progress}%`,
                        backgroundColor: getCardCategoryColor(card.category)
                      }}
                    />
                  </View>
                </View>

                <View className={styles.cardMeta}>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>剩余次数</Text>
                    <Text className={styles.metaValue} style={{ color: getCardCategoryColor(card.category) }}>
                      {remainder} 次
                    </Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>到期时间</Text>
                    <Text className={styles.metaValue}>
                      {formatDate(card.expiryDate)}
                    </Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text className={styles.metaLabel}>上次治疗</Text>
                    <Text className={styles.metaValue}>
                      {formatDate(card.lastTreatmentDate)}
                    </Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>最近沟通记录</Text>

          <View className={styles.recordPreview}>
            {customerRecords.length > 0 ? (
              customerRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <Text className={styles.recordDate}>{record.date}</Text>
                  <Text className={styles.recordContent}>{record.content}</Text>
                </View>
              ))
            ) : (
              <View className={styles.recordItem}>
                <Text className={styles.recordContent}>暂无沟通记录</Text>
              </View>
            )}
            <View className={styles.viewAll}>
              <Text>查看全部记录 →</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={`${styles.btn} ${styles.outline}`} onClick={handleAddRecord}>
          <Text>记录沟通</Text>
        </View>
        <View className={`${styles.btn} ${styles.primary}`} onClick={handleAddTask}>
          <Text>创建跟进</Text>
        </View>
      </View>
    </View>
  )
}

export default CustomerDetailPage
