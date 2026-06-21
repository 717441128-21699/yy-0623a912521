import React, { useState, useMemo } from 'react'
import { View, Text, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { mockCustomers } from '@/data/customers'
import { CommunicationType, CustomerAttitude, ChurnReason } from '@/types'
import { churnReasons } from '@/data/records'
import styles from './index.module.scss'

const concernOptions = [
  '价格', '效果', '恢复期', '疼痛感', '安全性', '医生选择', '时间安排', '对比其他机构'
]

const AddRecordPage: React.FC = () => {
  const router = useRouter()
  const customerId = router.params.customerId

  const customer = useMemo(() => {
    return mockCustomers.find(c => c.id === customerId)
  }, [customerId])

  const [type, setType] = useState<CommunicationType>('wechat')
  const [attitude, setAttitude] = useState<CustomerAttitude>('neutral')
  const [content, setContent] = useState('')
  const [result, setResult] = useState('')
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [selectedChurnReasons, setSelectedChurnReasons] = useState<ChurnReason[]>([])
  const [nextFollowDate, setNextFollowDate] = useState('')

  const handleConcernToggle = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(prev => prev.filter(c => c !== concern))
    } else {
      setSelectedConcerns(prev => [...prev, concern])
    }
  }

  const handleChurnReasonToggle = (reason: ChurnReason) => {
    if (selectedChurnReasons.includes(reason)) {
      setSelectedChurnReasons(prev => prev.filter(r => r !== reason))
    } else {
      setSelectedChurnReasons(prev => [...prev, reason])
    }
  }

  const handleSubmit = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入沟通内容', icon: 'none' })
      return
    }

    Taro.showToast({ title: '记录成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  const handleCancel = () => {
    Taro.navigateBack()
  }

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>客户</Text>
            <View className={styles.formInput} style={{ lineHeight: '80rpx' }}>
              <Text>{customer?.name || '请选择客户'}</Text>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>沟通方式</Text>
            <View className={styles.typeOptions}>
              <View
                className={`${styles.typeOption} ${type === 'phone' ? styles.active : ''}`}
                onClick={() => setType('phone')}
              >
                <Text>电话</Text>
              </View>
              <View
                className={`${styles.typeOption} ${type === 'wechat' ? styles.active : ''}`}
                onClick={() => setType('wechat')}
              >
                <Text>微信</Text>
              </View>
              <View
                className={`${styles.typeOption} ${type === 'visit' ? styles.active : ''}`}
                onClick={() => setType('visit')}
              >
                <Text>到店</Text>
              </View>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>客户态度</Text>
            <View className={styles.attitudeOptions}>
              <View
                className={`${styles.attitudeOption} ${attitude === 'positive' ? styles.active : ''} ${styles.positive}`}
                onClick={() => setAttitude('positive')}
              >
                <Text>积极</Text>
              </View>
              <View
                className={`${styles.attitudeOption} ${attitude === 'neutral' ? styles.active : ''} ${styles.neutral}`}
                onClick={() => setAttitude('neutral')}
              >
                <Text>一般</Text>
              </View>
              <View
                className={`${styles.attitudeOption} ${attitude === 'negative' ? styles.active : ''} ${styles.negative}`}
                onClick={() => setAttitude('negative')}
              >
                <Text>消极</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>沟通详情</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>客户关注点</Text>
            <View className={styles.concernsWrapper}>
              {concernOptions.map(concern => (
                <View
                  key={concern}
                  className={`${styles.concernTag} ${selectedConcerns.includes(concern) ? styles.active : ''}`}
                  onClick={() => handleConcernToggle(concern)}
                >
                  <Text>{concern}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>沟通内容</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请输入沟通内容详情..."
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              maxlength={500}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>跟进结果</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请输入本次跟进结果..."
              value={result}
              onInput={(e) => setResult(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>

        {attitude === 'negative' && (
          <View className={styles.formSection}>
            <Text className={styles.sectionTitle}>流失原因标记</Text>
            <View className={styles.churnReasons}>
              {churnReasons.map(reason => (
                <View
                  key={reason.value}
                  className={`${styles.churnReasonTag} ${selectedChurnReasons.includes(reason.value as ChurnReason) ? styles.active : ''}`}
                  onClick={() => handleChurnReasonToggle(reason.value as ChurnReason)}
                >
                  <Text>{reason.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View className={`${styles.btn} ${styles.outline}`} onClick={handleCancel}>
          <Text>取消</Text>
        </View>
        <View className={`${styles.btn} ${styles.primary}`} onClick={handleSubmit}>
          <Text>保存记录</Text>
        </View>
      </View>
    </View>
  )
}

export default AddRecordPage
