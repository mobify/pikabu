module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= pkg.repository.url%>) */\n'
        },
        build: {
            files: {
                'dist/pinny.min.js': 'src/js/pinny.js',
                'dist/effect/modal-center.min.js': 'src/js/effect/modal-center.js',
                'dist/effect/sheet-top.min.js': 'src/js/effect/sheet-top.js',
                'dist/effect/sheet-bottom.min.js': 'src/js/effect/sheet-bottom.js',
                'dist/effect/sheet-left.min.js': 'src/js/effect/sheet-left.js',
                'dist/effect/sheet-right.min.js': 'src/js/effect/sheet-right.js'
            }
        }
    };
};
