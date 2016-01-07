define([
    'text!fixtures/lockup.html',
    '$',
    'lockup'
], function(fixture, $) {
    var $element;

    describe('lockup plugin', function() {
        beforeEach(function() {
            $element = $(fixture);
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines lockup in Zepto', function() {
                var lockup = $.fn.lockup;

                assert.isDefined(lockup);
            });

            it('defines lockup as a function', function() {
                var lockup = $.fn.lockup;

                assert.isFunction(lockup);
            });
        });

        describe('invoking lockup', function() {
            it('creates lockup instance on $element', function() {
                $element.lockup({});

                assert.isDefined($element.data('lockup'));

                $element.lockup('destroy');
            });

            it('stores $element inside instance', function() {
                $element.lockup({});

                assert.isDefined($element.data('lockup').$element);

                $element.lockup('destroy');
            });
        });

        describe('invoking multiple lockups', function() {
            it('correctly tracks instance counts', function() {
                var getInstanceCount = function() {
                    return $('.lockup__container').data('instance') || 0;
                };

                var $first = $('<div />').lockup();
                var $second = $('<div />').lockup();
                var $third = $('<div />').lockup();

                assert.equal(getInstanceCount(), 3);

                $first.lockup('destroy');

                assert.equal(getInstanceCount(), 2);

                $second.lockup('destroy');
                $third.lockup('destroy');

                assert.equal(getInstanceCount(), 0);
            });

            it('removes the lockup container if it was generated and no more lockups exist', function() {
                var $lockup = $('<div />').lockup();

                $lockup.lockup('destroy');

                assert.equal($('.lockup__container').length, 0);
            });
        });

        describe('invoking lockup methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() { $element.lockup('lock'); });
            });
        });

        describe('invoking isLocked', function() {
            it('returns true when locked', function() {
                var $lockup = $('<div />').lockup();

                $lockup.lockup('lock');

                assert.isTrue($lockup.lockup('isLocked'));

                $lockup.lockup('destroy');
            });

            it('returns false when unlocked', function() {
                var $lockup = $('<div />').lockup();

                $lockup.lockup('lock');
                $lockup.lockup('unlock');

                assert.isFalse($lockup.lockup('isLocked'));

                $lockup.lockup('destroy');
            });
        });
    });
});