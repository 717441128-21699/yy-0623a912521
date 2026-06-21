import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: string
  trendColor?: string
  bgColor?: string
  textColor?: string
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendColor,
  bgColor,
  textColor,
  className
}) => {
  const cardStyle = {
    backgroundColor: bgColor || '#ffffff'
  }

  const valueStyle = {
    color: textColor || '#1d2129'
  }

  return (
    <View className={classnames(styles.statCard, className)} style={cardStyle}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.valueRow}>
        <Text className={styles.value} style={valueStyle}>{value}</Text>
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </View>
      {trend && (
        <Text className={styles.trend} style={{ color: trendColor || '#00b42a' }}>
          {trend}
        </Text>
      )}
    </View>
  )
}

export default StatCard
