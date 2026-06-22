import React, { useState, useMemo } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
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
import dayjs from 'dayjs'
import styles from './index.module.scss'

const CardDetailPage: React.FC = () => {
  const router = useRouter()
  const cardId = router.params.id

  const cards = useAppStore((s) => s.cards)
  const customers = useAppStore((s) => s.customers)
  const linkRenewalCard = useAppStore((s) => s.linkRenewalCard)
  const addCard = useAppStore((s) => s.addCard)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCardName, setNewCardName] = useState('')
  const [newCardTotalTimes, setNewCardTotalTimes] = useState('')
  const [newCardPrice, setNewCardPrice] = useState('')
  const [newCardExpiryDays, setNewCardExpiryDays] = useState('365')

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

  const handleSubmitNewCard = () => {
    if (!newCardName.trim()) {
      Taro.showToast({ title: '请输入卡名', icon: 'none' })
      return
    }
    if (!newCardTotalTimes || Number(newCardTotalTimes) <= 0) {
      Taro.showToast({ title: '请输入次数', icon: 'none' })
      return
    }
    if (!newCardPrice || Number(newCardPrice) <= 0) {
      Taro.showToast({ title: '请输入卡价', icon: 'none' })
      return
    }

    const days = Number(newCardExpiryDays) || 365
    const today = dayjs()
    const newExpiryDate = today.add(days, 'day').format('YYYY-MM-DD')
    const todayStr = today.format('YYYY-MM-DD')

    const baseCardName = card.name.replace(/(超值|升级版|疗程|套餐)?卡$/, '').trim()
    const finalName = newCardName.trim() || `${baseCardName}续卡`

    const newId = addCard({
      name: finalName,
      category: card.category,
      totalTimes: Number(newCardTotalTimes),
      usedTimes: 0,
      expiryDate: newExpiryDate,
      lastTreatmentDate: todayStr,
      customerId: card.customerId,
      treatmentRecords: [],
      originalCardId: card.id,
      price: Number(newCardPrice)
    })

    setShowCreateForm(false)
    setNewCardName('')
    setNewCardTotalTimes('')
    setNewCardPrice('')
    setNewCardExpiryDays('365')

    Taro.showToast({ title: '已创建并关联', icon: 'success' })
    setTimeout(() => {
      Taro.redirectTo({ url: `/pages/card-detail/index?id=${newId}` })
    }, 1200)
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
        <View style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
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
        </View>

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
                <Text className={styles.infoKey}>来源原卡</Text>
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
                此卡剩余次数不足，客户已成交续卡请创建或关联新卡，避免后续重复承诺权益
              </Text>

              {availableRenewalCards.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Text className={styles.renewalListLabel}>可直接关联的同类型新卡</Text>
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
                </View>
              )}

              {!showCreateForm ? (
                <View className={styles.createCardBtn} onClick={() => setShowCreateForm(true)}>
                  <Text style={{ color: '#fff' }}>+ 录入新成交续卡</Text>
                </View>
              ) : (
                <View className={styles.createCardForm}>
                  <Text className={styles.formTitle}>新续卡信息</Text>

                  <View className={styles.formItem}>
                    <Text className={styles.formLabel}>卡名</Text>
                    <Input
                      className={styles.formInput}
                      placeholder="请输入续卡名称"
                      value={newCardName}
                      onInput={(e) => setNewCardName(e.detail.value)}
                    />
                  </View>

                  <View className={styles.formRow}>
                    <View className={styles.formItemHalf}>
                      <Text className={styles.formLabel}>总次数</Text>
                      <Input
                        className={styles.formInput}
                        type="number"
                        placeholder="10"
                        value={newCardTotalTimes}
                        onInput={(e) => setNewCardTotalTimes(e.detail.value)}
                      />
                    </View>
                    <View className={styles.formItemHalf}>
                      <Text className={styles.formLabel}>卡价 (元)</Text>
                      <Input
                        className={styles.formInput}
                        type="digit"
                        placeholder="9800"
                        value={newCardPrice}
                        onInput={(e) => setNewCardPrice(e.detail.value)}
                      />
                    </View>
                  </View>

                  <View className={styles.formItem}>
                    <Text className={styles.formLabel}>有效期 (天)</Text>
                    <Input
                      className={styles.formInput}
                      type="number"
                      placeholder="365"
                      value={newCardExpiryDays}
                      onInput={(e) => setNewCardExpiryDays(e.detail.value)}
                    />
                  </View>

                  <View className={styles.formActions}>
                    <View
                      className={styles.formBtnOutline}
                      onClick={() => setShowCreateForm(false)}
                    >
                      <Text>取消</Text>
                    </View>
                    <View className={styles.formBtnPrimary} onClick={handleSubmitNewCard}>
                      <Text>创建并关联</Text>
                    </View>
                  </View>
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
