/*
 * fix.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */


var DOMEvent = require('dom-event');
var utils = require('utils');


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

module.exports = Fix;


