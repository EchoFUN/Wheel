describe('test Anchor init', function() {
  "use strict";

  it ('should match the normal anchor', function() {
    var
        line = '[content](http://google.com "google.inc")'
      , anchor = new Anchor(line)

    expect(anchor.line).toBe(line)
    expect(anchor.text).toBe('content')
    expect(anchor.attr).toBe('(http://google.com "google.inc")')
    expect(anchor.id).not.toBeDefined()
    expect(anchor.href).toBe('http://google.com')
    expect(anchor.title).toBe('"google.inc"')
  })

  it ('should match the anchor without title', function() {
    var
        line = '[content](http://google.com)'
      , anchor = new Anchor(line)

    expect(anchor.line).toBe(line)
    expect(anchor.text).toBe('content')
    expect(anchor.attr).toBe('(http://google.com)')
    expect(anchor.id).not.toBeDefined()
    expect(anchor.href).toBe('http://google.com')
    expect(anchor.title).not.toBeDefined()
  })

  it ('should match the anchor with id type', function() {
    var
        line = '[content][id]'
      , anchor = new Anchor(line)

    expect(anchor.line).toBe(line)
    expect(anchor.text).toBe('content')
    expect(anchor.attr).toBe('[id]')
    expect(anchor.type).toBe('id')
    expect(anchor.id).toBe('id')
    expect(anchor.href).not.toBeDefined()
    expect(anchor.title).not.toBeDefined()
  })
})

describe('test anchor parse', function() {
  "use strict";
  it ('should parse the normal anchor', function() {
    var
        line = '[content](http://google.com "google.inc")'
      , anchor = new Anchor(line)
      , anchorHTML = '<a href="http://google.com" title="google.inc">content</a>'

      expect(anchor.parse()).toBe(anchorHTML)
  })

  it ('should parse the normal anchor without title', function() {
    var
      line = '[content](http://google.com)'
      , anchor = new Anchor(line)
      , anchorHTML = '<a href="http://google.com">content</a>'

    expect(anchor.parse()).toBe(anchorHTML)
  })

  it ('should parse the anchor with id', function() {
    var
        line = '[content](http://google.com "google.inc")'
      , idLine = '[content][myId]'
      , anchor = new Anchor(line)
      , anchorHTML = '<a href="http://google.com" title="google.inc">content</a>'
      , id = 'myId'
      , idAnchor = new Anchor(idLine)
      Anchor.mapping[id] = anchor

    expect(idAnchor.parse()).toBe(anchorHTML)
  })


})