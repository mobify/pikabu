/*!
 * v0.3.0
 * Copyright (c) 2014 Jarid Margolin
 * bouncefix.js is open sourced under the MIT license.
 */ 

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['bouncefix'] = factory();
  }
}(this, function () {


/*
 * dom-event.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var domEvent;
domEvent = function () {
  // ----------------------------------------------------------------------------
  // DOMEvent
  //
  // Convenient class used to work with addEventListener.
  // ----------------------------------------------------------------------------
  function DOMEvent(el, eventName, handler, context) {
    // Make args available to instance
    this.el = el;
    this.eventName = eventName;
    this.handler = handler;
    this.context = context;
    // Attach
    this.add();
  }
  //
  // Handler that manages context, and normalizes both 
  // preventDefault and stopPropagation.
  //
  DOMEvent.prototype._handler = function (e, context) {
    // Copy props to new evt object. This is shallow.
    // Only done so that I can modify stopPropagation
    // and preventDefault.
    var evt = {};
    for (var k in e) {
      evt[k] = e[k];
    }
    // Normalize stopPropagation
    evt.stopPropagation = function () {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
    };
    // Normalize preventDefault
    evt.preventDefault = function () {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    };
    // Call with context and modified evt.
    this.handler.call(this.context || context, evt);
  };
  //
  // Add the `EventListener`. This method is called internally in
  // the constructor. It can also be used to re-attach a listener
  // that was previously removed.
  //
  DOMEvent.prototype.add = function () {
    // Cache this
    var self = this;
    // Cache handler so it can be removed.
    self.cachedHandler = function (e) {
      self._handler.call(self, e, this);
    };
    // Modified handler
    self.el.addEventListener(self.eventName, self.cachedHandler, false);
  };
  //
  // Remove the `EventListener`
  //
  DOMEvent.prototype.remove = function () {
    this.el.removeEventListener(this.eventName, this.cachedHandler);
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return DOMEvent;
}();
/*
 * utils.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var utils;
utils = function () {
  // ----------------------------------------------------------------------------
  // Utils
  // ----------------------------------------------------------------------------
  var utils = {};
  //
  // Search nodes to find target el. Return if exists
  //
  utils.getTargetedEl = function (el, className) {
    while (true) {
      // We found it, exit
      if (el.classList.contains(className)) {
        break;
      }
      // Else keep climbing up tree
      if (el = el.parentElement) {
        continue;
      }
      // Not found
      break;
    }
    return el;
  };
  //
  // Return true or false depending on if content
  // is scrollable
  //
  utils.isScrollable = function (el) {
    return el.scrollHeight > el.offsetHeight;
  };
  //
  // Keep scrool from hitting end bounds
  //
  utils.scrollToEnd = function (el) {
    var curPos = el.scrollTop, height = el.offsetHeight, scroll = el.scrollHeight;
    // If at top, bump down 1px
    if (curPos <= 0) {
      el.scrollTop = 1;
    }
    // If at bottom, bump up 1px
    if (curPos + height >= scroll) {
      el.scrollTop = scroll - height - 1;
    }
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return utils;
}();
/*
 * fix.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var fix;
fix = function (DOMEvent, utils) {
  // ----------------------------------------------------------------------------
  // Fix
  //
  // Class Constructor - Called with new BounceFix(el)
  // Responsible for setting up required instance
  // variables, and listeners.
  // ----------------------------------------------------------------------------
  var Fix = function (className) {
    // Make sure it is created correctly
    if (!(this instanceof Fix)) {
      return new Fix(className);
    }
    // Without className there is nothing to fix
    if (!className) {
      throw new Error('"className" argument is required');
    }
    // Add className to instance
    this.className = className;
    // On touchstart check for block. On end, cleanup
    this.startListener = new DOMEvent(document, 'touchstart', this.touchStart, this);
    this.endListener = new DOMEvent(document, 'touchend', this.touchEnd, this);
  };
  //
  // touchstart handler
  //
  Fix.prototype.touchStart = function (evt) {
    // Get target
    var el = utils.getTargetedEl(evt.target, this.className);
    // If el scrollable
    if (el && utils.isScrollable(el)) {
      return utils.scrollToEnd(el);
    }
    // Else block touchmove
    if (el && !this.moveListener) {
      this.moveListener = new DOMEvent(el, 'touchmove', this.touchMove, this);
    }
  };
  //
  // If this event is called, we block scrolling
  // by preventing default behavior.
  //
  Fix.prototype.touchMove = function (evt) {
    evt.preventDefault();
  };
  //
  // On touchend we need to remove and listeners
  // we may have added.
  //
  Fix.prototype.touchEnd = function (evt) {
    if (this.moveListener) {
      this.moveListener.remove();
      delete this.moveListener;
    }
  };
  //
  // touchend handler
  //
  Fix.prototype.remove = function () {
    this.startListener.remove();
    this.endListener.remove();
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return Fix;
}(domEvent, utils);
/*
 * bouncefix.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */
var bouncefix;
bouncefix = function (Fix) {
  // ----------------------------------------------------------------------------
  // Bouncefix
  //
  // Stop full body elastic scroll bounce when scrolling inside
  // nested containers (IOS)
  // ----------------------------------------------------------------------------
  var bouncefix = { cache: {} };
  //
  // Add/Create new instance
  //
  bouncefix.add = function (className) {
    if (!this.cache[className]) {
      this.cache[className] = new Fix(className);
    }
  };
  //
  // Delete/Remove instance
  //
  bouncefix.remove = function (className) {
    if (this.cache[className]) {
      this.cache[className].remove();
      delete this.cache[className];
    }
  };
  // ----------------------------------------------------------------------------
  // Expose
  // ----------------------------------------------------------------------------
  return bouncefix;
}(fix);


return bouncefix;



}));