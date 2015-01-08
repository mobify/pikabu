require.config({
    baseUrl: '../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        '$': 'lib/zeptojs/dist/zepto',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        'velocity': 'bower_components/mobify-velocity/velocity',
        'drawer-left': 'dist/effect/drawer-left',
        'drawer-right': 'dist/effect/drawer-right',
        'plugin': 'bower_components/plugin/dist/plugin.min',
        'shade': 'bower_components/shade/dist/shade',
        'lockup': 'bower_components/lockup/dist/lockup',
        'deckard': 'bower_components/deckard/dist/deckard.min',
        'pikabu': 'dist/pikabu'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
