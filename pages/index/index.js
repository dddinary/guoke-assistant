Page({
    data: {
      PageCur: 'shedule',
      pages: ['shedule', 'lecture', 'community', 'me']
    },
    onLoad: function (options) {
      let page = options.page;
      if (page == null || page == undefined || page == '' || this.data.pages.indexOf(page) < 0) {
        return;
      }
      console.log(page);
      this.setData({
        PageCur: page,
      });
    },
    navChange(e) {
      this.setData({
        PageCur: e.currentTarget.dataset.cur,
      })
    },
    toPublish(e) {
        wx.navigateTo({
          url: '/pages/publish/publish',
        });
    },

    onShareAppMessage: function() {
      return {
        title: '果壳助手',
        path: '/pages/index/index?page=' + this.data.PageCur,
      }
    },
    onShareTimeline: function() {
      return {
        title: '果壳助手',
        imageUrl: '/images/logo.jpg',
        path: '/pages/index/index?page=' + this.data.PageCur,
      }
    }
  })