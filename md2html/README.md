md2html(markdown to html)
============================

markdown 向 html 正向转换的工具。

纯JavaScript实现，不依赖任何其他模块包括 node.js 原生模块。

### Why ###

自己搭建博客希望有更好的体验，并且文章数据存放格式是 Markdown 格式。所以希望渲染文章的过程在客户端部分进行。这样的目的是简化后端开发难度。前端如何处理数据是前端的事情。

不为速度，仅求简单

### How to ###

接口极其简单

```js
var html = md2html(str)
```

当然这个方法还未做更多的优化处理


### Markdown Support ###

关于 markdown 语法支持目前阶段完成了

1. 段落   -------   p
2. 列表   -------   ul/ol
3. 连接   -------   a
4. 引用   -------   blockquote
5. 代码块 -------   pre>code(github格式的代码块)
6. 标题   -------   h1~h6


### TODO ###

1. 除了 a 标签，其他 inline 元素的支持
2. 下划线的支持


### 原理 ###

文本 -----> 逐行解析 -----> markdown块元素树 -----> 解析树

