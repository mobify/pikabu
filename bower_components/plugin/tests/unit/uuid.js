define([
    '$',
    'plugin'
], function($) {
    var testUniqueness = function() {
        var first = $.uniqueId();

        setTimeout(function() {
            var second = $.uniqueId();

            assert.notEqual(first, second, 'values are unique');
        }, 10);
    };

    describe('uuid function', function() {
        describe('functions as expected', function() {
            it('creates a uuid function bound to $', function() {
                assert.isDefined($.uniqueId);
            });

            it('creates uuid as a function', function() {
                assert.isFunction($.uniqueId);
            });

            it('generates a unique ID for each call', function() {
                for (var i = 0; i < 100; i++) {
                    testUniqueness();
                }
            });
        });
    });
});