
(function(name, global, definition) {
  if (typeof module !== 'undefined') module.exports = definition(name, global);
  else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition);
  else global[name] = definition(name, global);

})("Queue", this, function(name, root, undefined) {
  "use strict";



  /**
   *
   */