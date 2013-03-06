
(function(name, global, definition) {
  if (typeof module !== 'undefined') module.exports = definition(name, global);
  else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition);
  else global[name] = definition(name, global);

})("Queue", this, function(name, root, undefined) {
  "use strict";



  /**
   *
   */
var toArray = [].slice

function isNumber(obj) {
  return '[object Number]' === toString.call(obj)
}

function isFunction(obj) {
  return (typeof obj) == 'function'
}

function each(arr, fn, context) {
  if (arr.forEach) {
    arr.forEach(fn, context)
  }      
  else {
    for (var i = 0, len = arr.length; i < len; i++) {
      fn.call(context, arr[i], i)
    }
  }
}

function parseAsyncArgs(args) {
  var asyncFuncs = []
  if (isAllFunction(args)) {
    return {
        fn: args.length === 1 ? args[0] : args
      , delay: 0
      , context: null
    }
  }

  for (var i = 0; i < args.length; i++) {
    if (isFunction(args[i])) {
      asyncFuncs.push(args[i])
    }
  }
  var notFuncCount = args.length - asyncFuncs.length
  asyncFuncs = asyncFuncs.length == 1 ? asyncFuncs[0] : asyncFuncs;
  if (notFuncCount === 0) {
    return {
        fn : asyncFuncs
      , delay: 0
      , context: null
    }
  }
  else if (notFuncCount == 1) {
    return {
        fn: asyncFuncs
      , delay: isNumber(args[args.length - 1]) ? args[args.length - 1] : 0
      , context: !isNumber(args[args.length - 1]) ? args[args.length - 1] : null
    }
  }
  else if (notFuncCount == 2) {
    return {
        fn: asyncFuncs
      , delay: args[args.length - 2]
      , context: args[args.length - 1]
    }
  }
  else {
    throw Error('parseAsyncArgs: arguments not correct')
  }
}

function wrapAsyncFunctionGroup(retFn) {
  var totalAsyncFuncCount = retFn.length
    , outerNext
    , results = []
    , doneCount = 0
    , context

  function done(order) {
    return function() {
      var ret = toArray.call(arguments)
      results[order] = ret[0]
      doneCount += 1

      if(doneCount === totalAsyncFuncCount) {
        outerNext.apply(context, results)
      }
    }
  }


  if (isFunction(retFn)) {
    return retFn
  }
  else {
    return function() {
      var args = toArray.call(arguments, 0)
        , len  = args.length
        , next = args[len - 1]
        , beforeArgs = toArray.call(args, 0, args.length - 1)
        , self = this

      context = self
      outerNext = next
      each(retFn, function(fn, index) {
        var argsToFn = beforeArgs.slice(0)
        argsToFn.push(done(index))
        fn.apply(self, argsToFn)
      })
    }
  }

}

function isAllFunction(args) {
  var total = args.length,
      counter = 0
  each(args, function(arg) {
    if (isFunction(arg)) {
      counter++
    }
  })

  return total === counter
}
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
    , toString = Object.prototype.toString

  function Executor(fnType, fn, context) {
    if (this instanceof Executor) {
      var self = this
      this.fnType = fnType
      this.context = context
      this.fn = fn
      if (this.context) {
        this.fn = function() {
          fn.apply(self.context, arguments)
        }
      }
    }
    else {
      return new Executor(fnType, fn, context)
    }
  }


  Executor.prototype.isSync = function() {
    return this.fnType === 'sync'
  }

  function push(executer, delayMillSec) {

    if (delayMillSec) {
      delay(delayMillSec, executer.context)
    }

    fnQueue.push(executer)

    return this
  }

  /**
   * 把同步方法push进来
   * @param fn
   * @param delayMillSec
   * @param context
   */
  function pushSync(fn, delayMillSec, context) {
    var executor = Executor('sync', fn, context)
    push(executor, delayMillSec)
    return this
  }

  /**
   * 把异步方法push进来
   * @param fn
   * @param delayMillSec
   * @param context
   */
  function pushAsync(fn, delayMillSec, context) {
    var args = toArray.call(arguments)
      , executor
      , ret
    ret = parseAsyncArgs(args)
    ret.fn = wrapAsyncFunctionGroup(ret.fn)

    executor = Executor('async', ret.fn, ret.context)
    push(executor, ret.delay)
    return this
  }

  function delay(milliSec, context) {
    var delayFunc = function() {
      var args = toArray.call(arguments, 0)
        , next = args[args.length - 1]
      args = args.slice(0, args.length - 1)

      window.setTimeout(function() {
        next.apply(context ? context : this, args)
      }, milliSec)
    }

    var executer = Executor('async', delayFunc, context)
    push(executer, 0)

    return this
  }

  function next() {
    var args = toArray.call(arguments, 0)
      , executor = fnQueue.shift()
      , fn = null
      , returnVal = null

    if (!executor) {
      return
    }

    fn = executor.fn

    args.push(next);
    returnVal = fn.apply(this, args)

    if (executor.isSync()) {
      if (returnVal) {
        next(returnVal)
      }
      else {
        next()
      }
    }
  }

  function exec() {
    next();
  }

  return {

      pushSync: pushSync
    , pushAsync: pushAsync
    , delay: delay
    , exec: exec

  }
}
// expose

return Queue

})