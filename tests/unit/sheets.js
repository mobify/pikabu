define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'sheet-top',
    'sheet-bottom',
    'sheet-left',
    'sheet-right',
    'pinny'
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
            var $pinny = element.pinny({
                effect: modalCenter,
                opened: function() {
                    assert.isTrue($pinny.closest('.pinny').hasClass('pinny--is-open'));
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-top', function() {
            var $pinny = element.pinny({
                effect: sheetTop,
                opened: function() {
                    assert.isTrue($pinny.closest('.pinny').hasClass('pinny--is-open'));
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-bottom', function() {
            var $pinny = element.pinny({
                effect: sheetBottom,
                opened: function() {
                    assert.isTrue($pinny.closest('.pinny').hasClass('pinny--is-open'));
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-left', function() {
            var $pinny = element.pinny({
                effect: sheetLeft,
                opened: function() {
                    assert.isTrue($pinny.closest('.pinny').hasClass('pinny--is-open'));
                }
            });

            $pinny.pinny('open');
        });

        it('opens correctly using sheet-right', function() {
            var $pinny = element.pinny({
                effect: sheetRight,
                opened: function() {
                    assert.isTrue($pinny.closest('.pinny').hasClass('pinny--is-open'));
                }
            });

            $pinny.pinny('open');
        });
    });
});