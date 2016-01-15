module.exports = function(grunt) {
    return {
        tagRelease: {
            command: 'git tag -a <%= releaseName %> -m "<%= releaseMessage %>" &&' +
                'git push origin <%= releaseName %>'
        }
    };
};