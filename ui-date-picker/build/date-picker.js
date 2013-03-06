(function($) {

"use strict";
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




/**
 * @file Date Calendar DOM From date-picker-calendar.js
 * @author <a href="http://www.closure.pro">Closure Man</a>
 * @version 0.0.2
 */


var DISABLE_CLS = 'disabled'
  , ENABLE_CLS = 'enabled'
  , ACTIVED_CLS = 'actived'
  , defaultTemplate = [
        '<caption>'
      ,   '<a href="javascript:" class="pre-month">&lt</a>'
      ,   '<span class="year-month"></span>'
      ,   ' <a href="javascript:" class="next-month">&gt</a>'
      , '</caption>'
      ,   '<thead>'
      ,     '<tr></tr>'
      ,   '</thead>'
      , '<tbody>'
      , '</tbody>'
    ].join('')
  , titles = {
      en : {
        days:["sunday", "monday", "tuesday", "wednesday", "thusday", "friday", "saturday"], daysShort:["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      }
    , zh : {
        days:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'], daysShort:['日', '一', '二', '三', '四', '五', '六']
      }
  }

function DatePicker(calendarId, options) {

  var defaultOptions = {
      defaultDate : firstDayOfMonth(today())
    , selectedDate: today()
    , maxDate     : null
    , minDate     : null
    , template    : defaultTemplate
    , calendarId  : 'wheel-cal'
    , yearMonthSel: '.year-month'
    , nextBtnSel  : '.next-month'
    , preBtnSel   : '.pre-month'
    , calBodySel  : '.wheel-cal-body'
    , enableCls   : ENABLE_CLS
    , disableCls  : DISABLE_CLS
    , activeCls   : ACTIVED_CLS
    , lang        : 'zh'
    , zIndex      : 1
  }

  defaultOptions.calendarId = calendarId ? calendarId : defaultOptions.calendarId

  if (options) {
    $.extend(defaultOptions, options)
  }

  this.calendarId = calendarId

  if (this instanceof DatePicker) {
    $.extend(this, defaultOptions)
    this.render()
    this.initEvents()
  }
  else {
    return new DatePicker(calendarId, options)
  }
}

DatePicker.prototype = {
    constructor:DatePicker

  , bindedElem: null            // 绑定的对应的元素, jQuery Object
  , relatedElem:null            // 当前选择的日期的元素
  , calendarElem:null           // 整个日历元素

  , initEvents:function () {
      var self = this

      self.calendarElem

        .on('click', '.' + self.enableCls, function () {
          self.relatedElem.removeClass(self.activeCls)
          $(this).addClass(self.activeCls)
          self.relatedElem = $(this)
          self.setSelected($(this).html())
        })

        .on('click', self.preBtnSel, function () {
          self.setMonth(self.defaultDate.getMonth() - 1)
        })

        .on('click', self.nextBtnSel, function () {
          self.setMonth(self.defaultDate.getMonth() + 1)
        })

        .on('click', function(event) {
          event.stopPropagation();
        })

    }

  , setMonth:function (month) {
      this.defaultDate.setMonth(month)
      this.reRender()
    }

  , setFullYear:function (year) {
      this.defaultDate.setFullYear(year)
      this.reRender()
    }

  , setSelected:function (date) {
      var d = new Date(this.defaultDate)
      d.setDate(date)
      this.selectedDate = d

      if (this.bindedElem) {
        this.bindedElem.trigger('change:date', this.selectedDate);
      }
    }

  , show:function (params) {
      var exactParams = {
          display: 'block'
        , top: this.bindedElem ? this.bindedElem.offset().top + this.bindedElem.height() : 0
        , left: this.bindedElem ? this.bindedElem.offset().left : 0
      }


      //$.extend(exactParams, params)
      this.calendarElem.css(exactParams);
    }

  , hide:function () {
      this.calendarElem.css({display:'none'})
    }

  , css: function(param) {
      this.calendarElem.css(param);
    }

  /**
   * 渲染日历
   *
   */
  , render:function () {
      this.calendarElem = $('<table>')

      this.calendarElem
        .css({
            'display': 'none'
          , 'position': 'absolute'
        })
        .attr('id', this.calendarId)
        .append(this.template)

      // start render
      this.renderHead()
      this.renderTitle(this.lang)
      this.renderBody(true)

      this.calendarElem.appendTo(document.body)
    }

  , renderHead:function () {
      var year = this.defaultDate.getFullYear()
        , month = this.defaultDate.getMonth()
        , self = this

      this.calendarElem
        .find('caption ' + self.yearMonthSel)
        .html(year + '年' + (month + 1) + '月');
    }

  /**
   * 根据给出的语言渲染周标题
   * @param  {String} lang 语言
   */
  , renderTitle:function (lang) {
      var daysShort = this.titles[lang].daysShort
        , daysHead = ['<th>', daysShort.join('</th><th>'), '</th>'].join('')

      this.calendarElem.find('thead tr').append(daysHead)
    }

  /**
   * 渲染日历体
   */
  , renderBody:function (first) {
      var calendar = generateCalendar(this.defaultDate)
        , self = this
        , body = self.calendarElem.find('tbody')
        , start = false

      body.find('tr').remove()
      body.hide()

      jQuery.each(calendar, function (index, aweek) {
        var weekRow = $('<tr>')

        weekRow.attr('class', 'aweek')

        jQuery.each(aweek, function (index, day) {
          var dayTD = $('<td>')
            , dayA = $('<a href="javascript:">')

          dayA.appendTo(dayTD)

          if (!start && day !== 1) {
            dayA.addClass(self.enableCls)
          }
          else if (!start && day === 1) {
            dayA.addClass(self.enableCls)
            start = true
          }
          else if (start && day === 1) {
            dayA.addClass(self.disableCls)
            start = false
          }
          else {
            dayA.addClass(self.enableCls)
          }

          if (!self.selectedDate) {
            self.selectedDate = self.defaultDate
            self.defaultDate.setDate(1)
          }

          if (dayA.hasClass(self.enableCls)) {
            var d = new Date(self.defaultDate)
            d.setDate(day)
            if (isSameDate(self.selectedDate, d)) {
              dayA.addClass(self.activeCls)
              self.relatedElem = dayA
            }
          }

          dayA.html(day + "")

          dayTD.appendTo(weekRow)
        })

        body.append(weekRow)
      })
      body.show()
    }


  /**
   * 重新渲染内容
   */
  , reRender : function () {
      this.renderHead()
      this.renderBody()
    }

    /**
     * 设置位置
     * @param {Number} x
     * @param {Number} y
     */
  , setPosition : function (top, left) {
     calendarElem.css({
         top:top
       , left:left
      })
    }

  , clear: function() {
      this.calendarElem.remove();
    }

  , template : null

  , titles : {
        en : {
            days:["sunday", "monday", "tuesday", "wednesday", "thusday", "friday", "saturday"]
          , daysShort:["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        }
      , zh : {
          days:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        , daysShort:['日', '一', '二', '三', '四', '五', '六']
      }
    }
}



window.DatePicker = DatePicker;


})(window.jQuery, undefined);