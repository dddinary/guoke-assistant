const server = require("../../utils/server.js");
const appInstance = getApp();
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
    this.setData({
      bodyHeight: this.data.SafeArea.height - globalData.RpxToPx * 200 + this.data.StatusBar,
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

  clickBlock: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定要封禁该用户吗？',
      success: (res)=> {
        if (res.confirm) {
          this.BRStudent('block');
        } else if (res.cancel) {}
      }
    })
  },

  clickUnblock: function(e) {
    wx.showModal({
      title: '提示',
      content: '确定要解封该用户吗？',
      success: (res)=> {
        if (res.confirm) {
          this.BRStudent('unblock');
        } else if (res.cancel) {}
      }
    })
  },

  BRStudent: function(op) {
    let uid = this.data.user.id;
    let opPromise = null;
    if (op == 'block') {
      opPromise = server.adminBlockStudent(uid)
    } else if (op == 'unblock') {
      opPromise = server.adminUnblockStudent(uid)
    } else {
      return;
    }
    opPromise
      .then((res)=>{
        if (res.data.status == 200) {
          wx.showModal({
            title: '提示',
            content: '操作成功',
          });
          this.updateStuInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '操作失败，请确认登录状态未失效',
          })
        }
      })
      .catch((err)=>{
        console.log(err);
      })
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

  clickBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '果壳助手-' + this.data.user.name,
      path: '/page/profile/profile?sid=' + this.data.sid,
    }
  }
})
