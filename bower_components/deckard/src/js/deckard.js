/**
 * Device OS and Browser detection
 *
 * Based on:
 *
 * Zepto detect.js
 * https://github.com/madrobby/zepto/blob/master/src/detect.js
 * (c) 2010-2014 Thomas Fuchs
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework);
    }
}(function($) {
    var _parseVersion = function(version) {
        if (!version) return {};

        var parts = version.split('.');

        return {
            version: version,
            major: parseInt(parts[0] || 0),
            minor: parseInt(parts[1] || 0),
            patch: parseInt(parts[2] || 0)
        };
    };

    var ua = window.navigator.userAgent;
    var device;
    var currentOrientation;
    var $window = $(window);
    var $html = $('html');
    var orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    // This ratio is less than 1 because it accommodates when keyboards are activated.
    var compareRatio = 0.8;

    /*jshint maxstatements:120 */
    var detect = function(ua) {
        var browserVersion;
        var osVersion;
        var os = {};
        var browser = {};
        var cssClasses = [];

        var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var osx = !!ua.match(/\(Macintosh\; Intel /);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
        var windowsphone = ua.match(/Windows Phone ([\d.]+)/);
        var kindle = ua.match(/Kindle\/([\d.]+)/);
        var silk = ua.match(/Silk\/([\d._]+)/);
        var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
        var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
        var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
        var playbook = ua.match(/PlayBook/);
        var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
        var firefox = ua.match(/Firefox\/([\d.]+)/);
        var ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/);
        var webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
        var safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

        browser.webkit = !!webkit;

        if (browser.webkit) {
            browserVersion = webkit[1];
            cssClasses.push('webkit');
        }

        if (android) {
            os.android = true;
            osVersion = android[2];
            cssClasses.push('android');
        }
        if (iphone && !ipod) {
            os.ios = os.iphone = true;
            osVersion = iphone[2].replace(/_/g, '.');
            cssClasses.push('ios', 'iphone');
        }
        if (ipad) {
            os.ios = os.ipad = true;
            osVersion = ipad[2].replace(/_/g, '.');
            cssClasses.push('ios', 'ipad');
        }
        if (ipod) {
            os.ios = os.ipod = true;
            osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
            cssClasses.push('ios', 'ipod');
        }
        if (windowsphone) {
            os.windowsphone = true;
            osVersion = windowsphone[1];
            cssClasses.push('windows');
        }
        if (blackberry) {
            os.blackberry = true;
            osVersion = blackberry[2];
            cssClasses.push('blackberry');
        }
        if (bb10) {
            os.bb10 = true;
            osVersion = bb10[2];
            cssClasses.push('blackberry', 'bb10');
        }
        if (rimtabletos) {
            os.rimtabletos = true;
            osVersion = rimtabletos[2];
            cssClasses.push('blackberry');
        }
        if (playbook) {
            browser.playbook = true;
            cssClasses.push('playbook');
        }
        if (kindle) {
            os.kindle = true;
            osVersion = kindle[1];
            cssClasses.push('kindle');
        }
        if (silk) {
            browser.silk = true;
            browserVersion = silk[1];
            cssClasses.push('silk');
        }
        if (!silk && os.android && ua.match(/Kindle Fire/)) {
            browser.silk = true;
            cssClasses.push('silk');
        }
        if (chrome) {
            browser.chrome = true;
            browserVersion = chrome[1];
            cssClasses.push('chrome');
        }
        if (firefox) {
            browser.firefox = true;
            browserVersion = firefox[1];
            cssClasses.push('firefox');
        }
        if (ie) {
            browser.ie = true;
            browserVersion = ie[1];
            cssClasses.push('ie');
        }
        if (safari && (osx || os.ios)) {
            browser.safari = true;
            cssClasses.push('safari');
            if (osx) {
                browserVersion = safari[1];
            }
        }

        if (webview) {
            browser.webview = true;
            cssClasses.push('webview');
        }

        os = $.extend(true, os, _parseVersion(osVersion));
        browser = $.extend(true, browser, _parseVersion(browserVersion));


        if ('querySelector' in document &&
            'addEventListener' in window &&
            'localStorage' in window &&
            'sessionStorage' in window &&
            'bind' in Function) {
            browser.isModern = true;
            cssClasses.push('is-modern-browser');
        }

        // Determines if this browser is the Android browser vs. chrome. It's always the
        // Android browser if it's webkit and the version is less than 537
        if (os.android && !browser.chrome && browser.webkit && browser.major < 537) {
            browser.androidBrowser = true;
            cssClasses.push('android-browser');
        }

        os.tablet = !!(ipad || playbook || kindle || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));

        os.mobile = !!(!os.tablet && !os.ipod && (android || iphone || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

        // http://stackoverflow.com/questions/19689715/what-is-the-best-way-to-detect-retina-support-on-a-device-using-javascript
        os.retina = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 2)) && os.ios;
        os.retina && cssClasses.push('retina');

        cssClasses.push(os.tablet ? 'tablet' : (os.mobile ? 'mobile' : 'desktop'));

        return {
            os: os,
            browser: browser,
            classes: cssClasses
        };
    };

    var orientation = function() {
        var isLandscape = ($window.height() / $window.width()) < compareRatio;

        return {
            orientation: {
                landscape: isLandscape,
                portrait: !isLandscape
            }
        };
    };

    var addClasses = function(device, orientation) {
        device.classes.push(orientation.landscape ? 'landscape' : 'portrait');
        $html.addClass(device.classes.join(' '));
    };

    var updateOrientation = function() {
        $.extend($, orientation());
        $html.toggleClass('portrait', $.orientation.portrait);
        $html.toggleClass('landscape', $.orientation.landscape);
    };

    $window.on(orientationEvent, updateOrientation);

    device = detect(ua);
    currentOrientation = orientation();

    addClasses(device, currentOrientation.orientation);

    // bind os, browser, and orientation to $ as top-level properties
    $.extend($, { os: device.os, browser: device.browser }, currentOrientation);

    // expose for unit testing
    $.__deckard = {
        detect: detect,
        orientation: orientation,
        updateOrientation: updateOrientation,
        addClasses: addClasses
    };

    return $;
}));
