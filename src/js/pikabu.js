(function(factory) {
    if (typeof define === 'function' && define.amd) {
        /*
         In AMD environments, you will need to define an alias
         to your selector engine. i.e. either zepto or jQuery.
         */
        define([
            '$',
            'velocity',
            'plugin'
        ], factory);
    } else {
        /*
         Browser globals
         */
        var framework = window.Zepto || window.jQuery;
        factory(framework, framework.Velocity);
    }
}(function($, Velocity) {
    var cssClasses = {

    };

    var selectors = {

    };

    function Pikabu(element, options) {
        Pikabu._super.call(this, element, options, Pikabu.DEFAULTS);
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

    $.plugin('pikabu', Pikabu, {
        _init: function(element) {
            this.$pikabu = $(element);

            this._bindEvents();
        },

        _bindEvents: function() {

        }
    });

    $('[data-pikabu]').pikabu();

    return $;
}))
;
