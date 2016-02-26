require.config({
    baseUrl: '../../',
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'fixtures': 'tests/fixtures',
        'bouncefix': 'bower_components/bouncefix.js/dist/bouncefix.min',
        '$': 'lib/zeptojs/dist/zepto',
        'velocity': 'bower_components/mobify-velocity/velocity',
        'chai': 'node_modules/chai/chai',
        'mocha': 'node_modules/mocha/mocha',
        'drawer-left': 'dist/effect/drawer-left',
        'drawer-right': 'dist/effect/drawer-right',
        'plugin': 'bower_components/plugin/dist/plugin.min',
        'shade': 'bower_components/shade/dist/shade.min',
        'deckard': 'bower_components/deckard/dist/deckard.min',
        'lockup': 'bower_components/lockup/dist/lockup',
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
