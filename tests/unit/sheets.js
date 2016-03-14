define([
    'text!fixtures/pikabu.html',
    'text!fixtures/drawer.html',
    '$',
    'drawer-left',
    'drawer-right',
    'pikabu'
], function(fixture, drawer, $, drawerLeft, drawerRight, pikabu) {
    var element, content;

    describe('Pikabu sheets', function() {
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

        it('opens correctly using drawer-left', function() {
            var $pikabu = element.pikabu({
                effect: drawerLeft,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });

        it('opens correctly using drawer-right', function() {
            var $pikabu = element.pikabu({
                effect: drawerRight,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });

    });
});
