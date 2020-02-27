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

    me: {},
    notiIdList: [],
    notis: {},
    students: {
      0: {id: 0, name: '匿名', dpt: '中国科学院大学', avatar: 'http://ww1.sinaimg.cn/small/006m0GqOly1ga8zvcs4wwj30go0go75a.jpg'},
    },

    notiKind: {
      1: "赞了你的动态",
      2: "评论了你的动态",
      3: "赞了你的评论",
      4: "回复了你的评论",
      11: "删除了你的动态",
      12: "删除了你的评论",
      13: "对你的账号进行了限制",
      14: "解除了对你账号的限制",
      15: "提醒你",
    },

    triggered: false,
    freshing: false,
    loadingData: false,
    noMore: false,
    page: 0,
  },

  onLoad: function () {
    appInstance.watch("stuInfo", (val)=>{
      this.setData({
        me: val,
      });
    });
    this.updateBodyHeight();
    this.updateNotification();
  },

  updateBodyHeight: function() {
    this.setData({
      bodyHeight: this.data.SafeArea.bottom - this.data.CustomBar,
    });
  },

  updateNotification: function() {
    this.data.page = 0;
    this.data.notiIdList = [];
    this.data.notis = {};
    this.data.students = {};
    this.loadMoreNoti();
  },

  loadMoreNoti: function() {
    wx.showLoading({
      title: '快速加载中...'
    });
    if (this.data.loadingData) return;
    this.data.loadingData = true;
    let notiIdList = this.data.notiIdList;
    let notis = this.data.notis;
    let students = this.data.students;
    let page = this.data.page;
    server.getUnreadMessage(page)
      .then((res)=>{
        console.log(res);
        let resData = res.data;
        if ('students' in resData && 'notifications' in resData) {
          if (resData.notifications.length == 0) {
            this.data.noMore = true;
            this.setData({
              noMore: true,
            })
          }
          Object.assign(students, resData.students);
          for (let noti of resData.notifications) {
            if (noti.kind == 1 || noti.kind == 11) {
              noti.content = '原动态：' + noti.content;
            } else if (noti.kind == 3 || noti.kind == 12) {
              noti.content = '原评论：' + noti.content;
            } else if (noti.kind == 2 || noti.kind== 4 || noti.kind == 15) {
              noti.content = '@'+ this.data.me.name + '：' + noti.content;
            }
            if (notiIdList.indexOf(noti.id) == -1) {
              notiIdList.push(noti.id);
            }
            notis[noti.id] = noti;
          }
        }
        this.setData({
          notiIdList,
          notis,
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
    this.updateNotification();
  },

  onRestore(e) {
  },

  onAbort(e) {
  },

  onReachBottom() {
    this.data.page++;
    this.loadMoreNoti();
  },

  onScroll() {
    if(this.data.noMore) {
      this.setData({
        noMore: false,
      })
    }
  },

  goPost: function(e) {
    let nid = e.currentTarget.dataset.nid;
    server.readMessage(nid)
      .then((res)=>{
        if(res.data.status == 200) {
          this.data.notis[nid].status = 1;
          this.setData({
            notis: this.data.notis,
          })
        }
      })
    let pid = e.currentTarget.dataset.pid;
    console.log('点击去往post详情页，携带值为', pid);
    wx.navigateTo({
      url: "/pages/post/post?pid=" + pid,
    });
  },

  readNoti: function(e) {
    let nid = e.currentTarget.dataset.nid;
    server.readMessage(nid)
      .then((res)=>{
        console.log(res)
        if(res.data.status == 200) {
          this.data.notis[nid].status = 1;
          this.setData({
            notis: this.data.notis,
          })
        }
      })
  },

  deleteNoti: function(e) {
    let nid = e.currentTarget.dataset.nid;
    let notiIdList = this.data.notiIdList;
    server.deleteMessage(nid)
      .then((res)=>{
        console.log(res)
        if(res.data.status == 200) {
          let i = notiIdList.indexOf(nid);
          if (i >= 0) {
            notiIdList.splice(i,1);
            this.setData({
              notiIdList
            });
          }
        }
      })
  },

  goProfile: function(e) {
    let uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: "/pages/profile/profile?sid=" + uid,
    });
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalNid: e.currentTarget.dataset.nid
      })
    } else {
      this.setData({
        modalNid: 0
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})
