module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= pkg.repository.url%>) */\n'
        },
        build: {
            src: 'src/js/plugin.js',
            dest: 'dist/plugin.min.js'
        }
    };
};