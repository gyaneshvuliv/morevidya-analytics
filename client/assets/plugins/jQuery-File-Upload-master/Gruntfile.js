/*
 * jQuery File Upload Gruntfile
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'js/cors/*.js',
        'js/*.js',
        'server/node/server.js',
        'test/test.js'
      ]
    },
    concat: {
      dist: {
        src: [
          'js/vendor/jquery.ui.widget.js',
          'js/jquery.iframe-transport.js',
          'js/jquery.fileupload.js',
          'js/jquery.fileupload-process.js',
          'js/jquery.fileupload-image.js',
          'js/jquery.fileupload-audio.js',
          'js/jquery.fileupload-video.js',
          'js/jquery.fileupload-validate.js',
          'js/jquery.fileupload-angular.js',
          'js/app.js'
        ],
        dest: 'dist/uploader.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/uploader.min.js': ['dist/uploader.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bump-build-git');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['test']);

};