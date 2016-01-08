module.exports = function(grunt) {
    var jslint = require('../jslinting');
    var jshintrcPath = 'node_modules/mobify-code-style/javascript/.jshintrc';

    return {
        prod: {
            src: grunt.option('file') || jslint.targets,
            options: {
                force: false,
                ignores: jslint.excludes,
                jshintrc: jshintrcPath
            }
        },
        dev: {
            src: grunt.option('file') || jslint.targets,
            options: {
                force: true,
                ignores: jslint.excludes,
                jshintrc: jshintrcPath
            }
        }
    };
};