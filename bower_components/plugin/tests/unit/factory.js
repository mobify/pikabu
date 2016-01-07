define([
    '$',
    'plugin'
], function($, Plugin) {
    var $element;

    describe('Plugin factory', function() {
        beforeEach(function() {
            $element = $('<div class="subplugin" />');
        });

        describe('Plugin create', function() {

            it('creates create function', function() {
                assert.isDefined(Plugin.create);
            });

            it('creates Plugin.create as a function', function() {
                assert.isFunction(Plugin.create);
            });
        });

        describe('Plugin creation', function() {
            it('extends sub-object prototype with the name property', function() {
                function SubPlugin(element, options) {
                    SubPlugin.__super__.call(this, element, options);
                }

                Plugin.create('subplugin', SubPlugin, {
                    _init: function() {

                    }
                });

                assert.isDefined(SubPlugin.prototype.name);
                assert.equal(SubPlugin.prototype.name, 'subplugin');
            });

            it('extends sub-object prototype', function() {
                function SubPlugin(element, options) {
                    SubPlugin.__super__.call(this, element, options);
                }

                Plugin.create('subplugin', SubPlugin, {
                    _init: function() {

                    },
                    foo: function() {

                    },
                    bar: function() {

                    }
                });

                assert.isDefined(SubPlugin.prototype._init);
                assert.isDefined(SubPlugin.prototype.foo);
                assert.isDefined(SubPlugin.prototype.bar);
            });

            it('extends $.fn with the plugin function', function() {
                function SubPlugin(element, options) {
                    SubPlugin.__super__.call(this, element, options);
                }

                Plugin.create('subplugin', SubPlugin, {
                    _init: function() {

                    }
                });

                assert.isDefined($.fn.subplugin);
            });

            it('invokes the _init function when creating the plugin', function(done) {
                function SubPlugin(element, options) {
                    SubPlugin.__super__.call(this, element, options);
                }

                Plugin.create('subplugin', SubPlugin, {
                    _init: function() {
                        done();
                    }
                });

                $element.subplugin();
            });
        });

        describe('multiple plugin types', function() {
            it('creates types correctly by extending Plugin.prototype', function() {
                var plugin1Init = function(element) { var $element1 = element; };
                var plugin2Init = function(element) { var $element2 = element; };

                function Plugin1(element, options) {
                    Plugin1.__super__.call(this, element, options, {
                        plugin1Option: true
                    });
                }

                Plugin.create('plugin1', Plugin1, {
                    _init: plugin1Init,
                    firstUniqueMethod: function() {
                        return true;
                    }
                });

                function Plugin2(element, options) {
                    Plugin1.__super__.call(this, element, options, {
                        plugin2Option: true
                    });
                }

                Plugin.create('plugin2', Plugin2, {
                    _init: plugin2Init,
                    secondUniqueMethod: function() {
                        return false;
                    }
                });

                var $plugin1 = $('<div/>').plugin1();
                var $plugin2 = $('<div/>').plugin2();

                var plugin1 = $plugin1.data('plugin1');
                var plugin2 = $plugin2.data('plugin2');

                assert.equal(Plugin1.prototype._init, plugin1Init);
                assert.isDefined(plugin1.options.plugin1Option);
                assert.isDefined(plugin1.firstUniqueMethod);
                assert.isUndefined(plugin1.secondUniqueMethod);

                assert.equal(Plugin2.prototype._init, plugin2Init);
                assert.isDefined(plugin2.options.plugin2Option);
                assert.isDefined(plugin2.secondUniqueMethod);
                assert.isUndefined(plugin2.firstUniqueMethod);
            });
        });
    });
});