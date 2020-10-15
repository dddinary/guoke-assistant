const server = require("../../utils/server");

const appInstance = getApp();
const globalData = appInstance.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curLecture: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.lid);
    var lid = options.lid;
    var lecture = null;
    if (globalData.lectures == null || globalData.lectures == undefined) {
      server.getLecture(lid).then((res)=>this.updateLecture(res.data));
    } else {
      lecture = globalData.lectures[lid];
      this.updateLecture(lecture)
    }
  },

  updateLecture: function(lecture) {
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
    wx.switchTab({
      url:'/pages/lecture/lecture',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: this.data.curLecture.name,
      path: '/pages/detail/detail?lid=' + this.data.curLecture.lid,
    }
  },
  onShareTimeline: function() {
    return {
      title: this.data.curLecture.name,
      path: '/pages/detail/detail?lid=' + this.data.curLecture.lid,
    }
  }
})