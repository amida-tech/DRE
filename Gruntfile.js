'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Unified Watch Object
    var watchFiles = {
        serverJS: ['Gruntfile.js', 'server.js', 'lib/**/*.js'],
        clientViews: ['client/app/views/**/*.html', 'client/app/index.html'],
        clientJS: ['client/app/scripts/**/*.js'],
        clientCSS: ['client/app/styles/*.css'],
        clientSCSS: ['client/app/styles/{,*/}*.{scss,sass}'],
        mochaTests: ['test/unit/*.js', 'test/e2e/**/*.js', 'test/e2e/*.js']
    };
    
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: require('./bower.json').distPath || 'dist'
    };

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
/*        protractor: { //protratorjs (from client)
            options: {
                configFile: "client/test/conf.js", // Default config file
                keepAlive: true
            },
            all: {},
        },
        */
        // Project settings
        yeoman: appConfig,
        
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
            },
            clientSCSS: {
                files: watchFiles.clientSCSS,
                tasks: ['compass:dev'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            files: ['gruntFile.js', 'package.json', '*.js', './lib/*.js', './lib/**/*.js', './test/*.js', './test/**/*.js'], //['./test/unit/*.js'],
            options: {
                reporter: require('jshint-stylish'),
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
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['.tmp', '<%= yeoman.dist %>/{,*/}*', '!<%= yeoman.dist %>/.git*']
                }]
            },
            server: '.tmp'
        },
        compass: { //from client
            options: {
                sassDir: 'client/app/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: 'client/app/images',
                javascriptsDir: 'client/app/scripts',
                fontsDir: 'client/app/styles/fonts',
                importPath: 'client/app/bower_components',
                httpImagesPath: 'client/app/images',
                httpGeneratedImagesPath: 'client/app/images/generated',
                httpFontsPath: 'client/app/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: './client/app/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            },
            dev: { // Another target
                options: {
                    sassDir: './client/app/styles',
                    cssDir: './client/app/styles',
                    debugInfo: false
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
        },
        shell: {
            run_istanbul: {
                command: "istanbul cover ./node_modules/mocha/bin/_mocha -- -R spec --recursive"
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
    grunt.registerTask('default', ['env:test', 'express:dev', 'mochaTest', 'jshint']);

    // Run benchmark tests
    grunt.registerTask('benchmark', ['execute']);
    
    // Not ready for use
    grunt.registerTask('coverage', ['shell:run_istanbul']);

    // Test task.
    //grunt.registerTask('test', ['env:test', 'jshint', 'lint', 'concurrent:test']);
    grunt.registerTask('live', ['concurrent:default']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });

    // Client tasks 
    grunt.registerTask('build', ['jshint', 'clean:dist', 'wiredep', 'compass:dev']);
    grunt.registerTask('dev', ['jshint', 'compass:dev', 'watch']);
    grunt.registerTask('test', ['jshint', 'compass:dev','protractor', 'watch']);
    grunt.registerTask('release', ['jshint', 'clean:dist', 'wiredep', 'autoprefixer', 'copy:dist', 'copy:styles', 'copy:scripts', 'concurrent:dist', 'cdnify', 'uglify', 'cssmin']);


    // Lint task(s).
    //grunt.registerTask('lint', ['jshint', 'csslint']);
};
