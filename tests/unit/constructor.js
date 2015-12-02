define([
    'text!fixtures/pikabu.html',
    '$',
    'modal-center',
    'pikabu'
], function(fixture, $, modalCenter) {
    var Pikabu;
    var element;

    describe('Pikabu constructor', function() {
        beforeEach(function() {
            Pikabu = $.fn.pikabu.Constructor;
            element = $(fixture);
        });

        it('creates a pikabu instance', function() {
            var pikabu = new Pikabu(element, {
                effect: modalCenter
            });

            assert.isDefined(pikabu);
        });
    });
});