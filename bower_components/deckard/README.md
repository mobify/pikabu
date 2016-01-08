#Deckard
Device OS and Browser detection.

[![Bower version](https://badge.fury.io/bo/deckard.svg)](http://badge.fury.io/bo/deckard)
[![Circle CI](https://circleci.com/gh/mobify/deckard.svg?style=shield&circle-token=4fa31dbc4e160e2b19aafb2d5881c617c3ea9b50)](https://circleci.com/gh/mobify/deckard)

![](http://media.tumblr.com/e0da98f48bf70afdc322f08794a70520/tumblr_inline_n20w2wbjJQ1qzrkdh.gif)

##Installation
Installation is simple via bower.

```
bower install deckard --save
```
##Configure with Require.js
Add the following configuration to your require.js config file.

```js
...
'deckard': 'bower_components/deckard/dist/deckard'
...
```
##Bring deckard in via Require.js

```js
define([ 
	'$', 
	'deckard'
], 
function($) {
	...
});
```

Bringing in `deckard` parses the User Agent string, and populates a number of properties related to the device. Additionally, `deckard` adds relevant classes to the HTML element, allowing you to target fixes via CSS.

Deckard runs automatically on your page if included (either via require.js or as a `<script>`).

###`$.os`

####Platform
type: **boolean**
- `$.os.desktop`
- `$.os.mobile`
- `$.os.tablet`

####OS Name
type: **boolean**
- `$.os.ios`
- `$.os.android`
- `$.os.windowsphone`
- `$.os.blackberry`
- `$.os.bb10`
- `$.os.rimtabletos`
- `$.os.kindle`

####OS Version
type: **number**
- `$.os.major`
- `$.os.minor`
- `$.os.patch`

type: **string**
- `$.os.version` (full version string)

###`$.retina`
type: **boolean**

###`$.browser`

####Browser Name
type: **boolean**
- `$.browser.safari`
- `$.browser.chrome`
- `$.browser.firefox`
- `$.browser.opera`
- `$.browser.ie`
- `$.browser.silk`
- `$.browser.webview`

####Browser Version
type: **number**
- `$.browser.major`
- `$.browser.minor`
- `$.browser.patch`

type: **string**
- `$.browser.version` (full version string)

###`$.orientation`
`deckard` also handles binding to `orientationchange`, and updates the CSS classes and properties
appropriately if that event is triggered.

type: **boolean**
- `$.orientation.landscape`
- `$.orientation.portrait`

You can then target a particular OS and Browser:

```js
if ($.os.android && $.os.major < 4 && $.browser.chrome) {
	// do stuff specific to android less than version 4 on chrome
}
```

