define([
    'text!fixtures/shade.html',
    '$',
    'shade'
], function(fixture, $) {
    var $element;

    describe('Shade plugin', function() {
        beforeEach(function() {
            $element = $(fixture);
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines shade in Zepto', function() {
                var shade = $.fn.shade;

                assert.isDefined(shade);
            });

            it('defines shade as a function', function() {
                var shade = $.fn.shade;

                assert.isFunction(shade);
            });
        });

        describe('invoking shade', function() {
            afterEach(function() {
                $element.shade('destroy');
            });

            it('creates shade instance on $element', function() {
                $element.shade();

                assert.isDefined($element.data('shade'));
            });

            it('stores $element inside instance', function() {
                $element.shade();

                assert.isDefined($element.data('shade').$shade);
            });
        });

        describe('invoking shade methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() { $element.shade('open'); });
            });
        });

        describe('invoking shade methods using the plugin interface', function() {
            afterEach(function() {
                $element.shade('destroy');
            });

            it('opens a shade using the open method', function(done) {
                $element.shade({
                    opened: function() {
                        assert.isTrue($element.data('shade').$shade.hasClass('shade--is-open'));
                        done();
                    }
                });

                $element.shade('open');
            });

            it('closes a shade item using the close method', function(done) {
                $element.shade({
                    opened: function() {
                        $element.shade('close');
                    },
                    closed: function() {
                        assert.isFalse($element.data('shade').$shade.hasClass('shade--is-open'));
                        done();
                    }
                });

                $element.shade('open');
            });

            it('closes a shade by clicking on it', function(done) {
                $element.shade({
                    opened: function() {
                        $element.data('shade').$shade.trigger('click');
                    },
                    closed: function() {
                        assert.isFalse($element.data('shade').$shade.hasClass('shade--is-open'));
                        done();
                    }
                });

                $element.shade('open');
            });

            it('sets shade\'s position when window resizing', function(done) {
                var shade;
                var setPositionFn;

                $element
                    .shade({
                        opened: function() {
                            $(window).trigger('resize');
                        }
                    })
                    .shade('open');

                shade = $element.data('shade');
                setPositionFn = shade.setPosition;
                shade.setPosition = function() {
                    setPositionFn.call(this);
                    done();
                };
            });

            it('throws for method calls that don\'t exist', function() {
                assert.throws(function() { $element.shade().shade('noMethod'); });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() { $element.shade().shade('_init'); });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() { $element.shade().shade('singleItemOpen'); });
            });
            
        });
    });
});