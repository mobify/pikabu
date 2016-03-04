(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        window.Plugin = factory(framework);
    }
}(function($) {
    function Plugin(element, options, defaultOptions) {
        this.options = $.extend(true, {}, defaultOptions, options);

        if (typeof this._init !== 'function') {
            throw this.name + ' needs an _init method';
        }

        this._init(element);
    }

    Plugin.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(this.name + ':' + eventName, {bubbles: false}), data);
    };

    Plugin.create = function(name, SubConstructor, prototype) {
        SubConstructor.__super__ = Plugin;
        for (var key in Plugin.prototype) {
            if (!SubConstructor.prototype[key]) {
                SubConstructor.prototype[key] = Plugin.prototype[key];
            }
        }
        SubConstructor.prototype = $.extend(true, SubConstructor.prototype, prototype);
        SubConstructor.prototype.constructor = SubConstructor;
        SubConstructor.prototype.name = name;

        $.fn[name] = function(option) {
            var args = Array.prototype.slice.call(arguments);
            var isMethodCall = typeof option === 'string';
            var isSingleElement = this.length === 1;
            var returnValue = this;

            if (isMethodCall) {
                this.each(function() {
                    var $this = $(this);
                    var plugin = $this.data(name);

                    // We don't allow method calls on plugins that aren't initialized
                    if (!plugin) {
                        throw new Error('cannot call methods on "' + name + '" prior to initialization; attempted to call method "' + option + '"');
                    }

                    // Skip private and non-existent methods
                    if (option.charAt(0) === '_' || typeof plugin[option] !== 'function') {
                        throw new Error('no such method "' + option + '" for "' + name + '"');
                    }

                    var result = plugin[option].apply(plugin, args.length > 1 ? args.slice(1) : null);

                    if (isSingleElement) {
                        returnValue = result;
                    }
                });
            } else {
                returnValue = this.each(function() {
                    var $this = $(this);
                    var plugin = $this.data(name);

                    // If plugin isn't initialized, we lazy-load initialize it.
                    // If it's already initialized, we can safely ignore the call.
                    !plugin && $this.data(name, (plugin = new SubConstructor(this, option)));
                });
            }

            return returnValue;
        };

        $.fn[name].Constructor = SubConstructor;
    };

    $.extend($, {
        noop: function() {},
        uniqueId: function() {
            return +new Date();
        }
    });

    return Plugin;
}));
