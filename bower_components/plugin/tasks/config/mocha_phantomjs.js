module.exports = function(grunt) {
    return {
        all: {
            options: {
                urls: ['http://localhost:' + (grunt.option('p') || 8888) + '/tests/runner/']
            }
        }
    };
};