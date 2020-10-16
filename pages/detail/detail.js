const server = require("../../utils/server.js");
const appInstance = getApp();
const globalData = appInstance.globalData;
Page({
  data: {
    curLecture: {},
    fromShare: false,
  },

  onLoad: function (options) {
    console.log(options.lid);
    if (options.fromShare == 'yes') {
      this.setData({
        fromShare: true,
      });
      server.getLecture(options.lid)
        .then((res)=>{
          console.log(res);
          
          this.setLecture(res.data);
        });
    } else {
      this.setData({
        fromShare: false,
      });
      this.setLecture(globalData.lectures[options.lid]);
    }
  },

  setLecture: function(lecture) {
    console.log(lecture);
    if (lecture.category == 1) {
      lecture.category = '科技类';
    } else {
      lecture.category = '人文类';
    }
    var temp = lecture.venue.split('#')
    lecture.venue = temp[0];
     if (temp.length < 2) {
       lecture.fu_venue = temp[1];
     } else {
       lecture.fu_venue = '';
     }
    this.setData({
      curLecture: lecture
    })
  },

  tapBack: function() {
    if (this.data.fromShare) {
      wx.navigateTo({
        url:'/pages/index/index?page=lecture',
      });
    } else {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.curLecture.name,
      path: '/pages/detail/detail?fromShare=yes&lid=' + this.data.curLecture.lid,
    }
  },
  onShareTimeline: function() {
    return {
      title: this.data.curLecture.name,
      path: '/pages/detail/detail?fromShare=yes&lid=' + this.data.curLecture.lid,
    }
  }
})