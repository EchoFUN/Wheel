function isNumber(obj) {
  return '[object Number]' === toString.call(obj)
}

function isFunction(obj) {
  return '[object Function]' === toString.call(obj)
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
  var asyncFuncs = [],
      delay,
      context

  if ()

  each(args, function(arg) {
    if (isFunction(arg)) {
      asyncFuncs.push(arg)
    }
  })



  return {
      fn : asyncFuncs.length === 1 ? asyncFuncs[0] : asyncFuncs
    , delay : isNumber(args[args.length - 2]) ? args[args.length - 2] : 0,
    , context : 
  }
}
