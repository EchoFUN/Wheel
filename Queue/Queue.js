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
