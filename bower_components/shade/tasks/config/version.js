module.exports = function(grunt) {
    return {
        dist: {
            options: {
                prefix: 'VERSION\\s*=\\s*[\\\'|"]'
            },
            src: ['dist/shade.js', 'dist/shade.min.js']
        },
        bower: {
            options: {
                prefix: '"version":\\s*"'
            },
            src: ['bower.json']
        }
    }
};