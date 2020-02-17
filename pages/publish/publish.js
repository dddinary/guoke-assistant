const server = require("../../utils/server.js");
const appInstance = getApp();
const globalData = appInstance.globalData;

Page({
    data: {
      textHeight: 100,
      textareaValue: '',
      modalName: '',
      kind: 0,
      kindIdx: 0,
      kindList:[
        {id: 0, name: "普通发布"},
        {id: 2, name: "果壳问问"},
        {id: 3, name: "匿名树洞"},
        {id: 4, name: "约伴交友"},
        {id: 5, name: "二手市场"},
        {id: 6, name: "失物招领"},
      ],
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

    pickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      let kindIdx = e.detail.value;
      let kind = this.data.kindList[kindIdx].id;
      this.setData({
        kindIdx,
        kind
      })
    },

    checkLogin: function() {
      if (!globalData.stuInfo.token) {
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
      this.showModal("loading");
      var kind = this.data.kind;
      var content = this.data.textareaValue;
      server.publishPost(kind, content, '')
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