// Pikabu.js
(function($) {

window.Pikabu = (function() {
    var pikabu = {};
    var $document = $('html');

    // Saving the device width and height for Android 2.3.3
    var dWidth = window.innerWidth;
    // 81 is the missing height due to browser bars when recording the height in landscape
    var dHeight = window.innerHeight + 81;

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

    pikabu.init = function () {
        // check if we have overflow scrolling or not
        if (hasOverflowScrolling()) {
            $document.addClass('m-pikabu-overflow-scrolling');
        }

        if (isLegacyAndroid()) {
            $document.addClass('m-pikabu-legacy-android');
        }

        if (supportsTransitions()) {
            $document.addClass('m-pikabu-transitions');
        }

        if (has3d()) {
            $document.addClass('m-pikabu-translate3d');
        }

        // Bind handlers
        // Toggle sidebars!
        if (window.FastButton) {
            $('.m-pikabu-nav-toggle').fasttap(function(e) {
                e.stopPropagation();
                pikabu.showSidebar($(this.element).attr('data-role'));
            });

            // Overlay: stop clicks, close the sidebars and slide back to main content
            $('.m-pikabu-overlay').fasttap(function(e) {
                e.stopPropagation();
                pikabu.closeSidebars();
            });
        }
        else {
            $('.m-pikabu-nav-toggle').click(function(e) {
                e.stopPropagation();
                pikabu.showSidebar($(this).attr('data-role'));
            });

            // Overlay: stop clicks, close the sidebars and slide back to main content
            $('.m-pikabu-overlay').click(function(e) {
                e.stopPropagation();
                pikabu.closeSidebars();
            });
        }

        // Hide left side bar by default
        $('.m-pikabu-sidebar.m-pikabu-left').hide();
    };
    
    // Sidebar
    pikabu.showSidebar = function(type) {   
        $('.m-pikabu-sidebar').addClass('m-pikabu-overflow-touch');

        // part of left side bar will appear on orientation change on slow devices
        // only show when requested
        if (type == 'left' ) {
            $('.m-pikabu-sidebar.m-pikabu-left').show();
        }

        if (type == 'left' || type == 'right') {
            $document.toggleClass('m-pikabu-' + type + '-visible');

            window.scrollTo(0, 0);
            this.recalculateSidebarHeight($(window).height());
        }
    };

    pikabu.closeSidebars = function() {
        $document.removeClass('m-pikabu-left-visible m-pikabu-right-visible');
        $('.m-pikabu-viewport').css('width', 'auto');
        window.scrollTo(0, 0);

        // 1. Removing overflow-scrolling-touch causes a content flash
        // 2. Removing height too soon causes panel with few content to be not full height during animation
        // so we do these after the sidebar has closed
        setTimeout(function() {
            $('.m-pikabu-sidebar').removeClass('m-pikabu-overflow-touch');
            $('.m-pikabu-viewport, .m-pikabu-container').css('height', '');
            $('.m-pikabu-container').css('marginTop', 1); // add this arbitrary margin-top to force a reflow when we remove it
            // window.scrollTo(0, 1); // 0, 0 fixes 1px glitch during animation and still does hide the address bar
            $('.m-pikabu-container').css('marginTop', ''); // remove the unnecessary margin-top to force reflow and properly recalculate the height of this container
        
            $('.m-pikabu-sidebar.m-pikabu-left').hide();
        }, 250); 
    };

    pikabu.recalculateSidebarHeight = function(viewportHeight) {
        var $viewport = $('.m-pikabu-viewport');

        // Crazy Android 2.3.3 is not getting the correct portrait width
        if(isLegacyAndroid() && orientation == 0) {
            if( dWidth > dHeight ) {
                $viewport.css('width', dHeight );
            }
            else {
                $viewport.css('width', dWidth );
            }
        }
        else {
            $viewport.css('width', 'auto');
        }

        // we have overflow scroll touch (iOS devices)
        if (($document.hasClass('m-pikabu-overflow-scrolling')) && ($document.hasClass('m-pikabu-left-visible') || $document.hasClass('m-pikabu-right-visible'))) {
            $('.m-pikabu-container, .m-pikabu-sidebar').height(viewportHeight);
            $viewport.height(viewportHeight);
        }
        // other devices/desktop
        else {
            var offset = window.pageYOffset;
            $viewport.removeAttr('style');
            var $rightSidebar = $('.m-pikabu-right.m-pikabu-sidebar').removeAttr('style');
            var $leftSidebar = $('.m-pikabu-left.m-pikabu-sidebar').removeAttr('style');
            var windowHeight = $(window).height();

            if ($document.hasClass('m-pikabu-left-visible')) {
                // case: sidebar is taller than the window
                // we need to extend the viewport height so that we can scroll through the whole sidebar
                if ($leftSidebar.height() > windowHeight) {
                    $viewport.height($leftSidebar.height());
                }
                // case: sidebar is shorter than the window
                // we need to make the sidebar taller to extend the background to the bottom of the page
                else {
                    $leftSidebar.height(windowHeight);
                    $viewport.height(windowHeight);
                }
            } else if ($document.hasClass('m-pikabu-right-visible')) {
                // case: sidebar is taller than the window
                // we need to extend the viewport height so that we can scroll through the whole sidebar
                if ($rightSidebar.height() > windowHeight) {
                    $viewport.css('height', $rightSidebar.height());
                }
                // case: sidebar is shorter than the window
                // we need to make the sidebar taller to extend the background to the bottom of the page
                else {
                    $rightSidebar.css('min-height', windowHeight);
                    $viewport.css('height', windowHeight);
                }
            }

            window.scrollTo(0, offset);
        }
    };

    return pikabu;
});

})($);