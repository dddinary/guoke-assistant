function request (url, params) {
  return new Promise((resolve, reject) => {
    wx.request({ url: url, data: params, success: resolve, fail: reject })
  })
}

function login () {
  return new Promise((resolve, reject) => {
    wx.login({ success: resolve, fail: reject })
  })
}

function getUserInfo () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({ success: resolve, fail: reject })
  })
}

function setStorage (key, value) {
  return new Promise((resolve, reject) => {
    wx.setStorage({ key: key, data: value, success: resolve, fail: reject })
  })
}

function getStorage (key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({ key: key, success: resolve, fail: reject })
  })
}

function getLocation (type) {
  return new Promise((resolve, reject) => {
    wx.getLocation({ type: type, success: resolve, fail: reject })
  })
}

function getSetting () {
  return new Promise((resolve, reject) =>{
    wx.getSetting({ success: resolve, fail: reject });
  })
}

module.exports = {
  request,
  login,
  getUserInfo,
  setStorage,
  getStorage,
  getLocation,
  getSetting,
  original: wx
}