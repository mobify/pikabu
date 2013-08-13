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

        // Cache device characteristics
        return {
            'hasOverflowScrolling': hasOverflowScrolling(),
            'isLegacyAndroid': isLegacyAndroid(),
            'supportsTransitions': supportsTransitions(),
            'has3d': has3d(),
            // 81 is the missing height due to browser bars when recording the height in landscape
            height: window.innerHeight + 81,
            width: window.innerWidth
        };
    }

    // Pikabu class
    window.Pikabu = (function(options) {

        var self = $.extend(this, {
            $document: $('html'),

            // Overridable settings
            settings: {
                viewportSelector: '.m-pikabu-viewport',
                mainContentSelector: '.m-pikabu-container',

                leftSidebarSelector: '.m-pikabu-left',
                rightSidebarSelector: '.m-pikabu-right',
                sidebarsSelector: '.m-pikabu-sidebar',

                leftVisibleClass: 'm-pikabu-left-visible',
                rightVisibleClass: 'm-pikabu-right-visible',

                // Click-to-close overlay
                overlaySelector: '.m-pikabu-overlay',

                // Controls that trigger the sidebar
                navTogglesSelector: '.m-pikabu-nav-toggle',

                leftSidebarWidth: '80%',
                rightSidebarWidth: '80%'
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
        self.$viewport = $(self.settings.viewportSelector);

        self.$leftSidebar = $(self.settings.leftSidebarSelector);
        self.$rightSidebar = $(self.settings.rightSidebarSelector);
        self.$sidebars = $(self.settings.sidebarsSelector);
        self.$mainContent = $(self.settings.mainContentSelector);

        self.$navToggles = $(self.settings.navTogglesSelector);

        self.$children = self.$viewport.children();

        // Create overlay if it doesn't exist
        if(!$(self.settings.overlaySelector).length) {
            self.$mainContent
                .prepend('<div class="' + self.settings.overlaySelector.slice(1) + '">');
        }

        self.$overlay = $(self.settings.overlaySelector);

        // Bind handlers to toggle sidebars
        self.bindHandlers();

        // Hide left side bar by default
        self.$leftSidebar.addClass('m-pikabu-hidden');
    };

    // Bind nav toggles and overlay handlers
    Pikabu.prototype.bindHandlers = function() {

        var self = this;

        // Shows sidebar on clicking/tapping nav toggles
        self.$navToggles.on('click', function(e) {
            e.stopPropagation();
            self.showSidebar($(this).attr('data-role'));
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

    // Show sidebar
    Pikabu.prototype.showSidebar = function(type) {

        var self = this;

        // Store scroll offset for later use
        self.scrollOffset = window.pageYOffset;

        self.$sidebars.addClass('m-pikabu-overflow-touch');

        // part of left side bar will appear on orientation change on slow devices
        // only show when requested
        if (type == 'left' ) {
            self.$leftSidebar.removeClass('m-pikabu-hidden');
        }

        if (type == 'left' || type == 'right') {
            self.$document.toggleClass('m-pikabu-' + type + '-visible');

            // Which sidebar is open?
            self.$openSidebar = type === 'left' ? self.$leftSidebar : self.$rightSidebar;

            self.setViewportWidth();
            self.setHeights();

            window.scrollTo(0, 0);
        }
    };

    // Close sidebars
    Pikabu.prototype.closeSidebars = function() {

        var self = this;

        self.$document
            .removeClass(self.settings.leftVisibleClass)
            .removeClass(self.settings.rightVisibleClass);
        
        // Reset viewport
        self.$viewport.css('width', 'auto');

        // Scroll back to where we were before we opened the sidebar
        window.scrollTo(0, self.scrollOffset);

        // 1. Removing overflow-scrolling-touch causes a content flash
        // 2. Removing height too soon causes panel with few content to be not full height during animation
        // so we do these after the sidebar has closed
        setTimeout(function() {
            self.$sidebars.removeClass('m-pikabu-overflow-touch');
            self.$children.css('height', '');

            // Mark both sidebars as closed
            self.$openSidebar = null;

            // <TODO> Check to make sure this works
            // Force a reflow here, this might not work correctly!
            self.$mainContent[0].offsetHeight;

            self.$leftSidebar.addClass('m-pikabu-hidden');
        }, 250);    // <TODO>: Can we trigger this when the animation is done?
    };

    // Set width of viewport
    Pikabu.prototype.setViewportWidth = function() {

        var self = this;

        // Android 2.3.3 is not getting the correct portrait width
        if(self.device.isLegacyAndroid && orientation == 0) {
            if(self.device.width > self.device.height) {
                self.$viewport.css('width', self.device.height);
            } else {
                self.$viewport.css('width', self.device.width);
            }
        }
        else {
            self.$viewport.css('width', 'auto');
        }
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