var toArray = [].slice

/**
 * check argument number
 * @param {Number} obj
 * @return {Boolean} if is Number
 */
function isNumber(obj) {
  return '[object Number]' === toString.call(obj)
}

/**
 * check the argument if it's a function object
 * @param obj
 * @return {Boolean}
 */
function isFunction(obj) {
  return (typeof obj) == 'function'
}

/**
 * iterator for array
 * @param {Array} arr
 * @param {Function} fn the iterator
 * @param {Object} context the this pointer of fn
 */
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

/**
 * ### parse the async args ###
 *
 * #### for examples ####
 *
 * @example parseAsyncArgs([fn,delay])
 *          parseAsyncArgs([fn,fn,fn,fn,fn])
 *          parseAsyncArgs([fn,fn,fn,delay])
 *          parseAsyncArgs([fn,fn,fn,delay,context])
 *          parseAsyncArgs([fn,fn,fn,context])
 *          parseAsyncArgs([fn, delay, context])
 *          parseAsyncArgs([fn, context])
 *
 * @param args
 * @return {{fn: Function, delay: Number, context: Object}}
 * @throws {Error} "parseAsyncArgs: arguments not correct"
 */
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

/**
 * wrap the retFn's functions to standard normal Queue Function
 * @param {Array|Function} retFn
 * @return {Function} normal Queue Function
 */
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

/**
 * check the args if there're functions
 * @param {Array} args
 * @return {Boolean}
 */
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