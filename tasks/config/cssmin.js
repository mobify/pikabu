module.exports = function(grunt) {
    return {
        core: {
            src: 'dist/pikabu.css',
            dest: 'dist/pikabu.min.css'
        },
        style: {
            src: 'dist/pikabu-theme.css',
            dest: 'dist/pikabu-theme.min.css'
        }
    };
};