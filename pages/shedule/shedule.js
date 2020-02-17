const date = require("../../utils/date.js");
const course = require("../../utils/course.js");
const appInstance = getApp();
const globalData = appInstance.globalData;

Page({
    data: {
        SafeArea: globalData.SysInfo.safeArea,
        WindowHeight: globalData.SysInfo.windowHeight,
        StatusBar: globalData.SysInfo.statusBarHeight,
        Custom: globalData.Custom,
        CustomBar: globalData.CustomBar,
        PlaceHolderHeight: globalData.PlaceHolderHeight,

        colorArrays: [ "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],

        weekText: ['点击选择周数', '第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周',
            '第八周', '第九周', '第十周', '第十一周', '第十二周', '第十三周', '第十四周',
            '第十五周', '第十六周', '第十七周', '第十八周', '第十九周', '第二十周'],

        dayText: ['一', '二', '三', '四', '五', '六', '日'],
        
        jieStartTime: ["", "08:30", "09:20", "10:30", "11:20", "13:30", "14:20", "15:30", "16:20", "19:00", "19:50", "20:50", "21:50"],
        jieEndTime: ["", "09:20", "10:10", "11:20", "12:10", "14:20", "15:10", "16:20", "17:10", "19:50", "20:40", "21:40", "22:40"],

        bodyHeight: 0,

        dayView: false,

        curWeek: globalData.curWeek,
        dispWeek: globalData.curWeek,

        curDay: globalData.curDay,
        dispDay: globalData.curDay,

        weekDay: [],

        courseData: globalData.couseData,

        weekCourse: [],
        dayCourse: [],
        courseCount: 0,

        selectedCourse: {},
    },

    onLoad: function() {
        appInstance.watch("courseData", (val)=>{
            this.setData({
                courseData: val,
            });
            this.updateDayCourse();
            this.updateWeekCourse();
        });
        this.updateWeekDay();
        this.updateDayCourse();
        this.updateWeekCourse();
        this.updatebodyHeight();
    },

    onshow: function() {
        this.updateDayCourse();
        this.updateWeekCourse();
    },

    onReady: function() {
        this.popup = this.selectComponent("#popup");
    },

    updatebodyHeight: function() {
        var query = wx.createSelectorQuery();
        query.select(".head-container").boundingClientRect();
        query.exec((rect)=>{
          this.setData({
            bodyHeight: this.data.SafeArea.height - this.data.CustomBar - rect[0].height - 20,
          });
        });
    },

    updateDayCourse: function() {
        var dayCourseList = course.getDayCourseList(this.data.dispWeek, this.data.dispDay, this.data.courseData);
        this.setData({
            dayCourse: dayCourseList,
            courseCount: dayCourseList.length,
        });
        console.log("update day course:", this.data.dayCourse);
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
        this.updateDayCourse();
        this.updateWeekCourse();
    },

    changeDayNo: function (e) {
        var dayIdx = e.currentTarget.dataset.index;
        console.log('点击修改日子，携带值为', dayIdx);
        this.setData({
            dispDay: dayIdx,
        })
        this.updateDayCourse();
    },

    backCurDay: function () {
        if (this.data.dispWeek != globalData.curWeek) {
            this.setData({
                dispWeek: globalData.curWeek,
            });
            this.updateWeekDay();
            this.updateWeekCourse();
        }
        if (this.data.dispDay != globalData.curDay) {
            this.setData({
                dispDay: globalData.curDay,
            });
        }
        this.updateDayCourse();
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

    changeView: function() {
        this.setData({
            dayView: !this.data.dayView,
        });
    },

    getJieTime: function(jieNo) {
        return course.getJieTime(jieNo);
    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

    }
})