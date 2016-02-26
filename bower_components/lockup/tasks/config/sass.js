module.exports = function(grunt) {
    return {
        dist: {
            options: {
                style: 'nested',
                sourcemap: 'none'
            },
            files: [{
                expand: true,
                cwd: 'src/style',
                src: ['*.scss'],
                dest: 'dist',
                ext: '.css'
            }]
        }
    };
};
