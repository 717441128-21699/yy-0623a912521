export default defineAppConfig({
  pages: [
    'pages/today/index',
    'pages/tasks/index',
    'pages/records/index',
    'pages/dashboard/index',
    'pages/card-detail/index',
    'pages/customer-detail/index',
    'pages/create-task/index',
    'pages/add-record/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '疗程卡跟进助手',
    navigationBarTextStyle: 'black',
    backgroundColor: '#faf5f8'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#e83e8c',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/today/index',
        text: '今日客户'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '跟进任务'
      },
      {
        pagePath: 'pages/records/index',
        text: '沟通记录'
      },
      {
        pagePath: 'pages/dashboard/index',
        text: '业绩看板'
      }
    ]
  }
})
