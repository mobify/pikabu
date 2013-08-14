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
            pikabuStylesId: 'm-pikabu-styles',
            viewportSelector: '.m-pikabu-viewport',

            // Overridable settings
            settings: {

                // The main content container
                elementSelector: '.m-pikabu-container',

                // The sidebar content containers
                leftSidebarSelector: '.m-pikabu-left',
                rightSidebarSelector: '.m-pikabu-right',

                // Click-to-close overlay
                overlaySelector: '.m-pikabu-overlay',

                // Controls that trigger the sidebar
                navTogglesSelector: '.m-pikabu-nav-toggle',

                leftSidebarWidth: '80%',
                rightSidebarWidth: '80%',

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

        var self = this;

        // Get device characteristics
        self.device = Pikabu.prototype.device || deviceCharacteristics();
        self.markDeviceCharacteristics();

        // Set any custom options
        $.extend(self.settings, options);

        // Set up elements
        self.$viewport = $(self.viewportSelector);

        self.$leftSidebar = $(self.settings.leftSidebarSelector);
        self.$rightSidebar = $(self.settings.rightSidebarSelector);
        self.$element = $(self.settings.elementSelector);

        self.$navToggles = $(self.settings.navTogglesSelector);

        self.$children = self.$viewport.children();

        // Create overlay if it doesn't exist
        if(!$(self.settings.overlaySelector).length) {
            self.$element
                .prepend('<div class="' + self.settings.overlaySelector.slice(1) + '">');
        }

        self.$overlay = $(self.settings.overlaySelector);

        // Bind Pikabu events and event handlers
        self.bindHandlers();
        self.bindEvents();

        // Hide left side bar by default
        self.$leftSidebar.addClass('m-pikabu-hidden');

        self.$element.trigger('pikabu:initialized');
    };

    // Bind Pikabu events
    Pikabu.prototype.bindEvents = function() {
        var self = this;

        self.$element.on('pikabu:initialized', self.settings.onInit);
        self.$element.on('pikabu:opened', self.settings.onOpened);
        self.$element.on('pikabu:closed', self.settings.onClosed);
    };

    // Bind nav toggles and overlay handlers
    Pikabu.prototype.bindHandlers = function() {

        var self = this;

        // Shows sidebar on clicking/tapping nav toggles
        self.$navToggles.on('click', function(e) {
            e.stopPropagation();
            self.openSidebar($(this).attr('data-role'));
        });

        // Closes sidebar on clicking/tapping overlay
        self.$overlay.on('click', function(e) {
            e.stopPropagation();
            self.closeSidebars();
        });
        
    }

    // Set classes to identify features
    Pikabu.prototype.markDeviceCharacteristics = function() {

        var self = this;

        if (self.device.hasOverflowScrolling) {
            self.$document.addClass('m-pikabu-overflow-scrolling');
        }

        if (self.device.isLegacyAndroid) {
            self.$document.addClass('m-pikabu-legacy-android');
        }

        if (self.device.supportsTransitions) {
            self.$document.addClass('m-pikabu-transitions');
        }
        
        if (self.device.has3d) {
            self.$document.addClass('m-pikabu-translate3d');
        }
    }

    Pikabu.prototype.applyTransformations = function() {
        
        var self = this;
        var visibleSidebarSelector = self.$openSidebar === self.$leftSidebar ? 
                self.settings.leftSidebarSelector : self.settings.rightSidebarSelector;
        var width = self.$openSidebar === self.$leftSidebar ? 
                self.settings.leftSidebarWidth : '-' + self.settings.rightSidebarWidth;

        var styles = '<style id="' + self.pikabuStylesId + '">\n' + 
                        self.settings.elementSelector + ' {\n' + 
                            '\t-webkit-transform: translate3d(' + width + ', 0, 0);\n' + 
                            '\t-moz-transform: translate3d(' + width + ', 0, 0);\n' + 
                            '\t-ms-transform: translate3d(' + width + ', 0, 0);\n' + 
                            '\t-o-transform: translate3d(' + width + ', 0, 0);\n' +
                            '\ttransform: translate3d(' + width + ', 0, 0);\n' + 
                        '}\n' +
                        visibleSidebarSelector + ' {\n' + 
                        '\t-webkit-transform: translate3d(0, 0, 0);\n' + 
                        '\t-moz-transform: translate3d(0, 0, 0);\n' + 
                        '\t-ms-transform: translate3d(0, 0, 0);\n' + 
                        '\t-o-transform: translate3d(0, 0, 0);\n' + 
                        '\ttransform: translate3d(0, 0, 0);\n' + 
                        '}'
                    '</style>';

        // Add styles to document
        self.$document.find('head').append(styles);
    }

    // Open sidebar
    Pikabu.prototype.openSidebar = function(target) {

        var self = this;
        var width;

        // Store scroll offset for later use
        self.scrollOffset = window.pageYOffset;

        // Part of left side bar will appear on orientation change on slow devices
        // only show when requested
        if (target === 'left' ) {
            self.$leftSidebar.removeClass('m-pikabu-hidden');
            self.$openSidebar = self.$leftSidebar;
            width = self.settings.leftSidebarWidth;
        } else {
            self.$openSidebar = self.$rightSidebar;
            width = '-' + self.settings.rightSidebarWidth;
        }

        self.$openSidebar.addClass('m-pikabu-overflow-touch');
        self.$document.toggleClass('m-pikabu-' + target + '-visible');

        // Set dimensions of elements
        self.applyTransformations(width);
        self.setViewportWidth();
        self.setHeights();

        // Scroll to the top of the sidebar
        window.scrollTo(0, 0);

        self.$element.trigger('pikabu:opened');
    };

    // Reset sidebar classes on closing
    Pikabu.prototype.resetSidebar = function($sidebar) {
        var self = this;

        $sidebar.removeClass('m-pikabu-overflow-touch');
        self.$children.css('height', '');

        // <TODO> Check to make sure this works
        // Force a reflow here, this might not work correctly!
        self.$element[0].offsetHeight;

        $sidebar.addClass('m-pikabu-hidden');

        // Mark both sidebars as closed
        self.$openSidebar = null;

        self.$element.trigger('pikabu:closed');
    }

    // Close sidebars
    Pikabu.prototype.closeSidebars = function() {

        var self = this;

        self.$document
            .removeClass(self.leftVisibleClass + ' ' + self.rightVisibleClass);
        
        // Reset viewport
        self.$viewport.css('width', 'auto');

        // Remove sidebar, container tranform styles
        $('#' + self.pikabuStylesId).remove();

        // Scroll back to where we were before we opened the sidebar
        window.scrollTo(0, self.scrollOffset);

        // 1. Removing overflow-scrolling-touch causes a content flash
        // 2. Removing height too soon causes panel with content to be 
        // not full height during animation, so we do these after the sidebar has closed
        self.$openSidebar.on('transitionend', function(e) {
            self.resetSidebar($(this));
        });
    };

    // Set width of viewport
    Pikabu.prototype.setViewportWidth = function() {

        var self = this;
        var width = 'auto;'

        // Android 2.3.3 is not getting the correct portrait width
        if(self.device.isLegacyAndroid && orientation == 0) {
            width = Math.max(self.device.height, self.device.width);
        }

        self.$viewport.css('width', 'auto');
    }

    // Recalculate sidebar and viewport height on opening the sidebar
    Pikabu.prototype.setHeights = function() {

        var self = this;
        var windowHeight = $(window).height();

        if (self.device.hasOverflowScrolling) {
            // We have overflow scroll touch (iOS devices)
            self.$children.height(windowHeight);
            self.$viewport.height(windowHeight);
        } else { 
            // Other devices/desktop

            // Reset styles
            self.$openSidebar.removeAttr('style');
            self.$viewport.removeAttr('style');

            // Case: sidebar is taller than the window
            // We need to extend the viewport height so that we can scroll through the whole sidebar
            if (self.$openSidebar.height() > windowHeight) {
                self.$viewport.height(self.$openSidebar.height());
            }
            // Case: sidebar is shorter than the window
            // We need to make the sidebar taller to extend the background to the bottom of the page
            else {
                self.$openSidebar.height(windowHeight);
                self.$viewport.height(windowHeight);
            }
        }
    };

})($);