require.config({
    baseUrl: '../../',
    paths: {
        'text': 'node_modules/text/text',
        'fixtures': 'tests/fixtures',
        'bouncefix': 'node_modules/bouncefix.js/dist/bouncefix.min',
        '$': 'lib/zeptojs/dist/zepto',
        'velocity': 'node_modules/velocity-animate/velocity',
        'chai': 'node_modules/chai/chai',
        'mocha': 'node_modules/mocha/mocha',
        'drawer-left': 'dist/effect/drawer-left',
        'drawer-right': 'dist/effect/drawer-right',
        'plugin': 'node_modules/plugin/dist/plugin.min',
        'shade': 'node_modules/shade/dist/shade.min',
        'deckard': 'node_modules/deckard/dist/deckard.min',
        'lockup': 'node_modules/lockup/dist/lockup',
        'pikabu': 'dist/pikabu'
    },
    'shim': {
        'mocha': {
            init: function() {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        },
        '$': {
            exports: '$'
        }
    }
});
