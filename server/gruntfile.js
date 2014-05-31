module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('default', ['jshint', 'express:dev', 'mochaTest']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    grunt.initConfig({
        jshint: {
            files: ['./lib/recordjs/*.js'], //['gruntFile.js', 'package.json', '*.js', './lib/*.js','./lib/**/*.js','./test/*.js', './test/**/*.js'],
            options: {
                browser: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true,
                node: true,
                expr: true,
                globals: {
                    'xit': true,
                    'xdescribe': true,
                    'it': true,
                    'describe': true,
                    'before': true,
                    'after': true,
                    'done': true
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: './server.js'
                }
            }
        },
        watch: {
            all: {
                files: ['./lib/**/index.js', 'config.js', 'gruntFile.js', './models/*.js'],
                tasks: ['default']
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: '10000'
                },
                src: ['test/api/*.js', 'test/api/**/*.js', 'test/unit/*.js', 'test/record/*.js', 'test/*.js', 'test/e2e/match/components/*.js', 'test/e2e/match/*.js']
            }
        }
    });

};
