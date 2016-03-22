# Mobify Pikabu

A mobile-first content fly-in UI plugin.

[![Bower version](https://badge.fury.io/bo/pikabu.svg)](http://badge.fury.io/bo/pikabu)
[![Dependency Status](https://www.versioneye.com/user/projects/54512dcb9fc4d548ec000380/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54512dcb9fc4d548ec000380)
[![Circle CI](https://circleci.com/gh/mobify/pikabu.png?style=shield&circle-token=7f052e50aabb80c939303cc2f5118aa92ca502fa)](https://circleci.com/gh/mobify/pikabu)

## Dependencies

* [Zepto](http://zeptojs.com/)
* [Mobify's fork of Velocity.js](http://github.com/mobify/velocity)
* [Plugin](http://github.com/mobify/plugin)
* [Shade](http://github.com/mobify/shade)
* [Lockup](http://github.com/mobify/lockup)
* [Deckard](http://github.com/mobify/deckard)
* [Bouncefix](https://github.com/jaridmargolin/bouncefix.js)

### jQuery Support

Pikabu supports jQuery but is not actively developed for it. You should be able to use Pikabu directly with jQuery 2.0. While we don't actively support jQuery for Pikabu, we welcome any and all issues and PRs to help us make it work.

## Installation

Pikabu can be installed using bower:

```
bower install pikabu
```

## Usage with Require.js

We highly recommend using Require.js with Pikabu. To use Require, you have to reference Pikabu, Pikabu's effect modules, and Pikabu's dependencies inside your require config file:

```config.js

{
    'paths': {
        'text': 'node_modules/requirejs-text/text',
        '$': 'lib/zeptojs/dist/zepto',
        'bouncefix': 'node_modules/bouncefix.js/dist/bouncefix.min',
        'velocity': 'node_modules/velocity-animate/velocity',
        'slide-along': 'dist/effect/slide-along',
        'airbnb': 'dist/effect/airbnb',
        'drawer-left': 'dist/effect/drawer-left',
        'drawer-right': 'dist/effect/drawer-right',
        'plugin': 'node_modules/plugin/dist/plugin.min',
        'shade': 'node_modules/shade/dist/shade',
        'lockup': 'node_modules/lockup/dist/lockup',
        'deckard': 'node_modules/deckard/dist/deckard.min',
        'pikabu': 'dist/pikabu',
        'FastClick': 'node_modules/fastclick/lib/fastclick',
        // There are a few more within the 'effect' folder
    }
}

```

And then require Pikabu in as needed:

```
define([
    'zepto',
    'drawer-left',
    'pikabu'
    ],
    function($, drawerLeft) {
        $('.pikabu').pikabu({
            effect: drawerLeft
        });
    }
);
```


## Usage

Pikabu requires very minimal markup. All Pikabu needs is a div with your content and it will automatically transform into what we need.

> To avoid any unwanted FOUT, decorate the content you will be passing to Pikabu with the `hidden` attribute. We will remove that attribute when Pikabu is initialized.

For accessibility and functional purposes, Pikabu will wrap all of your body content in a wrapping container. This could conflict with other plugins that alter your page's markup. If you're seeing issues, try initializing Pikabu after your other plugins. If you want to specify your own wrapping container, add a class of `pikabu__container` to the element. This element should be a root level element to be effective.

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="pikabu.min.css">

<!-- Optionally include the Theme file -->
<link rel="stylesheet" href="pikabu-style.min.css">

<!-- Include a wrapping container -->
<div id="bodyContent" class="pikabu">
    Any fixed position elements with class="pikabu__fixed"
    <div class="pikabu__container">
        Your specified body content
    </div>
</div>

<!-- Include the markup -->
<div id="myPikabu" hidden>
    Your pikabu menu content
</div>

<!-- Include dependencies -->
<script src="zepto.min.js"></script>
<script src="velocity.min.js"></script>
<script src="plugin.min.js"></script>
<script src="shade.min.js"></script>
<script src="lockup.min.js"></script>
<script src="deckard.min.js"></script>
<script src="bouncefix.min.js"></script>

<!-- Include the effect module you want to use -->
<script src="effect/drawer-left.js"></script>
<!-- Include pikabu.js -->
<script src="pikabu.min.js"></script>

<!-- Construct Pikabu -->
<script>
$('#myPikabu').pikabu({
    effect: drawerLeft,
    //other customizations
});
</script>
```

## Initializing the plugin

### pikabu()

Initializes pikabu.

```js
$('#myPikabu').pikabu({
    effect: drawerLeft
});
```

_You *must* pass Pikabu an effect for it to work._

### pikabu(options)

Initialize with options.

```js
$('#myPikabu').pikabu({
    effect: drawerLeft,
    container: '#container',
    structure: {
        header: 'My Pikabu Title',
        footer: false
    },
    zIndex: 2,
    cssClass: 'my-pikabu-class',
    coverage: '80%',
    easing: 'swing',
    duration: 200,
    shade: {
        color: '#404040',
        zIndex: 5,
    },
    open: function(){},
    opened: function(){},
    close: function(){},
    closed: function(){}
});
```

#### Options

##### effect

default: null

Specifies which `effect` module Pikabu should use when opening. `Effect` modules allow you to load specific functionality that tell Pikabu how to open and close. Available `effect` modules can be found in the `dist/effect` folder. Current `effect` modules include:

- Drawer Left - slides in from the left of the screen
- Drawer Right - slides in from the right of the screen

```js
$('#myPikabu').pikabu({
    effect: drawerLeft
});
```

#### container

default: $('.pikabu__container')

Any content you want to be pushed aside by the pikabu menu should be wrapped in this container element.

```js
$('#myPikabu').pikabu({
    container: $('#mainForm') // or container: '#mainForm'
});
```


#### appendTo

default: $('.pikabu')

Specify the element Pikabu will be appended to. By default Pikabu will be appended the container with a class name `pikabu`. If you want it to be appended to a different element, specify that element here.

```js
$('#myPikabu').pikabu({
    appendTo: 'body'
});
```


##### structure

default: `{
            header: '',
            footer: false
        }`

Defines the structure to use for Pikabu. Specifically, Pikabu tries to build its own HTML structure if passed the default options.

**If you want to have full control over the HTML of your Pikabu menu, including the header, footer, and content section, set `structure: false`**. Setting `structure: false` will still allow the `close` event to be bound to any element that has the `pikabu__close` class, allowing you to specify the element that should trigger closing your Pikabu menu.

If you are using `structure: false`, you will need to structure your HTML to include the following elements (*missing any elements will cause Pikabu to not function*):

```html
<div id="myPikabu" class="pikabu__wrapper" role="document" hidden>
    <div class="pikabu__header">
        <a class="pikabu__close">close</a>
    </div>
    <div class="pikabu__content pikabu--is-scrollable"></div>
    <div class="pikabu__footer"></div>
</div>
```

Please see below for available sub-options for `header` and `footer`.

###### structure.header

default: `''`

Sets the header that Pikabu should use in its header bar. Valid values are:

- `boolean` - specifies no default header generated. If chosen, the user is required to specify the header markup themselves, including the appropriate class, `pikabu__header`. It will be expected that this will be a part of the element that is used to invoke pikabu.
- `string` - specifies the title text used in the header. The header structure will be generated automatically.
- `html|element` - specifies the HTML to be used for the header.

```js
// generates no header
$('#myPikabu').pikabu({
    structure: {
        header: false
    }
});
```
or

```js
// generates a default header with the title "My Pikabu"
$('#myPikabu').pikabu({
    structure: {
        header: 'My Pikabu'
    }
});
```

or

```js
$('#myPikabu').pikabu({
    structure: {
        header: '<header class="pikabu__header">My Pikabu<button class="pikabu__close">Close</button></header>'
    }
});
```

###### structure.footer

default: `false`

Sets the footer that Pikabu should use in its footer. Valid values are:

- `boolean` - specifies no default footer generated. If chosen, the user is required to specify the footer markup themselves, including the appropriate class, `pikabu__footer`.
- `string` - specifies the title text used in the footer. The footer structure will be generated automatically.
- `html|element` - specifies the HTML to be used for the footer.

```js
// generates no footer
$('#myPikabu').pikabu({
    structure: {
        footer: false
    }
});
```
or

```js
// generates a default footer with the contents "My Footer"
$('#myPikabu').pikabu({
    structure: {
        footer: 'My Footer'
    }
});
```

or

```js
$('#myPikabu').pikabu({
    structure: {
        footer: '<footer class="pikabu__footer">My Footer</footer>'
    }
});
```

##### zIndex

default: `2`

Sets the z-index value for Pikabu. Use this value if you need to specify a specific stacking order.

```js
$('#myPikabu').pikabu({
    zIndex: 10
});
```

##### cssClass

default: `''`

Sets a class to apply to the main Pikabu parent element for ease of styling.

```js
#('#myPikabu').pikabu({
    cssClass: 'my-pikabu-class'
});
```

##### coverage

default: `80%`

Sets the coverage value. This will allow you to specify that the pikabu covers only a portion of the screen.

```js
$('#myPikabu').pikabu({
    coverage: '80%'
});
```

##### duration

default: `200`

Sets the duration for the animation.

```js
$('#myPikabu').pikabu({
    duration: 600
});
```

##### shade

default: `{}`

Specifies whether pikabu should use the shade overlay. You can pass options through to [Shade](http://github.com/mobify/shade) using this property. For more information on available options, see the [Shade documentation](http://github.com/mobify/shade).

> **Warning:** We currently force Shade's duration to match the one provided to Pikabu. This is to limit DOM thrashing as much as possible during Pikabu's animation. Pikabu hitches a little if we don't do this.

```js
$('#myPikabu').pikabu({
    shade: {
        color: '#333333'
    }
});
```

##### easing

default: `swing`

Sets the easing for the animation. Pikabu takes all of the same easing properties that [Velocity.js](http://julian.com/research/velocity) accepts.

> * [jQuery UI's easings](http://easings.net/) and CSS3's easings ("ease", "ease-in", "ease-out", and "ease-in-out"), which are pre-packaged into Velocity. A bonus "spring" easing (sampled in the CSS Support pane) is also included.
* CSS3's bezier curves: Pass in a four-item array of bezier points. (Refer to [Cubic-Bezier.com](http://cubic-bezier.com/) for crafing custom bezier curves.)
* Spring physics: Pass a two-item array in the form of [ tension, friction ]. A higher tension (default: 600) increases total speed and bounciness. A lower friction (default: 20) increases ending vibration speed.
* Step easing: Pass a one-item array in the form of [ steps ]. The animation will jump toward its end values using the specified number of steps.

For more information, check out [Velocity's docs on easing](http://julian.com/research/velocity/#easing).

```js
$('#myPikabu').pikabu({
    easing: 'ease-in-out'
});
```

##### open

default: `function(e, ui) {}`

Triggered every time the selected pikabu item is starting to open.

**Parameters**

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPikabu').pikabu({
    open: function(e, ui) {
        // ui.item contains the item opening
    }
});
```

##### opened

default: `function(e, ui) {}`

Triggered every time the selected pikabu item has finished opening.

**Parameters**

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPikabu').pikabu({
    opened: function(e, ui) {
        // ui.item contains the item that opened
    }
});
```

##### close

default: `function(e, ui) {}`

Triggered every time an pikabu item is starting to close.

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPikabu').pikabu({
    close: function(e, ui) {
        // ui.item contains the item closing
    }
});
```

##### closed

default: `function(e, ui) {}`

Triggered every time an pikabu item is finished closing.

| Parameter name | Description |
|----------------|-------------|
| **e** | An Event object passed to the callback |
| **ui** | An object containing any associated data for use inside the callback |

```js
$('#myPikabu').pikabu({
    closed: function(e, ui) {
        // ui.item contains the item that closed
    }
});
```

## Methods

### Open

Open the selected pikabu item by element reference

```js
$pikabu.pikabu('open');
```

### Close

Close the selected pikabu item by element reference

```js
$pikabu.pikabu('close');
```

> Pikabu will automatically trigger `close` on elements decorated with the class name `pikabu__close`.

```html
<button class="pikabu__close">Close</button>
```

##Notes

If there are any `position: fixed;` elements on your page that should be pushed aside by pikabu, be sure to add the `pikabu__fixed` class to them, or ensure that they are located inside the `pikabu__container`.

## Browser Compatibility

| Browser           | Version | Support                      |
|-------------------|---------|------------------------------|
| Mobile Safari     | 5.1.x   | Degraded. Form inputs cause scroll issues while typing. |
| Mobile Safari     | 6.0+    | Supported.                   |
| Chrome (Android)  | 1.0+    | Supported.                   |
| Android Browser   | 4.0+    | Degraded. No scroll locking. |
| IE for Win Phone  | 8.0+    | Degraded. No scroll locking. |
| Firefox (Android) | 23.0+   | Supported. (Support may exist for earlier versions but has not been tested) |

## Known Issues

Currently, form inputs and selects inside of Pikabu have issues on iOS7 and under. This is due to not being able to lock scrolling without causing rendering issues as well as iOS attempting to scroll the page when the keyboard opens. Forms work but will cause some visual jumping.

## Building a distribution

### Requirements
* [node.js 0.10.x/npm](http://nodejs.org/download/)
* [Grunt](http://gruntjs.com/)
    * Install with `npm install -g grunt-cli`
* [Bower](http://bower.io/)
    * Install with `npm install -g bower`

### Steps
1. `npm install`
1. `bower install`
1. `grunt build`

The `dist` directory will be populated with minified versions of the css and javascript files for distribution and use with whatever build system you might use. The `src` directory has our raw unminified Sass and Javascript files if you prefer to work with those.

## Running tests

1. `grunt test`

## Developing tests

1. `grunt test:browser`

Open your browser at (http://localhost:8888/tests/runner)[http://localhost:8888/tests/runner] to manually run tests
and inspect the page as they're running.

## License

_MIT License. Pikabu is Copyright © 2014 Mobify. It is free software and may be redistributed under the terms specified in the LICENSE file._
