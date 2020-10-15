// pages/detail.js
const appInstance = getApp();
const globalData = appInstance.globalData;
Page({
  data: {
    curLecture: {},
  },

  onLoad: function (options) {
    console.log(options.lid);
    var lecture = globalData.lectures[options.lid];
    console.log(lecture);
    if (lecture.category == 1) {
      lecture.category = '科技类';
    } else {
      lecture.category = '人文类';
    }
    var temp = lecture.venue.split('#')
    lecture.venue = temp[0];
     if (temp.length < 2) {
       lecture.fu_venue = temp[1];
     } else {
       lecture.fu_venue = '';
     }
    this.setData({
      curLecture: lecture
    })
  },

  tapBack: function() {
    wx.navigateTo({
      url:'/pages/index/index?page=lecture',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.curLecture.name,
      path: '/pages/lecture/detail/detail?lid=' + this.data.curLecture.lid,
    }
  },
  onShareTimeline: function() {
    return {
      title: this.data.curLecture.name,
      path: '/pages/lecture/detail/detail?lid=' + this.data.curLecture.lid,
    }
  }
})