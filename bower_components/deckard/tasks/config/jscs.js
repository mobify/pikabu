module.exports = function(grunt) {
    var jslint = require('../jslinting');

    return {
        prod: {
            src: jslint.targets,
            options: {
                force: false,
                config: 'node_modules/mobify-code-style/javascript/.jscsrc',
                excludeFiles: jslint.excludes
            }
        },
        dev: {
            src: jslint.targets,
            options: {
                force: true,
                config: 'node_modules/mobify-code-style/javascript/.jscsrc',
                excludeFiles: jslint.excludes
            }
        }
    };
};