
module.exports = function(grunt) {
    grunt.registerTask('lint:dev', ['jshint:dev', 'jscs:dev']);
    grunt.registerTask('lint:prod', ['jshint:prod', 'jscs:prod']);
    grunt.registerTask('lint', ['lint:dev']);
};