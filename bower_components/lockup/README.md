# Mobify Lockup

A mobile first scroll blocking plugin

[![Bower version](https://badge.fury.io/bo/lockup.svg)](http://badge.fury.io/bo/lockup)
[![Dependency Status](https://www.versioneye.com/user/projects/545a6f0c151e7f73e2000025/badge.svg?style=flat)](https://www.versioneye.com/user/projects/545a6f0c151e7f73e2000025)
[![Circle CI](https://circleci.com/gh/mobify/lockup.png?style=shield&circle-token=c2be6f587d2cc6c72d8bc3ad583ea2e22e6e80d9)](https://circleci.com/gh/mobify/lockup)

## Dependencies

* [Zepto](http://zeptojs.com/)
* [Plugin](http://github.com/mobify/plugin)
* [Deckard](http://github.com/mobify/deckard)

## Installation

Lockup can be installed using bower:

```
bower install lockup
```

## Usage with Require.js

We highly recommend using Require.js with Lockup. To use Require, you have to reference Lockup and Lockup's dependencies inside your require config file:

```config.js

{
    'paths': {
    	'plugin': 'bower_components/plugin/dist/plugin.min',
        'lockup': 'bower_components/lockup/dist/lockup.min',
        'deckard': 'bower_components/deckard/dist/deckard.min'
    }
}

```

And then require Lockup in as needed:

```
define([
    'zepto',
    'lockup'
    ],
    function($) {
        $('.someElement').lockup();
    }
);
```
