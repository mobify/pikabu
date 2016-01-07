define([
    'text!fixtures/shade.html',
    '$',
    'shade'
], function(fixture, $) {
    var Shade;
    var element;
    var shade;

    describe('Shade options', function() {
        beforeEach(function() {
            Shade = $.fn.shade.Constructor;
            element = $(fixture);
        });

        afterEach(function() {
            shade.destroy();
        });

        describe('creates default options when no options parameter not used', function() {
            it('correctly defines cover', function() {
                shade = new Shade(element);

                assert.deepEqual(shade.options.cover, document.body);
                assert.isObject(shade.options.cover);
            });

            it('correctly defines color', function() {
                shade = new Shade(element);

                assert.equal(shade.options.color, Shade.DEFAULTS.color);
                assert.isString(shade.options.color);
            });

            it('correctly defines opacity', function() {
                shade = new Shade(element);

                assert.equal(shade.options.opacity, Shade.DEFAULTS.opacity);
                assert.isString(shade.options.opacity);
            });

            it('correctly defines duration', function() {
                shade = new Shade(element);

                assert.equal(shade.options.duration, 150);
                assert.isNumber(shade.options.duration);
            });

            it('correctly defines easing', function() {
                shade = new Shade(element);

                assert.equal(shade.options.easing, 'swing');
                assert.isString(shade.options.easing);
            });

            it('correctly defines padding', function() {
                shade = new Shade(element);

                assert.equal(shade.options.padding, 0);
                assert.isNumber(shade.options.padding);
            });

            it('correctly defines zIndex', function() {
                shade = new Shade(element);

                assert.equal(shade.options.zIndex, 1);
                assert.isNumber(shade.options.zIndex);
            });

            it('correctly defines cssClass', function() {
                shade = new Shade(element);

                assert.equal(shade.options.cssClass, Shade.DEFAULTS.cssClass);
                assert.isString(shade.options.cssClass);
            });

            it('correctly defines click', function() {
                shade = new Shade(element);

                assert.equal(shade.options.click, Shade.DEFAULTS.click);
                assert.isFunction(shade.options.click);
            });

            it('correctly defines events', function() {
                shade = new Shade(element);

                assert.isFunction(shade.options.open);
                assert.isFunction(shade.options.opened);
                assert.isFunction(shade.options.close);
                assert.isFunction(shade.options.closed);
            });
        });

        describe('creates custom options when options parameter used', function() {
            it('correctly defines cover', function() {
                var $cover = $('<div />');
                shade = new Shade(element, { cover: $cover });

                assert.deepEqual(shade.options.cover, $cover);
                assert.isArray(shade.options.cover);
            });

            it('correctly defines custom color', function() {
                shade = new Shade(element, { color: '#fff' });

                assert.equal(shade.options.color, '#fff');
                assert.isString(shade.options.color);
            });

            it('correctly defines custom opacity', function() {
                shade = new Shade(element, { opacity: '0.5' });

                assert.equal(shade.options.opacity, '0.5');
                assert.isString(shade.options.opacity);
            });

            it('correctly defines duration of 400', function() {
                shade = new Shade(element, { duration: 400 });

                assert.equal(shade.options.duration, 400);
                assert.isNumber(shade.options.duration);
            });

            it('correctly defines easing as ease-in-out', function() {
                shade = new Shade(element, { easing: 'ease-in-out'});

                assert.equal(shade.options.easing, 'ease-in-out');
                assert.isString(shade.options.easing);
            });

            it('correctly defines padding of 5px', function() {
                shade = new Shade(element, { padding: '5px' });

                assert.equal(shade.options.padding, '5px');
                assert.isString(shade.options.padding);
            });

            it('correctly defines zIndex of 5', function() {
                shade = new Shade(element, { zIndex: 5 });

                assert.equal(shade.options.zIndex, 5);
                assert.isNumber(shade.options.zIndex);
            });

            it('correctly defines custom CSS class', function() {
                shade = new Shade(element, { cssClass: 'c-class' });

                assert.equal(shade.options.cssClass, 'c-class');
                assert.isString(shade.options.cssClass);
            });

            it('correctly defines custom click', function() {
                var click = function() {
                    var that = this;
                    that.close();
                };
                shade = new Shade(element, { click: click });

                assert.equal(shade.options.click, click);
                assert.isFunction(shade.options.click);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('I\'m open!')
                };
                shade = new Shade(element, { open: open });

                assert.equal(shade.options.open, open);
                assert.isFunction(shade.options.open);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('Open!')
                };
                shade = new Shade(element, { open: open });

                assert.equal(shade.options.open, open);
                assert.isFunction(shade.options.open);
            });

            it('correctly defines opened event', function() {
                var opened = function() {
                    console.log('Opened!')
                };
                shade = new Shade(element, { opened: opened });

                assert.equal(shade.options.opened, opened);
                assert.isFunction(shade.options.opened);
            });

            it('correctly defines close event', function() {
                var close = function() {
                    console.log('Close!')
                };
                shade = new Shade(element, { close: close });

                assert.equal(shade.options.close, close);
                assert.isFunction(shade.options.close);
            });

            it('correctly defines closed event', function() {
                var closed = function() {
                    console.log('Closed!')
                };
                shade = new Shade(element, { closed: closed });

                assert.equal(shade.options.closed, closed);
                assert.isFunction(shade.options.closed);
            });
        });
    });
});