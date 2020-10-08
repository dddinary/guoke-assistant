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

    placeholderText: "发表评论:",
    isFocus: false,
    inputBottom: 0,
    inputArea: '',

    cidToComment: 0,
    ruidToComment: 0,

    modalName: '',
  },

  onLoad: function (options) {
    let pid = options.pid;
    console.log(pid);
    this.setData({
      me: globalData.stuInfo,
      pid: pid,
    });
    appInstance.watch("stuInfo", (val)=>{
      this.setData({
        me: val,
      });
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
            ruidToComment: resData.post.uid,
          });
        } else {
          console.log("get post info failed: ", res);
        }
        wx.hideLoading();
      }).catch((err)=>{
        wx.hideLoading();
        this.showModal("empty");
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
            comments[comment.id] = comment;
            if(comment.cid == 0) {
              commentIdList.push(comment.id);
              comment.children = [];
            }
          }
          for (let comment of resData.comments) {
            if(comment.cid != 0 && comment.cid in comments) {
              comments[comment.cid].children.push(comment);
            }
          }
          // 这里需要对二级评论按照时间排序
          commentIdList = commentIdList.sort((a, b)=>{
            return comments[b].like - comments[a].like;
          });
          for (let cid of commentIdList) {
            comments[cid].children = comments[cid].children.sort((a, b)=>{
              return a.id - b.id;
            });
          }
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

  likeComment: function(e) {
    let cid = e.currentTarget.dataset.cid;
    let comments = this.data.comments;
    if (comments[cid].liked) {
      return;
    }
    server.likeComment(cid)
      .then((res)=>{
        if (res.data.status == 200) {
          comments[cid].like++;
          comments[cid].liked = true;
          this.setData({
            comments
          })
        }
      })
  },

  delComment: function(e) {
    let cid = e.currentTarget.dataset.cid;
    let comment = this.data.comments[cid];
    if (comment.uid != this.data.me.id && this.data.me.id != 1) {
      return;
    } 
    wx.showModal({
      title: '提示',
      content: '确定要删除该条评论吗？',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          this._deleteComment(comment);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  _deleteComment: function(comment) {
    let delPromise = null;
    if(comment.uid == this.data.me.id) {
      delPromise = server.deleteComment(comment.id);
    } else if (this.data.me.id == 1) {
      delPromise = server.adminDeleteComment(comment.id);
    } else {
      return;
    }
    delPromise
      .then((res)=>{
        if (res.data.status == 200) {
          wx.showModal({
            title: '提示',
            content: '删除成功',
          });
          this.updateComments();
        } else {
          wx.showModal({
            title: '提示',
            content: '删除失败，请确认登录状态未失效',
          })
        }
      })
  },

  pubComment: function(e) {
    if (!('token' in globalData.stuInfo)) {
      this.showModal("failed");
      return;
    }
    wx.showLoading({
      title: '发表中...'
    });
    let pid = this.data.pid;
    let content = this.data.inputArea;
    let cidToComment = this.data.cidToComment;
    let ruidToComment = this.data.ruidToComment;
    let commentPromise;
    if (cidToComment == 0) {
      commentPromise = server.commentPost(pid, content)
    } else {
      commentPromise = server.commentComment(pid, cidToComment, ruidToComment, content)
    }
    commentPromise.then((res)=>{
      console.log("publish post: ", res);
      let resData = res.data;
      if (resData.status == '200') {
          console.log('发表成功');
          this.setData({
            inputArea: '',
          })
          this.hideModal();
          this.updateComments();
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

  tapComment: function(e) {
    let dataset = e.currentTarget.dataset;
    let cidToComment = dataset.cid;
    let ruidToComment = dataset.ruid;
    let rname = dataset.rname;
    this.setData({
      cidToComment,
      ruidToComment,
      isFocus: true,
      placeholderText: '回复@' + rname + "的评论:",
    })
  },

  inputFocus(e) {
    this.setData({
      inputBottom: e.detail.height
    })
  },

  inputBlur(e) {
    this.setData({
      inputBottom: 0
    })
    if (this.data.inputArea === '') {
      let cidToComment = 0;
      let ruidToComment = this.data.post.uid;
      let placeholderText = "发表评论";
      this.setData({
        cidToComment,
        ruidToComment,
        placeholderText,
      })
    }
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
  onShareAppMessage: function (res) {
    return {
      title: '果壳助手小程序',
      path: '/pages/post/post?pid=' + this.data.pid,
    }
  },
  onShareTimeline: function() {
    return {
      title: '果壳助手小程序',
      path: '/pages/post/post?pid=' + this.data.pid,
    }
  }
})