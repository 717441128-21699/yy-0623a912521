import { CommunicationRecord } from '@/types'

export const mockRecords: CommunicationRecord[] = [
  {
    id: 'r001',
    customerId: 'c001',
    customerName: '王雅婷',
    type: 'wechat',
    date: '2026-06-21 14:30',
    attitude: 'positive',
    concerns: ['补水效果', '维持时间'],
    content: '微信沟通水光针后续护理，客户表示对效果很满意，皮肤水润度明显提升。询问下次治疗时间。',
    result: '已预约6月28日复诊',
    nextFollowDate: '2026-06-28',
    consultant: '张咨询师'
  },
  {
    id: 'r002',
    customerId: 'c002',
    customerName: '李梦瑶',
    type: 'phone',
    date: '2026-06-20 10:15',
    attitude: 'neutral',
    concerns: ['恢复期', '术后红肿'],
    content: '电话回访热玛吉术后恢复情况，客户表示还有轻微红肿，担心恢复时间太长。已耐心解释恢复过程，告知属于正常现象。',
    result: '客户表示理解，继续观察',
    nextFollowDate: '2026-06-25',
    consultant: '李咨询师'
  },
  {
    id: 'r003',
    customerId: 'c003',
    customerName: '张美丽',
    type: 'visit',
    date: '2026-06-19 16:00',
    attitude: 'positive',
    concerns: ['升级套餐', '价格优惠'],
    content: '客户到店做水光治疗，沟通升级套餐事宜。客户对升级版很感兴趣，询问是否有优惠活动。',
    result: '推荐了年度套餐，客户表示考虑中',
    nextFollowDate: '2026-06-23',
    consultant: '张咨询师'
  },
  {
    id: 'r004',
    customerId: 'c004',
    customerName: '陈思琪',
    type: 'wechat',
    date: '2026-06-18 11:20',
    attitude: 'negative',
    concerns: ['疼痛感', '效果不明显'],
    content: '微信沟通脱毛项目进展，客户表示第三次治疗后感觉效果不明显，还有点疼，有些犹豫要不要继续。',
    result: '已安抚客户，建议到店让医生评估',
    nextFollowDate: '2026-06-22',
    consultant: '王咨询师'
  },
  {
    id: 'r005',
    customerId: 'c006',
    customerName: '周小芳',
    type: 'visit',
    date: '2026-06-17 15:45',
    attitude: 'positive',
    concerns: ['抗衰效果', '长期保养'],
    content: 'VIP客户到店做热玛吉第二次治疗，沟通长期抗衰方案。客户对效果非常满意，主动询问其他抗衰项目。',
    result: '推荐了线雕项目，预约下周面诊',
    nextFollowDate: '2026-06-24',
    consultant: '李咨询师'
  },
  {
    id: 'r006',
    customerId: 'c005',
    customerName: '刘思雨',
    type: 'phone',
    date: '2026-06-15 09:30',
    attitude: 'neutral',
    concerns: ['价格', '学生优惠'],
    content: '电话回访光子嫩肤体验，客户感觉还不错，但觉得正式疗程有点贵，询问有没有学生优惠。',
    result: '已推荐学生套餐，客户说考虑一下',
    nextFollowDate: '2026-06-22',
    consultant: '王咨询师'
  },
  {
    id: 'r007',
    customerId: 'c007',
    customerName: '吴琳琳',
    type: 'wechat',
    date: '2026-06-14 17:00',
    attitude: 'positive',
    concerns: ['组合项目', '时间安排'],
    content: '微信发送618活动信息，客户很感兴趣，想了解水光+光电的组合优惠。',
    result: '已发送组合套餐详情，客户周末到店咨询',
    nextFollowDate: '2026-06-23',
    consultant: '张咨询师'
  },
  {
    id: 'r008',
    customerId: 'c008',
    customerName: '郑雪儿',
    type: 'phone',
    date: '2026-06-10 13:00',
    attitude: 'negative',
    concerns: ['预算有限', '效果预期'],
    content: '电话回访，客户表示最近预算有限，暂时不考虑新项目。之前做的项目感觉效果一般。',
    result: '标记流失风险，后续再跟进',
    consultant: '王咨询师'
  }
]

export const getCommunicationTypeName = (type: string): string => {
  const map: Record<string, string> = {
    phone: '电话',
    wechat: '微信',
    visit: '到店'
  }
  return map[type] || type
}

export const getAttitudeName = (attitude: string): string => {
  const map: Record<string, string> = {
    positive: '积极',
    neutral: '一般',
    negative: '消极'
  }
  return map[attitude] || attitude
}

export const getAttitudeColor = (attitude: string): string => {
  const map: Record<string, string> = {
    positive: '#00b42a',
    neutral: '#ff7d00',
    negative: '#f53f3f'
  }
  return map[attitude] || '#86909c'
}

export const churnReasons = [
  { value: 'price', label: '价格犹豫' },
  { value: 'recovery', label: '恢复期不便' },
  { value: 'effect', label: '效果不明显' },
  { value: 'other', label: '其他原因' }
]
