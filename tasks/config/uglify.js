module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= pkg.repository.url%>) */\n'
        },
        build: {
            files: {
                'dist/pikabu.min.js': 'src/js/pikabu.js',
                'dist/effect/drawer-left.min.js': 'src/js/effect/drawer-left.js'
            }
        }
    };
};
