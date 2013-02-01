/**
 * Queue
 *
 * 函数执行队列
 *
 *
 *
 * @return {Object}
 * @constructor
 */
function Queue() {
  "use strict";

  var fnQueue = []
    , toArray = Array.prototype.slice
    , toString = Object.prototype.toString

  function isNumber(obj) {
    return '[object Number]' === toString.call(obj)
  }

  function isFunction(obj) {
    return '[object Function]' === toString.call(obj)
  }

  function push(fn, delayMillSec, context) {
    if (delayMillSec) {
      delay(delayMillSec, context)
    }

    if (context) {
      push(function() {
        var args = toArray.call(arguments, 0)
        return fn.apply(context, args)
      })
    }
    else {
      fnQueue.push(fn)
    }

    return this
  }


  function delay(milliSec, context) {
    fnQueue.push(function(){
      var args = toArray.call(arguments, 0)
      window.setTimeout(function() {
        next.apply(context ? context : this , args);
      }, milliSec)
    })
    return this
  }


  function next() {
    var args = toArray.call(arguments, 0)
      , fn = fnQueue.shift()
      , returnVal = null
      , NEXT_REGEXP = new RegExp("[\\{|;|\\n]+\\s*" + next.name + "(\\.call|\\.apply)?\\([^\\)]*\\)")

    if (!fn) {
      return
    }

    args.push(next);
    returnVal = fn.apply(this, args)

    if (returnVal) {
      next(returnVal)
    }
    else {
      if(!NEXT_REGEXP.test(fn.toString())) {
        next();
      }

    }
  }

  function exec() {
    next();
  }

  return {

      push: push

    , delay: delay

    , exec: exec

  }
}