"use strict";

function ElemParser(options) {
  if (this instanceof ElemParser) {
    extend(this, options)
    this.init()
  }
  else {
    return new ElemParser(options)
  }
}

ElemParser.prototype = {

    constructor : ElemParser

  , init        : function() {
      var oldParse = this.parse
        , parse = function() {
          var self = this
          if (this.children) {
            each(this.children, function(child) {
              self.push(child.parse())
            }, this)
          }

          var result = oldParse.apply(this, arguments)

          return result
        }

      this.parse = this.parse.wrapped ? oldParse : parse
      this.parse.wrapped = true
      this.parent = null
      this.children = []
      this.lines = []
    }

  , parent      : null

  , children    : null

  , lines       : null

  , push        : function(line) {
      this.lines.push(line)
    }

  , pop         : function() {
      return this.lines.pop()
    }

  , parse       : function() {
      var className = this.className
        , tagName   = this.tagName
        , line      = this.lines.join('')

      if (!tagName)
        return line

      return [
        '<' + tagName + (className ? (' class="'+ className +'"') : '') + '>'
        , line
        , '</'+ tagName +'>'
      ].join('')
    }

}


//  markdown 2 html
//  ===============
//
//  block elements:
//  ---------------
//
//  * p    -------     paragraph
//  * h[n] -------     titles
//  * ul   -------     unsorted list
//  * ol   -------     sorted list
//  * li   -------     list item
//  * code -------     code block
//  * pre  -------     pre
//
//  inline elements:
//  ----------------
//
//  * a    -------     anchor
//  * strong -----     strong
//  * incode -----     code inline
//  * img  -------     image
//
//
//
// all the element parser are the subclass of ElemParser

/**
 * 简单 forEach 仅用于数组
 * @param {Array} obj   需要进行迭代的数组
 * @param {Function} fn 迭代函数
 * @param {Object} context 迭代函数中 this 指针指向的对象，若没有则是 global
 */
function each(obj, fn, context) {
  if (obj.forEach) {
    obj.forEach(fn, context)
  }
  else {
    for (var i = 0; i < obj.length; i++) {
      fn.apply(context, obj[i], i)
    }
  }
}

/**
 * 扩展方法，把一个对象的属性写入目标对象中
 * @param dest
 * @param src
 * @return {Object} dest
 */
function extend(dest, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key]
    }
  }
}

/**
 * inherit ---- inherit from parent class
 *              the proto will overwrite
 *              the same name function of
 *              parent's same name method
 * @param {Function} parent
 * @param {Object} proto
 * @return {Function}
 */
function inherit(parent, proto) {
  function SubParser() {
    this.init()
  }
  // 维持原型链的玩意
  SubParser.prototype = new parent()
  SubParser.prototype.constructor = SubParser
  extend(SubParser.prototype, proto)
  return SubParser
}

/**
 * 文本段
 * @class  Paragraph
 * @parent ElemParser
 */
var Paragraph = inherit(ElemParser, {
    tagName: 'p'
})

/**
 * 标题
 * @class  Title       H1 ~ H6
 * @parent ElemParser
 */
var Title = inherit(ElemParser, {
    tagName: 'h'
  , parse  : function() {

      if (this.tagName.length === 2) {
        return [
          '<' + this.tagName + (this.className ? (' class="'+ this.className +'"') : '') + '>'
          , this.lines[0]
          , '</'+ this.tagName +'>'
        ].join('')
      }

      var line      = this.lines[0]
        , className = this.className
        , matches   = line.match(TITLE_REGEXP)
        , h         = '<h' + matches[1].length + (className ? (' class="'+ className +'"') : '') + '>'
        , hend      = '</h' + matches[1].length + '>'
        , title     = matches[2].trim()

       return [h, title, hend].join('')
    }
})

var CodeBlock = inherit(ElemParser, {
    tagName: 'code'
  , parse: function() {
      var className = this.className
        , line      = this.lines.join('\n')

      return [
          '<pre><code' + (className ? (' class="'+ className +'"') : '') + '>'
        , line
        , '</code></pre>'
      ].join('')
    }
})

var BlockQuote = inherit(ElemParser, {
  tagName: 'blockquote'
})

var OrderedList = inherit(ElemParser, {
  tagName: 'ol'
})

var UnOrderedList = inherit(ElemParser, {
  tagName: 'ul'
})

var ListItem = inherit(ElemParser, {
  tagName: 'li'
})








