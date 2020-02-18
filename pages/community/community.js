const server = require("../../utils/server.js");
const date = require("../../utils/date.js");
const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    PlaceHolderHeight: app.globalData.PlaceHolderHeight,
    posts: [],
    students: {},

    order: 0,
    orderList: ['最近发布', '七日高赞', '七日多评'],

    kind: 0,
    kindList: ['全部', '通知活动', '果壳问问', '匿名树洞', '约伴交友', '二手市场', '失物招领'],
    scrollLeft: 0,
  },

  onLoad: function (options) {
    this.updateNewsFeed();
  },

  onShow: function() {
    if (app.globalData.communityShouldUpdate) {
      app.globalData.communityShouldUpdate = false;
      this.updateNewsFeed();
    }
  },

  updateNewsFeed: function() {
    let kind = this.data.kind;
    let order = this.data.order;
    wx.showLoading({
      title: '快速加载中...'
    });
    server.getNews(kind, order, 0)
      .then((res)=>{
        console.log("get news info: ", res);
        let resData = res.data;
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

  tabSelect(e) {
    let kind = e.currentTarget.dataset.id;
    let scrollLeft = (kind - 1) * 60;
    this.setData({
      kind,
      scrollLeft
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

  starPost: function(e) {
    let pid = e.currentTarget.dataset.pid;
    console.log('收藏post，携带值为', pid);
  },

  likePost: function(e){
    let pid = e.currentTarget.dataset.pid;
    console.log('点赞post，携带值为', pid);
  },

  checkLogin: function() {
    let hasLogin = 'token' in app.globalData.stuInfo;
    if (hasLogin) {
      return true;
    } else {
      this.goLogin();
    }
  },

  goLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})