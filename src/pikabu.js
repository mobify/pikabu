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


window.Pikabu = (function() {
    var pikabu = {},
        $document = $('html'),
        $viewport = $('.m-pikabu-viewport'),
        $children = $viewport.children(),
        $mainContent = $('.m-pikabu-container'),
        $sidebars = $('.m-pikabu-sidebar'),
        $leftSidebar = $('.m-pikabu-left'),
        $rightSidebar = $('.m-pikabu-right'),
        leftVisible = 'm-pikabu-left-visible',
        rightVisible = 'm-pikabu-right-visible',
        dWidth = window.innerWidth,
        // 81 is the missing height due to browser bars when recording the height in landscape
        dHeight = window.innerHeight + 81;


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
        // <TODO> Is there a better way to do this?
        $leftSidebar.hide();
    };

    // Sidebar
    pikabu.showSidebar = function(type) {
        $sidebars.addClass('m-pikabu-overflow-touch');

        // part of left side bar will appear on orientation change on slow devices
        // only show when requested
        if (type == 'left' ) {
            $leftSidebar.show();
        }

        if (type == 'left' || type == 'right') {
            $document.toggleClass('m-pikabu-' + type + '-visible');

            window.scrollTo(0, 0);
            this.recalculateSidebarHeight($(window).height());
        }
    };

    pikabu.closeSidebars = function() {
        $document.removeClass(leftVisible).removeClass(rightVisible);
        $viewport.css('width', 'auto');
        window.scrollTo(0, 0);

        // 1. Removing overflow-scrolling-touch causes a content flash
        // 2. Removing height too soon causes panel with few content to be not full height during animation
        // so we do these after the sidebar has closed
        setTimeout(function() {
            $sidebars.removeClass('m-pikabu-overflow-touch');
            $viewport.css('height', '');
            $mainContent.css('height', '');

            // add this arbitrary margin-bottom to force a reflow when we remove it
            $mainContent.css('marginBottom', 1);

            // Not sure why but we need a scrollTo here to get the reflow to work
            window.scrollTo(0, 0);

            // remove the unnecessary margin-bottom to force reflow and properly recalculate the height of this container
            $mainContent.css('marginBottom', '');

            $leftSidebar.hide();
        }, 250);    // <TODO>: Can we trigger this when the animation is done?
    };

    pikabu.recalculateSidebarHeight = function(viewportHeight) {
        var offset = window.pageYOffset,
            windowHeight = $(window).height();

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
        if ($document.hasClass('m-pikabu-overflow-scrolling') && ($document.hasClass(leftVisible) || $document.hasClass(rightVisible))) {
            $children.height(viewportHeight);
            $viewport.height(viewportHeight);
        }
        // other devices/desktop
        else {
            $rightSidebar.removeAttr('style');
            $leftSidebar.removeAttr('style');
            $viewport.removeAttr('style');

            if ($document.hasClass(leftVisible)) {
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
            } else if ($document.hasClass(rightVisible)) {
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