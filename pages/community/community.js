const server = require("../../utils/server.js");
const date = require("../../utils/date.js");
const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    PlaceHolderHeight: app.globalData.PlaceHolderHeight,
    posts: [],
    students: {},

    kind: 0,
    order: 0,

    orderList: ['最近发布', '七日高赞', '七日多评'],
  },

  onLoad: function (options) {
    this.updateNewsFeed();
  },

  updateNewsFeed: function() {
    var kind = this.data.kind;
    var order = this.data.order;
    wx.showLoading({
      title: '快速加载中...'
    });
    server.getNews(kind, order, 0)
      .then((res)=>{
        console.log("get news info: ", res);
        var resData = res.data;
        if ("posts" in resData && "students" in resData) {
          for (let idx in resData.posts) {
            let post = resData.posts[idx];
            let d = new Date(post.created_at);
            post.created_at = d.getFullYear() + date.formatDate(d, '-MM-dd HH:mm');
          }
          resData.students[0] = {name: '匿名', dpt: '中国科学院大学', avatar: 'http://ww1.sinaimg.cn/small/006m0GqOly1ga8zvcs4wwj30go0go75a.jpg'}
          this.setData({
            posts: res.data.posts,
            students: res.data.students,
          });
          wx.hideLoading();
        } else {
          wx.hideLoading();
          console.log("get news info failed: ", res);
        }
      }).catch((err)=>{
        wx.hideLoading();
        console.log("get news info failed: ", err);
    });
  },

  changeKind: function(e) {
    var kind = e.currentTarget.dataset.kind;
    console.log('点击修改类型，携带值为', kind);
    this.setData({
        kind: kind,
    })
    this.updateNewsFeed();
  },

  changeOrder: function(e) {
    console.log('picker修改顺序，携带值为', e.detail.value);
    this.setData({
        order: e.detail.value,
    });
    this.updateNewsFeed();
  },

  goPost: function(e) {
    let pid = e.currentTarget.dataset.pid;
    console.log('点击去往post详情页，携带值为', pid);
    wx.navigateTo({
      url: "/pages/post/post?pid=" + pid,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})