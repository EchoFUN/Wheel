
"use strict";

function Step(distance, time) {
  if (this instanceof Step) {
    this.distance = distance
    this.time = time
  }
  else {
    return new Step(distance, time)
  }
}

var AnimateMath = {
    'linear': function(distance, time) {

      var fps = 60
        , steps = []
        , start = 0
        , unitTime = 1000 / fps
        , unitDistance = (distance / time) / fps

      while(start <= distance) {
        steps.push(Step(start, unitTime))
        start += unitDistance
      }

      steps.push(Step(distance, 0))

      return steps
    }

  , 'pow': function(distance, time) {
      var
          steps = []
        , step = 1 / (200 * (time || 0.5))

      for (var i = 0; i < 1; i += step) {
        steps.push(Step(distance * Math.pow(i, 4), step))
      }
      steps.push(Step(distance, 0))
      return steps
    }

  , 'sqrt': function(distance, time) {
      var steps = []
        , step  = 1 / (200 * (time || 0.5))


      for (var i = 0; i < 1; i += step) {
        steps.push(Step(distance * Math.sqrt(i), step))
      }

      steps.push(Step(distance, 0))
      return steps
    }
}


/**
 *
 * @param elem
 * @param time
 * @param distance
 * @param fn
 */
var defaultOptions = {
    distance: null
  , fn: null
  , context: null
}


/**
 *
 * @param elem
 * @param type
 * @param time
 * @param fn
 * @constructor
 */
function Animate(elem, type, time, options) {
  // jq
  var left = parseInt($(elem).css('left'), 10)
    , steps = AnimateMath[type](options.distance || $(elem).width(), time)
    , q = Queue()
    , start = null

  steps.forEach(function(step, index) {
    q.pushSync(function() {
      elem.style.left = left + step.distance + 'px'
    }, step.time)
  })


  if (typeof options.fn === 'function') {
    q.pushSync(function() {
      options.fn.call(this)
    }, 0, options.context)
  }

  q.exec()
}



function extend(dest, src) {
  for (var key in src) {
    dest[key] = src[key];
  }
}

function linearAnimate(elem, time, options) {
  Animate(elem, 'linear', time, options)
}

function powAnimate(elem, time, options) {
  Animate(elem, 'pow', time, options)
}

function sqrtAnimate(elem, time, options) {
  Animate(elem, 'sqrt', time, options)
}


