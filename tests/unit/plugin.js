define([
    'text!fixtures/pikabu.html',
    'text!fixtures/fullPikabu.html',
    '$',
    'drawer-left',
    'pikabu'
], function(fixture, fullFixture, $, drawerLeft) {
    var element;

    describe('Pikabu plugin', function() {
        this.timeout(5000);

        beforeEach(function() {
            element = $(fixture);
        });

        afterEach(function() {
            if (element) {
                $('.shade').remove();
                element.remove();
                element = null;
            }
            $('.lockup__container').removeClass('lockup__container');
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines pikabu in Zepto', function() {
                var pikabu = $.fn.pikabu;

                assert.isDefined(pikabu);
            });

            it('defines pikabu as a function', function() {
                var pikabu = $.fn.pikabu;

                assert.isFunction(pikabu);
            });
        });

        describe('invoking pikabu', function() {
            it('creates pikabu instance on element', function() {
                element.pikabu({
                    effect: drawerLeft
                });

                assert.isDefined(element.data('pikabu'));
            });

            it('stores element inside instance', function() {
                element.pikabu({
                    effect: drawerLeft
                });

                assert.isDefined(element.data('pikabu').$pikabu);
            });
        });

        describe('invoking pikabu methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() { element.pikabu('open'); });
            });
        });

        describe('invoking pikabu methods using the plugin interface', function() {
            it('opens a pikabu using the open method', function(done) {
                element.pikabu({
                    effect: drawerLeft,
                    opened: function() {
                        assert.isTrue(element.closest('.pikabu').hasClass('pikabu--is-open'));
                        done();
                    }
                });

                element.pikabu('open');
            });

            it('closes a pikabu item using the close method', function(done) {
                element.pikabu({
                    effect: drawerLeft,
                    opened: function() {
                        element.pikabu('close');
                    },
                    closed: function() {
                        assert.isFalse(element.closest('.pikabu').hasClass('pikabu--is-open'));
                        done();
                    }
                });

                element.pikabu('open');
            });

            it('closes a pikabu item using the close button', function(done) {
                element.pikabu({
                    effect: drawerLeft,
                    opened: function() {

                        element.closest('.pikabu').find('.pikabu__close').trigger('click');
                    },
                    closed: function() {
                        assert.isFalse(element.closest('.pikabu').hasClass('pikabu--is-open'));
                        done();
                    }
                });

                element.pikabu('open');
            });

            it('throws for method calls that don\'t exist', function() {
                assert.throws(function() {
                    element
                        .pikabu({
                            effect: drawerLeft
                        })
                        .pikabu('noMethod');
                });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() {
                    element
                        .pikabu({
                            effect: drawerLeft
                        })
                        .pikabu('_init');
                });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() {
                    element
                        .pikabu({
                            effect: drawerLeft
                        })
                        .pikabu('singleItemOpen');
                });
            });
        });

        describe('creates a pikabu with correct container', function() {
            it('creates pikabu with the default container', function() {
                var $pikabu = $(element).pikabu({ effect: drawerLeft });
                assert.equal($pikabu.closest('.pikabu').find('.pikabu__container').length, 1);
            });

            it('creates pikabu in the container element', function() {
                var $pikabu = $(element).pikabu({ effect: drawerLeft, container: '.custom__container' });
                assert.equal($pikabu.closest('.pikabu').find('.custom__container').length, 1);
            });
        });

        describe('creates a pikabu with correct header', function() {
            it('creates the structure with header = false', function() {
                var $pikabu = $(fullFixture).pikabu({
                    effect: drawerLeft,
                    structure: {
                        header: false
                    }
                }).closest('.pikabu__drawer');

                assert.equal($pikabu.find('.pikabu__header').length, 0);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
            });

            it('creates the correct structure with header = "Something"', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: drawerLeft,
                        structure: {
                            header: 'Something'
                        }
                    })
                    .closest('.pikabu__drawer');

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
                assert.include($pikabu.find('.pikabu__header').text(), 'Something');
            });

            it('creates the correct structure with an HTML header', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: drawerLeft,
                        structure: {
                            header: '<span class="pikabu__header--custom">Custom header</span><button class="pikabu__close"></button>'
                        }
                    })
                    .closest('.pikabu__drawer');

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__header--custom').length, 1);
                assert.include($pikabu.find('.pikabu__header--custom').text(), 'Custom header');
            });
        });

        describe('creates a pikabu with correct footer', function() {
            it('creates the structure with footer = false', function() {
                var $pikabu = $(fullFixture).pikabu({
                    effect: drawerLeft,
                    structure: {
                        header: false,
                        footer: false
                    }
                }).closest('.pikabu__drawer');

                assert.equal($pikabu.find('.pikabu__header').length, 0);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
                assert.equal($pikabu.find('.pikabu__footer').length, 0);
            });

            it('creates the correct structure with footer = "Footer"', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: drawerLeft,
                        structure: {
                            footer: 'Footer'
                        }
                    })
                    .closest('.pikabu__drawer');

                assert.equal($pikabu.find('.pikabu__header').length, 0);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
                assert.equal($pikabu.find('.pikabu__footer').length, 1);
                assert.include($pikabu.find('.pikabu__footer').text(), 'Footer');
            });

            it('creates the correct structure with an HTML footer', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: drawerLeft,
                        structure: {
                            footer: '<span class="pikabu__footer--custom">Custom footer</span>'
                        }
                    })
                    .closest('.pikabu__drawer');

                assert.equal($pikabu.find('.pikabu__header').length, 0);
                assert.equal($pikabu.find('.pikabu__footer--custom').length, 1);
                assert.include($pikabu.find('.pikabu__footer--custom').text(), 'Custom footer');
            });
        });
    });
});
