define([
    'text!fixtures/pinny.html',
    '$',
    'modal-center',
    'pinny'
], function(fixture, $, modalCenter) {
    var element;

    describe('Pikabu events', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        afterEach(function() {
            if (element) {
                element.remove();
                element = null;
            }
        });

        it('fires the open event when pinny is opened', function(done) {
            element.pinny({
                effect: modalCenter,
                open: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the opened event when pinny is opened', function(done) {
            element.pinny({
                effect: modalCenter,
                opened: function() {
                    done();
                }
            });
            element.pinny('open');
        });

        it('does not fire the open event when pinny is already open', function() {
            var openCount = 0;
            element.pinny({
                effect: modalCenter,
                open: function() {
                    openCount++;
                }
            });

            element.pinny('open');
            element.pinny('open');

            assert.equal(openCount, 1);
        });

        it('fires the close event when pinny is closed', function(done) {
            element.pinny({
                effect: modalCenter,
                opened: function() {
                    element.pinny('close');
                },
                close: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('fires the closed event when pinny is closed', function(done) {
            element.pinny({
                effect: modalCenter,
                opened: function() {
                    element.pinny('close');
                },
                closed: function() {
                    done();
                }
            });

            element.pinny('open');
        });

        it('does not fire the close event when pinny is already closed', function(done) {
            var closeCount = 0;

            this.timeout(5000);

            element.pinny({
                effect: modalCenter,
                opened: function() {
                    element.pinny('close');

                    setTimeout(function() {
                        element.pinny('close');

                        assert.equal(closeCount, 1);

                        done();
                    }, 1000);

                },
                close: function() {
                    closeCount++;
                }
            });

            element.pinny('open');
        });
    });
});