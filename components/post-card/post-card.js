const server = require("../../utils/server.js")
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
  },
  methods: {
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */

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