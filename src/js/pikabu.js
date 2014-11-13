(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'bouncefix',
            'velocity',
            'lockup',
            'shade'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix, window.Velocity);
    }
}(function($, Plugin, bouncefix, Velocity) {
    var classes = {
        PINNY: 'pinny',
        WRAPPER: 'pinny__wrapper',
        TITLE: 'pinny__title',
        CLOSE: 'pinny__close',
        CONTENT: 'pinny__content',
        OPENED: 'pinny--is-open',
        SCROLLABLE: 'pinny--is-scrollable'
    };

    var selectors = {

    };

    function Pikabu(element, options) {
        Pikabu.__super__.call(this, element, options, Pikabu.DEFAULTS);
    }

    Pikabu.VERSION = '0';

    Pikabu.DEFAULTS = {
        duration: 200,
        easing: 'swing',
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('pikabu', Pikabu, {
        _init: function(element) {
            this.$pikabu = $('<div class="pikabu"></div>').append($(element));

            this._bindEvents();
        },

        _bindEvents: function() {

        }
    });

    $('[data-pikabu]').pikabu();

    return $;
}))
;
