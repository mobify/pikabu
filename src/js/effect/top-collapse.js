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
                left: 0,
                right: 0,
                bottom: coverage ? coverage : 'auto',
                height: coverage ? 'auto' : this.options.coverage,
                width: 'auto'
            });

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    $animators,
                    { translateY: [this.options.coverage, '0'] },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: function() {
                            plugin.animation.openComplete.call(plugin);
                        }
                    }
                );

                Velocity.animate(
                    plugin.$pikabu,
                    {
                        translateY: [0, '-20%']
                    },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    $animators.add(plugin.$pikabu),
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
