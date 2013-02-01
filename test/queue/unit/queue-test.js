/**
 *
 * Sync Queue Test Suite
 */
describe('queue sync test suite', function() {
  "use strict";

  var q = null;

  beforeEach(function () {
    q = Queue();
  });

  it('should be get the hello world from the return value of the pre step', function() {
    var expectWord = 'hello world';

    q
      .pushSync(function() {
        return expectWord;
      })
      .pushSync(function(val) {
        expect(val).toBe(expectWord);
        return val;
      })
      .pushSync(function(val) {
         expect(val).toBe(expectWord);
      })
  });

  it('should get the hello world from the pre steps next function', function() {
    var expectWord = 'hello world';

    q
      .pushSync(function(next) {
        next(expectWord);
      })
      .pushSync(function(val, next) {
        expect(val).toBe(expectWord);
        next(val);
      })
      .pushSync(function(val, next) {
        expect(val).toBe(expectWord);
      })
  });

  it('should get the hello world from the pre function', function() {
    var expectWord = 'hello world';

    q
      .pushSync(function() {
        return expectWord;
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
  });

});

/**
 *  dalay Test Suite
 */
describe('Delay Test Suite', function() {
  "use strict";
  var q = null;

  beforeEach(function() {
    q = Queue();
  })
});