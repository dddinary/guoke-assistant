/**
 * 得到某周某天的课程列表，结果已经按照上课时间排好序了
 * 这个列表中的课程只包含一些基本信息，上课时间、地点等
 * @param {Integer} weekNo 
 * @param {Integer} dayNo 
 * @param {Matrix} courseData 
 */
function getDayCourseList(weekNo, dayNo, courseData) {
    let timeTable = courseData.timeTable;
    if (timeTable.length == 0) {
        return [];
    }
    let cl = timeTable[weekNo][dayNo];
    cl.sort((a, b)=>{
        let func = course => Number(course.jie.split("-")[0]);
        return func(a) - func(b);
    });
    return cl;
}

function getWeekCourseList(weekNo, courseData) {
    let timeTable = courseData.timeTable;
    if (timeTable.length == 0) {
        return [];
    }
    let cl = timeTable[weekNo];
    let res = [];
    for (let day of cl) {
        for (let c of day) {
            res.push(c);
        }
    }
    return res
}

function handleTimeTable(timeTable, courseDetail) {
    for (let week of timeTable) {
        for (let day of week) {
            for (let c of day) {
                c.name = getCourseDetail(c.cid, courseDetail).name;
                let courseTimeDetail = convertCouseTime(c.jie);
                Object.assign(c, courseTimeDetail);
            }
        }
    }
}

/**
 * 返回某节课的详细信息
 * @param {Integer} cid 
 * @param {Object} allCourseDetail 
 */
function getCourseDetail(cid, allCourseDetail) {
    let obj = allCourseDetail[cid];
    return JSON.parse(JSON.stringify(obj));;
}

/**
 * 将节数的字符串转化为第几节到第几节，以及开始时间到结束时间
 * @param {String} jieListStr 教务系统里的代表节数的字符串如： 2,3,4
 */
function convertCouseTime(jieListStr) {
    let jieList = jieListStr.split(",");
    let firstStr = jieList[0];
    let first = Number(firstStr);
    let lastStr = jieList[jieList.length-1];
    let last = Number(lastStr);
    let jieStr = firstStr + "-" + lastStr
    let jieNum = last-first+1
    let timeStr = getJieTime(first)[0]+"-"+getJieTime(last)[1]
    return {jieStart, jieEnd, jieNum, jieStr, timeStr};
}

/**
 * 返回某一节的开始结束时间
 * @param {Integer} jieNo 第几节 
 */
function getJieTime(jieNo) {
    let startTime = ["", "08:30", "09:20", "10:30", "11:20", "13:30", "14:20", "15:30", "16:20", "19:00", "19:50", "20:50", "21:50"];
    let endTime = ["", "09:20", "10:10", "11:20", "12:10", "14:20", "15:10", "16:20", "17:10", "19:50", "20:40", "21:40", "22:40"];
    return [startTime[jieNo], endTime[jieNo]];
}

module.exports = {
    getDayCourseList,
    getCourseDetail,
    convertCouseTime,
    getJieTime,
    getWeekCourseList,
    handleTimeTable
};