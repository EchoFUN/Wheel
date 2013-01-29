/**
 * @file Date Ulities For Calendar From date-util.js
 * @author <a href="http://www.closure.pro">Closure Man</a>
 * @version 0.0.1
 */
// 获取本月的所有日期
// 从今天开始，遍历到前一月的最后一天，遍历到下一月的第一天
function today() {
  return new Date
}

/**
 * 获取某个月的第一天
 * @param  {Date} date 某个日期
 * @return 当月的第一天的 Date 对象
 */
function firstDayOfMonth(date) {
  var d = new Date(date)
  d.setDate(1)
  return d
}

/**
 * 获取某个月的最后一天
 * @param  {{Date}} date 某个日期
 * @return {[Date]} 当月的最后一天
 */
function lastDayOfMonth(date) {
  var d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return d
}

/**
 * 获取某个月有多少天
 * @param  {Number} month 月份数
 * @return {Number}       这个月的天数
 */
function daysOfMonthThisYear(month) {
  var d = new Date
  d.setMonth(month)
  d.setDate(0)
  return d.getDate()
}

/**
 * 获取某个月有多少天
 * @param  {Number} year  年/如果月不存在那么这个参数当做月
 * @param  {Number} month 月
 * @return {Number}       天数
 */
function daysOfMonth(year, month) {
  if (!month) {
    return daysOfMonthThisYear(year)
  }

  var d = new Date
  d.setFullYear(year)
  d.setMonth(month)
  d.setDate(0)
  
  return d.getDate()
}


function isSameDate(dateA, dateB) {
  return dateA.getFullYear() === dateB.getFullYear() &&
         dateA.getMonth()    === dateB.getMonth() &&
         dateA.getDate()     === dateB.getDate()
}


/**
 * 日期格式化
 * @param  {String} format 格式化日期
 * @param  {Date}   date   日期对象
 * yyyy:dd:mm
 */
function parseDateFormat(format, date) {
  
}




