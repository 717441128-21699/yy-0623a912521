import { FollowTask, TaskTemplate } from '@/types'

export const mockTasks: FollowTask[] = [
  {
    id: 'task001',
    customerId: 'c001',
    customerName: '王雅婷',
    cardId: 'card001',
    cardName: '水光针基础套餐',
    title: '第21天提醒补水护理',
    content: '提醒客户做完水光针21天后，注意补水护理，可建议到店做一次深层补水护理巩固效果。',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-06-22',
    createdAt: '2026-06-15',
    templateId: 'tpl001'
  },
  {
    id: 'task002',
    customerId: 'c003',
    customerName: '张美丽',
    cardId: 'card005',
    cardName: '水光针升级版',
    title: '剩2次建议升级套餐',
    content: '客户水光卡只剩2次，建议推荐升级为年度保养套餐，或者搭配光电项目做组合。',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-06-22',
    createdAt: '2026-06-18',
    templateId: 'tpl002'
  },
  {
    id: 'task003',
    customerId: 'c002',
    customerName: '李梦瑶',
    cardId: 'card003',
    cardName: '热玛吉抗衰疗程',
    title: '术后7天回访',
    content: '热玛吉治疗后7天回访，询问恢复情况，有无不适，提醒注意事项。',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-06-23',
    createdAt: '2026-06-16',
    templateId: 'tpl003'
  },
  {
    id: 'task004',
    customerId: 'c006',
    customerName: '周小芳',
    cardId: 'card007',
    cardName: '热玛吉4代全面部',
    title: '疗程过半提醒预约',
    content: '客户热玛吉疗程已过半，提醒预约下一次治疗，确保疗程效果。',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-24',
    createdAt: '2026-06-10',
    templateId: 'tpl004'
  },
  {
    id: 'task005',
    customerId: 'c004',
    customerName: '陈思琪',
    cardId: 'card006',
    cardName: '全身脱毛8次卡',
    title: '下次治疗提醒',
    content: '提醒客户距离上次脱毛已超过45天，建议尽快预约下一次治疗。',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-06-20',
    createdAt: '2026-06-08',
    templateId: 'tpl005'
  },
  {
    id: 'task006',
    customerId: 'c005',
    customerName: '刘思雨',
    cardId: 'card008',
    cardName: '光子嫩肤体验卡',
    title: '体验后转化跟进',
    content: '客户体验了光子嫩肤，跟进体验感受，推荐正式疗程卡。',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-06-22',
    createdAt: '2026-06-15',
    templateId: 'tpl006'
  },
  {
    id: 'task007',
    customerId: 'c007',
    customerName: '吴琳琳',
    title: '节日活动邀约',
    content: '618活动邀约，告知活动优惠政策，邀请到店咨询。',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-06-23',
    createdAt: '2026-06-17'
  },
  {
    id: 'task008',
    customerId: 'c008',
    customerName: '郑雪儿',
    title: '流失客户挽回',
    content: '客户超过1个月未到店，主动联系了解原因，尝试挽回。',
    status: 'pending',
    priority: 'low',
    dueDate: '2026-06-25',
    createdAt: '2026-06-12'
  }
]

export const taskTemplates: TaskTemplate[] = [
  {
    id: 'tpl001',
    title: '第21天提醒补水护理',
    content: '您好，距离您上次水光治疗已经21天了，皮肤正处于最佳保养期。建议您到店做一次深层补水护理，可以更好地巩固水光效果，让皮肤持续水润透亮。',
    category: 'water',
    triggerCondition: '水光治疗后第21天'
  },
  {
    id: 'tpl002',
    title: '剩2次建议升级套餐',
    content: '您好，您的疗程卡还剩2次就用完了。我们现在有升级套餐的优惠活动，升级后不仅更划算，还可以搭配其他项目一起做，效果更好哦。',
    category: 'general',
    triggerCondition: '剩余次数≤2次'
  },
  {
    id: 'tpl003',
    title: '术后7天回访',
    content: '您好，做完治疗已经7天了，想了解一下您的恢复情况怎么样？有没有什么不适的地方？有任何问题随时跟我说哈。',
    category: 'general',
    triggerCondition: '治疗后第7天'
  },
  {
    id: 'tpl004',
    title: '疗程过半提醒预约',
    content: '您好，您的疗程已经进行一半了，效果应该开始显现了吧？记得提前预约下一次治疗哦，按疗程做效果才最好。',
    category: 'general',
    triggerCondition: '疗程过半'
  },
  {
    id: 'tpl005',
    title: '下次治疗提醒',
    content: '您好，距离您上次治疗已经有一段时间了，按疗程建议您该做下一次了。我帮您预约一下时间？',
    category: 'general',
    triggerCondition: '距上次治疗超过建议间隔'
  },
  {
    id: 'tpl006',
    title: '体验后转化跟进',
    content: '您好，上次体验完感觉怎么样？有没有兴趣了解一下正式的疗程方案？现在办卡还有优惠哦。',
    category: 'general',
    triggerCondition: '体验项目后7天'
  },
  {
    id: 'tpl007',
    title: '生日祝福+专属优惠',
    content: '您好，祝您生日快乐！这个月给您准备了专属的生日优惠，有时间可以过来看看~',
    category: 'general',
    triggerCondition: '客户生日当月'
  },
  {
    id: 'tpl008',
    title: '卡到期提醒',
    content: '您好，您的疗程卡还有1个月就要到期了，记得尽快把剩余次数用完哦。有需要的话也可以续卡。',
    category: 'general',
    triggerCondition: '卡到期前30天'
  }
]
