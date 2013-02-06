/**
 * @file Date Ulities For Calendar From date-util.js
 * @author <a href="http://www.closure.pro">Closure Man</a>
 * @version 0.0.2
 */

function today() {
  return new Date
}

/**
 * 获取某个月的第一天
 * @param  {Date} date 某个日期
 * @return {Date} 当月的第一天的 Date 对象
 */
function firstDayOfMonth(date) {
  var d = new Date(date)
  d.setDate(1)
  return d
}

/**
 * 获取某个月的最后一天
 * @param  {Date} date 某个日期
 * @return {Date} 当月的最后一天
 */

function lastDayOfMonth(date) {
  var d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return d
}


/**
 * 获取某个月有多少天, 月份从0开始计
 * @param  {Number} month 月份数
 * @return {Number}       这个月的天数
 */
function daysOfMonthThisYear(month) {
  var d = firstDayOfMonth(today())
  d.setMonth(month + 1)
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
  if (typeof month === 'undefined') {
    month = year
    return daysOfMonthThisYear(month)
  }

  // there's got 31 day's in January,
  // when in January 30th/31th
  // ***setMonth(month + 1)*** will lead to March 1th/2th/3th/
  // so, as initialize the d variable defaults the first
  // day of month
  var d = firstDayOfMonth(today())
  d.setFullYear(year)
  d.setMonth(month + 1)
  d.setDate(0)
  return d.getDate()
}


function isSameDate(dateA, dateB) {
  return dateA.toDateString() === dateB.toDateString()
}


/**
 * 日期格式化
 * @param  {String} format 格式化日期
 * @param  {Date}   date   日期对象
 * yyyy:dd:mm
 */
function parseDateFormat(format, date) {
}


/**
 * 生成一个日期和数组
 * @param  {Date} date 莫一天
 * @return {Array}
 */
function generateCalendar(date) {
  var someDay = date || today()
    , firstDay = firstDayOfMonth(someDay)
    , days = daysOfMonth(someDay.getFullYear(), someDay.getMonth())
    , day = firstDay.getDay()
    , calendar = []
    , week = calendar.length === 0 ? prefixWeek(firstDay) : []

  // 偏移量是day，一号是date
  for (var i = 0; i < days; i++) {
    if (0 === (day + i) % 7) {
      calendar.push(week)
      week = []
    }
    week[(day + i) % 7] = i + 1
  }
  week = tailfixWeek(week, 0)
  calendar.push(week)
  return calendar

}

/**
 * 辅助方法，生成一个月前几天的数组，用于补全第一周空白
 * @param {Date} firstDay
 * @return {Array}
 */
function prefixWeek(firstDay) {
  var aweek = []
    , startDay = firstDay.getDay()
    , lastDayOfPreMonth = daysOfMonth(firstDay.getFullYear(), firstDay.getMonth())

  for (; startDay > 0; startDay--, lastDayOfPreMonth--) {
    aweek[startDay - 1] = lastDayOfPreMonth
  }

  return aweek
}


/**
 * 最后一周尾部补全
 * @param  {Array} week 数字数组
 * @return {Array} week
 */
function tailfixWeek(week) {
  for (var len = week.length, start = 1; len < 7; len++, start++) {
    week[len] = start
  }
  return week
}



