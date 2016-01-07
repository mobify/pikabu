module.exports = function(grunt) {
    return {
        options: {
            banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= pkg.repository.url%>) */\n'
        },
        build: {
            files: {
                'dist/lockup.min.js': 'src/js/lockup.js'
            }
        }
    };
};
