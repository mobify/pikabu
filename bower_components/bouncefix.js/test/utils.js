/*
 * test/bouncefix.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'jquery',
  'proclaim',
  'sinon',
  'utils'
], function ($, assert, sinon, utils) {


// ----------------------------------------------------------------------------
// Reusable
// ----------------------------------------------------------------------------

var $workboard = $('#workboard');


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('utils.js', function () {

  describe('getTargetedEl', function () {
    
    var start, target;

    beforeEach(function () {
      $workboard.html('<section class="exists"><div><p><span></span></p></div></section>');
      start = $workboard.find('span')[0];
    });

    it('Should return null if not found', function () {
      assert.isNull(utils.getTargetedEl(start, 'doesntexist'));
    });

    it('Should return el if found', function () {
      assert.isObject(utils.getTargetedEl(start, 'exists'));
    });

  });

  describe('isScrollable', function () {

    var el = {};

    it('Should return false if not scrollable', function () {
      el.scrollTop    = 0;
      el.offsetHeight = 500;
      el.scrollHeight = 500;
      // Check
      assert.isFalse(utils.isScrollable(el));
    });

    it('Should return true if scrollable', function () {
      el.scrollTop    = 0;
      el.offsetHeight = 500;
      el.scrollHeight = 1000;
      // Check
      assert.isTrue(utils.isScrollable(el));
    });

  });

  describe('scrollToEnd', function () {

    var el = {};
    
    it('Should bump down 1px when scrolled at top', function () {
      el.scrollTop    = 0;
      el.offsetHeight = 500;
      el.scrollHeight = 1000;
      // Check
      utils.scrollToEnd(el);
      assert.equal(el.scrollTop, 1);
    });

    it('Should bump up 1px when scrolled at bottom', function () {
      el.scrollTop    = 500;
      el.offsetHeight = 500;
      el.scrollHeight = 1000;
      // Check
      utils.scrollToEnd(el);
      assert.equal(el.scrollTop, 499);
    });

  });

});


});