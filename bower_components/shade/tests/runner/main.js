
require(['config'], function() {
    require([
        'require',
        'chai',
        'mocha'
    ],
        function(require, chai, mocha) {

            var tests = [
                '../../tests/unit/constructor.js',
                '../../tests/unit/plugin.js',
                '../../tests/unit/options.js',
                '../../tests/unit/events.js'
            ];

            require(tests, function() {
                assert = chai.assert;

                if (window.mochaPhantomJS) {
                    return window.mochaPhantomJS.run();
                }
                mocha.run();
            });
        });
});
