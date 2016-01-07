define([
    'text!fixtures/lockup.html',
    '$',
    'lockup'
], function(fixture, $) {
    var $element;

    describe('lockup events', function() {
        beforeEach(function() {
            $element = $(fixture);
        });

        afterEach(function() {
            $element.lockup('destroy');
        });

        it('fires the locked event when lockup is locked', function(done) {
            $element.lockup({
                locked: function() {
                    done();
                }
            });

            $element.lockup('lock');
        });

        it('fires the unlocked event when lockup is unlocked', function(done) {
            $element.lockup({
                locked: function() {
                    $element.lockup('unlock');
                },
                unlocked: function() {
                    done();
                }
            });

            $element.lockup('lock');
        });
    });
});