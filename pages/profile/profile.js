const server = require("../../utils/server.js");
const date = require("../../utils/date.js");
const app = getApp();
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    PlaceHolderHeight: app.globalData.PlaceHolderHeight,
    sid: 0,
    posts: [],
    user:{},
    students: {},

    page: 0,
  },

  onLoad: function (options) {
    let sid = options.sid;
    console.log(sid);
    this.setData({
      me: app.globalData.stuInfo,
      sid: sid,
    });
    this.updateStuInfo();
  },

  updateStuInfo: function() {
    server.getStudentInfo(this.data.sid)
      .then((res)=>{
        this.setData({
          user: res.data,
        })
      })
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
