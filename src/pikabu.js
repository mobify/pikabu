// Pikabu.js
(function($) {

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

            overlaySelector: '.m-pikabu-overlay',

            navTogglesSelector: '.m-pikabu-nav-toggle',

            deviceWidth: window.innerWidth,
            // 81 is the missing height due to browser bars when recording the height in landscape
            deviceHeight: window.innerHeight + 81
        }
    });

    // Create Pikabu
    self.init(options);

    return self;
});

Pikabu.prototype.init = function (options) {

    var self = this;

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

    if (hasOverflowScrolling()) {
        self.$document.addClass('m-pikabu-overflow-scrolling');
    }

    if (isLegacyAndroid()) {
        self.$document.addClass('m-pikabu-legacy-android');
    }

    if (supportsTransitions()) {
        self.$document.addClass('m-pikabu-transitions');
    }

    if (has3d()) {
        self.$document.addClass('m-pikabu-translate3d');
    }

    // Bind handlers to toggle sidebars
    if (window.FastButton) {
        // Do we have fasttap?
        // <TODO> Specify expected implementation
        self.$navToggles.fasttap(function(e) {
            e.stopPropagation();
            self.showSidebar($(this.element).attr('data-role') || 'left');
        });

        // Overlay: stop clicks, close the sidebars and slide back to main content
        self.$overlay.fasttap(function(e) {
            e.stopPropagation();
            self.closeSidebars();
        });
    }
    else {
        self.$navToggles.click(function(e) {
            e.stopPropagation();
            self.showSidebar($(this).attr('data-role') || 'left');
        });

        // Overlay: stop clicks, close the sidebars and slide back to main content
        self.$overlay.click(function(e) {
            e.stopPropagation();
            self.closeSidebars();
        });
    }

    // Hide left side bar by default
    self.$leftSidebar.addClass('m-pikabu-hidden');
};

// Sidebar
Pikabu.prototype.showSidebar = function(type) {

    var self = this;

    self.$sidebars.addClass('m-pikabu-overflow-touch');

    // part of left side bar will appear on orientation change on slow devices
    // only show when requested
    if (type == 'left' ) {
        self.$leftSidebar.removeClass('m-pikabu-hidden');
    }

    if (type == 'left' || type == 'right') {
        self.$document.toggleClass('m-pikabu-' + type + '-visible');

        window.scrollTo(0, 0);
        self.recalculateSidebarHeight($(window).height());
    }
};

Pikabu.prototype.closeSidebars = function() {

    var self = this;

    self.$document.removeClass(self.settings.leftVisibleClass).removeClass(self.settings.rightVisibleClass);
    self.$viewport.css('width', 'auto');
    window.scrollTo(0, 0);

    // 1. Removing overflow-scrolling-touch causes a content flash
    // 2. Removing height too soon causes panel with few content to be not full height during animation
    // so we do these after the sidebar has closed
    setTimeout(function() {
        self.$sidebars.removeClass('m-pikabu-overflow-touch');
        self.$children.css('height', '');

        // Force a reflow here, this might not work correctly!
        self.$mainContent[0].offsetHeight;

        self.$leftSidebar.addClass('m-pikabu-hidden');
    }, 250);    // <TODO>: Can we trigger this when the animation is done?
};

Pikabu.prototype.recalculateSidebarHeight = function(viewportHeight) {

    var self = this;
    var offset = window.pageYOffset,
        windowHeight = $(window).height();

    // Crazy Android 2.3.3 is not getting the correct portrait width
    // <TODO>: Orientation access?
    if(isLegacyAndroid() && orientation == 0) {
        if(self.deviceWidth > self.deviceHeight) {
            self.$viewport.css('width', deviceHeight);
        } else {
            self.$viewport.css('width', deviceWidth);
        }
    }
    else {
        self.$viewport.css('width', 'auto');
    }

    // we have overflow scroll touch (iOS devices)
    if (self.$document.hasClass('m-pikabu-overflow-scrolling') 
        && (self.$document.hasClass(self.settings.leftVisibleClass) || self.$document.hasClass(self.settings.rightVisibleClass))) {
        self.$children.height(viewportHeight);
        self.$viewport.height(viewportHeight);
    }
    // other devices/desktop
    else {
        self.$rightSidebar.removeAttr('style');
        self.$leftSidebar.removeAttr('style');
        self.$viewport.removeAttr('style');

        if (self.$document.hasClass(self.settings.leftVisibleClass)) {
            // case: sidebar is taller than the window
            // we need to extend the viewport height so that we can scroll through the whole sidebar
            if (self.$leftSidebar.height() > windowHeight) {
                self.$viewport.height(self.$leftSidebar.height());
            }
            // case: sidebar is shorter than the window
            // we need to make the sidebar taller to extend the background to the bottom of the page
            else {
                self.$leftSidebar.height(windowHeight);
                self.$viewport.height(windowHeight);
            }
        } else if (self.$document.hasClass(self.settings.rightVisibleClass)) {
            // case: sidebar is taller than the window
            // we need to extend the viewport height so that we can scroll through the whole sidebar
            if (self.$rightSidebar.height() > windowHeight) {
                self.$viewport.css('height', self.$rightSidebar.height());
            }
            // case: sidebar is shorter than the window
            // we need to make the sidebar taller to extend the background to the bottom of the page
            else {
                self.$rightSidebar.css('min-height', windowHeight);
                self.$viewport.css('height', windowHeight);
            }
        }

        window.scrollTo(0, offset);
    }
};

})($);