/**
 *
 * Sync Queue Test Suite
 */
describe('queue sync test suite', function() {
  "use strict"

  var q = null

  beforeEach(function () {
    q = Queue()
  })

  it('should be get the hello world from the return value of the pre step', function() {
    var expectWord = 'hello world'
      , finalWord = null
      , flag = false

    runs(function() {
      q
        .pushSync(function() {
          return expectWord
        })
        .pushSync(function(val) {
          return val
        })
        .pushSync(function(val) {
          finalWord = expectWord
          flag = true
        })
        .exec()
    })

    waitsFor(function() {
      return flag
    }, 'should done in 10 msec', 10)

    runs(function() {
      expect(expectWord).toBe(finalWord)
    })

  })

  it('should get the hello world from the pre steps next function', function() {
    var expectWord = 'hello world'

    q
      .pushSync(function(next) {
        next(expectWord)
      })
      .pushSync(function(val, next) {
        expect(val).toBe(expectWord)
        next(val)
      })
      .pushSync(function(val, next) {
        expect(val).toBe(expectWord)
      })
      .exec()
  })

  it('should get the hello world from the pre function', function() {
    var expectWord = 'hello world'

    q
      .pushSync(function() {
        return expectWord
      })
      .pushSync(function(val) {
        return val
      })
      .pushSync(function(val, next) {
        next(val)
      })
      .pushSync(function(val) {
        expect(val).toBe(expectWord)
      })
  })

})

/**
 *  dalay Test Suite
 */
describe('Delay Test Suite', function() {
  "use strict"
  var q = null
    , timerCallback = null



  // jasmine 测试异步代码是否已经被调用的方法
  beforeEach(function() {
    q = Queue()
    timerCallback = jasmine.createSpy('timerCallback')
    jasmine.Clock.useMock()
  })




  it('should timerCallBack after delay', function() {

    q
      .delay(100)
      .pushSync(function() {
        timerCallback()
      })
      .exec()

      expect(timerCallback).not.toHaveBeenCalled()

      jasmine.Clock.tick(101)

      expect(timerCallback).toHaveBeenCalled()
  })


  it('should timerCallBack be call with the pre param', function() {

    var preParam = 'value'

    q
      .pushSync(function() {
         return preParam
       })
      .delay(200)
      .pushSync(function(val) {
         expect(val).toMatch(preParam)
         timerCallback()
       })
      .exec()


    expect(timerCallback).not.toHaveBeenCalled()

    jasmine.Clock.tick(201)

    expect(timerCallback).toHaveBeenCalled()

  })

})


/**
 * Async test suite
 */
describe('Async Push Test Suite', function() {
  "use strict";

  var q = null

  beforeEach(function() {
    q = Queue()
  })

  it('should be done after Async all', function() {
    var flag = false;

    runs(function() {
      q
        .pushAsync(function(next) {
           setTimeout(function() {
             flag = true
             next()
           }, 200)
         })
        .exec()
    })


    waitsFor(function() {
      return flag
    }, 'should be return after 200 sec', 200)

    runs(function() {
      expect(flag).toMatch(true)
    })

  })


  it('should be fill the array after the async call', function() {
    var arr = []
      , q = Queue()
      , flag = false

    runs(function() {
      [0,1,2,3,4,5,6,7,8,9].forEach(function(i) {
        q.pushAsync(function(next) {
          window.setTimeout(function() {
            arr.push(i)
            next()
          }, 100)
        })
      })
      q
        .pushSync(function() {
          flag = true
        })
        .exec()
    })


    waitsFor(function() {
      return flag
    }, 'done after 1000 msec', 1001)


    runs(function() {
      expect(arr.length).toBe(10)
      expect(arr[0]).toBe(0)
      expect(arr[1]).toBe(1)
      expect(arr[9]).toBe(9)
      expect(arr[10]).not.toBeDefined()
    })

  })


  it('should tranfer params through the next function', function() {

    var param = 'value'
      , passed = null
      , q     = Queue()


    runs(function() {
      q
        .pushAsync(function(next) {
          window.setTimeout(function() {
            next(param)
          }, 10)
        })

        .pushAsync(function(val, next) {
          window.setTimeout(function() {
            next(val)
          })
        })

        .pushSync(function(val) {
          passed = val
        })

        .exec()
    })


    waitsFor(function() {
      return passed
    }, 'it should be done in 1 sec', 1000)

    runs(function() {
      expect(passed).toBe(param)
    })

  })

});







