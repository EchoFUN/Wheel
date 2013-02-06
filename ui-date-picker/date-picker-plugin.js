/**
 *
 * Plugin to jQuery
 *
 * 采用绝对定位
 */

var singletonDatePicker = null
  , defaultParams = {
        selectedDate: today()
      , show: true
      , minDate: null
      , maxDate: null
      , zIndex: 1
    }

$.fn.extend({

  wDatePicker: function(params) {
    var exactParams = {}
      , self = this

    $.extend(exactParams, defaultParams);
    if (params) {
      $.extend(exactParams, params)
    }

    if (!singletonDatePicker) {
      singletonDatePicker = new DatePicker('wDatePicker')
    }
    singletonDatePicker.bindedElem = this

    singletonDatePicker.show()

    return this
  }

})

$.extend({

  wDatePickerConfig: function(options) {
    if (singletonDatePicker) {
      singletonDatePicker.clear()
    }
    singletonDatePicker = new DatePicker(options)
  }

})

$(document).on('click', function() {
  if (singletonDatePicker) {
    singletonDatePicker.hide();
  }
})