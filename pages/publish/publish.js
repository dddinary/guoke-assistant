const server = require("../../utils/server.js");
const appInstance = getApp();
const globalData = appInstance.globalData;

Page({
    data: {
      textHeight: 100,
      textareaValue: '',
      modalName: '',
      kind: 0,
    },

    onLoad: function (options) {
      this.updateTextHeight();
    },

    onShow: function() {
      this.hideModal();
      this.checkLogin();
    },

    updateTextHeight() {
      var sysInfo = wx.getSystemInfoSync();
      var winHeight = sysInfo.windowHeight;
      this.setData({
        bodyHeight: winHeight * 0.3,
      });
    },

    checkLogin: function() {
      if (!globalData.stuInfo.sessionid) {
        this.showModal("shouldLogin");
      }
    },
  
    onTextareaInput: function(e) {
      this.setData({
        textareaValue: e.detail.value
      });
    },

    tapAnonymousSwitch: function(e) {
      let kind = 0;
      if (e.detail.value) {
        kind = 1;
      }
      this.setData({
        kind: kind
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

    pubPost: function(e) {
      var sessionid = globalData.stuInfo.sessionid;
      if (sessionid == null || sessionid == '') {
        this.showModal("failed");
        return;
      }
      this.showModal("loading");
      var kind = this.data.kind;
      var content = this.data.textareaValue;
      console.log({ kind, content});
      server.publishPost(sessionid, 0, kind, content, '')
        .then((res)=>{
            console.log("publish post: ", res);
            let resData = res.data;
            if (resData.status == '200') {
                console.log('发布成功');
                this.hideModal();
                wx.switchTab({
                  url: '/pages/community/community',
                });
            } else {
                this.showModal("failed");
            }
        })
        .catch((err)=>{
            this.showModal("failed");
            console.log("publish post: ", err);
        });
    },

    cancelLogin: function() {
      wx.navigateBack({
        delta: 1
      });
    },

    goLogin: function() {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
})