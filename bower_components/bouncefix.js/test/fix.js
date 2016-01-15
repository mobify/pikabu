/*
 * test/fix.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'jquery',
  'proclaim',
  'sinon',
  'fix',
  'utils'
], function ($, assert, sinon, Fix, utils) {


// ----------------------------------------------------------------------------
// Reusable
// ----------------------------------------------------------------------------

var $workboard = $('#workboard'),
    scrollable,
    fix;


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('fix.js', function () {

  beforeEach(function () {
    $workboard.html('<section></section>');
    scrollable = $workboard.find('section')[0];
  });

  afterEach(function () {
    if (fix) {
      fix.startListener.remove();
      fix.endListener.remove();
    }
  });

  describe('constructor', function () {

    it('Should add class name and event listeners to instance.', function () {
      fix = new Fix('test');

      assert.equal(fix.className, 'test');
      assert.equal(fix.startListener.eventName, 'touchstart');
      assert.equal(fix.endListener.eventName, 'touchend');
    });

    it('Should call handlers on event', function () {
      sinon.stub(Fix.prototype, 'touchStart');
      sinon.stub(Fix.prototype, 'touchEnd');

      fix = new Fix('test');

      fix.startListener._handler();
      assert.ok(Fix.prototype.touchStart.calledOnce);

      fix.endListener._handler();
      assert.ok(Fix.prototype.touchEnd.calledOnce);

      Fix.prototype.touchStart.restore();
      Fix.prototype.touchEnd.restore();
    });

  });

  describe('touchStart', function () {

    beforeEach(function () {
      sinon.stub(utils, 'getTargetedEl').returns(scrollable);
      sinon.stub(utils, 'scrollToEnd');
    });

    afterEach(function () {
      utils.getTargetedEl.restore();
      utils.isScrollable.restore();
      utils.scrollToEnd.restore(); 
    });

    it('Should scroll to end if el is scrollable.', function () {
      sinon.stub(utils, 'isScrollable').returns(true);

      fix = new Fix('test');
      fix.touchStart({});

      assert.ok(utils.scrollToEnd.calledOnce);
    });

    it('Should add move listener if el is not scrollable.', function () {
      sinon.stub(utils, 'isScrollable').returns(false);

      fix = new Fix('test');
      fix.touchStart({});

      assert.equal(fix.moveListener.eventName, 'touchmove');     
    });

    it('Should call move handler on event.', function () {
      sinon.stub(utils, 'isScrollable').returns(false);
      sinon.stub(Fix.prototype, 'touchMove');

      fix = new Fix('test');
      fix.touchStart({});
      fix.moveListener._handler();

      assert.ok(Fix.prototype.touchMove.calledOnce);

      Fix.prototype.touchMove.restore();
    });

  });

  describe('touchMove', function () {

    beforeEach(function () {
      sinon.stub(utils, 'getTargetedEl').returns(scrollable);
      sinon.stub(utils, 'scrollToEnd');
    });

    afterEach(function () {
      utils.getTargetedEl.restore();
      utils.isScrollable.restore();
      utils.scrollToEnd.restore(); 
    });

    it('Should call preventDefault', function () {
      sinon.stub(utils, 'isScrollable').returns(false);

      var evt = { preventDefault: sinon.spy() };

      fix = new Fix('test');
      fix.touchStart({});
      fix.moveListener._handler(evt);

      assert.ok(evt.preventDefault.calledOnce);
    });

  });

  describe('touchEnd', function () {

    it('Should remove move listener and delete instance from class.', function () {
      var spy = { remove: sinon.spy() };
      fix = new Fix('test');
      fix.moveListener = spy;
      
      fix.touchEnd();

      assert.ok(spy.remove.calledOnce);
      assert.notOk(fix.moveListener);
    });

  });

  describe('remove', function () {

    it('Should remove event listeners.', function () {
      fix = new Fix('test');
      fix.startListener = { remove: sinon.spy() };
      fix.endListener = { remove: sinon.spy() };
      fix.remove();

      assert.ok(fix.startListener.remove.calledOnce);
      assert.ok(fix.endListener.remove.calledOnce);
    });

  });

});


});