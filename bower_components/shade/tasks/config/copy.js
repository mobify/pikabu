module.exports = function(grunt) {
    return {
        main: {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['src/**/*.js'],
                    dest: 'dist/',
                    filter: 'isFile'
                }
            ]
        }
    };
};