'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    //grunt.loadNpmTasks('grunt-node-inspector');
    //grunt.loadNpmTasks('grunt-csslint');
    //grunt.loadNpmTasks('grunt-ng-annotate');
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-karma');

    // Unified Watch Object
    var watchFiles = {
        serverJS: ['Gruntfile.js', 'server.js', 'lib/**/*.js'],
        clientViews: ['client/app/views/**/*.html', 'client/app/index.html'],
        clientJS: ['client/app/scripts/**/*.js'],
        clientCSS: ['client/app/styles/*.css'],
        mochaTests: ['test/unit/*.js', 'test/e2e/**/*.js', 'test/e2e/*.js']
    };

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            serverJS: {
                files: watchFiles.serverJS,
                tasks: ['jshint', 'jsbeautifier'],
                options: {
                    livereload: true
                }
            },
            clientViews: {
                files: watchFiles.clientViews,
                options: {
                    livereload: true,
                }
            },
            clientJS: {
                files: watchFiles.clientJS,
                tasks: ['jshint', 'jsbeautifier'],
                options: {
                    livereload: true
                }
            },
            clientCSS: {
                files: watchFiles.clientCSS,
                //tasks: ['csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            files: ['gruntFile.js', 'package.json', '*.js', './lib/*.js', './lib/**/*.js', './test/*.js', './test/**/*.js'], //['./test/unit/*.js'], 
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
        jsbeautifier: {
            beautify: {
                src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/**/*.js', '*.js', 'test/xmlmods/*.json', 'client/app/scripts/**/*.js', 'client/app/scripts/*.js', 'client/app/views/*.html', 'client/app/views/**/*.html', 'client/app/*.html'],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            check: {
                src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/**/*.js', '*.js', 'test/xmlmods/*.json', 'client/app/scripts/**/*.js', 'client/app/scripts/*.js', 'client/app/views/*.html', 'client/app/views/**/*.html', 'client/app/*.html'],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    //nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: watchFiles.serverJS
                }
            }
        },
        /*        'node-inspector': {
                    custom: {
                        options: {
                            'web-port': 3000,
                            'web-host': 'localhost',
                            'debug-port': 5858,
                            'save-live-edit': true,
                            'no-preload': true,
                            'stack-trace-limit': 50,
                            'hidden': []
                        }
                    }
                }, */
        concurrent: {
            default: ['nodemon', 'watch'],
            //test: ['nodemon', 'watch', 'node-inspector', 'mochaTest'], //'karma:unit'
            test: ['env:test', 'nodemon', 'watch', 'mochaTest'], //'karma:unit'
            //test: ['nodemon', 'mochaTest'], //'karma:unit'
            options: {
                logConcurrentOutput: true,
                limit: 10
            }
        },
        env: {
            options: {
                //Shared Options Hash 
            },
            all: {
                src: ["env/*"],
                options: {
                    envdir: true
                }
            },
            test: {
                DBname: 'devtests'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: '10000'
                },
                src: watchFiles.mochaTests
            }
        },
        express: {
            dev: {
                options: {
                    script: './server.js'
                }
            }
        },
        execute: {
            target: {
                src: ['./lib/benchmark/index.js']
            }
        }
        /*        karma: {
                    unit: {
                        configFile: 'karma.conf.js'
                    }
                } */
    });

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // Default task(s).
    grunt.registerTask('default', ['env:test', 'express:dev', 'mochaTest']);

    grunt.registerTask('benchmark', ['execute']);

    // Test task.
    //grunt.registerTask('test', ['env:test', 'jshint', 'lint', 'concurrent:test']);
    grunt.registerTask('live', ['concurrent:default']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });

    // Lint task(s).
    //grunt.registerTask('lint', ['jshint', 'csslint']);
};
