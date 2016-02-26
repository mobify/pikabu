(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, framework.Velocity);
    }
}(function($, Plugin, Velocity) {
    var classes = {
        SHADE: 'shade',
        OPENED: 'shade--is-open'
    };

    var events = {
        resize: 'resize.shade',
        click: 'click.shade'
    };

    function Shade(element, options) {
        Shade.__super__.call(this, element, options, Shade.DEFAULTS);
    }

    Shade.VERSION = '0';

    Shade.DEFAULTS = {
        cover: document.body,
        color: 'black',
        opacity: '0.25',
        duration: 150,
        easing: 'swing',
        padding: 0,
        zIndex: 1,
        cssClass: '',
        click: function() {
            this.close();
        },
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('shade', Shade, {
        _init: function(element) {
            var plugin = this;

            this.$element = $(element);

            this.isBody = $(this.options.cover).is('body');

            this.$shade = $('<div />')
                .addClass(classes.SHADE)
                .addClass(this.options.cssClass)
                .css({
                    background: this.options.color ? this.options.color : '',
                    opacity: 0,
                    '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
                })
                .hide()
                .on(events.click, function() {
                    plugin.options.click && plugin.options.click.call(plugin);
                })
                .insertAfter(this.$element);

            this._resize = function() {
                plugin.$shade.hasClass(classes.OPENED) && plugin.setPosition.call(plugin);
            };

            $(window).on(events.resize, this._resize);
        },

        destroy: function() {
            $(window).off(events.resize, this._resize);
            this.$element.removeData(this.name);
            this.$shade.remove();
        },

        open: function() {
            var plugin = this;

            this._trigger('open');

            this.setPosition();

            Velocity.animate(
                this.$shade,
                {
                    opacity: this.options.opacity
                },
                {
                    display: 'block',
                    duration: this.options.duration,
                    easing: this.options.easing,
                    complete: function() {
                        plugin.$shade
                            .addClass(classes.OPENED)
                            .on('touchmove', function() {
                                return false;
                            });

                        plugin._trigger('opened');
                    }
                }
            );
        },

        close: function() {
            var plugin = this;

            this._trigger('close');

            Velocity.animate(
                this.$shade,
                'reverse',
                {
                    display: 'none',
                    duration: this.options.duration,
                    easing: this.options.easing,
                    complete: function() {
                        plugin.$shade
                            .removeClass(classes.OPENED)
                            .off('touchmove');

                        plugin._trigger('closed');
                    }
                }
            );
        },

        setPosition: function() {
            var $element = this.$element;
            var width = this.isBody ? 'auto' : $element.width();
            var height = this.isBody ? 'auto' : $element.height();
            var position = this.isBody ? 'fixed' : 'absolute';

            this.$shade
                .css({
                    left: this.options.padding ? -this.options.padding : 0,
                    top: this.options.padding ? -this.options.padding : 0,
                    bottom: this.options.padding ? -this.options.padding : 0,
                    right: this.options.padding ? -this.options.padding : 0,
                    width: this.options.padding ? width - this.options.padding : width,
                    height: this.options.padding ? height - this.options.padding : height,
                    position: position,
                    padding: this.options.padding,
                    zIndex: this.options.zIndex || $element.css('zIndex') + 1
                });
        }
    });

    return $;
}));

