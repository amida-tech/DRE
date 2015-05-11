// Generated on 2014-11-03 using generator-angular 0.9.8
'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };
    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        yeoman: appConfig,

        //protratorjs
        protractor: {
            options: {
                configFile: "test/conf.js", // Default config file
                keepAlive: true
            },
            all: {},
        },
        // Watches files for changes and runs tasks based on the changed files
        // this is used only for development
        // linting files and recompiling SASS/Compass styles
        watch: {
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:dev']
            },
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js']
            },
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
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                exclude: ['app/bower_components/bootstrap/'],
                ignorePath: /\.\.\//
            },
            sass: {
                src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /(\.\.\/){1,2}app\/bower_components\//
            }
        },
        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: './app/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            },
            dev: { // Another target
                options: {
                    sassDir: 'app/styles',
                    cssDir: 'app/styles',
                    debugInfo: false
                }
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
        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        uglify: {
           dist: {
             files: [{
               expand: true,
               cwd: '.tmp/scripts',
               src: '{,*/}*.js',
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
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '.',
                    src: 'app/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
                    flatten: true,
                    dest: '<%= yeoman.dist %>/fonts'
                }, {
                    expand: true,
                    cwd: '.',
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
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            scripts: {
                expand: true,
                cwd: '<%= yeoman.app %>/scripts',
                dest: '.tmp/scripts/',
                src: '{,*/}*.js'
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: ['compass:server'],
            dist: ['compass:dist', 'imagemin', 'svgmin', 'htmlmin']
        },
    });
    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run(['clean:server', 'wiredep', 'concurrent:server', 'autoprefixer', 'connect:livereload', 'watch']);
    });
    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });
    //Fully minified/clean build.
    grunt.registerTask('build', ['jshint', 'clean:dist', 'wiredep', 'autoprefixer', 'copy:dist', 'copy:styles', 'copy:scripts', 'concurrent:dist', 'cdnify', 'uglify', 'cssmin']);
    grunt.registerTask('default', ['newer:jshint']);
    grunt.registerTask('dev', ['jshint', 'compass:dev', 'watch']);
    grunt.registerTask('test', ['jshint', 'compass:dev','protractor', 'watch']);
    grunt.registerTask('release', []);
};
