/*
 * bouncefix.js
 * 
 * (C) 2014 Jarid Margolin
 * MIT LICENCE
 *
 */


define([
  'fix'
], function (Fix) {


// ----------------------------------------------------------------------------
// Bouncefix
//
// Stop full body elastic scroll bounce when scrolling inside
// nested containers (IOS)
// ----------------------------------------------------------------------------

var bouncefix = {
  cache: {}
};

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


});