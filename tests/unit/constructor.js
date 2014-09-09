define([
    'text!fixtures/pikabu.html',
    '$',
    'velocity',
    'pikabu'
], function(fixture, $) {
    var Pikabu;
    var element;

    describe('Pikabu constructor', function() {
        beforeEach(function() {
            Pikabu = $.fn.pikabu.Constructor;
            element = $(fixture);
        });

        it('creates a pikabu instance', function() {
            var pikabu = new Pikabu(element);

            assert.isDefined(pikabu);
        });
    });
});