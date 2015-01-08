(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();

        var $animators = $('.pikabu__container, .pikabu--fixed, .shade');

        var windowHeight;

        this.$pikabu
            .css({
                top: 0,
                bottom: 0,
                left: coverage ? coverage : 'auto',
                right: 0,
                width: coverage ? 'auto' : this.options.coverage,
                height: 'auto'
            });

        return {
            open: function() {
                var containerHeight = plugin.$container.height();
                var containerWidth = plugin.$container.width();
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;

                // Force feed the initial value
                Velocity.animate(
                    $animators,
                    { translateX: ['-' + this.options.coverage, '0'] },
                    {
                        begin: function() {
                            plugin.$pikabu.show();

                            if (containerHeight < windowHeight) {
                                plugin.$container.height(windowHeight);
                            }

                            plugin.$container.width(windowWidth);
                        },
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: function() {
                            plugin.animation.openComplete.call(plugin);
                        }
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    $animators,
                    'reverse',
                    {
                        begin: function() {
                            plugin.animation.beginClose.call(plugin);
                        },
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: function() {
                            plugin.$pikabu.hide();

                            plugin.$container.css({
                                height: '',
                                width: ''
                            });

                            plugin.animation.closeComplete.call(plugin);
                        }
                    }
                );
            }
        };
    };
}));
