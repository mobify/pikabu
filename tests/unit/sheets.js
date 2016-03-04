define([
    'text!fixtures/pikabu.html',
    '$',
    'drawer-left',
    'drawer-right',
    'pikabu'
], function(fixture, $, drawerLeft, drawerRight, pikabu) {
    var element;

    describe('Pikabu sheets', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        afterEach(function() {
            if (element) {
                element.remove();
                element = null;
            }

            $('.pikabu__container').removeClass('pikabu__container');
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
