(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        var framework = window.jQuery|| window.Zepto;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    return function() {
        var plugin = this;
        var coverage = this._coverage();
        var $animators = plugin.$animators;

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
                // Force feed the initial value
                Velocity.animate(
                    $animators,
                    { translateX: ['-' + this.options.coverage, '0'] },
                    {
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
                            plugin.animation.closeComplete.call(plugin);
                        }
                    }
                );
            }
        };
    };
}));
