import { Card, TreatmentRecord } from '@/types'

const treatmentRecords: Record<string, TreatmentRecord[]> = {
  'card001': [
    { id: 't001', date: '2026-03-15', doctor: '张医生', therapist: '小李', feedback: '皮肤水润度明显提升，客户满意', nextInterval: 30 },
    { id: 't002', date: '2026-04-18', doctor: '张医生', therapist: '小李', feedback: '保持良好，建议加强防晒', nextInterval: 30 },
    { id: 't003', date: '2026-05-20', doctor: '王医生', therapist: '小王', feedback: '皮肤状态稳定，继续保持', nextInterval: 30 },
    { id: 't004', date: '2026-06-20', doctor: '张医生', therapist: '小李', feedback: '第4次治疗，效果显著', nextInterval: 30 }
  ],
  'card002': [
    { id: 't005', date: '2026-02-10', doctor: '李医生', therapist: '小张', feedback: '首次脱毛，轻度泛红正常', nextInterval: 45 },
    { id: 't006', date: '2026-03-28', doctor: '李医生', therapist: '小张', feedback: '毛发明显减少', nextInterval: 45 },
    { id: 't007', date: '2026-05-15', doctor: '李医生', therapist: '小王', feedback: '第三次治疗，效果良好', nextInterval: 60 }
  ],
  'card003': [
    { id: 't008', date: '2026-01-05', doctor: '赵医生', therapist: '小李', feedback: '首次抗衰治疗，注意补水', nextInterval: 90 },
    { id: 't009', date: '2026-04-10', doctor: '赵医生', therapist: '小李', feedback: '面部紧致度提升明显', nextInterval: 90 }
  ],
  'card004': [
    { id: 't010', date: '2026-05-08', doctor: '王医生', therapist: '小张', feedback: '首次光电治疗，结痂正常', nextInterval: 60 }
  ],
  'card005': [
    { id: 't011', date: '2026-03-01', doctor: '张医生', therapist: '小王', feedback: '首次水光，补水效果好', nextInterval: 30 },
    { id: 't012', date: '2026-04-05', doctor: '张医生', therapist: '小王', feedback: '皮肤通透度提升', nextInterval: 30 },
    { id: 't013', date: '2026-05-10', doctor: '张医生', therapist: '小李', feedback: '第三次治疗，肤色均匀', nextInterval: 30 },
    { id: 't014', date: '2026-06-08', doctor: '王医生', therapist: '小李', feedback: '第四次，巩固效果', nextInterval: 30 },
    { id: 't015', date: '2026-06-18', doctor: '张医生', therapist: '小王', feedback: '第五次，效果稳定', nextInterval: 45 }
  ],
  'card006': [
    { id: 't016', date: '2026-02-20', doctor: '李医生', therapist: '小张', feedback: '腋下脱毛首次', nextInterval: 45 },
    { id: 't017', date: '2026-04-10', doctor: '李医生', therapist: '小张', feedback: '毛发明显变细变少', nextInterval: 45 }
  ],
  'card007': [
    { id: 't018', date: '2026-04-15', doctor: '赵医生', therapist: '小李', feedback: '热玛吉首次治疗', nextInterval: 30 },
    { id: 't019', date: '2026-05-20', doctor: '赵医生', therapist: '小李', feedback: '第二次，紧致效果显现', nextInterval: 60 }
  ],
  'card008': [
    { id: 't020', date: '2026-06-01', doctor: '王医生', therapist: '小王', feedback: '体验光子嫩肤', nextInterval: 30 }
  ]
}

export const mockCards: Card[] = [
  {
    id: 'card001',
    name: '水光针基础套餐',
    category: 'water',
    totalTimes: 6,
    usedTimes: 4,
    expiryDate: '2026-09-15',
    lastTreatmentDate: '2026-06-20',
    customerId: 'c001',
    treatmentRecords: treatmentRecords['card001'],
    price: 3800
  },
  {
    id: 'card002',
    name: '冰点脱毛腋下包年',
    category: 'hair',
    totalTimes: 8,
    usedTimes: 3,
    expiryDate: '2027-02-10',
    lastTreatmentDate: '2026-05-15',
    customerId: 'c001',
    treatmentRecords: treatmentRecords['card002'],
    price: 2980
  },
  {
    id: 'card003',
    name: '热玛吉抗衰疗程',
    category: 'antiaging',
    totalTimes: 3,
    usedTimes: 2,
    expiryDate: '2026-12-05',
    lastTreatmentDate: '2026-04-10',
    customerId: 'c002',
    treatmentRecords: treatmentRecords['card003'],
    price: 12800
  },
  {
    id: 'card004',
    name: '光子嫩肤5次卡',
    category: 'photo',
    totalTimes: 5,
    usedTimes: 1,
    expiryDate: '2027-05-08',
    lastTreatmentDate: '2026-05-08',
    customerId: 'c002',
    treatmentRecords: treatmentRecords['card004'],
    price: 3980
  },
  {
    id: 'card005',
    name: '水光针升级版',
    category: 'water',
    totalTimes: 6,
    usedTimes: 5,
    expiryDate: '2026-09-01',
    lastTreatmentDate: '2026-06-18',
    customerId: 'c003',
    treatmentRecords: treatmentRecords['card005'],
    price: 5800
  },
  {
    id: 'card006',
    name: '全身脱毛8次卡',
    category: 'hair',
    totalTimes: 8,
    usedTimes: 2,
    expiryDate: '2027-02-20',
    lastTreatmentDate: '2026-04-10',
    customerId: 'c004',
    treatmentRecords: treatmentRecords['card006'],
    price: 6800
  },
  {
    id: 'card007',
    name: '热玛吉4代全面部',
    category: 'antiaging',
    totalTimes: 3,
    usedTimes: 2,
    expiryDate: '2026-10-15',
    lastTreatmentDate: '2026-05-20',
    customerId: 'c006',
    treatmentRecords: treatmentRecords['card007'],
    price: 15800
  },
  {
    id: 'card008',
    name: '光子嫩肤体验卡',
    category: 'photo',
    totalTimes: 2,
    usedTimes: 1,
    expiryDate: '2026-07-01',
    lastTreatmentDate: '2026-06-01',
    customerId: 'c005',
    treatmentRecords: treatmentRecords['card008'],
    price: 980
  }
]

export const getCardCategoryName = (category: string): string => {
  const map: Record<string, string> = {
    water: '水光',
    photo: '光电',
    hair: '脱毛',
    antiaging: '抗衰'
  }
  return map[category] || category
}

export const getCardCategoryColor = (category: string): string => {
  const map: Record<string, string> = {
    water: '#13c2c2',
    photo: '#722ed1',
    hair: '#fa8c16',
    antiaging: '#eb2f96'
  }
  return map[category] || '#e83e8c'
}
