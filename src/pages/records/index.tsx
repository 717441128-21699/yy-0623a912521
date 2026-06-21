import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import FilterBar from '@/components/FilterBar'
import RecordItem from '@/components/RecordItem'
import { mockRecords } from '@/data/records'
import { CommunicationRecord } from '@/types'
import styles from './index.module.scss'

type FilterType = 'all' | 'phone' | 'wechat' | 'visit' | 'positive' | 'negative'

const RecordsPage: React.FC = () => {
  const [records] = useState<CommunicationRecord[]>(mockRecords)
  const [filterType, setFilterType] = useState<FilterType>('all')

  const filterOptions = [
    { key: 'all', label: '全部' },
    { key: 'phone', label: '电话' },
    { key: 'wechat', label: '微信' },
    { key: 'visit', label: '到店' },
    { key: 'positive', label: '积极' },
    { key: 'negative', label: '消极' }
  ]

  const filteredRecords = useMemo(() => {
    switch (filterType) {
      case 'phone':
        return records.filter(r => r.type === 'phone')
      case 'wechat':
        return records.filter(r => r.type === 'wechat')
      case 'visit':
        return records.filter(r => r.type === 'visit')
      case 'positive':
        return records.filter(r => r.attitude === 'positive')
      case 'negative':
        return records.filter(r => r.attitude === 'negative')
      default:
        return records
    }
  }, [records, filterType])

  const handleRecordClick = (record: CommunicationRecord) => {
    Taro.navigateTo({
      url: `/pages/customer-detail/index?id=${record.customerId}`
    })
  }

  const handleAddRecord = () => {
    Taro.navigateTo({
      url: '/pages/add-record/index'
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
        <Text className={styles.title}>沟通记录</Text>
        <Text className={styles.subTitle}>记录与客户的每一次沟通</Text>
      </View>

      <View className={styles.filterSection}>
        <FilterBar
          options={filterOptions}
          activeKey={filterType}
          onChange={(key) => setFilterType(key as FilterType)}
        />
      </View>

      <ScrollView
        scrollY
        className={styles.recordList}
        refresherEnabled
        onRefresherRefresh={handleRefresh}
      >
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
            <RecordItem
              key={record.id}
              record={record}
              onClick={() => handleRecordClick(record)}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无沟通记录</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.fab} onClick={handleAddRecord}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  )
}

export default RecordsPage
