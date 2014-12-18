define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var Pikabu;
    var element;

    describe('Pikabu constructor', function() {
        beforeEach(function() {
            Pikabu = $.fn.pinny.Constructor;
            element = $(fixture);
        });

        it('creates a pinny instance', function() {
            var pinny = new Pikabu(element, {
                effect: modalCenter
            });

            assert.isDefined(pinny);
        });
    });
});