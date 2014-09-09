module.exports = function(grunt) {
    return {
        options: {
            browsers: ['last 4 versions', 'ie 8', 'ie 9', 'Android 2.3']
        },
        multiple_files: {
            flatten: true,
            src: 'dist/*.css'
        }
    };
};