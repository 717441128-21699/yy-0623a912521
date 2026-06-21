import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import Tag from '../Tag'
import { CommunicationRecord } from '@/types'
import { getAttitudeColor, getAttitudeName, getCommunicationTypeName } from '@/data/records'
import { formatDateTime } from '@/utils'
import styles from './index.module.scss'

interface RecordItemProps {
  record: CommunicationRecord
  onClick?: () => void
  className?: string
}

const RecordItem: React.FC<RecordItemProps> = ({ record, onClick, className }) => {
  return (
    <View className={classnames(styles.recordItem, className)} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.left}>
          <View
            className={styles.typeIcon}
            style={{ backgroundColor: `${getAttitudeColor(record.attitude)}20` }}
          >
            <Text className={styles.typeText} style={{ color: getAttitudeColor(record.attitude) }}>
              {getCommunicationTypeName(record.type)}
            </Text>
          </View>
          <Text className={styles.customer}>{record.customerName}</Text>
        </View>
        <Text className={styles.date}>{formatDateTime(record.date)}</Text>
      </View>

      <View className={styles.content}>
        <Text className={styles.contentText}>{record.content}</Text>
      </View>

      {record.concerns.length > 0 && (
        <View className={styles.concerns}>
          <Text className={styles.concernsLabel}>关注点：</Text>
          <View className={styles.concernsList}>
            {record.concerns.map((concern, index) => (
              <Tag
                key={index}
                text={concern}
                color="#722ed1"
                bgColor="rgba(114, 46, 209, 0.1)"
                size="sm"
              />
            ))}
          </View>
        </View>
      )}

      <View className={styles.footer}>
        <View className={styles.attitudeRow}>
          <Text className={styles.attitudeLabel}>客户态度：</Text>
          <Tag
            text={getAttitudeName(record.attitude)}
            color={getAttitudeColor(record.attitude)}
            bgColor={`${getAttitudeColor(record.attitude)}15`}
            size="sm"
          />
        </View>
        <Text className={styles.consultant}>{record.consultant}</Text>
      </View>

      {record.result && (
        <View className={styles.result}>
          <Text className={styles.resultLabel}>跟进结果：</Text>
          <Text className={styles.resultText}>{record.result}</Text>
        </View>
      )}
    </View>
  )
}

export default RecordItem
