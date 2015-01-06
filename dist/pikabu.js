(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'bouncefix',
            'velocity',
            'lockup',
            'shade',
            'deckard'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, window.bouncefix);
    }
}(function($, Plugin, bouncefix, Velocity) {
    var EFFECT_REQUIRED = 'Pikabu requires a declared effect to operate. For more information read: https://github.com/mobify/pikabu#initializing-the-plugin';
    var FOCUSABLE_ELEMENTS = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';
    var FOCUSABLE_INPUT_ELEMENTS = 'input, select, textarea';

    /**
     * Function.prototype.bind polyfill required for < iOS6
     */
    /* jshint ignore:start */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(scope) {
            var fn = this;
            return function() {
                return fn.apply(scope);
            };
        };
    }
    /* jshint ignore:end */

    var iOS7orBelow = $.os.ios && $.os.major <= 7;

    var classes = {
        PIKABU: 'pikabu',
        CONTAINER: 'pikabu__container',
        VIEWPORT: 'pikabu__viewport',
        HEADER: 'pikabu__header',
        WRAPPER: 'pikabu__wrapper',
        SPACER: 'pikabu__spacer',
        TITLE: 'pikabu__title',
        CLOSE: 'pikabu__close',
        CONTENT: 'pikabu__content',
        OPENED: 'pikabu--is-open',
        SCROLLABLE: 'pikabu--is-scrollable'
    };

    /**
     * Template constants required for building the default HTML structure
     */
    var template = {
        COMPONENT: '<{0} class="' + classes.PIKABU + '__{0}">{1}</{0}>',
        HEADER: '<h1 class="' + classes.TITLE + '">{0}</h1><button class="' + classes.CLOSE + '">Close</button>',
        FOOTER: '{0}'
    };

    var events = {
        click: 'click.pikabu',
        focus: 'focus.pikabu',
        blur: 'blur.pikabu'
    };

    function Pikabu(element, options) {
        Pikabu.__super__.call(this, element, options, Pikabu.DEFAULTS);
    }

    Pikabu.VERSION = '2.0.0';

    Pikabu.DEFAULTS = {
        effect: null,
        container: $('.' + classes.CONTAINER),
        appendTo: $('.' + classes.VIEWPORT),
        structure: {
            header: '',
            footer: false
        },
        zIndex: 0,
        cssClass: '',
        coverage: '100%',
        easing: 'swing',
        duration: 200,
        shade: {},
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop,
        scrollDuration: 50,
        spacerHeight: 300
    };

    Plugin.create('pikabu', Pikabu, {
        /**
         * Common animation callbacks used in the effect objects
         */
        animation: {
            beginClose: function() {

            },
            openComplete: function() {
                this._trigger('opened');

                this._focus();
            },
            closeComplete: function() {
                this._trigger('closed');

                this._resetFocus();

                this.$pikabu.lockup('unlock');
            }
        },

        _init: function(element) {
            this.id = 'pikabu-' + $.uniqueId();

            this.$element = $(element);
            this.$doc = $(document);
            this.$body = $('body');

            this._build();

            if (!this.options.effect) {
                throw EFFECT_REQUIRED;
            }

            this.effect = this.options.effect.call(this);

            this.$element.removeAttr('hidden');

            this._bindEvents();
        },

        toggle: function() {
            this[this.$pikabu.hasClass(classes.OPENED) ? 'close' : 'open']();
        },

        open: function() {
            if (this._isOpen()) {
                return;
            }

            this._trigger('open');

            bouncefix.add(classes.SCROLLABLE);

            this.effect.open.call(this);

            this.$pikabu.addClass(classes.OPENED);

            this.$pikabu.lockup('lock');
        },

        close: function() {
            var plugin = this;

            if (!this._isOpen()) {
                return;
            }

            this._trigger('close');

            bouncefix.remove(classes.SCROLLABLE);

            this.$pikabu.removeClass(classes.OPENED);

            this.options.shade && this.$shade.shade('close');

            this.effect.close.call(this);
        },

        _isOpen: function() {
            return this.$pikabu.hasClass(classes.OPENED);
        },

        _bindEvents: function() {
            // Block scrolling on anything but pikabu content
            this.$pikabu.on('touchmove', function(e) {
                if (!$(e.target).parents().hasClass(classes.CONTENT)) {
                    e.preventDefault();
                }
            });
        },

        /**
         Builds Pikabu using the following structure:

         <section class="pikabu">
             <div class="pikabu__wrapper">
                 <header class="pikabu__header">{header content}</header>
                 <div class="pikabu__content">
                 {content}
                 </div>
                 <footer class="pikabu__footer">{footer content}</footer>
             </div>
         </section>
         */
        _build: function() {
            var plugin = this;

            this.$pikabu = $('<section />')
                .addClass(classes.PIKABU)
                .addClass(this.options.cssClass)
                .css({
                    position: 'fixed',
                    zIndex: this.options.zIndex,
                    width: this.options.coverage,
                    height: this.options.coverage
                })
                .on(events.click, '.' + classes.CLOSE, function(e) {
                    e.preventDefault();
                    plugin.close();
                })
                .lockup({
                    container: this.options.container,
                    locked: function () {
                        plugin._handleKeyboardShown();

                        if (plugin.options.shade) {
                            var $shade = plugin.$shade.data('shade').$shade;
                            var scrollValue = plugin.$container.scrollTop();

                            plugin.$shade.shade('open');

                            $shade.css({
                                'top': scrollValue,
                                'bottom': -scrollValue
                            });
                        }
                    },
                    unlocked: function () {
                        plugin._handleKeyboardHidden();
                    }
                });

            this.$container = this.$pikabu.data('lockup').$container.addClass(classes.CONTAINER);

            this.$pikabu.appendTo(this.options.appendTo ? $(this.options.appendTo) : this.$container);

            if (this.options.structure) {
                var $wrapper = $('<div />')
                    .addClass(classes.WRAPPER)
                    .appendTo(this.$pikabu);

                this._buildComponent('header').appendTo($wrapper);

                $('<div />')
                    .addClass(classes.CONTENT)
                    .addClass(classes.SCROLLABLE)
                    .append(this.$element)
                    .append(this.$spacer)
                    .appendTo($wrapper);

                this._buildComponent('footer').appendTo($wrapper);
            } else {
                this.$element.appendTo(this.$pikabu);
            }

            this.$header = this.$pikabu.find('.' + classes.HEADER);
            this.$content = this.$pikabu.find('.' + classes.CONTENT);

            this.$spacer = $('<div />')
                .addClass(classes.SPACER)
                .height(this.options.spacerHeight)
                .attr('hidden', 'hidden')
                .appendTo(this.$content);

            this._addAccessibility();

            if (this.options.shade) {
                this.$shade = this.$container.shade($.extend(true, {}, {
                    zIndex: 2,
                    append: 'appendTo',
                    click: function() {
                        plugin.close();
                    }
                }, $.extend(
                    this.options.shade,
                    {
                        duration: this.options.duration
                    }
                )));
            }
        },

        _buildComponent: function(name) {
            var component = this.options.structure[name];
            var $element = $([]);

            if (component !== false) {
                var html = this._isHtml(component) ? component : template[name.toUpperCase()].replace('{0}', component);

                $element = $(template.COMPONENT.replace(/\{0\}/g, name).replace(/\{1\}/g, html));
            }

            return $element;
        },

        _isHtml: function(input) {
            return /<[a-z][\s\S]*>/i.test(input);
        },

        /**
         * Takes the coverage option and turns it into a effect value
         */
        _coverage: function(divisor) {
            var coverage;
            var percent = this.options.coverage.match(/(\d*)%$/);

            if (percent) {
                coverage = 100 - parseInt(percent[1]);

                if (divisor) {
                    coverage = coverage / divisor;
                }
            }

            return percent ? coverage + '%' : this.options.coverage;
        },

        /**
         * Accessibility Considerations
         */
        _addAccessibility: function() {
            var headerID = this.id + '__header';
            var $header = this.$pikabu.find('h1, .' + classes.TITLE).first();
            var $wrapper = this.$pikabu.find('.' + classes.WRAPPER);

            this.$container
                .attr('aria-hidden', 'false');

            this.$pikabu
                .attr('role', 'dialog')
                .attr('aria-labelledby', headerID)
                .attr('aria-hidden', 'true')
                .attr('tabindex', '-1');

            $wrapper
                .attr('role', 'document');

            $header
                .attr('id', headerID);
        },

        _focus: function() {
            this.originalActiveElement = document.activeElement;

            this._disableInputs();

            this.$pikabu.attr('aria-hidden', 'false');

            this.$pikabu.children().first().focus();

            this.$container.attr('aria-hidden', 'true');
        },

        _resetFocus: function() {
            this._enableInputs();

            this.$container.attr('aria-hidden', 'false');

            this.$pikabu.attr('aria-hidden', 'true');

            this.originalActiveElement.focus();
        },

        /**
         * Traps any tabbing within the visible Pikabu window
         * by disabling tabbing into all inputs outside of
         * pikabu using a negative tabindex.
         */
        _disableInputs: function() {
            var $focusableElements = $(FOCUSABLE_ELEMENTS).not(function() {
                return $(this).closest('.pikabu').length;
            });

            $focusableElements.each(function(_, el) {
                var $el = $(el);
                var currentTabIndex = $el.attr('tabindex') || 0;

                $el
                    .data('tabindex', currentTabIndex)
                    .attr('tabindex', '-1');
            });
        },

        /**
         * Reverses the above!!
         */
        _enableInputs: function() {
            var $disabledInputs = $('[data-pikabu-tabindex]');

            $disabledInputs.each(function(_, el) {
                var $el = $(el);
                var oldTabIndex = $el.data('tabindex');

                if (oldTabIndex) {
                    $el.attr('tabindex', oldTabIndex);
                } else {
                    $el.removeAttr('tabindex');
                }

                $el.removeData('tabindex');
            });
        },

        /**
         * In iOS7 or below, when elements are focussed inside pikabu
         * the keyboard obscures the input. We need to scroll back to
         * the element to keep it in view.
         */
        _handleKeyboardShown: function() {
            if (iOS7orBelow) {
                this.$pikabu.find(FOCUSABLE_INPUT_ELEMENTS)
                    .on(events.focus, this._inputFocus.bind(this))
                    .on(events.blur, this._inputBlur.bind(this));
            }
        },

        _handleKeyboardHidden: function() {
            if (iOS7orBelow) {
                this.$pikabu.find(FOCUSABLE_INPUT_ELEMENTS)
                    .off(events.focus)
                    .off(events.blur);
            }
        },

        /**
         * In iOS7 or below, when inputs are focussed inside pikabu, we show a
         * spacer element at the bottom of pikabu content so that it creates space
         * in the viewport to facilitate scrolling back to the element.
         */
        _inputFocus: function () {
            this.$spacer.removeAttr('hidden');

            Velocity.animate(this._scrollTarget(), 'scroll', {
                container: this.$content[0],
                offset: -1 * (this.$header.height() + parseInt(this.$content.css('padding-top'))),
                duration: this.options.scrollDuration
            });
        },

        _inputBlur: function () {
            !this._activeElement().is(FOCUSABLE_INPUT_ELEMENTS) && this.$spacer.attr('hidden', '');
        },

        _activeElement: function () {
            return $(document.activeElement);
        },

        /**
         * Returns the closest parent element that doesn't have relative positioning
         * (within the pikabu__content container). Relative positioning messes with
         * Velocity's scroll, which prevents us from correctly scrolling back to active
         * inputs in pikabu__content.
         */
        _scrollTarget: function () {
            var $scrollTarget = this._activeElement();
            var $activeElementParent = $scrollTarget.parent();

            while ($activeElementParent.css('position') === 'relative' && !$activeElementParent.hasClass(classes.CONTENT)) {
                $scrollTarget = $activeElementParent;
                $activeElementParent = $scrollTarget.parent();
            }

            return $scrollTarget;
        }
    });

    $('[data-pikabu]').each(function() {
        var $pikabu = $(this);
        var effect = $(this).data('pikabu');

        if (!effect.length) {
            throw EFFECT_REQUIRED;
        }

        $pikabu.pikabu({
            effect: effect
        });
    });

    return $;
}));
