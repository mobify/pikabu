require.config({
    baseUrl: '../',
    paths: {
        'text': 'node_modules/requirejs-text/text',
        '$': 'node_modules/jquery/dist/jquery.min',
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
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});
