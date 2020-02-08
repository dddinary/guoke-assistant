wx.hideTabBar();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    list: {
      "shedule": '/pages/shedule/shedule',
      "lecture": '/pages/lecture/lecture',
      'community': '/pages/community/community',
      'me': '/pages/me/me'
    }
  },
  properties: {
    PageCur: {
      type: String,
      value: 'shedule'
    },
  },
  methods: {
    switchTab(e) {
      const cur = e.currentTarget.dataset.cur;
      const url = this.data.list[cur];
      wx.switchTab({url});
    },
    toPublish(e) {
      wx.navigateTo({
        url: '/pages/publish/publish',
      });
    }
  }
})