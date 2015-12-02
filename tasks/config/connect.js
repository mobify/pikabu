module.exports = function(grunt) {
    return {
        server: {
            options: {
                hostname: '0.0.0.0',
                port: 3000,
                base: '.'
            }
        },
        test: {
            options: {
                hostname: '0.0.0.0',
                port: 8888,
                base: '.'
            }
        }
    };
};