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
            var pikabu = element.pikabu({
                effect: drawerLeft
            });

            assert.isDefined(pikabu);
        });
    });
});
