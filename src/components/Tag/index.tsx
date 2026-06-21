import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface TagProps {
  text: string
  color?: string
  bgColor?: string
  size?: 'sm' | 'md'
  className?: string
}

const Tag: React.FC<TagProps> = ({ text, color, bgColor, size = 'sm', className }) => {
  const style = {
    color: color || '#e83e8c',
    backgroundColor: bgColor || 'rgba(232, 62, 140, 0.1)'
  }

  return (
    <View
      className={classnames(styles.tag, styles[size], className)}
      style={style}
    >
      <Text>{text}</Text>
    </View>
  )
}

export default Tag
