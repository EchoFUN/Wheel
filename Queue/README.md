Queue
=============================

Queue 的存在完全是因为个人灰常蛋疼地想实现一个异步任务队列而做出来的，写出来以后发现这种任务队列出现以后还真是可以在代码中避免多重函数嵌套。

用jq最原始的书写一个 Ajax 的方式是

```js
$.ajax('', {
  success: function() {}
  error:   function() {}
})
```

当jq有了 promise/defered 以后可以这样写

```js
$
.ajax('', {
  // initialize code
})
.done(function() {})
.failed(function() {})
.finally(function() {})
```

这种类似 try/catch 写法的链式调用启发了我一下，不过我想写的是更加极端的，把Ajax请求这类异步代码也放入到队列中执行。

原始执行完一个请求再执行多一个请求的写法

```js
$
.ajax(/**/)
.done(function() {
   $.ajax()
    .done(function() {
       $.ajax()
         .done()
       // .....
    })

})
```

说到底，这样的写法还是避免不了多重闭包嵌套。所以才有了 Queue...


### initialize ###

初始化仅调用 ***Queue()*** 就好

```js
var q = Queue()
```

### Sync Funcs ###

在 Queue 中，不仅可以放入异步代码，也可以放入一般的执行流程，其返回值会作为队列中下一个方法的第一个参数传入。

```js
q
  .pushSync(function() {
    return 'this is return value'
  })
  .pushSync(function(val) {
    console.log(val)      //'this is return value'
  })
  .exec()
```

### Async Funcs ###

Queue中的异步代码在执行结束的时候必须调用 next 以传入参数并且执行下一步操作

```js
q
  .pushAsync(function(next) {
    setTimeout(function() {
      next('this is return value')
    }, 100)
  })
  .pushAsync(function(val, next) {
    console.log(val)      //'this is return value'
    next()
  })
  .exec()
```

在插入异步方法的时候，如果两个异步方法可以并行操作，那么可以这么玩

```js
q
  .pushAsync(
    function(next) {
      setTimeout(function() {
        next(1)
      },100)
    },
    function(next) {
      setTimeout(function() {
        next(2)
      }, 50)
  })
  .pushSync(function(retValOne, retValTwo) {
    console.log(retValOne, retValTwo)    //-----> output: 1, 2
  })
  .exec()
```

那么这样在上一步所有的并发请求都完成以后才执行下一步操作


### Delay ###

延迟执行，类似 sleep，让任务中断一段时间，在delay前后的返回值会继续向下传递

```js
q
.pushAsync(function(next) {
  setTimeout(function() {
        next('this is return value')
  }, 100)
})
.delay(1000)
.pushAsync(function(val, next) {
  console.log(val)      //'this is return value'
  next()
})
.exec()
```

当然有更方便的 delay 写法，就是 pushSync/pushAsync 的第二个参数,上面的代码等效于

```js
q
.pushAsync(function(next) {
  setTimeout(function() {
        next('this is return value')
  }, 100)
})
.pushAsync(function(val, next) {
  console.log(val)      //'this is return value'
  next()
}, 1000)                // 这个流程延迟执行
.exec()
```


### Context ###

如果你希望在传入的回调函数中使用 ***this*** 关键字来访问到你某个作用域中的变量时，第三个参数为你提供了便利。让你不用使用一个self来维持闭包中的作用域。

```js
var context = {
  'name' : 'Kiddkai'
}

q
.pushAsync(function(next) {
  var self = this
  setTimeout(function() {
    next(self.name)
  }, 100)
}, 0, context)
.pushAsync(function(val, next) {
  console.log(val)      //'Kiddkai'
  next()
}, 1000)                // 这个流程延迟执行
.exec()
```

这些就是Queue的所有使用方法，接口简单。....


### 更新日志 ###

2013/03/06 ----------------- 增加对异步方法并行操作的支持