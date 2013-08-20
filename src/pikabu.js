// Pikabu.js
(function($) {

    // Detect device characteristics
    function deviceCharacteristics() {

        // Do we have overflow scrolling?
        function hasOverflowScrolling() {
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
            var computedStyle = window.getComputedStyle(div);

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

        // Detect older Androids
        function isLegacyAndroid() {
            var android = /Android\s+([\d\.]+)/.exec(window.navigator.userAgent);

            if (android && android.length > 0 && (parseInt(android[1]) < 3)) {
                // we are on Android 2.x
                return true;
            }

            return false;
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

        // Cache device characteristics
        return {
            'hasOverflowScrolling': hasOverflowScrolling(),
            'isLegacyAndroid': isLegacyAndroid(),
            'supportsTransitions': supportsTransitions(),
            'has3d': has3d(),
            'transitionEvent': transitionEvent(),
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
            activePikabuStyles: 'm-pikabu-styles',

            // Overridable settings
            settings: {
                // Main Pikabu viewport
                viewportSelector: '.m-pikabu-viewport',
                // The sidebar content containers
                selectors: {
                    // The main content container
                    element: '.m-pikabu-container',
                    // Sidebars
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
        this.$viewport = $(this.viewportSelector);
        this.$element = $(settings.selectors['element']);
        this.$sidebars = {
            left: $(settings.selectors['left']),
            right: $(settings.selectors['right'])
        };

        this.$navToggles = $(settings.selectors['navToggles']);

        this.$children = this.$viewport.children();

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
    }

    // Set classes to identify features
    Pikabu.prototype.markDeviceCharacteristics = function() {
        if (this.device.hasOverflowScrolling) {
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
        var leftSidebarSelector = '.' + this.leftVisibleClass + ' ' + this.settings.selectors['left'];
        var rightSidebarSelector = '.' + this.rightVisibleClass + ' ' + this.settings.selectors['right'];
        var styles = '<style>\n' + 
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

    // Styles applied when Pikabu is activated
    Pikabu.prototype.applyTransformations = function(sidebar) {
        
        var width;
        var transform;

        width = this.settings.widths[sidebar];

        // Transform to the left or the right
        transform = sidebar === 'left' ? width : '-' + width;

        var styles = '<style id="' + this.activePikabuStyles + '">\n' + 
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
        window.scrollTo(0, 0);

        this.$element.trigger('pikabu:opened');
    };

    // Reset sidebar classes on closing
    Pikabu.prototype.resetSidebar = function($sidebar) {
        
        $sidebar.removeClass('m-pikabu-overflow-touch');
        this.$children.css('height', '');

        // <TODO> Check to make sure this works
        this.$viewport.css('height', '');
        this.$element.css('height', '');

        // add this arbitrary margin-bottom to force a reflow when we remove it
        this.$element.css('marginBottom', 1);

        // Not sure why but we need a scrollTo here to get the reflow to work
        window.scrollTo(0, 0);

        // Remove the unnecessary margin-bottom to force reflow and properly recalculate the height of this container
        this.$element.css('marginBottom', '');

        this.$sidebars['left'].addClass('m-pikabu-hidden');

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
        $('#' + this.activePikabuStyles).remove();

        // 1. Removing overflow-scrolling-touch causes a content flash
        // 2. Removing height too soon causes panel with content to be 
        // not full height during animation, so we do these after the sidebar has closed
        this.$element.one(this.device.transitionEvent, function(e) {
            _this.resetSidebar($(this));

            // Scroll back to where we were before we opened the sidebar
            window.scrollTo(0, _this.scrollOffset);
        });
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

        var windowHeight = $(window).height();
        var sidebarHeight = this.$sidebars[this.activeSidebar][0].scrollHeight;
        var contentHeight = this.$element[0].scrollHeight;
        var maxHeight = Math.max(windowHeight, contentHeight);

        if(this.device.hasOverflowScrolling) {
            // Lock viewport for devices that have overflow-scrolling: touch, eg: iOS 5 devices
            this.$children.height(windowHeight);
            this.$viewport.height(windowHeight);
        } else {
            // Set viewport to tallest element height
            this.$viewport.height(maxHeight);
            this.$overlay.height(maxHeight);
            this.$element.height(maxHeight);
        }
    };

})($);