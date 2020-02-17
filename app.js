const date = require("utils/date.js");
const wechat = require("utils/wechat.js");
const server = require("utils/server.js");

App({
  onLaunch: function() {
    this.checkUpdate();
    this.monitorGlobalData();
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.SysInfo = e
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        let customBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.CustomBar = customBar
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.PlaceHolderHeight = customBar;
      }
    });
    wechat.getStorage("courseData")
    .then((res)=>{
      console.log("从缓存中获取courseData: ", res);
      if (res.data.hasData) {
        this.globalData.courseData = res.data;
      }
    })
    .catch((err)=>{
      console.log("从缓存中获取courseData失败: ", err);
    });
    wechat.getStorage("stuInfo")
    .then((res)=>{
      console.log("从缓存中获取stuInfo: ", res);
      if (res.data.token) {
        this.globalData.stuInfo = res.data;
        server.updateToken(res.data.token);
      }
    })
    .catch((err)=>{
      console.log("从缓存中获取stuInfo:失败", err);
    });
    wechat.getStorage("accountInfo")
    .then((res)=>{
      console.log("从缓存中获取accountInfo:", res);
      if (res.data.username) {
        this.globalData.accountInfo = res.data;
      }
    })
    .catch((err)=>{
      console.log("从缓存中获取accountInfo:失败", err);
    });
  },

  globalData: {
    curWeek: date.getWeekNo(),
    curDay: date.getDayNo(),
    lectures: [],
    
    // 存放需要监听改变事件的值，防止赋值死循环
    _data:{ 
      userInfo: {}, 
      openid: "", 
      courseData: {
        hasData: false, 
        courses: [], 
        timeTable: [], 
        courseDetail: [],
      }, 
      stuInfo: {},
      accountInfo: {},
      },
    
    // 存放属性的监听回调函数
    _listener: {},
  },

  monitorGlobalData: function() {
    let obj = this.globalData;
    for (let attr in obj._data) {
      obj._listener[attr] = [];
      Object.defineProperty(obj, attr, {
        configurable: true,
        enumerable: true,
        set: function(value) {
          let oldValue = obj._data[attr];
          if (oldValue == value) return;
          obj._data[attr] = value;
          console.log("monitored global data [" + attr + "] has been changed:", value);
          let cbs = obj._listener[attr];
          for (let idx in obj._listener[attr]) {
            cbs[idx](value);
          }
        },
        get: function() {
          return obj._data[attr];
        }
      });
    }
  },
  
  /**
   * 设置全局数据监听器，如果全局数据改变，则执行回调函数
   * 但是这个只能监听一阶属性，也就是只能是getApp().globalData.key
   * 而不能是getApp().globalData.key.skey
   * @param {String} key 
   * @param {Function} cb 
   */
  watch: function(key, cb) {
    let data = this.globalData;
    let val = data[key];
    if ((typeof val) !== "undefined") {
      cb(val);
    }
    if (!(key in data._listener)) {
      console.log("属性：" + key + "无法被监听");
      return;
    }
    data._listener[key].push(cb);
  },

  checkUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      });
    });
  }
})