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
                left: 0,
                right: coverage ? coverage : 'auto',
                width: coverage ? 'auto' : this.options.coverage,
                height: 'auto'
            });

        return {
            open: function() {
                var containerHeight = plugin.$container.height();
                var containerWidth = plugin.$container.width();
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;

                $('.pikabu__viewport').css({
                    '-webkit-perspective': '1500px',
                    'overflow': 'hidden'
                });

                // Force feed the initial value
                Velocity.animate(
                    $animators,
                    {
                        translateZ: ['-750px', '0'],
                        translateX: [this.options.coverage, '0'],
                        rotateY: ['-45deg', '0']
                    },
                    {
                        begin: function() {
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

                Velocity.animate(
                    plugin.$pikabu,
                    {
                        translateX: [0, '-100%']
                    },
                    {
                        easing: plugin.options.easing,
                        duration: plugin.options.duration,
                        display: 'block',
                        complete: function() {
                            plugin.$pikabu.css('z-index', plugin.options.zIndex + 10);
                        }
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
                            plugin.$container.css({
                                height: '',
                                width: ''
                            });

                            $('.pikabu__viewport').css({
                                '-webkit-perspective': '',
                                'overflow': ''
                            });

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
                        display: 'none',
                        complete: function() {
                            plugin.$pikabu.css('z-index', '');
                        }
                    }
                );
            }
        };
    };
}));
