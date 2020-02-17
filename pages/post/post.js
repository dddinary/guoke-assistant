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
    commentIdList: [],
    likedUidList: [],
    students: {
      0: {name: '匿名', dpt: '中国科学院大学', avatar: 'http://ww1.sinaimg.cn/small/006m0GqOly1ga8zvcs4wwj30go0go75a.jpg'},
    },
    curTab: "comment",

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
    this.updateComments();
  },

  updatePost: function() {
    wx.showLoading({
      title: '快速加载中...'
    });
    server.getPost(this.data.pid)
      .then((res)=>{
        let resData = res.data;
        if ("post" in resData && "student" in resData) {
          let d = new Date(resData.post.created_at);
          resData.post.created_at = d.getFullYear() + date.formatDate(d, '-MM-dd HH:mm');
          if(resData.post.uid == 0) {
            resData.student = this.data.students[0];
          }
          this.setData({
            post: resData.post,
            user: resData.student,
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

  updateComments: function() {
    server.getPostComments(this.data.pid)
      .then((res)=>{
        console.log(res)
        let resData = res.data;
        let post = this.data.post;
        let comments = {};
        let commentIdList = [];
        let students = this.data.students;
        if ("comments" in resData && "students" in resData) {
          Object.assign(students, resData.students);
          for (let comment of resData.comments) {
            let d = new Date(comment.created_at);
            comment.created_at = d.getFullYear() + date.formatDate(d, '-MM-dd HH:mm');
            if(comment.cid == 0) {
              commentIdList.push(comment.id);
              comment.children = [];
              comments[comment.id] = comment;
            }
          }
          for (let comment of resData.comments) {
            if(comment.cid != 0) {
              comments[comment.cid].children.push(comment);
            }
          }
          commentIdList.sort((a, b)=>{
            comments[b].like - comments[a].like;
          });
          post.comment = commentIdList.length;
          this.setData({
            post,
            students,
            comments,
            commentIdList
          });
        }
      }).catch((err)=>{
        console.log("get post info failed: ", err);
      });
  },

  updateLikes: function() {
    server.getPostLikes(this.data.pid)
      .then((res)=>{
        console.log(res)
        let resData = res.data;
        let post = this.data.post;
        let students = this.data.students;
        let likedUidList = this.data.likedUidList;
        if (resData) {
          Object.assign(students, resData);
          for (let x in resData) {
            if (likedUidList.indexOf(x) == -1) {
              likedUidList.push(x);
            }
          }
          post.like = likedUidList.length;
          this.setData({
            post,
            students,
            likedUidList
          });
        }
      }).catch((err)=>{
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
    if (!('token' in globalData.stuInfo)) {
      this.showModal("failed");
      return;
    }
    var pid = this.data.pid;
    var content = this.data.inputArea;
    console.log({ pid, content});
    wx.showLoading({
      title: '发表中...'
    });
    server.commentPost(pid, content)
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
  },

  switchToLikes: function() {
    this.updateLikes();
    this.setData({
      curTab: "like"
    })
  },

  switchToComments: function() {
    this.updateComments();
    this.setData({
      curTab: "comment"
    })
  },

  goProfile: function(e) {
    let sid = e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: "/pages/profile/profile?sid=" + sid,
    });
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})