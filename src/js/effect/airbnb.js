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
        var $animators = plugin.$animators;

        this.$pikabu
            .css({
                top: 0,
                bottom: 0,
                left: 0,
                right: coverage ? coverage : 'auto',
                width: coverage ? 'auto' : plugin.options.coverage,
                height: 'auto'
            });

        Velocity.hook(this.$pikabu, 'translateX', '-100%');
        Velocity.hook(this.$pikabu, 'translateZ', '0');

        return {
            open: function() {
                // Force feed the initial value
                Velocity.animate(
                    $animators,
                    {
                        translateZ: ['-750px', '0'],
                        translateX: [plugin.options.coverage, '0'],
                        rotateY: ['-45deg', '0']
                    },
                    {
                        begin: function() {
                            Velocity.hook(plugin.$viewport, 'perspective', '1500px');
                        },
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
                        translateX: [0, '-100%'],
                        translateZ: [0, 0]
                    },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        delay: 100
                    }
                );
            },
            close: function() {

                Velocity.animate(
                    $animators,
                    {
                        translateZ: 0,
                        translateX: 0,
                        rotateY: 0
                    },
                    {
                        begin: function() {
                            plugin.animation.beginClose.call(plugin);
                        },
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: function() {
                            Velocity.hook(plugin.$viewport, 'perspective', '');
                            plugin.animation.closeComplete.call(plugin);
                        }
                    }
                );

                Velocity.animate(
                    plugin.$pikabu,
                    {
                        translateX: ['-100%']
                    },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none'
                    }
                );
            }
        };
    };
}));
