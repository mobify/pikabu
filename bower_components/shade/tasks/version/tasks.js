module.exports = function(grunt) {
    grunt.registerTask('version:all', ['version:dist', 'version:bower']);
    grunt.registerTask('version', ['version:all']);
};