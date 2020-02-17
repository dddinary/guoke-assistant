const server = require("../../utils/server.js");
const wechat = require("../../utils/wechat.js");
const course = require("../../utils/course.js")
var appInstance = getApp();
var globalData = appInstance.globalData;

Page({
    data: {
        accountInfo: globalData.accountInfo,
        avatar: '',
    },

    onLoad: function() {
        appInstance.watch("accountInfo", (val)=>{
            this.setData({
                accountInfo: val,
            });
        });
        wechat.getSetting()
            .then((res)=>{
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wechat.getUserInfo()
                        .then((res)=>{
                        console.log(res.userInfo)
                        this.setData({avatar: res.userInfo.avatarUrl});
                    })
                } else if (!('token' in globalData.stuInfo)) {
                    this.showModal('requestInfo')
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    },

    bindGetUserInfo (e) {
        this.hideModal()
        if ('userInfo' in e.detail) {
            this.setData({avatar: e.detail.userInfo.avatarUrl});
        }
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
        server.loginAndGetCourse(data.username, data.pwd, this.data.avatar)
            .then((res)=>{
                console.log("login and get course: ", res);
                let resData = res.data;
                if ("courseDetail" in resData && "timeTable" in resData) {
                    let sinfo = {name: resData.name, dpt: resData.dpt, avatar: resData.avatar, token: resData.token};
                    server.updateToken(resData.token)
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
                }
            })
            .catch((err)=>{
                this.showModal("failed");
                console.log("login and get course failed: ", err);
            });
    }
});