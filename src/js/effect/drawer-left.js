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

        var $elements = [
            plugin.$container,
            plugin.$shade
        ];

        this.$pikabu
            .css({
                top: 0,
                bottom: 0,
                left: 0,
                right: coverage ? coverage : 'auto',
                width: coverage ? 'auto' : this.options.coverage,
                height: 'auto'
            });

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    plugin.$container,
                    { translateX: [this.options.coverage, '0'] },
                    {
                        begin: function() {
                            plugin.$pikabu.show();
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
                    plugin.$container,
                    'reverse',
                    {
                        begin: function() {
                            plugin.animation.beginClose.call(plugin);
                        },
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: function() {
                            plugin.$pikabu.hide();

                            plugin.animation.closeComplete.call(plugin);
                        }
                    }
                );
            }
        };
    };
}));
