define([
    'text!fixtures/shade.html',
    '$',
    'shade'
], function(fixture, $) {
    var $element;

    describe('Shade events', function() {
        beforeEach(function() {
            $element = $(fixture);
        });

        afterEach(function() {
            $element.shade('destroy');
        });

        it('fires the open event when shade is opened', function(done) {
            $element.shade({
                open: function() {
                    done();
                }
            });

            $element.shade('open');
        });

        it('fires the opened event when shade is opened', function(done) {
            $element.shade({
                opened: function() {
                    done();
                }
            });

            $element.shade('open');
        });

        it('fires the close event when shade is closed', function(done) {
            $element.shade({
                opened: function() {
                    $element.shade('close');
                },
                close: function() {
                    done();
                }
            });

            $element.shade('open');
        });

        it('fires the closed event when shade is closed', function(done) {
            $element.shade({
                opened: function() {
                    $element.shade('close');
                },
                closed: function() {
                    done();
                }
            });

            $element.shade('open');
        });
    });
});