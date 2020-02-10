// pages/lecture/lecture.js
const server = require("../../utils/server.js");
const dateUtils = require("../../utils/date.js");
const fetch = require("../../utils/fetch.js");
const appInstance = getApp();
const globalData = appInstance.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: globalData.CustomBar,
    PlaceHolderHeight: globalData.PlaceHolderHeight,
    curTab: 0,
    tabText: ['科学类', '人文类'],
    humanity: [],
    science: [],
    lectures: {},
    humanityEmpty: false,
    scienceEmpty: false,
    pullDown: false,

    touchS: [0, 0],
    touchE: [0, 0],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateLectureInfo();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pullDown: true,
    });
    this.updateLectureInfo();
  },

  updateLectureInfo: function() {
    wx.showLoading({
      title: '快速加载中...'
    });
    server.getLecture()
      .then((res)=>{
        console.log("get lecture info: ", res);
        var humanityArray = res.data.humanity;
        var scienceArray = res.data.science;
        this.setData({
          humanityEmpty: humanityArray.length == 0,
          scienceEmpty: scienceArray.length == 0,
        });
        for (var idx in humanityArray) {
          var curLecture = humanityArray[idx];
          this.attachImage(curLecture);
          curLecture.name = curLecture.name.replace(/明德讲堂M[0-9]+[:：]/, '').trim();
          curLecture.start = this.myDateString(new Date(curLecture.start));
          curLecture.end = this.myDateString(new Date(curLecture.end));
          this.data.lectures[curLecture.lid] = curLecture;
        }
        for (var idx in scienceArray) {
          var curLecture = scienceArray[idx];
          if (idx == scienceArray.length - 1) {
            this.attachImage(curLecture, true);
          } else {
            this.attachImage(curLecture);
          }
          curLecture.start = this.myDateString(new Date(curLecture.start));
          curLecture.end = this.myDateString(new Date(curLecture.end));
          this.data.lectures[curLecture.lid] = curLecture;
        }
        this.setData({
          humanity: humanityArray,
          science: scienceArray,
        });
        globalData.lectures = this.data.lectures;
        wx.hideLoading();
        if (this.data.pullDown) {
          wx.stopPullDownRefresh();
          this.setData({
            pullDown: false,
          });
        }
      }).catch((err)=>{
        wx.hideLoading();
        console.log("get lecture info failed: ", err);
        if (this.data.pullDown) {
          wx.stopPullDownRefresh();
          this.setData({
            pullDown: false,
          });
        }
    });
  },

  tabSelect: function(e) {
    this.setData({
      curTab: e.currentTarget.dataset.id,
    });
  },

  myDateString: function(d) {
    var weekday = ['', '一', '二', '三', '四', '五', '六', '日'];
    return dateUtils.formatDate(d, "MM-dd HH:mm") + " 周" + weekday[d.getDay()];
  },

  showLectureDetail: function(e) {
    console.log(e);
    var lid = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?lid=' + lid,
    });
  },

  attachImage: function(lecture, last=false) {
    fetch('https://api.btstu.cn/sjbz', '/api.php', {'lx':'fengjing', 'format': 'json'})
      .then((res) => {
          if (res.data.imgurl != undefined) {
            lecture.imageUrl = res.data.imgurl.replace('large', 'small').replace('https', 'http');
          } else {
            console.log('attach image err:', res);
            lecture.imageUrl = 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg';
          }
          if (last) {
            this.setData({
            humanity: this.data.humanity,
            science: this.data.science,
          });
          }
      }).catch((err)=>{
        console.log('attach image err:', err);
      });
  },

  touchStart: function(e) {
      let sx = e.touches[0].pageX
      let sy = e.touches[0].pageY
      this.data.touchS = [sx, sy]
  },
  touchMove: function(e) {
      let sx = e.touches[0].pageX;
      let sy = e.touches[0].pageY;
      this.data.touchE = [sx, sy]
  },
  touchEnd: function(e) {
      let start = this.data.touchS
      let end = this.data.touchE
      if (start[0] < end[0] - 50) {
          console.log('右滑');
          if (this.data.curTab == 1) {
            this.setData({
              curTab: 0
            })
          }
      } else if (start[0] > end[0] + 50) {
          console.log('左滑');
          if (this.data.curTab == 0) {
            this.setData({
              curTab: 1
            })
          }
      } else {
          console.log('静止')
      }
  },

})