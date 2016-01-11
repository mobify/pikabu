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
  'bouncefix'
], function ($, assert, sinon, bouncefix) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('bouncefix.js', function () {
  
  it('Should add classes to cache', function () {
    bouncefix.add('test');
    bouncefix.add('test2');
    assert.isObject(bouncefix.cache['test']);
    assert.isObject(bouncefix.cache['test2']);
  });

  it('Should remove classes from cache', function () {
    bouncefix.remove('test');
    bouncefix.remove('test2');
    assert.isUndefined(bouncefix.cache['test']);
    assert.isUndefined(bouncefix.cache['test2']);
  });

});


});