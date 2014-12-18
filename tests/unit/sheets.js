define([
    'text!fixtures/pikabu.html',
    '$',
    'modal-center',
    'pikabu'
], function(fixture, $, modalCenter, sheetTop, sheetBottom, sheetLeft, sheetRight) {
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
        });

        it('opens correctly using modal-center', function() {
            var $pikabu = element.pikabu({
                effect: modalCenter,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });

        it('opens correctly using sheet-top', function() {
            var $pikabu = element.pikabu({
                effect: sheetTop,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });

        it('opens correctly using sheet-bottom', function() {
            var $pikabu = element.pikabu({
                effect: sheetBottom,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });

        it('opens correctly using sheet-left', function() {
            var $pikabu = element.pikabu({
                effect: sheetLeft,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });

        it('opens correctly using sheet-right', function() {
            var $pikabu = element.pikabu({
                effect: sheetRight,
                opened: function() {
                    assert.isTrue($pikabu.closest('.pikabu').hasClass('pikabu--is-open'));
                }
            });

            $pikabu.pikabu('open');
        });
    });
});