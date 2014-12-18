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
        var $window = $(window);
        var coverage = this._coverage(2);

        this.$pikabu
            .css({
                width: coverage ? 'auto' : this.options.coverage,
                height: coverage ? 'auto' : this.options.coverage
            });

        return {
            open: function() {
                var size = {};
                var getDimension = function(dimension) {
                    if (!size[dimension]) {
                        size[dimension] = $window[dimension]() - plugin.$pikabu[dimension]() / 2;
                    }
                    return size[dimension];
                };
                var height = getDimension('height');
                var width = getDimension('width');

                plugin.$pikabu
                    .css({
                        top: coverage ? coverage : height,
                        bottom: coverage ? coverage : height,
                        right: coverage ? coverage : width,
                        left: coverage ? coverage : width
                    });

                Velocity.animate(
                    plugin.$pikabu,
                    {
                        scale: [1, 2],
                        opacity: [1, 0]
                    },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: plugin.animation.openComplete.bind(plugin)
                    }
                );
            },
            close: function() {
                Velocity.animate(
                    plugin.$pikabu,
                    {
                        scale: 0.5,
                        opacity: 0
                    },
                    {
                        begin: plugin.animation.beginClose.bind(plugin),
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'none',
                        complete: plugin.animation.closeComplete.bind(plugin)
                    }
                );
            }
        };
    };
}));
