module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= pkg.repository.url%>) */\n'
        },
        build: {
            files: {
                'dist/deckard.min.js': 'src/js/deckard.js'
            }
        }
    };
};