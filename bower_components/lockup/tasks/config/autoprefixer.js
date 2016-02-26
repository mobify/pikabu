module.exports = function(grunt) {
    return {
        options: {
            browsers: ['last 4 versions', 'ie 8', 'ie 9', 'iOS >= 6.0', 'Android >= 2.3', 'last 4 ChromeAndroid versions']
        },
        multiple_files: {
            flatten: true,
            src: 'dist/*.css'
        }
    };
};