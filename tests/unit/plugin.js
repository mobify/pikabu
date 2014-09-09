define([
    'text!fixtures/pikabu.html',
    '$',
    'velocity',
    'pikabu'
], function(fixture, $) {
    var element;

    describe('Pikabu plugin', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines pikabu in Zepto', function() {
                var pikabu = $.fn.pikabu;

                assert.isDefined(pikabu);
            });

            it('defines pikabu as a function', function() {
                var pikabu = $.fn.pikabu;

                assert.isFunction(pikabu);
            });
        });

        describe('invoking pikabu', function() {
            it('creates pikabu instance on element', function() {
                element.pikabu();

                assert.isDefined(element.data('pikabu'));
            });

            it('stores element inside instance', function() {
                element.pikabu();

                assert.isDefined(element.data('pikabu').$pikabu);
            });
        });
    });
});