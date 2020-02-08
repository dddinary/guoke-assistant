const server = require("../../utils/server.js");
const date = require("../../utils/date.js");
const appInstance = getApp();
const globalData = appInstance.globalData;
Page({
  data: {
    me: {},
    pid: 0,
    user: {},
    post: {},
    comments: {},
    students: {},

    inputArea: '',
    modalName: '',
  },

  onLoad: function (options) {
    let pid = options.pid;
    console.log(pid);
    this.setData({
      me: globalData.stuInfo,
      pid: pid,
    });
    this.updatePost();
  },

  updatePost: function() {
    wx.showLoading({
      title: '快速加载中...'
    });
    server.getPost(this.data.pid)
      .then((res)=>{
        let resData = res.data;
        if ("post" in res.data && "comments" in res.data && "students" in res.data) {
          console.log(res);
          let d = new Date(resData.post.created_at);
          resData.post.created_at = d.getFullYear() + date.formatDate(d, '-MM-dd HH:mm');
          for (let idx in resData.comments) {
            let comment = resData.comments[idx];
            let d = new Date(comment.created_at);
            comment.created_at = d.getFullYear() + date.formatDate(d, '-MM-dd HH:mm');
          }
          resData.students[0] = {name: '匿名', dpt: '中国科学院大学', avatar: 'http://ww1.sinaimg.cn/small/006m0GqOly1ga8zvcs4wwj30go0go75a.jpg'}
          this.setData({
            post: resData.post,
            comments: resData.comments,
            students: resData.students,
            user: resData.students[resData.post.uid],
          });
        } else {
          console.log("get post info failed: ", res);
        }
        wx.hideLoading();
      }).catch((err)=>{
        wx.hideLoading();
        console.log("get post info failed: ", err);
      });
  },

  showModal: function(name) {
    this.setData({
        modalName: name,
    });
  },

  hideModal: function() {
      this.setData({
          modalName: "",
      });
  },

  onTextareaInput: function(e) {
    this.setData({
      inputArea: e.detail.value
    });
  },

  pubComment: function(e) {
    var sessionid = globalData.stuInfo.sessionid;
    if (sessionid == null || sessionid == '') {
      this.showModal("failed");
      return;
    }
    var pid = this.data.pid;
    var content = this.data.inputArea;
    console.log({ pid, content});
    wx.showLoading({
      title: '发表中...'
    });
    server.publishPost(sessionid, pid, 0, content, '')
      .then((res)=>{
          console.log("publish post: ", res);
          let resData = res.data;
          if (resData.status == '200') {
              console.log('发表成功');
              this.setData({
                inputArea: '',
              })
              this.hideModal();
              this.updatePost();
          } else {
              this.showModal("failed");
          }
          wx.hideLoading();
      })
      .catch((err)=>{
        wx.hideLoading();
        this.showModal("failed");
        console.log("publish post: ", err);
      });
  },

  goLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
})