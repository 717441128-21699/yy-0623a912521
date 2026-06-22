import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useAppStore } from '@/store'
import { getCardCategoryName, getCardCategoryColor } from '@/data/cards'
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

  const cards = useAppStore((s) => s.cards)
  const customers = useAppStore((s) => s.customers)
  const linkRenewalCard = useAppStore((s) => s.linkRenewalCard)

  const card = useMemo(() => {
    return cards.find((c) => c.id === cardId) || cards[0]
  }, [cards, cardId])

  const customer = useMemo(() => {
    return customers.find((c) => c.id === card.customerId)
  }, [customers, card])

  const originalCard = useMemo(() => {
    if (!card.originalCardId) return null
    return cards.find((c) => c.id === card.originalCardId) || null
  }, [cards, card])

  const isRenewed = useMemo(() => {
    return cards.some((c) => c.originalCardId === card.id)
  }, [cards, card])

  const availableRenewalCards = useMemo(() => {
    return cards.filter(
      (c) =>
        c.customerId === card.customerId &&
        c.id !== card.id &&
        !c.originalCardId &&
        c.category === card.category
    )
  }, [cards, card])

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

  const handleLinkRenewal = (newCardId: string) => {
    linkRenewalCard(newCardId, card.id)
    Taro.showToast({ title: '关联成功', icon: 'success' })
  }

  const handleRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh()
    }, 1000)
  }

  return (
    <View className={styles.page}>
      <View
        className={styles.header}
        style={{
          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`
        }}
      >
        <Text className={styles.cardName}>{card.name}</Text>
        <View className={styles.cardCategory}>
          <Text>{getCardCategoryName(card.category)}</Text>
        </View>
        {card.originalCardId && (
          <View className={styles.originalCardTag}>
            <Text>续卡</Text>
          </View>
        )}
        {isRenewed && (
          <View className={styles.renewedTag}>
            <Text>已续新卡</Text>
          </View>
        )}

        <View className={styles.progressSection}>
          <View className={styles.progressInfo}>
            <Text className={styles.progressLabel}>疗程进度</Text>
            <Text className={styles.progressValue}>
              {card.usedTimes} / {card.totalTimes} 次
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progress}%` }} />
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
              <Text className={styles.infoValueText}>
                {formatDate(card.lastTreatmentDate)}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoKey}>总次数</Text>
              <Text className={styles.infoValueText}>{card.totalTimes} 次</Text>
            </View>
            {card.originalCardId && originalCard && (
              <View className={styles.infoRow}>
                <Text className={styles.infoKey}>关联原卡</Text>
                <Text className={styles.infoValueText} style={{ color: '#722ed1' }}>
                  {originalCard.name}
                </Text>
              </View>
            )}
            {isRenewed && (
              <View className={styles.infoRow}>
                <Text className={styles.infoKey}>续卡状态</Text>
                <Text className={styles.infoValueText} style={{ color: '#00b42a' }}>
                  已续新卡
                </Text>
              </View>
            )}
          </View>
        </View>

        {!card.originalCardId && !isRenewed && remainder <= 2 && (
          <View className={styles.section}>
            <View className={styles.renewalCard}>
              <Text className={styles.renewalTitle}>续卡关联</Text>
              <Text className={styles.renewalDesc}>
                此卡剩余次数不足，如客户已续卡，请关联新卡避免重复承诺
              </Text>
              {availableRenewalCards.length > 0 ? (
                <View className={styles.renewalOptions}>
                  {availableRenewalCards.map((c) => (
                    <View
                      key={c.id}
                      className={styles.renewalOption}
                      onClick={() => handleLinkRenewal(c.id)}
                    >
                      <Text className={styles.renewalOptionName}>{c.name}</Text>
                      <Text className={styles.renewalOptionInfo}>
                        {c.usedTimes}/{c.totalTimes}次 · 到期{formatDate(c.expiryDate)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className={styles.noRenewalCard}>
                  <Text className={styles.noRenewalText}>
                    暂无可关联的同类型新卡，请先为客户创建新卡
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>治疗记录 ({card.treatmentRecords.length})</Text>

          <View className={styles.timeline}>
            {[...card.treatmentRecords]
              .reverse()
              .map((record, index) => (
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
