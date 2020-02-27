const server = require("../../utils/server.js");
const date = require("../../utils/date.js");
var COS = require('../../utils/cos-wx-sdk-v5.js')
const appInstance = getApp();
const globalData = appInstance.globalData;

Page({
    data: {
      closeCommunity: globalData.closeCommunity,
      textHeight: 230,
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
      cos: null,
      imgList: [],
    },

    onLoad: function (options) {
      this.updateTextHeight();
      this.updateCosClient();
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

    updateCosClient: function() {
      this.data.cos = new COS({
        getAuthorization: function (options, callback) {
          server.tempCredential()
          .then((res)=>{
            if ('sessionToken' in res.data) {
              callback({
                TmpSecretId: res.data.tempSecretId,
                TmpSecretKey: res.data.tempSecretKey,
                XCosSecurityToken: res.data.sessionToken,
                ExpiredTime: res.data.expiredTime,
              })
            } else {
              this.showModal("expired");
            }
          })
          .catch((err)=>{
            this.showModal("failed");
          })
        }
      })
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
      let kind = this.data.kind;
      let content = this.data.textareaValue;
      let imgListStr = this.data.imgList.join(",")
      server.publishPost(kind, content, imgListStr)
        .then((res)=>{
            console.log("publish post: ", res);
            let resData = res.data;
            if (resData.status == '200') {
                console.log('发布成功');
                this.hideModal();
                globalData.communityShouldUpdate = true;
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

    ChooseImage() {
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          let namePrefix = new Date().getTime() + "-";
          let count = res.tempFiles.length
          for (let i = 0; i < count; i++) {
            let filePath = res.tempFiles[i].path;
            let filename = namePrefix + i + filePath.substr(filePath.lastIndexOf('.'));;
            this.data.cos.postObject({
              Bucket: 'guoke-1257582698',
              Region: 'ap-beijing',
              Key: 'user/' + globalData.stuInfo.id + '/' + filename,
              FilePath: filePath,
              onProgress: function (info) {
                  console.log(JSON.stringify(info));
              }
            },  (err, data)=> {
                console.log(err || data);
                this.setData({
                  imgList: this.data.imgList.concat("https://"+data.Location)
                })
            });
          }
        }
      });
    },
    ViewImage(e) {
      wx.previewImage({
        urls: this.data.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      wx.showModal({
        title: '删除图片',
        content: '确定要删除这张图片吗？',
        cancelText: '取消',
        confirmText: '确认',
        success: res => {
          if (res.confirm) {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList
            })
          }
        }
      })
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