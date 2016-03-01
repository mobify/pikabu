define([
    'text!fixtures/pikabu.html',
    '$',
    'drawer-left',
    'pikabu'
], function(fixture, $, drawerLeft) {
    var Pikabu;
    var element;
    var pikabu;

    describe('Pikabu options', function() {
        beforeEach(function() {
            Pikabu = $.fn.pikabu.Constructor;
            element = $(fixture);
        });

        afterEach(function() {
            if (element) {
                element.remove();
                element = null;
            }

            $('.pikabu__container').removeClass('pikabu__container');
        });

        describe('creates default options when no options parameter not used', function() {
            beforeEach(function() {
                pikabu = new Pikabu(element, {
                    effect: drawerLeft
                });
            });

            it('throws with no effect defines effect', function() {
                assert.throws(function() {
                    pikabu = new Pikabu(element);
                });
            });

            it('correctly defines container', function() {
                assert.isDefined(pikabu.options.container);
            });

            it('correctly defines appendTo', function() {
                assert.isDefined(pikabu.options.appendTo);
            });

            it('correctly defines header', function() {
                assert.equal(pikabu.options.structure.header, Pikabu.DEFAULTS.structure.header);
                assert.isFalse(pikabu.options.structure.header);
            });

            it('correctly defines footer', function() {
                assert.equal(pikabu.options.structure.footer, Pikabu.DEFAULTS.structure.footer);
                assert.isFalse(pikabu.options.structure.footer);
            });

            it('correctly defines zIndex', function() {
                assert.equal(pikabu.options.zIndex, 0);
                assert.isNumber(pikabu.options.zIndex);
            });

            it('correctly defines cssClass', function() {
                assert.equal(pikabu.options.cssClass, '');
                assert.isString(pikabu.options.cssClass);
            });

            it('correctly defines coverage', function() {
                assert.equal(pikabu.options.coverage, '100%');
                assert.isString(pikabu.options.coverage);
            });

            it('correctly defines easing', function() {
                assert.equal(pikabu.options.easing, 'swing');
                assert.isString(pikabu.options.easing);
            });

            it('correctly defines duration', function() {
                assert.equal(pikabu.options.duration, 200);
                assert.isNumber(pikabu.options.duration);
            });

            it('correctly defines shade zIndex', function() {
                assert.equal(pikabu.options.shade.zIndex, 2);
                assert.isNumber(pikabu.options.shade.zIndex);
            });

            it('correctly defines events', function() {
                assert.isFunction(pikabu.options.open);
                assert.isFunction(pikabu.options.opened);
                assert.isFunction(pikabu.options.close);
                assert.isFunction(pikabu.options.closed);
            });

            it('correctly defines scrollDuration', function() {
                assert.equal(pikabu.options.scrollDuration, 50);
                assert.isNumber(pikabu.options.scrollDuration);
            });

            it('correctly defines spacerHeight', function() {
                assert.equal(pikabu.options.spacerHeight, 300);
                assert.isNumber(pikabu.options.spacerHeight);
            });
        });

        describe('creates custom options when options parameter used', function() {
            it('correctly defines effect', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft });

                assert.deepEqual(pikabu.options.effect, drawerLeft);
                assert.isFunction(pikabu.options.effect);
            });

            it('correctly defines the container element', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, container: '#pikabu-container' });

                assert.equal(pikabu.options.container, '#pikabu-container');
            });

            it('correctly defines the appendTo element', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, appendTo: '#pikabu-appendTo' });

                assert.equal(pikabu.options.appendTo, '#pikabu-appendTo');
            });

            it('correctly defines custom header', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, structure: { header: '<header>Pinnay</header>' } });

                assert.equal(pikabu.options.structure.header, '<header>Pinnay</header>');
                assert.isString(pikabu.options.structure.header);
            });

            it('correctly defines custom footer', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, structure: { footer: '<footer>Stinky foot</footer>' } });

                assert.equal(pikabu.options.structure.footer, '<footer>Stinky foot</footer>');
                assert.isString(pikabu.options.structure.footer);
            });

            it('correctly defines zIndex of 5', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, zIndex: 5 });

                assert.equal(pikabu.options.zIndex, 5);
                assert.isNumber(pikabu.options.zIndex);
            });

            it('correctly defines coverage of 80%', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, coverage: '80%' });

                assert.equal(pikabu.options.coverage, '80%');
                assert.isString(pikabu.options.coverage);
            });

            it('correctly defines easing as ease-in-out', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, easing: 'ease-in-out'});

                assert.equal(pikabu.options.easing, 'ease-in-out');
                assert.isString(pikabu.options.easing);
            });

            it('correctly defines duration of 400', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, duration: 400 });

                assert.equal(pikabu.options.duration, 400);
                assert.isNumber(pikabu.options.duration);
            });

            it('correctly defines shade zIndex', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, shade: { zIndex: 4 } });

                assert.equal(pikabu.options.shade.zIndex, 4);
                assert.isNumber(pikabu.options.shade.zIndex);
            });

            it('correctly defines open event', function() {
                var open = function() {
                    console.log('Open!')
                };
                pikabu = new Pikabu(element, { effect: drawerLeft, open: open });

                assert.equal(pikabu.options.open, open);
                assert.isFunction(pikabu.options.open);
            });

            it('correctly defines opened event', function() {
                var opened = function() {
                    console.log('Opened!')
                };
                pikabu = new Pikabu(element, { effect: drawerLeft, opened: opened });

                assert.equal(pikabu.options.opened, opened);
                assert.isFunction(pikabu.options.opened);
            });

            it('correctly defines close event', function() {
                var close = function() {
                    console.log('Close!')
                };
                pikabu = new Pikabu(element, { effect: drawerLeft, close: close });

                assert.equal(pikabu.options.close, close);
                assert.isFunction(pikabu.options.close);
            });

            it('correctly defines closed event', function() {
                var closed = function() {
                    console.log('Closed!')
                };
                pikabu = new Pikabu(element, { effect: drawerLeft, closed: closed });

                assert.equal(pikabu.options.closed, closed);
                assert.isFunction(pikabu.options.closed);
            });

            it('correctly defines scrollDuration', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, scrollDuration: 100 });

                assert.equal(pikabu.options.scrollDuration, 100);
                assert.isNumber(pikabu.options.scrollDuration);
            });

            it('correctly defines spacerHeight', function() {
                pikabu = new Pikabu(element, { effect: drawerLeft, spacerHeight: 500 });

                assert.equal(pikabu.options.spacerHeight, 500);
                assert.isNumber(pikabu.options.spacerHeight);
            });
        });
    });
});
