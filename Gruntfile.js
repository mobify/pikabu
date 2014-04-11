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
        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 3000,
                    middleware: function(connect, options) {
                        return [
                            connect.static(__dirname),
                            connect.directory(__dirname)
                        ]
                    }
                }
            }
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
        compass: {
            options: {
                config: 'config.rb',
                cssDir: '../build',
                outputStyle: 'compressed'
            },
            dist: {
                clean: true,
                force: true
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['src/pikabu.js'], dest: 'build/', filter: 'isFile'}
                ]  
            }  
        },
        zip: {
            "build/pikabu.zip": ["src/pikabu.js", "src/pikabu.css", 
            "src/pikabu-theme.css"]
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
                    dest: "modules/pikabu/<%= pkg.version %>/",
                    rel: "build"
                }
            ]
        },
        qunit: {
            files: ['tests/**/*.html']
        },
        release: {
            options: {
                folder: '.',
                npm: false,
                bump: false,
                add: false,
                commit: false,
                file: 'bower.json',
                github: {
                    repo: 'mobify/pikabu',
                    usernameVar: 'GITHUB_USERNAME',
                    passwordVar: 'GITHUB_TOKEN'
                }
            }
        }
    });

    // Load the task plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-release');

    // Default task(s).
    grunt.registerTask('build', ['uglify', 'compass', 'zip', 'copy']);
    grunt.registerTask('publish', ['build', 'release', 's3']);
    grunt.registerTask('default', 'build');
    grunt.registerTask('serve', ['connect:server:keepalive']);
    grunt.registerTask('test', ['connect', 'qunit']);
};