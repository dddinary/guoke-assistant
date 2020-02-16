/**
 * 格式化时间
 * @param  {Datetime} source 时间对象
 * @param  {String} format 格式
 * @return {String}        格式化过后的时间
 */
function formatDate(source, format) {
    const o = {
      'M+': source.getMonth() + 1, // 月份
      'd+': source.getDate(), // 日
      'H+': source.getHours(), // 小时
      'm+': source.getMinutes(), // 分
      's+': source.getSeconds(), // 秒
      'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
      'f+': source.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return format
}


/**
 * 今天是教学周的第几周
 * @return {int}  1-20
 */
function getWeekNo() {
    let today = new Date();
    let firstDay = new Date(2020, 1, 3);
    let result = Math.floor((today.valueOf()- firstDay.valueOf()) / 604800000); // (1000*60*60 * 24 * 7)
    return result+1;
};

/**
 * 今天是周几
 * @return {int} 1-7
 */
function getDayNo() {
    let res = new Date().getDay();
    if (res === 0) return 7;
    return res;
}

/**
 * 返回本周的日期
 * @param {int} weekNo
 * @returns {StringArray}  
 */
function getWeekDay(weekNo) {
    let res = []
    let firstDay = new Date(2020, 2, 10);
    firstDay.setDate(firstDay.getDate() + (weekNo - 1) * 7 - 1);
    for (let i = 0; i < 7; i++) {
        firstDay.setDate(firstDay.getDate()+1);
        res.push(firstDay.getMonth()+1 + "." + firstDay.getDate());
    }
    return res;
}

module.exports = {
    formatDate,
    getWeekDay,
    getDayNo,
    getWeekNo,
}