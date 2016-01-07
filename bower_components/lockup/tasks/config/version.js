module.exports = function(grunt) {
    return {
        dist: {
            options: {
                prefix: 'VERSION\\s*=\\s*[\\\'|"]'
            },
            src: ['dist/lockup.js', 'dist/lockup.min.js']
        },
        bower: {
            options: {
                prefix: '"version":\\s*"'
            },
            src: ['bower.json']
        }
    }
};