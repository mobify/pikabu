module.exports = function(grunt) {
    return {
        core: {
            src: 'dist/pinny.css',
            dest: 'dist/pinny.min.css'
        },
        style: {
            src: 'dist/pinny-theme.css',
            dest: 'dist/pinny-theme.min.css'
        }
    };
};