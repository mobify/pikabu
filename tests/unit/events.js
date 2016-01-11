define([
    'text!fixtures/pikabu.html',
    '$',
    'drawer-left',
    'pikabu'
], function(fixture, $, drawerLeft) {
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

        it('fires the open event when pikabu is opened', function(done) {
            element.pikabu({
                effect: drawerLeft,
                open: function() {
                    done();
                }
            });

            element.pikabu('open');
        });

        it('fires the opened event when pikabu is opened', function(done) {
            element.pikabu({
                effect: drawerLeft,
                opened: function() {
                    done();
                }
            });
            element.pikabu('open');
        });

        it('does not fire the open event when pikabu is already open', function() {
            var openCount = 0;
            element.pikabu({
                effect: drawerLeft,
                open: function() {
                    openCount++;
                }
            });

            element.pikabu('open');
            element.pikabu('open');

            assert.equal(openCount, 1);
        });

        it('fires the close event when pikabu is closed', function(done) {
            element.pikabu({
                effect: drawerLeft,
                opened: function() {
                    element.pikabu('close');
                },
                close: function() {
                    done();
                }
            });

            element.pikabu('open');
        });

        it('fires the closed event when pikabu is closed', function(done) {
            element.pikabu({
                effect: drawerLeft,
                opened: function() {
                    element.pikabu('close');
                },
                closed: function() {
                    done();
                }
            });

            element.pikabu('open');
        });

        it('does not fire the close event when pikabu is already closed', function(done) {
            var closeCount = 0;

            this.timeout(5000);

            element.pikabu({
                effect: drawerLeft,
                opened: function() {
                    element.pikabu('close');

                    setTimeout(function() {
                        element.pikabu('close');

                        assert.equal(closeCount, 1);

                        done();
                    }, 1000);

                },
                close: function() {
                    closeCount++;
                }
            });

            element.pikabu('open');
        });
    });
});
