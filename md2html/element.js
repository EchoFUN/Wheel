/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
var util = {}
;(function (){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  this.Class.extend = function EClass(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
                        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    function Class() {
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    Class.prototype = prototype;

    Class.prototype.constructor = Class;

    Class.extend = EClass;

    return Class;
  };
}).call(util);


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

var ElemParser = util.Class.extend({

    init: function() {
      var oldParse = this.parse
        , parse = function() {
          var self = this
          if (this.hasSub && this.children) {
            each(this.children, function(child) {
              self.push(child.parse())
            }, this)
          }

          var result = oldParse.apply(this, arguments)

          if(this.hasSub && this.anchors.length) {
            each(this.anchors, function(anchor) {
              var html = anchor.parse()
              result = result.replace(anchor.line, html)
            })
          }

          return result
        }

      this.parse = this.parse.wrapped ? oldParse : parse
      this.parse.wrapped = true
      this.parent = null
      this.children = []
      this.lines = []
      this.anchors = []
      this.hasSub = true
    }

  , push : function(line) {
      if (ANCHOR_REGEXP.test(line)) {
        this.anchors.push(
          new Anchor(line)
        )
      }
      this.lines.push(line)
    }

  , pop : function() {
      return this.lines.pop()
    }

  , parse : function() {
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

})


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
 * 文本段
 * @class  Paragraph
 * @parent ElemParser
 */
var Paragraph = ElemParser.extend({
    tagName: 'p'
  , init: function() {
      this._super()
    }
})

/**
 * 标题
 * @class  Title       H1 ~ H6
 * @parent ElemParser
 */
var Title = ElemParser.extend({
    tagName: 'h'
  , init: function() {
      this._super()
    }
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

var CodeBlock = ElemParser.extend({
    tagName: 'code'
  , init : function() {
      this._super()
      this.hasSub = false
    }
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

var BlockQuote = ElemParser.extend({
    tagName: 'blockquote'
  , init: function() {
      this._super()
    }
})

var OrderedList = ElemParser.extend({
    tagName: 'ol'
  , init: function() {
      this._super()
    }
})

var UnOrderedList = ElemParser.extend({
    tagName: 'ul'
  , init: function() {
      this._super()
    }
})

var ListItem = ElemParser.extend({
    tagName: 'li'
  , init: function() {
      this._super()
    }
})


var Anchor = util.Class.extend({

    init: function(line) {
      if (ANCHOR_REGEXP.test(line)) {
        this.initWithNormalAnchor(line)
      }
      else if (ANCHOR_DEF_REGEXP.test(line)) {
        this.initWithDefineAnchor(line)
      }
    }

  , initWithNormalAnchor: function(line) {
      var matches = line.match(ANCHOR_REGEXP)
      this.line = matches[1]
      this.text = matches[2]
      this.attr = matches[3]
      if (typeof matches[4] != 'undefined') {
        this.id = matches[4] == '' ? this.text : matches[4]
      }
      this.href = matches[5]
      this.title = matches[6]
    }

  , initWithDefineAnchor: function(line) {

      var matches = line.match(ANCHOR_DEF_REGEXP)
      this.id = matches[1].toLowerCase()
      this.href = matches[2].replace(/[<>]/g, '')
      this.title = matches[4] ? ['"', matches[4].slice(1, matches[4].length - 1), '"'].join('')
                              : undefined

      Anchor.mapping[this.id] = this
    }

  , parse: function() {
      var anchorObj = this
      if (this.id) {
        anchorObj = Anchor.mapping[this.id.toLowerCase()]
      }

      return [
          '<a'
        , ' href="', anchorObj.href, '"'
        , anchorObj.title ? (' title=' + anchorObj.title) : ''
        , '>'
        , this.text
        , '</a>'
      ].join('')
    }
})

// anchor map for ids
Anchor.mapping = {}