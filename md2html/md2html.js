"use strict";

var TITLE_REGEXP = /^([#]{1,6})\s*([^#\s][\w\W]*[^#])([#]*)/
  , CODEBLOCK_START_REGEXP = /^[`]{3,}([^`]+)/
  , CODEBLOCK_END_REGEXP = /^[`]{3,}$/
  , BLOCKQUOTE_REGEXP = /^>[\s\S]*/
  , UL_LIST_REGEXP = /^([*+-])((\s+)[\W\w]+|[^+*-][\w\W]*)/
  , OL_LIST_REGEXP = /^(\d+)\.(\s*)([\W\w]*)/
  , INDENT_REGEXP  = /^(\s{4}|\t)+/

function md2html(mdStr) {

  var lines = mdStr.split(/[\n|\r\n]/)
    , root  = new ElemParser()

  root = buildBlockTree(root, lines)

  return root.parse()
}

/**
 * 判断这一行是否是 markdown 标题 (以 # 号开始）
 * @param {String} line
 * @return {Boolean}
 */
function isTitle(line) {
  return TITLE_REGEXP.test(line)
}

/**
 * 单纯的转换函数
 * @param {String} line 该字符串需经过 isTitle 方法判断结果为 true 的时候使用，用于生成h标签
 * @param {String} className 类名属性，用户自定
 * @return {String}
 */
function parseTitle(line, className) {
  var matches = line.match(TITLE_REGEXP)
    , h       = '<h' + matches[1].length + (className ? (' class="'+ className +'"') : '') + '>'
    , hend    = '</h' + matches[1].length + '>'
    , title   = matches[2].trim()

  return [h, title, hend].join('')
}

/**
 * 判断是否为 codeblock
 * 这里使用的 codeblock 是 github 格式的
 *
 * ```js
 * // code here
 * function Code() {}
 * ```
 *
 * ```[lang]
 *
 * ```
 *
 */
function isCodeBlockStart(line) {
  return CODEBLOCK_START_REGEXP.test(line)
}

function isCodeBlockEnd(line) {
  return CODEBLOCK_END_REGEXP.test(line)
}

function isBlockQuote(line) {
  return BLOCKQUOTE_REGEXP.test(line)
}

/**
 * 获取
 * @param title
 * @return {*}
 */
function getCodeLang(title) {
  return title.match(CODEBLOCK_START_REGEXP)[1]
}




function getListType(line) {
  if (OL_LIST_REGEXP.test(line)) {
    return 'ol'
  }
  else if (UL_LIST_REGEXP.test(line)) {
    return 'ul'
  }
  else {
    return ''
  }
}

function getListContent(line) {
  var type = getListType(line)
  return type == 'ul' ? line.match(UL_LIST_REGEXP)[2].trim()
                      : type == 'ol'
                      ? line.match(OL_LIST_REGEXP)[3]
                      : line
}

function createList(type) {

  return type == 'ol' ? new OrderedList()
                      : type == 'ul'
                      ? new UnOrderedList()
                      : null

}

function isIndent(line) {
  return INDENT_REGEXP.test(line)
}

function buildList(listType, lines, i, root) {
  var listElem = createList(listType)
    , listItem = null
  listElem.parent = root
  root.children.push(listElem)
  while (
    listType === getListType(lines[i]) ||
    isIndent(lines[i])
    ) {
    if (getListType(lines[i])) {
      if (listItem && listItem.lines.length > 1) {
        buildBlockTree(listItem, listItem.lines)
      }
      listItem = new ListItem()
      listItem.push(getListContent(lines[i]))
      listElem.children.push(listItem)
      listItem.parent = listElem
    }
    else if (isIndent(lines[i])) {
      listItem.push(lines[i].trim())
    }
    i++
  }
  return {i:i-1};
}

/**
 * 创建块引用对象
 * @param lines
 * @param i
 * @param root
 * @return {Object}
 */
function buildBlockQuote(lines, i, root) {
  var blockQuote = new BlockQuote()
  while (isBlockQuote(lines[i])) {
    blockQuote.push(lines[i].slice(1))
    i++
  }
  root.children.push(blockQuote)
  blockQuote.parent = root
  buildBlockTree(blockQuote, blockQuote.lines)
  return {blockQuote:blockQuote, i:i-1};
}

function buildCodeBlock(lines, i, root) {
  var codeBlock = new CodeBlock()
  codeBlock.className = getCodeLang(lines[i])
  while (!isCodeBlockEnd(lines[i])) {
    i++
    codeBlock.push(lines[i])
    codeBlock.parent = root
  }
  codeBlock.pop()
  root.children.push(codeBlock)
  return {i:i};
}


function buildTitle(lines, i, root) {
  var title = new Title()
  title.push(lines[i])
  root.children.push(title)
  return title;
}
/**
 * 构建文档树
 * @param root
 * @param lines
 */
function buildBlockTree(root, lines) {
  var ret = null
    , listType  = ''
    , title
    , paragraph

  // 一个循环走
  for (var i = 0, len = lines.length; i < len; i++) {
    // ```js
    // code
    // ```
    if (isCodeBlockStart(lines[i])) {
      ret = buildCodeBlock(lines, i, root);
      i = ret.i;
    }
    // h1 ~ h6
    else if (isTitle(lines[i])) {
      title = buildTitle(lines, i, root);
    }
    // > this is block quote
    // > this is block quote again
    else if (isBlockQuote(lines[i])) {
      ret = buildBlockQuote(lines, i, root)
      i = ret.i
    }
    // ul & ol > li
    //
    else if (listType = getListType(lines[i])) {
      ret = buildList(listType, lines, i, root);
      i = ret.i;
    }
    else {
      paragraph = new Paragraph()
      paragraph.push(lines[i])
      paragraph.parent = root
      root.children.push(paragraph)
    }
  }
  return root
}
