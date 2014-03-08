var Mobify = window.Mobify = window.Mobify || {};
Mobify.$ = Mobify.$ || window.Zepto || window.jQuery;

;(function($) {

    var selectors = {
            viewport: '.m-pikabu-viewport',
            element: '.m-pikabu-container',
            common: '.m-pikabu-sidebar',
            left: '.m-pikabu-left',
            right: '.m-pikabu-right',
            overlay: '.m-pikabu-overlay',
            navToggles: '.m-pikabu-nav-toggle'
        },
        noop = function(){};


    // PIKABU CLASS DEFINITION
    // =========================

    var Pikabu = function(element, options) {
        this.init(element, options);

        return this;
    };

    Pikabu.DEFAULTS = {

        leftVisibleClass: 'm-pikabu-left-visible',
        rightVisibleClass: 'm-pikabu-right-visible',
        activePikabuStylesSelector: '#m-pikabu-styles',

        widths: {
            left: '80%',
            right: '80%'
        },

        // Transition speeds for open/close animation
        transitionSpeed: 0.2,
        scrollDuration: 200,

        'initialized': noop,
        'beforeOpened': noop,
        'afterOpened': noop,
        'beforeClosed': noop,
        'afterClosed': noop
    };

    Pikabu.prototype.init = function(element, options) {
        this.options = $.extend({}, Pikabu.DEFAULTS, options);

        this.$document = $('html').removeClass('no-js');
        this.$viewport = $(element).addClass('m-pikabu-viewport');
        this.$element = $(selectors.element);
        this.$sidebars = {
            left: $(selectors.left),
            right: $(selectors.right)
        };
        this.$navToggles = $(selectors.navToggles);

        // Create overlay if it doesn't exist
        if (!$(selectors.overlay).length) {
            this.$element
                .prepend('<div class="' + selectors.overlay.slice(1) + '">');
        }

        this.$overlay = $(selectors.overlay);

        // Get device characteristics
        this.device = Pikabu.prototype.device || deviceCharacteristics();
        this.markDeviceCharacteristics();
        // Add persistent styles for sidebars
        this.applyPersistentStyles();

        // Bind Pikabu events and event handlers
        this.bindHandlers();

        // Hide sidebars by default
        this.$sidebars.left.addClass('m-pikabu-hidden');
        this.$sidebars.right.addClass('m-pikabu-hidden');

        // Set initial width
        this.setViewportWidth();

        this._trigger('initialized');
    };

    Pikabu.prototype.bindHandlers = function() {

        var pikabu = this;

        // Shows sidebar on clicking/tapping nav toggles
        this.$navToggles.on('pikabu:click', function(e) {
            e.stopPropagation();
            pikabu.openSidebar($(this));
        });

        // Closes sidebar on clicking/tapping overlay
        this.$overlay.on('pikabu:click', function(e) {
            e.stopPropagation();
            pikabu.closeSidebars();
        });

        // Recalculate heights and width of viewport on size/orientation change
        $(window).on('pikabu:resize pikabu:orientationchange', function() {
            var windowHeight = $(window).height();
            // Only do something if a sidebar is active
            if (pikabu.activeSidebar) {
                // Set dimensions of elements
                pikabu.recalculateHeights();
                pikabu.setViewportWidth();
            } else {
                // If we are on a wide-screen where sidebars are always visible, fix sidebar height
                // to window height
                if (pikabu.$sidebars.left.is(':visible') || pikabu.$sidebars.right.is(':visible')) {
                    pikabu.$viewport.height(windowHeight);
                    pikabu.$sidebars.left.height(windowHeight);
                    pikabu.$sidebars.right.height(windowHeight);
                }
            }
        });
    };

    Pikabu.prototype.scrollTo = function(endY) {
        endY = endY || (this.device.isAndroid ? 1 : 0);

        var duration = this.options.scrollDuration,
            easing = function(pos) {
                return (-Math.cos(pos * Math.PI) / 2) + 0.5;
            },
            // enable smooth scrolling in Zepto
            interpolate = function(source, target, shift) {
                return (source + (target - source) * shift);
            },
            startY = window.pageYOffset,
            startT = Date.now || +new Date(),
            finishT = startT + duration;

        (function animate() {
            var now = Date.now || +new Date(),
                shift = (now > finishT) ? 1 : (now - startT) / duration;

            window.scrollTo(0, interpolate(startY, endY, easing(shift)));

            (now > finishT) || setTimeout(animate, 15);
        })();
    };

    Pikabu.prototype.markDeviceCharacteristics = function() {
        if (this.device.hasOverflowScrollingTouch) {
            this.$document.addClass('m-pikabu-overflow-scrolling');
        }
        if (this.device.isLegacyAndroid) {
            this.$document.addClass('m-pikabu-legacy-android');
        }
        if (this.device.supportsTransitions) {
            this.$document.addClass('m-pikabu-transitions');
        }
        if (this.device.has3d) {
            this.$document.addClass('m-pikabu-translate3d');
        }
    };

    Pikabu.prototype.applyPersistentStyles = function() {
        var bothSidebars = selectors.common + ', \n' +
            selectors.element;
        var leftSidebarSelector = '.' + this.leftVisibleClass + ' ' + selectors.left;
        var rightSidebarSelector = '.' + this.rightVisibleClass + ' ' + selectors.right;
        var styles = '<style>\n' +
            bothSidebars + ' {\n' +
            '-webkit-transition: -webkit-transform ' + this.options.transitionSpeed + 's ease-in;\n' +
            '-moz-transition: -moz-transform ' + this.options.transitionSpeed + 's ease-in;\n' +
            '-ms-transition: -ms-transform ' + this.options.transitionSpeed + 's ease-in;\n' +
            '-o-transition: -o-transform ' + this.options.transitionSpeed + 's ease-in;\n' +
            'transition: transform ' + this.options.transitionSpeed + 's ease-in;\n' +
            '}\n' +
            leftSidebarSelector + ' {\n' +
            '\twidth: ' + this.options.widths['left'] + ';\n' +
            '}\n' +
            rightSidebarSelector + ' {\n' +
            '\twidth: ' + this.options.widths['right'] + ';\n' +
            '}' +
            '</style>';

        // Add styles to document
        this.$document.find('head').append(styles);
    };

    Pikabu.prototype.applyTransformations = function(sidebar) {
        var width = this.options.widths[sidebar],
            transform = sidebar === 'left' ? width : '-' + width;

        var styles = '<style id="' + this.options.activePikabuStylesSelector.slice(1) + '">\n' +
            selectors['element'] + ' {\n' +
            '\t-webkit-transform: translate3d(' + transform + ', 0, 0);\n' +
            '\t-moz-transform: translate3d(' + transform + ', 0, 0);\n' +
            '\t-ms-transform: translate3d(' + transform + ', 0, 0);\n' +
            '\t-o-transform: translate3d(' + transform + ', 0, 0);\n' +
            '\ttransform: translate3d(' + transform + ', 0, 0);\n' +
            '}\n' +
            selectors[sidebar] + ' {\n' +
            '\t-webkit-transform: translate3d(0, 0, 0);\n' +
            '\t-moz-transform: translate3d(0, 0, 0);\n' +
            '\t-ms-transform: translate3d(0, 0, 0);\n' +
            '\t-o-transform: translate3d(0, 0, 0);\n' +
            '\ttransform: translate3d(0, 0, 0);\n' +
            '}' +
            '</style>';

        // Add styles to document
        this.$document.find('head').append(styles);
    };

    Pikabu.prototype.openSidebar = function($sidebar) {
        var role = $sidebar.attr('data-role');

        this._trigger('beforeOpened', {sidebar: $sidebar});

        // Store scroll offset for later use
        this.scrollOffset = window.pageYOffset;

        $sidebar.removeClass('m-pikabu-hidden');

        // Mark the chosen sidebar as being open
        this.activeSidebar = role;

        // Add support classes
        $sidebar.addClass('m-pikabu-overflow-touch');
        this.$document.addClass('m-pikabu-' + role + '-visible');

        // Set dimensions of elements
        this.recalculateHeights();
        this.setViewportWidth();

        this.applyTransformations(role);

        // Scroll to the top of the sidebar
        this.scrollTo(0);

        this._trigger('afterOpened', {sidebar: $sidebar});
    };

    Pikabu.prototype.resetSidebar = function($sidebar) {
        this._trigger('beforeClosed', {sidebar: $sidebar});

        $sidebar.removeClass('m-pikabu-overflow-touch');

        // <TODO> Check to make sure this works
        this.$viewport.css('height', '');
        this.$element.css('height', '');

        // add this arbitrary margin-bottom to force a reflow when we remove it
        this.$element.css('marginBottom', 1);

        // Not sure why but we need a scrollTo here to get the reflow to work
        this.scrollTo(0);

        // Remove the unnecessary margin-bottom to force reflow and properly recalculate the height of this container
        this.$element.css('marginBottom', '');

        this.$sidebars.left.addClass('m-pikabu-hidden');
        this.$sidebars.right.addClass('m-pikabu-hidden');

        // Mark both sidebars as closed
        this.activeSidebar = null;

        this._trigger('afterClosed', {sidebar: $sidebar});
    };

    Pikabu.prototype.closeSidebars = function() {

        var pikabu = this;

        // Add class to body to indicate currently open sidebars
        this.$document.removeClass(this.leftVisibleClass + ' ' + this.rightVisibleClass);

        // Reset viewport
        this.$viewport.css('width', 'auto');

        // Remove sidebar, container tranform styles
        $(this.activePikabuStylesSelector).remove();

        // Check to see if CSS transitions are supported
        if (this.device.transitionEvent && this.activeSidebar) {
            // 1. Removing overflow-scrolling-touch causes a content flash
            // 2. Removing height too soon causes panel with content to be
            // not full height during animation, so we do these after the sidebar has closed
            this.$element.one(this.device.transitionEvent, function(e) {
                pikabu.resetSidebar($(this));

                // Scroll back to where we were before we opened the sidebar
                pikabu.scrollTo(pikabu.scrollOffset);
            });
        } else {
            setTimeout(function() {
                pikabu.resetSidebar($(this));
                pikabu.scrollTo(pikabu.scrollOffset);
            }, 250);
        }
    };

    Pikabu.prototype.setViewportWidth = function() {

        var width = 'auto';

        // Android 2.3.3 is not getting the correct portrait width
        if (this.device.isLegacyAndroid && orientation == 0) {
            width = Math.max(this.device.height, this.device.width);
        }

        this.$viewport.css('width', width);
    };

    // Recalculate sidebar and viewport height on opening the sidebar
    Pikabu.prototype.recalculateHeights = function() {

        // We use outerHeight for newer Androids running Chrome, because Chrome sometimes
        // hides the address bar, changing the height.
        var windowHeight = this.device.isNewChrome ? window.outerHeight : $(window).height();

        var $sidebar = this.activeSidebar && this.$sidebars[this.activeSidebar];
        var sidebarHeight = $sidebar.removeAttr('style')[0].scrollHeight;
        var maxHeight = Math.max(windowHeight, sidebarHeight);

        if (this.device.hasOverflowScrollingTouch) {
            // Lock viewport for devices that have overflow-scrolling: touch, eg: iOS 5 devices
            $sidebar.height(windowHeight);

            this.$element.height(windowHeight);
            this.$viewport.height(windowHeight);
            this.$overlay.height(windowHeight);

        } else {
            // Set viewport to sidebar height or window height - whichever is greater, so that the
            // whole document scrolls revealing contents of the sidebar
            $sidebar.height(maxHeight);

            this.$viewport.height(maxHeight);
            this.$overlay.height(maxHeight);
            this.$element.height(maxHeight);
        }
    };

    Pikabu.prototype._trigger = function(eventName, data) {
        this.options[eventName].call(this, $.Event('pikabu:' + eventName, { bubbles: false }), data);
    };

    // PIKABU PLUGIN
    // =========================

    $.fn.pikabu = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('pikabu');

            if (!data) {
                $this.data('pikabu', (data = new Pikabu(this, option)));
            }
            if (typeof option == 'string') {
                data[option].call($this);
            }
        })
    };

    $.fn.pikabu.Constructor = Pikabu;

    // DEVICE CHARACTERISTICS
    // =========================

    function deviceCharacteristics() {

        // Do we have overflow scrolling?
        function hasOverflowScrollingTouch() {
            var prefixes = ['webkit', 'moz', 'o', 'ms'];
            var div = document.createElement('div');
            var body = document.getElementsByTagName('body')[0];
            var hasIt, i, l, prefix;

            body.appendChild(div);

            for (i = 0, l = prefixes.length; i < l; i++) {
                prefix = prefixes[i];
                div.style[prefix + 'OverflowScrolling'] = 'touch';
            }

            // And the non-prefixed property
            div.style.overflowScrolling = 'touch';

            // Now check the properties
            var computedStyle = window.getComputedStyle && window.getComputedStyle(div);
            if (!computedStyle) {
                computedStyle = div.currentStyle;
            }

            // First non-prefixed
            hasIt = !!computedStyle.overflowScrolling;

            // Now prefixed...
            for (i = 0, l = prefixes.length; i < l; i++) {
                prefix = prefixes[i];
                if (!!computedStyle[prefix + 'OverflowScrolling']) {
                    hasIt = true;
                    break;
                }
            }

            // Cleanup old div elements
            div.parentNode.removeChild(div);

            return hasIt;
        }

        // It's an Android
        function isAndroid() {
            var android = /Android\s+([\d\.]+)/.exec(window.navigator.userAgent);
            return !!(android && android.length);
        }

        // Detect older Androids
        function isLegacyAndroid() {
            var android = /Android\s+([\d\.]+)/.exec(window.navigator.userAgent);
            return !!(android && android.length && (parseInt(android[1]) < 3));
        }

        /* @url: http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr */
        function supportsTransitions() {
            var b = document.body || document.documentElement;
            var s = b.style;
            var p = 'transition';
            var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

            if (typeof s[p] == 'string') {
                return true;
            }

            // Tests for vendor specific prop
            p = p.charAt(0).toUpperCase() + p.substr(1);

            for (var i = 0; i < v.length; i++) {
                if (typeof s[v[i] + p] == 'string') {
                    return true;
                }
            }
            return false;
        }

        /* @url: http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support */
        function hasTranslate3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'OTransform': '-o-transform',
                    'msTransform': '-ms-transform',
                    'MozTransform': '-moz-transform',
                    'transform': 'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }

        // Determine which transition event to use
        function transitionEvent() {
            // http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers
            // hack for ios 3.1.* because of poor transition support.
            if (/iPhone\ OS\ 3_1/.test(navigator.userAgent)) {
                return undefined;
            }

            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionEnd transitionend',
                'OTransition': 'oTransitionEnd',
                'MSTransition': 'msTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

            for (var t in transitions) {
                if (transitions.hasOwnProperty(t) && el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }

        function isNewChrome() {
            var isChrome = navigator.userAgent.match(/Chrome\/([\d\.]+)\s/);
            return (isChrome && parseFloat(isChrome[1]) >= 29);
        }

        // Cache device characteristics
        return {
            hasOverflowScrollingTouch: hasOverflowScrollingTouch(),
            isAndroid: isAndroid(),
            isLegacyAndroid: isLegacyAndroid(),
            supportsTransitions: supportsTransitions(),
            has3d: hasTranslate3d(),
            transitionEvent: transitionEvent(),
            isNewChrome: isNewChrome(),
            // 81 is the missing height due to browser bars when recording the height in landscape
            height: window.innerHeight + 81,
            width: window.innerWidth
        };
    }
})(Mobify.$);
