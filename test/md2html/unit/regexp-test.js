/**
 * 匹配 # 号正则（markdown 标题）
 */
describe('markdown 2 html title regexp test suite', function() {
  "use strict";

  var REG = null

  beforeEach(function() {
    REG = TITLE_REGEXP
  })

  it('should match titles like ### title ###', function() {
    var str = "### title ###"

    expect(true).toBe(REG.test(str))
    expect(str).toBe(str.match(REG)[0])
    expect('###').toBe(str.match(REG)[1])
    expect('title').toBe(str.match(REG)[2].trim())
    expect('###').toBe(str.match(REG)[3].trim())

    str = "###title###"
    expect(true).toBe(REG.test(str))
    expect(str).toBe(str.match(REG)[0])
    expect('###').toBe(str.match(REG)[1])
    expect('title').toBe(str.match(REG)[2].trim())
    expect('###').toBe(str.match(REG)[3].trim())

  })

  it('should match titles like ### title', function() {
    var str = "### title";
    expect(true).toBe(REG.test(str))
    expect(str).toBe(str.match(REG)[0])
    expect('###').toBe(str.match(REG)[1])
    expect('title').toBe(str.match(REG)[2].trim())
    expect(str.match(REG)[3]).toBe('')

    str = "###title";
    expect(true).toBe(REG.test(str))
    expect(str).toBe(str.match(REG)[0])
    expect('###').toBe(str.match(REG)[1])
    expect('title').toBe(str.match(REG)[2].trim())
    expect(str.match(REG)[3]).toBe('')
  })

  it('should not match simple title without first #', function() {
    var str = 'title'

    expect(false).toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()
  })

  it('should not match title which more than 6 "#" start at the title', function() {
    var str = '####### title'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()

    str = '#######  title'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()
  })

  it('should not match title only have # charactor and space words', function() {
    var str = '######'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()

    str = '######  '
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()

    str = '######  ######'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()

    str = '######      ######'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()
  })

  it('should not match title only have # charactor after the real title', function() {
    var str = 'title ######'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()

    str = 'title######'
    expect(true).not.toBe(REG.test(str))
    expect(str.match(REG)).toBeNull()
  })

  it('should contain # & space in the title', function() {
    var str = '### tit#le ###'
    expect(true).toBe(REG.test(str))
    expect(str).toBe(str.match(REG)[0])
    expect('###').toBe(str.match(REG)[1])
    expect('tit#le').toBe(str.match(REG)[2].trim())

    str = '### tit#  le ###'
    expect(true).toBe(REG.test(str))
    expect(str).toBe(str.match(REG)[0])
    expect('###').toBe(str.match(REG)[1])
    expect('tit#  le').toBe(str.match(REG)[2].trim())
  })
})

/**
 * 代码块的两个正则测试
 */
describe('code block regexp test suite', function() {
  "use strict";

  var START_REG,
      END_REG

  beforeEach(function() {
    START_REG = CODEBLOCK_START_REGEXP
    END_REG   = CODEBLOCK_END_REGEXP
  })

  it('should match ```js in code block start but not end reg', function() {
    expect(START_REG.test('```js')).toBe(true)
    expect('```js'.match(START_REG)[1]).toBe('js')
  })

  it('should only dmatch ```+for the end reg', function() {
    expect(END_REG.test('```')).toBe(true)
    expect(END_REG.test('```s')).not.toBe(true)
  })

})

/**
 * 块引用的正则测试
 */
describe('block quote test suite', function() {
  it('should match > block quote', function() {
    expect(BLOCKQUOTE_REGEXP.test('> block quote')).toBe(true)
    expect(BLOCKQUOTE_REGEXP.test('>')).toBe(true)
    expect(BLOCKQUOTE_REGEXP.test('')).not.toBe(true)
    expect(BLOCKQUOTE_REGEXP.test('aaaa')).not.toBe(true)
    expect(BLOCKQUOTE_REGEXP.test('> aaaaa')).toBe(true)
  })
})

/**
 * 列表正则测试 list
 */
describe('unsorted list item regexp test suite', function() {
  "use strict";
  it('should match * item type', function() {
    var testStr = '* this is item'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(true)
    expect(testStr.match(UL_LIST_REGEXP)[0]).toBe(testStr)
    expect(testStr.match(UL_LIST_REGEXP)[1]).toBe('*')
    expect(testStr.match(UL_LIST_REGEXP)[2]).toBe(' this is item')
    expect(testStr.match(UL_LIST_REGEXP)[3]).toBe(' ')

    testStr = '*this is item'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(true)
    expect(testStr.match(UL_LIST_REGEXP)[0]).toBe(testStr)
    expect(testStr.match(UL_LIST_REGEXP)[1]).toBe('*')
    expect(testStr.match(UL_LIST_REGEXP)[2]).toBe('this is item')
    expect(testStr.match(UL_LIST_REGEXP)[3]).not.toBeDefined()
  })

  it('should match + this is item', function() {
    var testStr = '+ this is item'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(true)
    expect(testStr.match(UL_LIST_REGEXP)[0]).toBe(testStr)
    expect(testStr.match(UL_LIST_REGEXP)[1]).toBe('+')
    expect(testStr.match(UL_LIST_REGEXP)[2]).toBe(' this is item')
    expect(testStr.match(UL_LIST_REGEXP)[3]).toBe(' ')

    testStr = '+this is item'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(true)
    expect(testStr.match(UL_LIST_REGEXP)[0]).toBe(testStr)
    expect(testStr.match(UL_LIST_REGEXP)[1]).toBe('+')
    expect(testStr.match(UL_LIST_REGEXP)[2]).toBe('this is item')
    expect(testStr.match(UL_LIST_REGEXP)[3]).not.toBeDefined()
  })

  it('should match - this is item', function() {
    var testStr = '- this is item'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(true)
    expect(testStr.match(UL_LIST_REGEXP)[0]).toBe(testStr)
    expect(testStr.match(UL_LIST_REGEXP)[1]).toBe('-')
    expect(testStr.match(UL_LIST_REGEXP)[2]).toBe(' this is item')
    expect(testStr.match(UL_LIST_REGEXP)[3]).toBe(' ')

    testStr = '-this is item'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(true)
    expect(testStr.match(UL_LIST_REGEXP)[0]).toBe(testStr)
    expect(testStr.match(UL_LIST_REGEXP)[1]).toBe('-')
    expect(testStr.match(UL_LIST_REGEXP)[2]).toBe('this is item')
    expect(testStr.match(UL_LIST_REGEXP)[3]).not.toBeDefined()
  })

  it('should not match *+ to [*, +]', function() {
    var testStr = '*+'
    expect(UL_LIST_REGEXP.test(testStr)).toBe(false)
  })
})


describe('ordered list item regexp test suite', function() {
  "use strict";
  it('should match ordered list item', function() {
    var tryStr = '1. this is item'
    expect(OL_LIST_REGEXP.test(tryStr)).toBe(true)
    expect(tryStr.match(OL_LIST_REGEXP)[0]).toBe(tryStr)
    expect(tryStr.match(OL_LIST_REGEXP)[1]).toBe('1')
    expect(tryStr.match(OL_LIST_REGEXP)[2]).toBe(' ')
    expect(tryStr.match(OL_LIST_REGEXP)[3]).toBe('this is item')
  })

  it('should match ordered list item without space', function() {
    var tryStr = '1.this is item'
    expect(OL_LIST_REGEXP.test(tryStr)).toBe(true)
    expect(tryStr.match(OL_LIST_REGEXP)[0]).toBe(tryStr)
    expect(tryStr.match(OL_LIST_REGEXP)[1]).toBe('1')
    expect(tryStr.match(OL_LIST_REGEXP)[2]).toBe('')
    expect(tryStr.match(OL_LIST_REGEXP)[3]).toBe('this is item')
  })

  it('should not match unordered list item space', function() {
    var tryStr = '*this is item'
    expect(OL_LIST_REGEXP.test(tryStr)).not.toBe(true)
    tryStr = '+this is item'
    expect(OL_LIST_REGEXP.test(tryStr)).not.toBe(true)
    tryStr = '-this is item'
    expect(OL_LIST_REGEXP.test(tryStr)).not.toBe(true)
    tryStr = '- this is item'
    expect(OL_LIST_REGEXP.test(tryStr)).not.toBe(true)
  })

  it('should not match "1jsdsfsa" like this', function() {
    var tryStr = "1jsdsfsa"
    expect(OL_LIST_REGEXP.test(tryStr)).not.toBe(true)
  })
})

describe('indent regexp test', function() {
  "use strict";
   it('should match 4space indent text', function() {
     expect(INDENT_REGEXP.test('    ')).toBe(true)
   })

   it('should match 1 tab indent text', function() {
     expect(INDENT_REGEXP.test('	')).toBe(true)
   })

   it('should match 4*n space indent text', function() {
     expect(INDENT_REGEXP.test('        ')).toBe(true)
   })

  it('should match 2*n tab indent text', function() {
    expect(INDENT_REGEXP.test('		')).toBe(true)
  })
})














