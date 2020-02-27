const server = require("../../utils/server.js");
const date = require("../../utils/date.js");
const appInstance = getApp();
const globalData = getApp().globalData;
Page({
  data: {
    closeCommunity: globalData.closeCommunity,

    SafeArea: globalData.SysInfo.safeArea,
    WindowHeight: globalData.SysInfo.windowHeight,
    StatusBar: globalData.SysInfo.statusBarHeight,
    Custom: globalData.Custom,
    CustomBar: globalData.CustomBar,

    messageCount: globalData.messageCount,
    
    bodyHeight: 400,
    postIdList: [],
    posts: {},
    students: {},

    triggered: false,
    freshing: false,
    loadingData: false,
    noMore: false,
    page: 0,

    order: 0,
    orderList: ['最近发布', '七日高赞', '七日多评'],

    kind: 0,
    kindList: ['全部', '通知活动', '果壳问问', '匿名树洞', '约伴交友', '二手市场', '失物招领'],
    scrollLeft: 0,
  },

  onLoad: function (options) {
    appInstance.watch("messageCount", (val)=>{
      this.setData({
        messageCount: val,
      });
    });
    this.updateBodyHeight();
    this.updateNewsFeed();
  },

  onShow: function() {
    if (globalData.communityShouldUpdate) {
      globalData.communityShouldUpdate = false;
      this.updateNewsFeed();
    }
    this.getNewMessage();
  },

  updateBodyHeight: function() {
    let query = wx.createSelectorQuery();
    query.select(".head-container").boundingClientRect();
    query.select(".foot-container").boundingClientRect();
    query.exec((rect)=>{
      this.setData({
        bodyHeight: this.data.SafeArea.bottom - this.data.CustomBar - rect[0].height - rect[1].height,
      });
    });
  },

  updateNewsFeed: function() {
    this.data.page = 0;
    this.data.postIdList = [];
    this.data.posts = {};
    this.data.students = {};
    this.loadMorePost();
  },

  getNewMessage: function() {
    server.getUnreadMessageCount()
      .then((res)=>{
        if (res.data.count) {
          globalData.messageCount = res.data.count;
        }
      })
      .catch((err)=>{
        console.log(err);
      });
  },

  loadMorePost: function() {
    wx.showLoading({
      title: '快速加载中...'
    });
    if (this.data.loadingData) return;
    this.data.loadingData = true;
    let postIdList = this.data.postIdList;
    let posts = this.data.posts;
    let students = this.data.students;
    let kind = this.data.kind;
    let order = this.data.order;
    let page = this.data.page;
    server.getNews(kind, order, page)
      .then((res)=>{
        console.log("load more data: ", res)
        let resData = res.data;
        if ('students' in resData && 'posts' in resData) {
          resData.students[0] = {id: 0, name: '匿名', dpt: '中国科学院大学', avatar: 'http://ww1.sinaimg.cn/small/006m0GqOly1ga8zvcs4wwj30go0go75a.jpg'}
          if (resData.posts.length == 0) {
            this.data.noMore = true;
            this.setData({
              noMore: true,
            })
          }
          Object.assign(students, resData.students);
          for (let post of resData.posts) {
            if (postIdList.indexOf(post.id) == -1) {
              postIdList.push(post.id);
            }
            posts[post.id] = post;
          }
        }
        this.setData({
          postIdList,
          posts,
          students,
          triggered: false,
        })
        this.data.freshing = false;
        this.data.loadingData = false;
        wx.hideLoading();
      })
      .catch((err)=>{
        this.setData({
          triggered: false,
        })
        this.data.freshing = false;
        this.data.loadingData = false;
        wx.hideLoading();
        console.log(err);
      })
  },

  onPulling(e) {
  },

  onRefresh() {
    if (this.data.freshing) return
    this.data.freshing = true
    this.updateNewsFeed();
  },

  onRestore(e) {
  },

  onAbort(e) {
  },

  onReachBottom() {
    this.data.page++;
    this.loadMorePost();
  },

  onScroll() {
    if(this.data.noMore) {
      this.setData({
        noMore: false,
      })
    }
  },

  tabSelect(e) {
    let kind = e.currentTarget.dataset.id;
    let scrollLeft = (kind - 1) * 60;
    this.setData({
      kind,
      scrollLeft,
      order: 0
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

  delPost: function(e) {
    let pid = e.currentTarget.dataset.pid;
    console.log('删除post，携带值为', pid);
    let postIdList = this.data.postIdList;
    let i = postIdList.indexOf(pid);
    if (i >= 0) {
      postIdList.splice(i,1);
      this.setData({
        postIdList
      });
    }
  },

  checkLogin: function() {
    let hasLogin = globalData.stuInfo.token;
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