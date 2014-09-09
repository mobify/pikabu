define([
    'text!fixtures/pikabu.html',
    '$',
    'velocity',
    'pikabu'
], function(fixture, $) {
    var Pikabu;
    var element;

    describe('Pikabu options', function() {
        beforeEach(function() {
            Pikabu = $.fn.pikabu.Constructor;
            element = $(fixture);
        });

        describe('creates default options when no options parameter not used', function() {

            it('correctly defines duration', function() {
                var pikabu = new Pikabu(element);

                assert.equal(pikabu.options.duration, 200);
                assert.isNumber(pikabu.options.duration);
            });

            it('correctly defines easing', function() {
                var pikabu = new Pikabu(element);

                assert.equal(pikabu.options.easing, 'swing');
                assert.isString(pikabu.options.easing);
            });

            it('correctly defines events', function() {
                var pikabu = new Pikabu(element);

                assert.isFunction(pikabu.options.open);
                assert.isFunction(pikabu.options.opened);
                assert.isFunction(pikabu.options.close);
                assert.isFunction(pikabu.options.closed);
            });
        });

        describe('creates custom options when options parameter used', function() {

            it('correctly defines duration of 400', function() {
                var pikabu = new Pikabu(element, { duration: 400 });

                assert.equal(pikabu.options.duration, 400);
                assert.isNumber(pikabu.options.duration);
            });

            it('correctly defines easing as ease-in-out', function() {
                var pikabu = new Pikabu(element, { easing: 'ease-in-out'});

                assert.equal(pikabu.options.easing, 'ease-in-out');
                assert.isString(pikabu.options.easing);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('I\'m open!')
                };
                var pikabu = new Pikabu(element, { open: open });

                assert.equal(pikabu.options.open, open);
                assert.isFunction(pikabu.options.open);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('Open!')
                };
                var pikabu = new Pikabu(element, { open: open });

                assert.equal(pikabu.options.open, open);
                assert.isFunction(pikabu.options.open);
            });

            it('correctly defines opened event', function() {
                var opened = function() {
                    console.log('Opened!')
                };
                var pikabu = new Pikabu(element, { opened: opened });

                assert.equal(pikabu.options.opened, opened);
                assert.isFunction(pikabu.options.opened);
            });

            it('correctly defines close event', function() {
                var close = function() {
                    console.log('Close!')
                };
                var pikabu = new Pikabu(element, { close: close });

                assert.equal(pikabu.options.close, close);
                assert.isFunction(pikabu.options.close);
            });

            it('correctly defines closed event', function() {
                var closed = function() {
                    console.log('Closed!')
                };
                var pikabu = new Pikabu(element, { closed: closed });

                assert.equal(pikabu.options.closed, closed);
                assert.isFunction(pikabu.options.closed);
            });
        });
    });
});