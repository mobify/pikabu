define([
    'text!fixtures/pikabu.html',
    'text!fixtures/fullPikabu.html',
    '$',
    'modal-center',
    'pikabu'
], function(fixture, fullFixture, $, modalCenter) {
    var element;

    describe('Pikabu plugin', function() {
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
                    effect: modalCenter
                });

                assert.isDefined(element.data('pikabu'));
            });

            it('stores element inside instance', function() {
                element.pikabu({
                    effect: modalCenter
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
                    effect: modalCenter,
                    opened: function() {
                        assert.isTrue(element.closest('.pikabu').hasClass('pikabu--is-open'));
                        done();
                    }
                });

                element.pikabu('open');
            });

            it('closes a pikabu item using the close method', function(done) {
                element.pikabu({
                    effect: modalCenter,
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
                    effect: modalCenter,
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
                            effect: modalCenter
                        })
                        .pikabu('noMethod');
                });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() {
                    element
                        .pikabu({
                            effect: modalCenter
                        })
                        .pikabu('_init');
                });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() {
                    element
                        .pikabu({
                            effect: modalCenter
                        })
                        .pikabu('singleItemOpen');
                });
            });
        });

        describe('creates a pikabu with correct container', function() {
            it('creates pikabu with the default container', function() {
                var $pikabu = $(element).pikabu({ effect: modalCenter });
                assert.equal($pikabu.closest('.lockup__container').length, 1);
            });

            it('creates pikabu in the container element', function() {
                var $pikabu = $(element).pikabu({ effect: modalCenter, container: '#pikabu-container' });
                assert.equal($pikabu.closest('#pikabu-container').length, 1);
            });
        });

        describe('creates a pikabu with correct header', function() {
            it('creates the structure with header = false', function() {
                var $pikabu = $(fullFixture).pikabu({
                    effect: modalCenter,
                    structure: {
                        header: false
                    }
                });

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
            });

            it('creates the correct structure with header = "Something"', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: modalCenter,
                        structure: {
                            header: 'Something'
                        }
                    })
                    .closest('.pikabu');

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
                assert.include($pikabu.find('.pikabu__header').text(), 'Something');
            });

            it('creates the correct structure with an HTML header', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: modalCenter,
                        structure: {
                            header: '<span class="pikabu__header--custom">Custom header</span><button class="pikabu__close"></button>'
                        }
                    })
                    .closest('.pikabu');

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__header--custom').length, 1);
                assert.include($pikabu.find('.pikabu__header--custom').text(), 'Custom header');
            });
        });

        describe('creates a pikabu with correct footer', function() {
            it('creates the structure with footer = false', function() {
                var $pikabu = $(fullFixture).pikabu({
                    effect: modalCenter,
                    structure: {
                        header: false,
                        footer: false
                    }
                });

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
                assert.equal($pikabu.find('.pikabu__footer').length, 0);
            });

            it('creates the correct structure with footer = "Footer"', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: modalCenter,
                        structure: {
                            footer: 'Footer'
                        }
                    })
                    .closest('.pikabu');

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__content').length, 1);
                assert.equal($pikabu.find('.pikabu__footer').length, 1);
                assert.include($pikabu.find('.pikabu__footer').text(), 'Footer');
            });

            it('creates the correct structure with an HTML footer', function() {
                var $pikabu = $(fixture)
                    .pikabu({
                        effect: modalCenter,
                        structure: {
                            footer: '<span class="pikabu__footer--custom">Custom footer</span>'
                        }
                    })
                    .closest('.pikabu');

                assert.equal($pikabu.find('.pikabu__header').length, 1);
                assert.equal($pikabu.find('.pikabu__footer--custom').length, 1);
                assert.include($pikabu.find('.pikabu__footer--custom').text(), 'Custom footer');
            });
        });
    });
});