module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-recess');
  //grunt.loadNpmTasks('grunt-karma');
  //grunt.loadNpmTasks('grunt-html2js');

  // Default task.

  grunt.registerTask('default', ['jshint', 'build']);
  grunt.registerTask('build', ['clean', 'copy:assets', 'copy:partials', 'copy:vendor',  'concat']);
  //grunt.registerTask('default', ['jshint','build','karma:unit']);
  //grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  //grunt.registerTask('release', ['clean','html2js','uglify','jshint','karma:unit','concat:index', 'recess:min','copy:assets']);
  //grunt.registerTask('test-watch', ['karma:watch']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  //var karmaConfig = function(configFile, customOptions) {
  //  var options = { configFile: configFile, keepalive: true };
  //  var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
  //  return grunt.util._.extend(options, customOptions, travisOptions);
  //};

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
      ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    clean: ['<%= distdir %>/*'],
    src: {
      js: ['src/app/app.js', 'src/app/**/*.js', 'src/common/**/*.js'],
      html: ['src/index.html']
    },
    watch: {
      all: {
        files: ['src/**/*.js', 'test/**/*.js', 'src/**/*.html', 'src/**/*.tpl.html'],
        tasks: ['default']
      }
    },
    copy: {
      assets: {
        files: [{
          dest: '<%= distdir %>',
          src: '**',
          expand: true,
          cwd: 'src/assets/'
        }]
      },
      partials: {
        files: [{
          dest: '<%= distdir %>/templates',
          src: '**/*.tpl.html',
          expand: true,
          cwd: 'src/app'
        }]
      },
      vendor: {
        files: [{
          dest: '<%= distdir %>/fonts',
          src: ['bootstrap/fonts/*'],
          expand: true,
          flatten: true,
          cwd: 'src/vendor'
        }]
      }
    },
    concat: {
      dist: {
        options: {
          banner: "<%= banner %>"
        },
        src: ['<%= src.js %>'],
        dest: '<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      css: {
        src: ['src/vendor/bootstrap/css/bootstrap.min.css', 'src/vendor/font-awesome/font-awesome.min.css', 'src/vendor/fontello/css/merging.css'],
        dest: '<%= distdir %>/<%= pkg.name %>.css'
      },
      angular: {
        src: ['src/vendor/angular/angular.js', 'src/vendor/angular/angular-route.js'],
        dest: '<%= distdir %>/angular.js'
      },
      underscore: {
        src: ['src/vendor/underscore/underscore.js'],
        dest: '<%= distdir %>/underscore.js'
      },
      jquery: {
        src: ['src/vendor/jquery/*.js'],
        dest: '<%= distdir %>/jquery.js'
      },
      bootstrap: {
        src: ['src/vendor/bootstrap/js/bootstrap.min.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      moment: {
        src: ['src/vendor/moment/moment.min.js'],
        dest: '<%= distdir %>/moment.js'
      }
    },
    jshint: {
      files: ['gruntFile.js', 'package.json', '<%= src.js %>'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        globals: {}
      }
    }
  });

};
