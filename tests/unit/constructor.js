define([
    'text!fixtures/pikabu.html',
    'text!fixtures/drawer.html',
    '$',
    'drawer-left',
    'pikabu'
], function(fixture, drawer, $, drawerLeft) {
    var element, content;

    describe('Pikabu constructor', function() {
        beforeEach(function() {
            element = $(drawer);
            content = $(fixture);
            $('body').append(content);
        });

        afterEach(function() {
            if (element) {
                element.remove();
                content.remove();
                $('.shade').remove();
                element = null;
            }
        });

        it('creates a pikabu instance', function() {
            var pikabu = element.pikabu({
                effect: drawerLeft
            });

            assert.isDefined(pikabu);
        });
    });
});
