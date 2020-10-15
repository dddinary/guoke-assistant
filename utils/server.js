// const HOST = 'https://ucas.dinary.xin';
const HOST = 'http://127.0.0.1:3000';

/**
 * 登录教务系统获取课程详情和时间表
 */
function loginAndGetCourse(username, pwd, avatar) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: HOST + "/loginCourse",
          data: { username, pwd, avatar },
          header: {"content-type": "application/x-www-form-urlencoded"},
          method: "POST",
          success: resolve,
          fail: reject
        })
    })
}

var token = '';
function updateToken(newToken) {
    console.log("update token: ", newToken)
    token = newToken;
}

function fetch(path, params) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: HOST + path,
          data: Object.assign({"_t": token}, params),
          success: resolve,
          fail: reject
        })
    })
}

function getLectures() {
    return fetch("/getLectures");
}

function getLecture() {
    return fetch("/getLecture");
}

function getNews(kind, order, page) {
    return fetch("/getNews", { kind, order, page });
}

function searchPost(words, page) {
    return fetch("/searchPost", { words, page });
}

function getPost(pid) {
    return fetch("/getPost", { pid });
}

function getUserPost(uid, page){
    return fetch("/getUserPost", { uid, page })
}

function getPostLikes(pid) {
    return fetch("/getPostLikes", { pid })
}

function getPostComments(pid) {
    return fetch("/getPostComments", { pid })
}

function getPostImages(pid) {
    return fetch("/getPostImages", { pid })
}

function getStudentInfo(sid) {
    return fetch("/getStudentInfo", { sid })
}

function getStudentsInfoList(sid) {
    return fetch("/getStudentsInfoList", { sid })
}

function tempCredential() {
    return fetch("/s/tempCredential");
}

function publishPost(kind, content, images) {
    return fetch("/s/publish", { kind, content, images });
}

function commentPost(pid, content) {
    return fetch("/s/commentPost", { pid, content })
}

function commentComment(pid, cid, ruid, content) {
    return fetch("/s/commentComment", { pid, cid, ruid, content })
}

function getStarPost(page) {
    return fetch("/s/getStarPost", { page })
}

function likePost(pid) {
    return fetch("/s/likePost", { pid })
}

function unlikePost(pid) {
    return fetch("/s/unlikePost", { pid })
}

function likeComment(cid) {
    return fetch("/s/likeComment", { cid })
}

function unlikeComment(cid) {
    return fetch("/s/unlikeComment", { cid })
}

function starPost(pid) {
    return fetch("/s/starPost", { pid })
}

function unstarPost(pid) {
    return fetch("/s/unstarPost", { pid })
}

function deletePost(pid) {
    return fetch("/s/deletePost", { pid })
}

function deleteComment(cid) {
    return fetch("/s/deleteComment", { cid })
}

function getUnreadMessageCount() {
    return fetch("/s/messageCount")
}

function getUnreadMessage(page) {
    return fetch("/s/getMessage", { page })
}

function readMessage(nid) {
    return fetch("/s/readMessage", { nid })
}

function deleteMessage(nid) {
    return fetch("/s/deleteMessage", { nid })
}

function adminDeletePost(pid) {
    return fetch("/a/deletePost", { pid })
}

function adminDeleteComment(cid) {
    return fetch("/a/deleteComment", { cid })
}

function adminBlockStudent(uid) {
    return fetch("/a/blockStudent", { uid })
}

function adminUnblockStudent(uid) {
    return fetch("/a/unblockStudent", { uid })
}

function adminNotify(uid, content) {
    return fetch("/a/notify", { uid, content })
}

module.exports = {
    updateToken,
    loginAndGetCourse,
    getLectures,
    getLecture,
    getNews,
    searchPost,
    getPost,
    getUserPost,
    getPostLikes,
    getPostComments,
    getPostImages,
    getStudentInfo,
    getStudentsInfoList,
    tempCredential,
    publishPost,
    commentPost,
    commentComment,
    getStarPost,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    starPost,
    unstarPost,
    deletePost,
    deleteComment,
    getUnreadMessageCount,
    getUnreadMessage,
    readMessage,
    deleteMessage,
    adminDeletePost,
    adminDeleteComment,
    adminBlockStudent,
    adminUnblockStudent,
    adminNotify
}