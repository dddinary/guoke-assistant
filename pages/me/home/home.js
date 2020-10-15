const wechat = require("../../../utils/wechat.js");
var appInstance = getApp();
var globalData = appInstance.globalData;

Component({
  options: {
      addGlobalClass: true,
  },
  data: {
    closeCommunity: globalData.closeCommunity,
    stuInfo: globalData.stuInfo,
  },

  onLoad: function() {
    appInstance.watch("stuInfo", (val)=>{
      this.setData({
        stuInfo: val,
      });
    });
  },

  skipToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },

  skipToMyPost: function() {
    wx.navigateTo({
      url: "/pages/profile/profile?sid=" + this.data.stuInfo.id,
    });
  },

  skipToMyStar: function() {
    wx.navigateTo({
      url: '/pages/stared/stared'
    });
  },

  clearPwd: function() {
    globalData.accountInfo = {};
    wx.removeStorage({key: "accountInfo",
      success (res) {
        console.log("清除用户名密码缓存:", res);
      }
    });
  },

  clearAll: function() {
    globalData.courseData = {
      hasData: false, 
      courses: [], 
      timeTable: [], 
      courseDetail: [],
    };
    wx.removeStorage({key: "courseData", 
      success (res) {
        console.log("清除课程数据:", res);
      }
    });
    globalData.stuInfo = {};
    wx.removeStorage({key: "stuInfo", 
      success (res) {
        console.log("清除学生信息:", res);
      }
    });
  },


  clearPwdBtn: function() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定清除用户名密码缓存',
      success (res) {
        if (res.confirm) {
          that.clearPwd();
          wx.showToast({
            title: '清除成功',
            icon: "success",
            duration: 2000
          });
        } else if (res.cancel) {}
      }
    });
  },

  clearAllBtn: function() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定清除所有数据',
      success (res) {
        if (res.confirm) {
          wx.showToast({
            title: '清除成功',
            icon: "success",
            duration: 2000
          });
          that.clearPwd();
          that.clearAll();
        } else if (res.cancel) {}
      }
    })
  },

  whetherLogout: function() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定退出',
      success (res) {
        if (res.confirm) {
          console.log('退出登录：用户点击确定，清除本地内存');
          wx.showToast({
            title: '退出成功',
            icon: "success",
            duration: 2000
          });
          that.clearAll();
        } else if (res.cancel) {
          console.log('退出登录：用户点击取消');
        }
      }
    })
  },

  showQrcode() {
    wx.previewImage({
      urls: ['http://ww1.sinaimg.cn/large/006m0GqOly1gc44vihydzj30iy0i676p.jpg'],
      current: 'http://ww1.sinaimg.cn/large/006m0GqOly1gc44vihydzj30iy0i676p.jpg' // 当前显示图片的http链接      
    })
  },

})