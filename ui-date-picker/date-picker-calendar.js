

var DISABLE_CLS = 'disabled'
  , ENABLE_CLS  = 'enabled'
  , ACTIVED_CLS = 'actived'
  , titles = {
        en: {
            days: ["sunday", "monday", "tuesday", "wednesday", "thusday", "friday", "saturday"]
          , daysShort: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]  
        }

      , zh: {
            days: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
          , daysShort:['日','一','二','三','四','五','六']
        }
    }

function DatePicker(calendarId, defaultDate, selectedDay) {
  this.calendarId = calendarId
  this.defaultDate = defaultDate || firstDayOfMonth(today())
  this.selectedDay = selectedDay || today()
  this.render()
  this.initEvents()
}

DatePicker.prototype = {
    constructor: DatePicker

  , defaultDate: null

  , selectedDay: null

  , relatedElem: null

  , calendarElem: null

  , calendarId: ''

  , lang: 'zh'

  , initEvents: function() {
      var self = this

      self.calendarElem.on('click', '.enabled', function() {
        self.relatedElem.removeClass(ACTIVED_CLS)
        $(this).addClass(ACTIVED_CLS)
        self.relatedElem = $(this)
        self.setSelected($(this).html())
      })

      self.calendarElem.on('click', '.pre-month', function() {
        self.setMonth(self.defaultDate.getMonth() - 1)
      })

      self.calendarElem.on('click', '.next-month', function() {
        self.setMonth(self.defaultDate.getMonth() + 1)
      })
    }

  , setMonth: function(month) {
      this.defaultDate.setMonth(month)
      this.renderBody()
    }

  , setFullYear: function(year) {
      this.defaultDate.setFullYear(year)
      this.renderBody()
    }

  , setSelected: function(date) {
      var d = new Date(this.defaultDate)
      d.setDate(date)
      this.selectedDay = d
    }

  , show: function(obj) {
      this.calendarElem.css({display: 'block'})
    }

  , hide: function() {

    }

    /**
     * 渲染日历
     */
  , render: function() {
      this.calendarElem = $('<table>')

      this.calendarElem
        .attr('id', this.calendarId)
        .append(this.template)

      // body
      this.renderTitle(this.lang)
      this.renderBody()

      this.calendarElem.appendTo(document.body)
    }

    /**
     * 根据给出的语言渲染周标题
     * @param  {String} lang 语言
     */
  , renderTitle: function(lang) {
      var daysShort = this.titles[lang].daysShort
        , daysHead  = ['<th>', daysShort.join('</th><th>'),'</th>'].join('')

      this.calendarElem.find('thead tr').append(daysHead)
    }

    /**
     * 渲染日历体
     */
  , renderBody: function() {
      var calendar = generateCalendar(this.defaultDate)
        , domCache = []
        , self     = this
        , body     = self.calendarElem.find('tbody')
        , start    = false

      body.find('tr').remove()

      jQuery.each(calendar, function(index, aweek) {
        var weekRow = $('<tr>')

        weekRow.attr('class', 'aweek')
        
        jQuery.each(aweek, function(index, day) {
          var dayTD = $('<td>')
            , dayA = $('<a href="javascript:">')

          dayA.appendTo(dayTD)

          if (!start && day !== 1) {
            dayA.addClass(DISABLE_CLS)
          }
          else if (!start && day === 1) {
            dayA.addClass(ENABLE_CLS)
            start = true
          }
          else if (start && day === 1) {
            dayA.addClass(DISABLE_CLS)
            start = false
          }
          else {
            dayA.addClass(ENABLE_CLS)
          }

          if (!self.selectedDay) {
            self.selectedDay = self.defaultDate
            self.defaultDate.setDate(1)
          }

          if (dayA.hasClass(ENABLE_CLS)) {
            var d = new Date(self.defaultDate)
            d.setDate(day)
            if (isSameDate(self.selectedDay, d)) {
              dayA.addClass(ACTIVED_CLS)
              self.relatedElem = dayA
            }
          }
          
          dayA.html(day + "")

          dayTD.appendTo(weekRow)
        })

        body.append(weekRow)
      })
    }

    /**
     * 设置位置
     * @param {Number} x
     * @param {Number} y
     */
  , setPosition: function(top, left) {
      calendarElem.css({
          top: top
        , left: left
      })
    }

  , template: [
           '<caption>'
      ,      '<a href="javascript:" class="pre-month">&lt</a>'
      ,      '<span class="year-month"></span>'
      ,       '<a href="javascript:" class="next-month">&gt</a>'
      ,    '</caption>'
      ,    '<thead>'
      ,      '<tr></tr>'
      ,    '</thead>'
      ,    '<tbody>'
      ,    '</tbody>'
    ].join('')

  , titles: {
        en: {
            days: ["sunday", "monday", "tuesday", "wednesday", "thusday", "friday", "saturday"]
          , daysShort: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]  
        }

      , zh: {
            days: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
          , daysShort:['日','一','二','三','四','五','六']
        }
    }
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
    , day  = firstDay.getDay()
    , calendar = []
    , week = calendar.length === 0 ? prefixWeek(firstDay) : []

    console.log(someDay)
    console.log(days)
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
  console.log(calendar)
  return calendar
}


function prefixWeek(firstDay) {
  var aweek = []
    , startDay = firstDay.getDay()
    , lastDayOfPreMonth = daysOfMonth(firstDay.getFullYear(), firstDay.getMonth())

  for (; startDay > 0; startDay--, lastDayOfPreMonth--) {
    aweek[startDay-1] = lastDayOfPreMonth
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




