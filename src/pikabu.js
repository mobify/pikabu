var Mobify = window.Mobify = window.Mobify || {};
Mobify.$ = Mobify.$ || window.Zepto || window.jQuery;

// Pikabu.js
(function($) {

    // Detect device characteristics
    function deviceCharacteristics() {

        // Do we have overflow scrolling?
        function hasOverflowScrollingTouch() {
            var prefixes = ['webkit', 'moz', 'o', 'ms'];
            var div = document.createElement('div');
            var body = document.getElementsByTagName('body')[0];
            var hasIt = false;

            body.appendChild(div);

            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
                div.style[prefix + 'OverflowScrolling'] = 'touch';
            }

            // And the non-prefixed property
            div.style.overflowScrolling = 'touch';

            // Now check the properties
            var computedStyle = window.getComputedStyle && window.getComputedStyle(div);
            if(!computedStyle) {
                computedStyle = div.currentStyle;
            }

            // First non-prefixed
            hasIt = !!computedStyle.overflowScrolling;

            // Now prefixed...
            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
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
            if(typeof s[p] == 'string') {return true; }

            // Tests for vendor specific prop
            v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for(var i=0; i<v.length; i++) {
              if(typeof s[v[i] + p] == 'string') { return true; }
            }
            return false;
        }

        /* @url: http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support */
        function has3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
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
        function transitionEvent(){
            // http://stackoverflow.com/questions/5023514/how-do-i-normalize-css3-transition-functions-across-browsers
            // hack for ios 3.1.* because of poor transition support.
            if (/iPhone\ OS\ 3_1/.test(navigator.userAgent)) {
                return undefined;
            }

            var el = document.createElement('fakeelement');
            var transitions = {
                'transition':'transitionEnd transitionend',
                'OTransition':'oTransitionEnd',
                'MSTransition':'msTransitionEnd',
                'MozTransition':'transitionend',
                'WebkitTransition':'webkitTransitionEnd'
            }

            var t;
            for(t in transitions){
                if( el.style[t] !== undefined ){
                    return transitions[t];
                }
            }
            return;
        }

        function isNewChrome(targetVersion) {
            var isChrome = navigator.userAgent.match(/Chrome\/([\d\.]+)\s/);
            var targetVersion = 29;
            
            return (isChrome && parseFloat(isChrome[1]) >= targetVersion);
        }

        // Cache device characteristics
        return {
            'hasOverflowScrollingTouch': hasOverflowScrollingTouch(),
            'isAndroid': isAndroid(),
            'isLegacyAndroid': isLegacyAndroid(),
            'supportsTransitions': supportsTransitions(),
            'has3d': has3d(),
            'transitionEvent': transitionEvent(),
            isNewChrome: isNewChrome(),
            // 81 is the missing height due to browser bars when recording the height in landscape
            height: window.innerHeight + 81,
            width: window.innerWidth
        };
    }

    // Pikabu class
    window.Pikabu = (function(options) {

        var self = $.extend(this, {
            $document: $('html'),
            leftVisibleClass: 'm-pikabu-left-visible',
            rightVisibleClass: 'm-pikabu-right-visible',
            activePikabuStylesSelector: '#m-pikabu-styles',

            // Overridable settings
            settings: {
                // Main Pikabu viewport
                viewportSelector: '.m-pikabu-viewport',
                // The sidebar content containers
                selectors: {
                    // The main content container
                    element: '.m-pikabu-container',
                    // Sidebars
                    common: '.m-pikabu-sidebar',
                    left: '.m-pikabu-left',
                    right: '.m-pikabu-right',
                    // Click-to-close overlay
                    overlay: '.m-pikabu-overlay',
                    // Controls that trigger the sidebar
                    navToggles: '.m-pikabu-nav-toggle'
                },

                widths: {
                    left: '80%',
                    right: '80%'
                },

                // Transition speeds for open/close animation
                transitionSpeed: 0.2,

                // Events we publish
                'onInit': function() {},
                'onOpened': function() {},
                'onClosed': function() {}
            }
        });

        // Create Pikabu
        self.init(options);

        return self;
    });

    // Animated scrollTo
    Pikabu.prototype.scrollTo = function(endY, duration, easingFunc) {

        // enable smooth scrolling in Zepto
        var interpolate = function (source, target, shift) {
            return (source + (target - source) * shift);
        };

        var easing = function (pos) {
            return (-Math.cos(pos * Math.PI) / 2) + .5;
        };

        var endY = endY || (this.device.isAndroid ? 1 : 0);
        var duration = duration || 200;
        (typeof easingFunc === 'function') && (easing = easingFunc);

        // IE < 9 doesn't have Date.now()
        Date.now = Date.now || function() { return +new Date; };
        var startY = window.pageYOffset,
            startT = Date.now(),
            finishT = startT + duration;

        var animate = function() {
            var now = +(new Date()),
                shift = (now > finishT) ? 1 : (now - startT) / duration;

            window.scrollTo(0, interpolate(startY, endY, easing(shift)));

            (now > finishT) || setTimeout(animate, 15);
        };

        animate();
    }

    // Let the magic begin
    Pikabu.prototype.init = function (options) {

        var styles;
        var settings = this.settings;

        // Remove body no-js, in case it exists
        $('html').removeClass('no-js');

        // Get device characteristics
        this.device = Pikabu.prototype.device || deviceCharacteristics();
        this.markDeviceCharacteristics();

        // Set any custom options
        $.extend(true, settings, options);

        // Set up elements
        this.$viewport = $(this.settings.viewportSelector);
        this.$element = $(settings.selectors['element']);
        this.$sidebars = {
            left: $(settings.selectors['left']),
            right: $(settings.selectors['right'])
        };

        this.$navToggles = $(settings.selectors['navToggles']);

        // Create overlay if it doesn't exist
        if(!$(settings.selectors['overlay']).length) {
            this.$element
                .prepend('<div class="' + settings.selectors['overlay'].slice(1) + '">');
        }

        this.$overlay = $(settings.selectors['overlay']);

        // Add persistent styles for sidebars
        this.applyPersistentStyles();

        // Bind Pikabu events and event handlers
        this.bindHandlers();
        this.bindEvents();

        // Hide sidebars by default
        this.$sidebars['left'].addClass('m-pikabu-hidden');
        this.$sidebars['right'].addClass('m-pikabu-hidden');

        // Assign it back to the instance
        this.settings = settings;

        // Set initial width
        this.setViewportWidth();

        this.$element.trigger('pikabu:initialized');
    };

    // Bind Pikabu events
    Pikabu.prototype.bindEvents = function() {
        this.$element.on('pikabu:initialized', this.settings.onInit);
        this.$element.on('pikabu:opened', this.settings.onOpened);
        this.$element.on('pikabu:closed', this.settings.onClosed);
    };

    // Bind nav toggles and overlay handlers
    Pikabu.prototype.bindHandlers = function() {

        var _this = this;

        // Shows sidebar on clicking/tapping nav toggles
        this.$navToggles.on('click', function(e) {
            e.stopPropagation();
            _this.openSidebar($(this).attr('data-role'));
        });

        // Closes sidebar on clicking/tapping overlay
        this.$overlay.on('click', function(e) {
            e.stopPropagation();
            _this.closeSidebars();
        });

        // Recalculate heights and width of viewport on size/orientation change
        $(window).on('resize orientationchange', function() {
            var windowHeight = $(window).height();
            // Only do something if a sidebar is active
            if(_this.activeSidebar) {
                // Set dimensions of elements
                _this.setHeights();
                _this.setViewportWidth();
            } else {
                // If we are on a wide-screen where sidebars are always visible, fix sidebar height 
                // to window height
                if(_this.$sidebars['left'].is(':visible') || _this.$sidebars['right'].is(':visible')) {
                    _this.$viewport.height(windowHeight);
                    _this.$sidebars['left'].height(windowHeight);
                    _this.$sidebars['right'].height(windowHeight);
                }
            }
        });
    }

    // Set classes to identify features
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
    }

    // Styles that aren't deleted when the sidebars are closed
    Pikabu.prototype.applyPersistentStyles = function() {
        var bothSidebars = this.settings.selectors['common'] + ', \n' + 
            this.settings.selectors['element'];
        var leftSidebarSelector = '.' + this.leftVisibleClass + ' ' + this.settings.selectors['left'];
        var rightSidebarSelector = '.' + this.rightVisibleClass + ' ' + this.settings.selectors['right'];
        var styles = '<style>\n' + 
                bothSidebars + ' {\n' + 
                    '-webkit-transition: -webkit-transform ' + this.settings.transitionSpeed + 's ease-in;\n' + 
                    '-moz-transition: -moz-transform '+ this.settings.transitionSpeed + 's ease-in;\n' + 
                    '-ms-transition: -ms-transform ' + this.settings.transitionSpeed + 's ease-in;\n' + 
                    '-o-transition: -o-transform ' + this.settings.transitionSpeed +'s ease-in;\n' +
                    'transition: transform ' + this.settings.transitionSpeed +'s ease-in;\n' +
                '}\n' + 
                leftSidebarSelector + ' {\n' +
                    '\twidth: ' + this.settings.widths['left'] + ';\n' +
                '}\n' + 
                rightSidebarSelector + ' {\n' + 
                    '\twidth: ' + this.settings.widths['right'] + ';\n' +
                    '}' +
                '</style>';

        // Add styles to document
        this.$document.find('head').append(styles);
    }

    // Styles applied when sidebars are opened
    Pikabu.prototype.applyTransformations = function(sidebar) {
        
        var width;
        var transform;

        width = this.settings.widths[sidebar];

        // Transform to the left or the right
        transform = sidebar === 'left' ? width : '-' + width;

        var styles = '<style id="' + this.activePikabuStylesSelector.slice(1) + '">\n' + 
                        this.settings.selectors['element'] + ' {\n' + 
                            '\t-webkit-transform: translate3d(' + transform + ', 0, 0);\n' + 
                            '\t-moz-transform: translate3d(' + transform + ', 0, 0);\n' + 
                            '\t-ms-transform: translate3d(' + transform + ', 0, 0);\n' + 
                            '\t-o-transform: translate3d(' + transform + ', 0, 0);\n' +
                            '\ttransform: translate3d(' + transform + ', 0, 0);\n' + 
                        '}\n' +
                        this.settings.selectors[sidebar] + ' {\n' + 
                        '\t-webkit-transform: translate3d(0, 0, 0);\n' + 
                        '\t-moz-transform: translate3d(0, 0, 0);\n' + 
                        '\t-ms-transform: translate3d(0, 0, 0);\n' + 
                        '\t-o-transform: translate3d(0, 0, 0);\n' + 
                        '\ttransform: translate3d(0, 0, 0);\n' + 
                        '}' +
                    '</style>';

        // Add styles to document
        this.$document.find('head').append(styles);
    }

    // Open sidebar
    Pikabu.prototype.openSidebar = function(target) {

        // Store scroll offset for later use
        this.scrollOffset = window.pageYOffset;

        this.$sidebars[target].removeClass('m-pikabu-hidden');

        // Mark the chosen sidebar as being open
        this.activeSidebar = target;

        // Add support classes
        this.$sidebars[target].addClass('m-pikabu-overflow-touch');
        this.$document.addClass('m-pikabu-' + target + '-visible');

        // Set dimensions of elements
        this.setHeights();
        this.setViewportWidth();

        this.applyTransformations(target);

        // Scroll to the top of the sidebar
        this.scrollTo(0);

        this.$element.trigger('pikabu:opened');
    };

    // Reset sidebar classes on closing
    Pikabu.prototype.resetSidebar = function($sidebar) {
        
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

        this.$sidebars['left'].addClass('m-pikabu-hidden');
        this.$sidebars['right'].addClass('m-pikabu-hidden');

        // Mark both sidebars as closed
        this.activeSidebar = null;

        this.$element.trigger('pikabu:closed');
    }

    // Close sidebars
    Pikabu.prototype.closeSidebars = function() {

        var _this = this;

        // Add class to body to indicate currently open sidebars
        this.$document
            .removeClass(this.leftVisibleClass + ' ' + this.rightVisibleClass);
        
        // Reset viewport
        this.$viewport.css('width', 'auto');

        // Remove sidebar, container tranform styles
        $(this.activePikabuStylesSelector).remove();

        // Check to see if CSS transitions are supported
        if(this.device.transitionEvent && this.activeSidebar) {
            // 1. Removing overflow-scrolling-touch causes a content flash
            // 2. Removing height too soon causes panel with content to be 
            // not full height during animation, so we do these after the sidebar has closed
            this.$element.one(this.device.transitionEvent, function(e) {
                _this.resetSidebar($(this));

                // Scroll back to where we were before we opened the sidebar
                _this.scrollTo(_this.scrollOffset);
            });
        } else {
            setTimeout(function() {
                _this.resetSidebar($(this));
                _this.scrollTo(_this.scrollOffset);
            }, 250);
        }
    };

    // Set width of viewport
    Pikabu.prototype.setViewportWidth = function() {

        var width = 'auto';

        // Android 2.3.3 is not getting the correct portrait width
        if(this.device.isLegacyAndroid && orientation == 0) {
            width = Math.max(this.device.height, this.device.width);
        }

        this.$viewport.css('width', width);
    }

    // Recalculate sidebar and viewport height on opening the sidebar
    Pikabu.prototype.setHeights = function() {

        // We use outerHeight for newer Androids running Chrome, because Chrome sometimes 
        // hides the address bar, changing the height. 
        var windowHeight = this.device.isNewChrome ? window.outerHeight : $(window).height();

        var $sidebar = this.activeSidebar && this.$sidebars[this.activeSidebar];
        var sidebarHeight = $sidebar.removeAttr('style')[0].scrollHeight;
        var maxHeight = Math.max(windowHeight, sidebarHeight);

        if(this.device.hasOverflowScrollingTouch) {
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

})(Mobify.$);
