const date = require("../../utils/date.js");
const course = require("../../utils/course.js");
const appInstance = getApp();
const globalData = appInstance.globalData;

Page({
    data: {
        colorArrays: [ "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],

        weekText: ['点击选择周数', '第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周',
            '第八周', '第九周', '第十周', '第十一周', '第十二周', '第十三周', '第十四周',
            '第十五周', '第十六周', '第十七周', '第十八周', '第十九周', '第二十周'],

        dayText: ['一', '二', '三', '四', '五', '六', '日'],
        
        jieStartTime: ["", "08:30", "09:20", "10:30", "11:20", "13:30", "14:20", "15:30", "16:20", "19:00", "19:50", "20:50", "21:50"],
        jieEndTime: ["", "09:20", "10:10", "11:20", "12:10", "14:20", "15:10", "16:20", "17:10", "19:50", "20:40", "21:40", "22:40"],

        curWeek: globalData.curWeek,
        dispWeek: globalData.curWeek,

        weekDay: [],

        courseData: globalData.couseData,

        weekCourse: [],
        courseCount: 0,

        selectedCourse: {},
    },

    onLoad: function() {
        appInstance.watch("courseData", (val)=>{
            this.setData({
                courseData: val,
            });
            this.updateWeekCourse();
        });
        this.updateWeekDay();
        this.updateWeekCourse();
    },

    onshow: function() {
        this.updateWeekCourse();
    },

    onReady: function() {
        this.popup = this.selectComponent("#popup");
    },

    updateWeekCourse: function() {
        var weekCourseList = course.getWeekCourseList(this.data.dispWeek, this.data.courseData);
        this.setData({
            weekCourse: weekCourseList,
        });
        console.log("update week course:", this.data.weekCourse);
    },

    updateWeekDay: function() {
        var weekDayList = date.getWeekDay(this.data.dispWeek);
        this.setData({
            weekDay: weekDayList,
        });
        console.log("update week day:", this.data.weekDay);
    },

    changeWeekNo: function (e) {
        console.log('picker修改周数，携带值为', e.detail.value);
        this.setData({
            dispWeek: e.detail.value,
        });
        this.updateWeekDay();
        this.updateWeekCourse();
    },

    backCurWeek: function () {
        if (this.data.dispWeek != globalData.curWeek) {
            this.setData({
                dispWeek: globalData.curWeek,
            });
            this.updateWeekDay();
            this.updateWeekCourse();
        }
    },

    skipToLogin: function() {
        wx.navigateTo({
            url: '/pages/login/login',
        });
    },

    skipToLecture: function() {
        wx.switchTab({
            url: '/pages/lecture/lecture',
        });
    },

    skipToNews: function() {
        wx.switchTab({
            url: '/pages/news/news',
        });
    },

    showPopup: function(e) {
        var cid = e.currentTarget.dataset.cid;
        this.setData({
            selectedCourse: course.getCourseDetail(cid, this.data.courseData.courseDetail),
        });
        this.popup.showPopup();
    },
    
    popupTapok: function() {
        this.popup.hidePopup();
    },

    getJieTime: function(jieNo) {
        return course.getJieTime(jieNo);
    },

    showCalendarImage: function() {
        wx.previewImage({
            urls: ['http://ww1.sinaimg.cn/large/006m0GqOly1gc0kql90mwj30nb0nw7a4.jpg'],
            current: 'http://ww1.sinaimg.cn/large/006m0GqOly1gc0kql90mwj30nb0nw7a4.jpg' // 当前显示图片的http链接      
          })
    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

    }
})