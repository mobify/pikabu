/*
 * utils.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */


define(function () {


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
    if ((el = el.parentElement)) {
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
  return (el.scrollHeight > el.offsetHeight);
};

//
// Keep scrool from hitting end bounds
//
utils.scrollToEnd = function (el) {
  var curPos = el.scrollTop,
      height = el.offsetHeight,
      scroll = el.scrollHeight;
  
  // If at top, bump down 1px
  if(curPos <= 0) {
    el.scrollTop = 1;
  }

  // If at bottom, bump up 1px
  if(curPos + height >= scroll) {
    el.scrollTop = scroll - height - 1;
  }
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return utils;


});