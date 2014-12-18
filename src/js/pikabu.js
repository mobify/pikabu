(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'pikabu'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix, window.Velocity);
    }
}(function($, Plugin) {
    var classes = {
        PIKABU: 'pikabu',
        WRAPPER: 'pikabu__wrapper',
        CLOSE: 'pikabu__close',
        CONTENT: 'pikabu__content',
        OPENED: 'pikabu--is-open',
        SCROLLABLE: 'pikabu--is-scrollable'
    };

    function Pikabu(element, options) {
        Pikabu.__super__.call(this, element, options, Pikabu.DEFAULTS);
    }

    Pikabu.VERSION = '0';

    Pikabu.DEFAULTS = {
        effect: null,
        container: null,
        cssClass: '',
        coverage: '100%',
        duration: 200,
        easing: 'swing',
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('pikabu', Pikabu, {
        _init: function(element) {
            this.$pikabu = $(element).pikabu(this.options);
        },

        toggle: function() {
            this[this.$pikabu.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            this.$pikabu.pikabu('open');
        },

        close: function() {
            this.$pikabu.pikabu('close');
        }
    });

    $('[data-pikabu]').pikabu();

    return $;
}))
;
