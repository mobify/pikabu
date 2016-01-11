define([
    'text!fixtures/pikabu.html',
    '$',
    'drawer-left',
    'pikabu'
], function(fixture, $, drawerLeft) {
    var Pikabu;
    var element;

    describe('Pikabu constructor', function() {
        beforeEach(function() {
            Pikabu = $.fn.pikabu.Constructor;
            element = $(fixture);
        });

        it('creates a pikabu instance', function() {
            var pikabu = new Pikabu(element, {
                effect: drawerLeft
            });

            assert.isDefined(pikabu);
        });
    });
});
