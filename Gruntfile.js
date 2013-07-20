module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        localConfig: (function(){ 
                        try { 
                            return grunt.file.readJSON('localConfig.json') 
                        } catch(e) {
                            return {};
                        }
                    })(),
        releaseName: '<%= pkg.name %>-<%= pkg.version %>',
        releaseMessage: '<%= pkg.name %> release <%= pkg.version %>',
        clean: {
            buildProducts: "build/"
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/pikabu.js',
                dest: 'build/pikabu.min.js'
            }
        },
        cssmin: {
            core: {
                src: 'src/pikabu.css',
                dest: 'build/pikabu.min.css'
            },
            style: {
                src: 'src/pikabu-style.css',
                dest: 'build/pikabu-style.min.css'
            }
        },
        shell: {
            tagRelease: {
                command: 'git tag -a <%= releaseName %> -m "<%= releaseMessage %>" &&' +
                  'git push origin <%= releaseName %>'
            }
        },
        zip: {
            "build/pikabu.zip": ["src/pikabu.js", "src/pikabu.css", 
            "src/pikabu-style.css"]
        },
        s3: {
            key: '<%= localConfig.aws.key %>',
            secret: '<%= localConfig.aws.secret %>',
            bucket: '<%= localConfig.aws.bucket %>',
            access: "public-read",
            headers: { "Cache-Control": "max-age=1200" },
            upload: [
                { // build
                    src: "build/*",
                    dest: "pikabu/<%= pkg.version %>/",
                    rel: "build"
                }
            ]
        }
        // TODO: upload over a LATEST version and/or create a redirect?
    });

    // Load the task plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-clean');

    // Default task(s).
    grunt.registerTask('build', ['uglify', 'cssmin', 'zip']);
    grunt.registerTask('release', ['build', 'shell:tagRelease', 's3'])
    grunt.registerTask('default', 'build')

};