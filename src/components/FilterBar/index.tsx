import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface FilterOption {
  key: string
  label: string
}

interface FilterBarProps {
  options: FilterOption[]
  activeKey: string
  onChange: (key: string) => void
  className?: string
}

const FilterBar: React.FC<FilterBarProps> = ({ options, activeKey, onChange, className }) => {
  return (
    <ScrollView
      scrollX
      className={classnames(styles.filterBar, className)}
      showsHorizontalScrollIndicator={false}
    >
      {options.map(option => (
        <View
          key={option.key}
          className={classnames(styles.filterItem, activeKey === option.key && styles.active)}
          onClick={() => onChange(option.key)}
        >
          <Text className={styles.filterText}>{option.label}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default FilterBar
