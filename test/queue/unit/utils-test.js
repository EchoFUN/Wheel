"use strict";

describe('test for utils', function() {
  var func = function() {
    return 1
  }

  it('should parse the regular input', function() {
    var ret = parseAsyncArgs([func, 1, {}])
    expect(ret.delay).toBe(1)
    expect(ret.fn).not.toBeNull()
    expect(ret.fn()).toBe(1)
  })

  it('should parse the mutiple function input', function() {
    var ret = parseAsyncArgs([func, func, func, 1, {}])
    expect(ret.fn[0]()).toBe(1)
    expect(ret.fn[1]()).toBe(1)
    expect(ret.fn[2]()).toBe(1)
    expect(ret.fn.length).toBe(3)
    expect(ret.delay).toBe(1)
    expect(ret.context).toBeDefined()
  })

  it('should parse the function only function input', function() {
    var ret = parseAsyncArgs([func, func, func, func, func])
    expect(ret.fn.length).toBe(5)
    for (var i = 0; i < ret.fn.length; i++) {
      expect(ret.fn[i]()).toBe(1)
    }
    expect(ret.delay).toBe(0)
    expect(ret.context).toBeNull()
  })

  it('should parse the functions and delay', function() {
    var ret = parseAsyncArgs([func, func, func, 1])
    expect(ret.fn.length).toBe(3)
    for (var i = 0; i < ret.fn.length; i++) {
      expect(ret.fn[i]()).toBe(1)
    }
    expect(ret.delay).toBe(1)
    expect(ret.context).toBe(null)
  })

  it('should parse the functions and context', function() {
    var ret = parseAsyncArgs([func, func, func, {}])
    expect(ret.fn.length).toBe(3)
    for (var i = 0; i < ret.fn.length; i++) {
      expect(ret.fn[i]()).toBe(1)
    }
    expect(ret.delay).toBe(0)
    expect(ret.context).not.toBeNull()
  })

  it('should parse the function and delay', function() {
    var ret = parseAsyncArgs([func, 1])
    expect(ret.fn()).toBe(1)
    expect(ret.delay).toBe(1)
    expect(ret.context).toBeNull()
  })

  it('should parse the function and context', function() {
    var ret = parseAsyncArgs([func, {}])
    expect(ret.fn()).toBe(1)
    expect(ret.delay).toBe(0)
    expect(ret.context).not.toBeNull()
  })
})

