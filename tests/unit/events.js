define([
    'text!fixtures/pikabu.html',
    '$',
    'pikabu'
], function(fixture, $) {
    var element;

    describe('Pikabu events', function() {
        beforeEach(function() {
            element = $(fixture);
        });
    });
});