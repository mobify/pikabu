define([
    'text!fixtures/lockup.html',
    '$',
    'lockup'
], function(fixture, $, modalCenter) {
    var Lockup;
    var element;

    describe('lockup constructor', function() {
        beforeEach(function() {
            Lockup = $.fn.lockup.Constructor;
            element = $(fixture);
        });

        it('creates a lockup instance', function() {
            var lockup = new Lockup(element, {
                effect: modalCenter
            });

            assert.isDefined(lockup);

            lockup.destroy();
        });
    });
});