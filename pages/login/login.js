const server = require("../../utils/server.js");
const wechat = require("../../utils/wechat.js");
const course = require("../../utils/course.js")
var appInstance = getApp();
var globalData = appInstance.globalData;

Page({
    data: {
        pic_url_orign: server.changePicURL,
        pic_url: "",

        openid: globalData.openid,
        accountInfo: globalData.accountInfo,
    },

    onLoad: function() {
        this.changePic();
        appInstance.watch("openid", (val)=>{
            this.setData({
                openid: val,
            });
            this.changePic();
        });
        appInstance.watch("accountInfo", (val)=>{
            this.setData({
                accountInfo: val,
            });
            this.changePic();
        });
    },

    reLoad: function() {
        this.changePic();
    },

    changePic: function() {
        this.setData({
            pic_url: this.data.pic_url_orign + "?openid=" + this.data.openid + "&r=" + Math.random(),
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

    formSubmit: function(e) {
        this.showModal("loading");
        let data = e.detail.value;
        server.loginAndGetCourse(this.data.openid, data.username, data.pwd, data.code)
            .then((res)=>{
                console.log("login and get course: ", res);
                let resData = res.data;
                if ("courseDetail" in resData && "timeTable" in resData) {
                    let sinfo = {name: resData.name, dpt: resData.dpt, avatar: resData.avatar, sessionid: resData.sessionid};
                    globalData.stuInfo = sinfo;
                    wx.setStorage({
                        key: "stuInfo",
                        data: sinfo
                    });
                    course.handleTimeTable(resData.timeTable, resData.courseDetail);
                    let cinfo = {
                        hasData: true,
                        courses: resData.courseList,
                        courseDetail: resData.courseDetail,
                        timeTable: resData.timeTable,
                    }
                    globalData.courseData = cinfo;
                    wx.setStorage({
                        key: "courseData",
                        data: cinfo
                    });
                    let ainfo = {
                        username: data.username,
                        pwd: data.pwd,
                    }
                    globalData.accountInfo = ainfo;
                    wx.setStorage({
                        key: "accountInfo",
                        data: ainfo
                    });
                    this.hideModal();
                    wx.navigateBack({
                        delta: 1
                    });
                } else {
                    this.showModal("failed");
                    this.changePic();
                }
            })
            .catch((err)=>{
                this.showModal("failed");
                this.changePic();
                console.log("login and get course failed: ", err);
            });
    }
});