# Pikabu

### Simple markup
Few containers and classes means implementation is a breeze.

### Native scrolling
Just like mom used to make. Momentum scrolling in sidebars and smart fallbacks for browsers that don&rsquo;t support it.

### Customization
No theme, just barebones HTML and CSS. Pikabu is super customizable to your needs.

### Compatibility
This thing works on everything. We progressively enhance the experience for devices that support it.

## CDN

This module is also hosted on Mobify's CDN

### CSS
    <link rel="stylesheet" href="//cdn.mobify.com/modules/pikabu/0.2.2/pikabu.css">
    <link rel="stylesheet" href="//cdn.mobify.com/modules/pikabu/0.2.2/pikabu-theme.css">

### JavaScript
    <script src="//cdn.mobify.com/modules/pikabu/0.2.2/pikabu.min.js"></script>

## Basic Usage

First create an instance of Pikabu like this:

    // All options are optional
    var pikabu = new Pikabu({
        // Specify left and right sidebar widths independently
        widths: {
            left: '70%',
            right: '70%'
        }
    });


Once you've created the pikabu instance as shown above,
you can use it elsewhere like this:


    $('m-pikabu').pikabu({
        viewportSelector: '.pikabu-viewport'
    });

## Basic HTML
Pikabu assumes a containing viewport, one or two sidebars and a
main content container. By default these are prefixed with
'm-pikabu-', but you can easily set your own classes.

    <!-- the viewport -->
    <div class="m-pikabu-viewport">
        <!-- the left sidebar -->
        <div class="m-pikabu-sidebar m-pikabu-left">
            <!-- left sidebar content -->
            <h2>Left Sidebar Content</h2>
        </div>

        <!-- the main page content -->
        <div class="m-pikabu-container">
            <header>
                <a class="m-pikabu-nav-toggle" data-role="left">
                    Left Menu
                </a>
                <h1>Pikabu</h1>
                <a class="m-pikabu-nav-toggle" data-role="right">
                    Right Menu
                </a>
            </header>
            <section>
                <!-- Body content goes in here -->
                <h2>
                    <strong>Pikabu</strong>
                    is a speedy, flexible framework
                    for off-canvas flyout panels.
                </h2>
                <p>
                    Lorem ipsum dolor sit amet,
                    consectetur adipisicing elit.
                </p>
            </section>
        </div>

        <!-- the right sidebar -->
        <div class="m-pikabu-sidebar m-pikabu-right">
            <!-- right sidebar content -->
            Right
        </div>
    </div>

## Custom CSS Class Names
If you'd like to request different elements be used
as controls, you can easily override any of the default
pikabu class names.

IMPORTANT: If you change the class names here, please
remember to change the appropriate classes in the
stylesheets as well.

    pikabu = new Pikabu({
        viewportSelector: [viewport-selector],
        selectors: {
            element: '.m-pikabu-container',
            // Sidebars
            common: '.m-pikabu-sidebar',
            left: '.m-pikabu-left',
            right: '.m-pikabu-right',
            // Click-to-close overlay
            overlay: '.m-pikabu-overlay',
            // Controls that trigger the sidebar
            navToggles: '.m-pikabu-nav-toggle'
        }
    }

## Available Methods

### .scrollTo()
window smooth scrolling

    pikabu.scrollTo(500);

### .device()
Returns information about the device, such as:

    pikabu.device({
        has3d: [true for 3d transitions],
        hasOverflowScrollingTouch: [true overflow scrolling],
        height: [returns document height],
        isAndroid: [returns true if the device is an Android],
        isLegacyAndroid: [returns true if the android < 2.3],
        supportsTransitions: [true for transitions],
        useDefaultAnimation: [true to use pikabu logics for animation, false to describe your own in CSS],
        transitionEvent: [event fired on transition],
        width: [returns document width]
    });

### .openSidebar()
opens the given sidebar

    pikabu.openSidebar('right');

### .closeSidebars
closes all given sidebars

    pikabu.closeSidebars();

### .activeSidebar
returns the active sidebar

    pikabu.activeSidebar // 'left' or 'right'

### .$sidebars
get the Zepto/jQuery active sidebar object

    pikabu.$sidebars[pikabu.activeSidebar] //

## Events

### onInit
Fires an event when pikabu is initialized.

    onInit: function() {...}

### onOpened
Fires an event when pikabu is opened.

    onOpened: function() {...}

### onClosed
Fires an event when pikabu is closed.

    onClosed: function() {...}

## Browser Compatibility

### Mobile Browsers

The following mobile browsers are fully supported:

| Browser           | Version
|-------------------|---------|
| Mobile Safari     | 3.1.3+  |
| Android Browser   | 2.1+    |
| Android Chrome    | 1.0+    |
| Android Firefox   | 1.0+    |

The following mobile browsers have degraded support:

| Browser           | Version |
|-------------------|---------|
| Windows Phone     | 7.5     |

### Desktop Browsers

The follow desktop browsers are fully supported:

| Browser           | Version |
|-------------------|---------|
| Safari            | 4.0+    |
| Firefox           | 4.0+    |
| Chrome            | 12.0+   |
| Opera             | 12.0+   |
| Internet Explorer | 10.0+   |

The following desktop browsers have degraded support:

| Browser           | Version |
|-------------------|---------|
| Internet Explorer | 8.0,9.0 |
| Firefox           | 3.5,3.6 |

## Contributing

Please see the project's
<a href="//github.com/mobify/pikabu" title="Mobify on Github">GitHub page</a>
for details contributing. In order to build the files, you will need
[node.js 0.8.x and npm](http://nodejs.org/download/).

### Steps
    npm install -g grunt-cli
    npm install
    grunt

The build directory will be populated with minified versions of the css and
javascript files and a .zip of the original source files (for distribution and
use with whatever build system you might use).


## License
Licensed under the MIT License
