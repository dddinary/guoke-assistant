// pages/detail.js
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
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})