import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import Tag from '../Tag'
import { getLevelColor, getLevelName, getRemainder, formatDate, getDaysRemaining } from '@/utils'
import { getCardCategoryColor, getCardCategoryName } from '@/data/cards'
import { Customer, Card } from '@/types'
import styles from './index.module.scss'

interface CustomerCardProps {
  customer: Customer
  cards: Card[]
  onClick?: () => void
  className?: string
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, cards, onClick, className }) => {
  const lowRemainderCards = cards.filter(c => getRemainder(c.usedTimes, c.totalTimes) <= 2)
  const expiringSoonCards = cards.filter(c => {
    const days = getDaysRemaining(c.expiryDate)
    return days <= 30 && days >= 0
  })

  return (
    <View className={classnames(styles.card, className)} onClick={onClick}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={customer.avatar} mode="aspectFill" />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{customer.name}</Text>
            <Tag
              text={getLevelName(customer.level)}
              color={getLevelColor(customer.level)}
              bgColor={`${getLevelColor(customer.level)}15`}
              size="sm"
            />
          </View>
          <Text className={styles.phone}>{customer.phone}</Text>
        </View>
      </View>

      <View className={styles.cardList}>
        {cards.slice(0, 3).map(card => {
          const remainder = getRemainder(card.usedTimes, card.totalTimes)
          const expiryDays = getDaysRemaining(card.expiryDate)
          return (
            <View key={card.id} className={styles.cardItem}>
              <View
                className={styles.categoryDot}
                style={{ backgroundColor: getCardCategoryColor(card.category) }}
              />
              <View className={styles.cardInfo}>
                <Text className={styles.cardName}>{card.name}</Text>
                <View className={styles.cardMeta}>
                  <Text className={styles.cardMetaText}>
                    剩<Text className={styles.highlight}>{remainder}</Text>次
                  </Text>
                  <Text className={styles.cardMetaText}>
                    {getCardCategoryName(card.category)}
                  </Text>
                </View>
              </View>
              <View className={styles.cardRight}>
                {expiryDays <= 30 && expiryDays >= 0 && (
                  <Tag
                    text={`${expiryDays}天后到期`}
                    color="#f53f3f"
                    bgColor="rgba(245, 63, 63, 0.1)"
                    size="sm"
                  />
                )}
              </View>
            </View>
          )
        })}
      </View>

      <View className={styles.footer}>
        <Text className={styles.lastVisit}>
          上次到店：{formatDate(customer.lastVisitDate)}
        </Text>
        {(lowRemainderCards.length > 0 || expiringSoonCards.length > 0) && (
          <View className={styles.warning}>
            {lowRemainderCards.length > 0 && (
              <Text className={styles.warningText}>
                {lowRemainderCards.length}张卡次数不足
              </Text>
            )}
            {expiringSoonCards.length > 0 && (
              <Text className={styles.warningText}>
                {expiringSoonCards.length}张卡即将到期
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

export default CustomerCard
