require.config({
    baseUrl: '../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        '$': 'lib/zeptojs/dist/zepto',
        'velocity': 'bower_components/velocity/velocity',
        'plugin': 'bower_components/plugin/dist/plugin.min',
        'pikabu': 'dist/pikabu'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
