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

    // Making grunt default to force in order not to break the project.
    //grunt.option('force', true); //DISABLED, not good idea in general

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'jsbeautifier:beautify', 'env:test', 'express:dev', 'mochaTest']);

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
    grunt.registerTask('build', ['jshint', 'jsbeautifier:beautify', 'clean:dist', 'wiredep', 'compass:dev']);
    grunt.registerTask('dev', ['jshint', 'jsbeautifier:beautify', 'compass:dev', 'watch']);
    grunt.registerTask('test', ['jshint', 'jsbeautifier:beautify', 'compass:dev', 'protractor:populate', 'protractor:medications', 'protractor:scenarios', 'watch']);
    grunt.registerTask('release', ['jshint', 'jsbeautifier:beautify', 'clean:dist', 'wiredep', 'autoprefixer', 'copy:dist', 'copy:styles', 'copy:scripts', 'concurrent:dist', 'cdnify', 'uglify', 'cssmin']);
    grunt.registerTask('travis-protractor', ['protractor:populate', 'protractor:medications', 'protractor:scenarios', ]);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
            files: [
                'Gruntfile.js', 'package.json', '*.js', './lib/*.js', './lib/**/*.js', './test/*.js', './test/**/*.js', '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!./lib/dre/remove_dups.js', '!./test/coverage/lcov-report/**/*.js'
            ],
            options: {
                reporter: require('jshint-stylish'),
                "bitwise": true,
                "browser": false,
                "camelcase": false,
                "curly": true,
                "eqeqeq": true,
                "esnext": true,
                "expr": true,
                "globals": {
                    "$": false,
                    "DeepDiff": false,
                    "_": true,
                    "after": true,
                    "angular": false,
                    "before": true,
                    "describe": true,
                    "done": true,
                    "it": true,
                    "moment": false,
                    "Promise": true,
                    "xdescribe": true,
                    "xit": true
                },
                "immed": true,
                "indent": 4,
                "latedef": "nofunc",
                "multistr": true,
                "newcap": true,
                "noarg": true,
                "node": true,
                "quotmark": false,
                "regexp": true,
                "smarttabs": true,
                "trailing": true,
                "undef": true,
                "unused": false
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
        // Empties client folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['client/.tmp', '<%= yeoman.dist %>/{,*/}*', '!<%= yeoman.dist %>/.git*']
                }]
            },
            server: 'client/.tmp'
        },
        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                exclude: ['client/app/bower_components/bootstrap/'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}app\/bower_components\//
            }
        },
        //protratorjs
        protractor: {
            options: {
                configFile: "client/test/conf.js", // Default config file 
                keepAlive: false,
            },
            populate: {
                options: {
                    args: {
                        suite: 'populate'
                    }
                }
            },
            scenarios: {
                options: {
                    args: {
                        suite: 'scenarios'
                    }
                }
            },
            medications: {
                options: {
                    args: {
                        suite: 'medications'
                    }
                }
            }
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'client/.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: 'client/.tmp/styles/'
                }]
            }
        },
        compass: { //from client
            options: {
                sassDir: 'client/app/styles',
                cssDir: 'client/.tmp/styles',
                generatedImagesDir: 'client/.tmp/images/generated',
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
        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        // The following *-min tasks will produce minified files in the dist folder
        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/views',
                    src: ['{,*/}*.html'],
                    dest: '<%= yeoman.dist %>/views'
                }]
            }
        },
        uglify: {
            dist: {
                options: {
                    mangle: false
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/scripts',
                    src: '{,**/}*.js',
                    dest: '<%= yeoman.dist %>/scripts'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css'
                    ]
                }
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: ['*.{ico,png,txt}', '.htaccess', '*.html', 'views/{,*/}*.html', 'views/templates/{,*/}*.html', 'views/record/{,*/}*.html', 'images/{,*/}*.{webp}', 'fonts/*']
                }, {
                    expand: true,
                    cwd: 'client/.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: 'client',
                    src: 'app/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
                    flatten: true,
                    dest: '<%= yeoman.dist %>/fonts'
                }, {
                    expand: true,
                    cwd: 'client',
                    src: 'app/bower_components/font-awesome/fonts/*',
                    flatten: true,
                    dest: '<%= yeoman.dist %>/fonts'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components',
                    src: '**/*',
                    dest: '<%= yeoman.dist %>/bower_components'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: 'client/.tmp/styles/',
                src: '{,*/}*.css'
            },
            scripts: {
                expand: true,
                cwd: '<%= yeoman.app %>/scripts',
                dest: 'client/.tmp/scripts/',
                src: '{,**/}*.js'
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            default: ['nodemon', 'watch'],
            test: ['env:test', 'nodemon', 'watch', 'mochaTest'],
            server: ['compass:server'],
            dist: ['compass:dist', 'imagemin', 'svgmin', 'htmlmin'],
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
                command: "./cover.sh"
            }
        }
    });
};
