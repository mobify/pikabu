define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var Pikabu;
    var element;
    var pinny;

    describe('Pikabu options', function() {
        beforeEach(function() {
            Pikabu = $.fn.pinny.Constructor;
            element = $(fixture);
        });

        afterEach(function() {
            if (element) {
                element.remove();
                element = null;
            }

            $('.pinny__container').removeClass('pinny__container');
        });

        describe('creates default options when no options parameter not used', function() {
            beforeEach(function() {
                pinny = new Pikabu(element, {
                    effect: modalCenter
                });
            });

            it('throws with no effect defines effect', function() {
                assert.throws(function() {
                    pinny = new Pikabu(element);
                });
            });

            it('correctly defines header', function() {
                assert.equal(pinny.options.structure.header, Pikabu.DEFAULTS.structure.header);
                assert.isString(pinny.options.structure.header);
            });

            it('correctly defines footer', function() {
                assert.equal(pinny.options.structure.footer, Pikabu.DEFAULTS.structure.footer);
                assert.isBoolean(pinny.options.structure.footer);
            });

            it('correctly defines zIndex', function() {
                assert.equal(pinny.options.zIndex, 2);
                assert.isNumber(pinny.options.zIndex);
            });

            it('correctly defines coverage', function() {
                assert.equal(pinny.options.coverage, '100%');
                assert.isString(pinny.options.coverage);
            });

            it('correctly defines duration', function() {
                assert.equal(pinny.options.duration, 200);
                assert.isNumber(pinny.options.duration);
            });

            it('correctly defines easing', function() {
                assert.equal(pinny.options.easing, 'swing');
                assert.isString(pinny.options.easing);
            });

            it('correctly defines events', function() {
                assert.isFunction(pinny.options.open);
                assert.isFunction(pinny.options.opened);
                assert.isFunction(pinny.options.close);
                assert.isFunction(pinny.options.closed);
            });

            it('correctly defines container', function() {
                assert.isDefined(pinny.options.container);
            });
        });

        describe('creates custom options when options parameter used', function() {
            it('correctly defines effect', function() {
                pinny = new Pikabu(element, { effect: modalCenter });

                assert.deepEqual(pinny.options.effect, modalCenter);
                assert.isFunction(pinny.options.effect);
            });

            it('correctly defines custom header', function() {
                pinny = new Pikabu(element, { effect: modalCenter, structure: { header: '<header>Pinnay</header>' } });

                assert.equal(pinny.options.structure.header, '<header>Pinnay</header>');
                assert.isString(pinny.options.structure.header);
            });

            it('correctly defines custom footer', function() {
                pinny = new Pikabu(element, { effect: modalCenter, structure: { footer: '<footer>Stinky foot</footer>' } });

                assert.equal(pinny.options.structure.footer, '<footer>Stinky foot</footer>');
                assert.isString(pinny.options.structure.footer);
            });

            it('correctly defines zIndex of 5', function() {
                pinny = new Pikabu(element, { effect: modalCenter, zIndex: 5 });

                assert.equal(pinny.options.zIndex, 5);
                assert.isNumber(pinny.options.zIndex);
            });

            it('correctly defines coverage of 80%', function() {
                pinny = new Pikabu(element, { effect: modalCenter, coverage: '80%' });

                assert.equal(pinny.options.coverage, '80%');
                assert.isString(pinny.options.coverage);
            });

            it('correctly defines duration of 400', function() {
                pinny = new Pikabu(element, { effect: modalCenter, duration: 400 });

                assert.equal(pinny.options.duration, 400);
                assert.isNumber(pinny.options.duration);
            });

            it('correctly defines easing as ease-in-out', function() {
                pinny = new Pikabu(element, { effect: modalCenter, easing: 'ease-in-out'});

                assert.equal(pinny.options.easing, 'ease-in-out');
                assert.isString(pinny.options.easing);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('I\'m open!')
                };
                pinny = new Pikabu(element, { effect: modalCenter, open: open });

                assert.equal(pinny.options.open, open);
                assert.isFunction(pinny.options.open);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('Open!')
                };
                pinny = new Pikabu(element, { effect: modalCenter, open: open });

                assert.equal(pinny.options.open, open);
                assert.isFunction(pinny.options.open);
            });

            it('correctly defines opened event', function() {
                var opened = function() {
                    console.log('Opened!')
                };
                pinny = new Pikabu(element, { effect: modalCenter, opened: opened });

                assert.equal(pinny.options.opened, opened);
                assert.isFunction(pinny.options.opened);
            });

            it('correctly defines close event', function() {
                var close = function() {
                    console.log('Close!')
                };
                pinny = new Pikabu(element, { effect: modalCenter, close: close });

                assert.equal(pinny.options.close, close);
                assert.isFunction(pinny.options.close);
            });

            it('correctly defines closed event', function() {
                var closed = function() {
                    console.log('Closed!')
                };
                pinny = new Pikabu(element, { effect: modalCenter, closed: closed });

                assert.equal(pinny.options.closed, closed);
                assert.isFunction(pinny.options.closed);
            });

            it('correctly defines the container element', function() {
                pinny = new Pikabu(element, { effect: modalCenter, container: '#pinny-container' });

                assert.equal(pinny.options.container, '#pinny-container');
            });
        });
    });
});
