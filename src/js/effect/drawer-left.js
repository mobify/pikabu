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
                    { translateX: ['100%', '0'] },
                    {
                        begin: function() {
                            plugin.$pikabu.show();
                        },
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: plugin.animation.openComplete.bind(this)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$container,
                    'reverse',
                    {
                        begin: plugin.animation.beginClose.bind(this),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        complete: plugin.animation.closeComplete.bind(this)
                    }
                );
            }
        };
    };
}));
