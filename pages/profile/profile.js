const server = require("../../utils/server.js");
const globalData = getApp().globalData;
Page({
  data: {
    SafeArea: globalData.SysInfo.safeArea,
    WindowHeight: globalData.SysInfo.windowHeight,
    StatusBar: globalData.SysInfo.statusBarHeight,
    Custom: globalData.Custom,
    CustomBar: globalData.CustomBar,
    bodyHeight: 400,

    sid: 0,
    postIdList: [],
    posts: {},
    user:{},
    students: {},

    triggered: false,
    freshing: false,
    loadingData: false,
    noMore: false,
    page: 0,
  },

  onLoad: function (options) {
    //console.log(options);
    let sid = options.sid;
    this.setData({
      me: globalData.stuInfo,
      sid: sid,
    });
    appInstance.watch("stuInfo", (val)=>{
      this.setData({
        me: val,
      });
    });
    this.updateBodyHeight();
    this.updateStuInfo();
    this.updateStuPost();
  },

  updateBodyHeight: function() {
    var query = wx.createSelectorQuery();
    query.select(".head-container").boundingClientRect();
    query.exec((rect)=>{
      this.setData({
        bodyHeight: this.data.SafeArea.height - this.data.CustomBar - rect[0].height,
      });
    });
  },

  updateStuInfo: function() {
    server.getStudentInfo(this.data.sid)
      .then((res)=>{
        this.setData({
          user: res.data,
        })
      })
  },

  updateStuPost: function() {
    this.data.page = 0;
    this.data.postIdList = [];
    this.data.posts = {};
    this.data.students = {};
    this.loadMorePost();
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
    let sid = this.data.sid;
    let page = this.data.page;
    server.getUserPost(sid, page)
      .then((res)=>{
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
    this.updateStuPost();
  },

  onRestore(e) {
    console.log('onRestore:', e)
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

  goPost: function(e) {
    let pid = e.currentTarget.dataset.pid;
    console.log('点击去往post详情页，携带值为', pid);
    wx.navigateTo({
      url: "/pages/post/post?pid=" + pid,
    });
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
