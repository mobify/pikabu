require.config({
    baseUrl: '../',
    almond: true,
    paths: {
        'text': 'bower_components/requirejs-text/text',
        '$': 'lib/zeptojs/dist/zepto',
        'deckard': 'dist/deckard'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
