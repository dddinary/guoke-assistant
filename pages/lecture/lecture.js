// pages/lecture/lecture.js
const server = require("../../utils/server.js");
const dateUtils = require("../../utils/date.js");
const appInstance = getApp();
const globalData = appInstance.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

    lecturePics: [
      "https://tva1.sinaimg.cn/small/9bd9b167ly1g2rltvsp6lj21hc0u0nir.jpg",
      "https://tva2.sinaimg.cn/small/9bd9b167gy1g2rn3s8c3ej21hc0u0x6p.jpg",
      "https://tva4.sinaimg.cn/small/9bd9b167gy1g2rl7g0pfej21hc0u0tns.jpg",
      "https://tva2.sinaimg.cn/small/9bd9b167gy1g2rmwarlkkj21hc0u0hdt.jpg",
      "https://tva3.sinaimg.cn/small/9bd9b167gy1g2rl2n8m7bj21hc0u0gz1.jpg",
      "https://tva1.sinaimg.cn/small/9bd9b167ly1g2rmk994nej21hc0u0b29.jpg",
      "https://tva4.sinaimg.cn/small/9bd9b167gy1g2rll24fbyj21hc0u0kaq.jpg",
      "https://tva2.sinaimg.cn/small/9bd9b167gy1g2rlydoqqmj21hc0u04m3.jpg",
      "https://tva4.sinaimg.cn/small/9bd9b167gy1g2rlrh3vhuj21hc0u01dg.jpg",
      "https://tva2.sinaimg.cn/small/9bd9b167gy1g2rlj083s8j21hc0u0dyc.jpg",
      "https://tva1.sinaimg.cn/small/9bd9b167gy1g2rkpmnuomj21hc0u046i.jpg",
      "https://tva3.sinaimg.cn/small/9bd9b167gy1g2rlsmpf8tj21hc0u0aut.jpg",
      "https://tva3.sinaimg.cn/small/9bd9b167gy1g2rkysqrztj21hc0u0gwz.jpg",
      "https://tva3.sinaimg.cn/small/9bd9b167gy1g2rlg3fm25j21hc0u0dxo.jpg",
      "https://tva4.sinaimg.cn/small/9bd9b167gy1g2rlsg8hljj21hc0u01do.jpg",
      "https://tva2.sinaimg.cn/small/9bd9b167gy1g2rl5u64vbj21hc0u0dug.jpg",
      "https://tva3.sinaimg.cn/small/9bd9b167ly1g2rl9ws9hnj21hc0u0tot.jpg",
      "https://tva3.sinaimg.cn/small/9bd9b167gy1g2rko1ghz1j21hc0u0te8.jpg",
      "https://tva1.sinaimg.cn/small/9bd9b167gy1g2rkrrjzm4j21c00u0thj.jpg",
      "https://tva4.sinaimg.cn/small/9bd9b167gy1g2rktuar0wj21hc0u0k1p.jpg",
    ]

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
        var picLen = this.data.lecturePics.length;
        var picIdx = Math.floor(Math.random()*picLen);
        for (var idx in humanityArray) {
          var curLecture = humanityArray[idx];
          curLecture.imageUrl = this.data.lecturePics[(picIdx++)%picLen];
          curLecture.name = curLecture.name.replace(/明德讲堂M[0-9]+[:：]/, '').trim();
          curLecture.start = this.myDateString(new Date(curLecture.start));
          curLecture.end = this.myDateString(new Date(curLecture.end));
          this.data.lectures[curLecture.lid] = curLecture;
        }
        for (var idx in scienceArray) {
          var curLecture = scienceArray[idx];
          curLecture.imageUrl = this.data.lecturePics[(picIdx++)%picLen];
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
    if (end[0] == 0 && end[1] == 0) {
      return;
    }
    if ((start[0] < end[0] - 50) && (Math.abs(end[1] - start[1]) < Math.abs(end[0] - start[0]))) {
      console.log('右滑');
      if (this.data.curTab == 1) {
        this.setData({
          curTab: 0
        })
      }
    } else if ((start[0] > end[0] + 50) && (Math.abs(end[1] - start[1]) < Math.abs(end[0] - start[0]))) {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})