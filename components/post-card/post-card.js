const server = require("../../utils/server.js")
const appInstance = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    post: {
      type: Object,
      value: {}
    },
    author: {
      type: Object,
      value: {}
    },
    showShare: {
      type: Boolean,
      value: false
    },
    curTab: {
      type: String,
      value: "comment"
    }
  },
  data: {
    me: appInstance.globalData.stuInfo,
  },
  lifetimes: {
    attached: function() {
      appInstance.watch("stuInfo", (val)=>{
        this.setData({
            me: val,
        });
    });
    },
    detached: function() {
    },
  },
  methods: {
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */

   _viewImage(e) {
    console.log(e);
    let imgIdx = e.currentTarget.dataset.imgIdx;
    wx.previewImage({
      urls: this.data.post.images,
      current: this.data.post.images[imgIdx],
    });
   },

    _likePost() {
      let post = this.properties.post;
      if (post.liked) {
        return
      }
      let appInstance = getApp();
      if ('token' in appInstance.globalData.stuInfo) {
        server.likePost(post.id)
          .then((res)=>{
            if(res.data.status == 200) {
              post.liked = true;
              post.like = post.like + 1;
              this.setData({
                post
              })
            }
          });
      } else {
        this.triggerEvent("goLogin");
        return
      }
    },
    _starPost() {
      let post = this.properties.post;
      let appInstance = getApp();
      if ('token' in appInstance.globalData.stuInfo) {
        if (post.stared) {
          server.unstarPost(post.id)
          .then((res)=>{
            if(res.data.status == 200) {
              post.stared = false;
              this.setData({
                post
              })
            }
          });
        } else {
          server.starPost(post.id)
          .then((res)=>{
            if(res.data.status == 200) {
              post.stared = true;
              this.setData({
                post
              })
            }
          });
        }
      } else {
        this.triggerEvent("goLogin");
        return
      }
    },
    _clickDelete() {
      if (this.data.post.uid != this.data.me.id && this.data.me.id != 1) {
        return
      }
      wx.showModal({
        title: '提示',
        content: '确定要删除该条动态吗？',
        success: (res)=> {
          if (res.confirm) {
            console.log('用户点击确定')
            this._deletePost();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    _deletePost() {
      let post = this.data.post;
      let delPromise = null;
      if(post.uid == this.data.me.id) {
        delPromise = server.deletePost(post.id);
      } else if (this.data.me.id == 1) {
        delPromise = server.adminDeletePost(post.id);
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
            this.triggerEvent("delPost");
          } else {
            wx.showModal({
              title: '提示',
              content: '删除失败，请确认登录状态未失效',
            })
          }
        })
    },
    _switchLikes() {
      this.triggerEvent("switchToLikes")
    },
    _switchComments() {
      this.triggerEvent("switchToComments")
    },
    _sharePost() {
      console.log("post-card catch share post")
      this.triggerEvent("tapShare");
    },
    _commentPost() {
      console.log("post-card catch comment post")
      this.triggerEvent("tapComment");
    },
    _goAuthor() {
      let uid = this.properties.post.uid;
      if (uid == 0) {
        return;
      }
      wx.navigateTo({
        url: "/pages/profile/profile?sid=" + uid,
      });
    }
  }
})