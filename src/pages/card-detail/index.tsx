import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { mockCards, getCardCategoryName, getCardCategoryColor } from '@/data/cards'
import { mockCustomers } from '@/data/customers'
import {
  getRemainder,
  getDaysRemaining,
  formatDate,
  formatMoney,
  getProgressPercent
} from '@/utils'
import styles from './index.module.scss'

const CardDetailPage: React.FC = () => {
  const router = useRouter()
  const cardId = router.params.id

  const card = useMemo(() => {
    return mockCards.find(c => c.id === cardId) || mockCards[0]
  }, [cardId])

  const customer = useMemo(() => {
    return mockCustomers.find(c => c.id === card.customerId)
  }, [card])

  const remainder = getRemainder(card.usedTimes, card.totalTimes)
  const expiryDays = getDaysRemaining(card.expiryDate)
  const progress = getProgressPercent(card.usedTimes, card.totalTimes)
  const categoryColor = getCardCategoryColor(card.category)

  const handleCreateTask = () => {
    Taro.navigateTo({
      url: `/pages/create-task/index?customerId=${card.customerId}&cardId=${card.id}`
    })
  }

  const handleAddRecord = () => {
    Taro.navigateTo({
      url: `/pages/add-record/index?customerId=${card.customerId}`
    })
  }

  const handleRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <View className={styles.header} style={{ background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)` }}>
        <Text className={styles.cardName}>{card.name}</Text>
        <View className={styles.cardCategory}>
          <Text>{getCardCategoryName(card.category)}</Text>
        </View>
        {card.originalCardId && (
          <View className={styles.originalCardTag}>
            <Text>已续卡</Text>
          </View>
        )}

        <View className={styles.progressSection}>
          <View className={styles.progressInfo}>
            <Text className={styles.progressLabel}>疗程进度</Text>
            <Text className={styles.progressValue}>{card.usedTimes} / {card.totalTimes} 次</Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </View>
          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{remainder}</Text>
              <Text className={styles.statLabel}>剩余次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{expiryDays}</Text>
              <Text className={styles.statLabel}>距到期天数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatMoney(card.price)}</Text>
              <Text className={styles.statLabel}>卡价</Text>
            </View>
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
          <Text className={styles.sectionTitle}>卡信息</Text>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoKey}>客户姓名</Text>
              <Text className={styles.infoValueText}>{customer?.name || '-'}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoKey}>到期时间</Text>
              <Text className={styles.infoValueText}>{formatDate(card.expiryDate)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoKey}>上次治疗</Text>
              <Text className={styles.infoValueText}>{formatDate(card.lastTreatmentDate)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoKey}>总次数</Text>
              <Text className={styles.infoValueText}>{card.totalTimes} 次</Text>
            </View>
            {card.originalCardId && (
              <View className={styles.infoRow}>
                <Text className={styles.infoKey}>关联原卡</Text>
                <Text className={styles.infoValueText} style={{ color: '#722ed1' }}>
                  是（续卡）
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>治疗记录 ({card.treatmentRecords.length})</Text>

          <View className={styles.timeline}>
            {[...card.treatmentRecords].reverse().map((record, index) => (
              <View key={record.id} className={styles.timelineItem}>
                <View
                  className={styles.timelineDot}
                  style={{
                    backgroundColor: index === 0 ? categoryColor : '#c9cdd4',
                    boxShadow: index === 0 ? `0 0 0 2rpx ${categoryColor}` : 'none'
                  }}
                />
                <View className={styles.timelineCard}>
                  <Text className={styles.treatmentDate}>{record.date}</Text>

                  <View className={styles.treatmentInfo}>
                    <View className={styles.infoItem}>
                      <Text className={styles.infoLabel}>医生：</Text>
                      <Text className={styles.infoValue}>{record.doctor}</Text>
                    </View>
                    {record.therapist && (
                      <View className={styles.infoItem}>
                        <Text className={styles.infoLabel}>治疗师：</Text>
                        <Text className={styles.infoValue}>{record.therapist}</Text>
                      </View>
                    )}
                  </View>

                  <View className={styles.feedback}>
                    <Text className={styles.feedbackLabel}>术后反馈</Text>
                    <Text className={styles.feedbackContent}>{record.feedback}</Text>
                  </View>

                  <View className={styles.nextInterval}>
                    <Text className={styles.intervalLabel}>下次建议间隔</Text>
                    <Text className={styles.intervalValue}>{record.nextInterval} 天</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={`${styles.btn} ${styles.outline}`} onClick={handleAddRecord}>
          <Text>记录沟通</Text>
        </View>
        <View className={`${styles.btn} ${styles.primary}`} onClick={handleCreateTask}>
          <Text>创建跟进</Text>
        </View>
      </View>
    </View>
  )
}

export default CardDetailPage
