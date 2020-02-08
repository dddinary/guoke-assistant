const _fetch = require('./fetch');

const URL = 'https://dinary.xin';
// const URL = 'http://127.0.0.1:3000';
const changePicURL = URL + "/getCaptcha";

function fetch (path, params) {
    return _fetch(URL, path, params);
}

/**
 * 使用一次性的code换取用户的openid
 * @param {String} code 
 */
function codeToOpenid(code) {
    return fetch("/wxLogin", { code });
} 

/**
 * 登录教务系统获取课程详情和时间表
 * @param {String} openid 
 * @param {String} username 
 * @param {String} pwd 
 * @param {String} cap 
 * @param {*} needname 是否需要返回用户名字和单位
 */
function loginAndGetCourse(openid, username, pwd, cap) {
    return fetch("/loginCourse", { openid:openid, username, pwd, cap });
}

/**
 * 由课程列表获取课程详细信息和时间表
 * @param {IntegerArray} courses 
 */
function clistToMap(courses) {
    return fetch("/clistToMap", { courses });
}

/**
 * 获取最近讲座信息
 */
function getLecture() {
    return fetch("/getLecture");
}

/**
 * 发布动态
 */
function publishPost(sessionid, pid, kind, content, image) {
    return fetch("/publish", { sessionid, pid, kind, content, image });
}

/**
 * 获取post列表
 */
function getNews(kind, order, page) {
    return fetch("/getNews", { kind, order, page });
}

/**
 * 获取post详情页
 */

function getPost(pid) {
    return fetch("/getPost", { pid });
}

module.exports = {
    changePicURL,
    codeToOpenid,
    loginAndGetCourse,
    clistToMap,
    getLecture,
    publishPost,
    getNews,
    getPost,
}