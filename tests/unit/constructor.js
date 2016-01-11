define([
    'text!fixtures/pikabu.html',
    '$',
    'drawer-left',
    'pikabu'
], function(fixture, $, drawerLeft) {
    var element;

    describe('Pikabu constructor', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        it('creates a pikabu instance', function() {
            var pikabu = $('.pikabu').pikabu({
                effect: drawerLeft
            });

            assert.isDefined(pikabu);
        });
    });
});
