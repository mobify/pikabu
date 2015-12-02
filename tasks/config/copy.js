module.exports = function(grunt) {
    return {
        main: {
            files: [
                {
                    expand: true,
                    cwd: 'src/js',
                    src: ['**/*.js'],
                    dest: 'dist/',
                    filter: 'isFile'
                }
            ]
        }
    };
};
