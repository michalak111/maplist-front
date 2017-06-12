'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    banner: " /* Jan Michalak */\n",

    uglify:{
      options: {
        mangle:true,
      },

      main: {
        src: "src/assets/js/source/main.js",
        dest: "src/assets/js/main.min.js"
      },
      vendor : {
        src: "src/assets/js/source/vendor.js",
        dest: "src/assets/js/vendor.min.js"
      }
    },
    jshint: {
      options: {
        eqeqeq: true,
        curly: true,
      },

      target: {
        src: "src/assets/js/source/main.js",
      }
    },

    concat: {
      options: {
        seperator: ";",
        banner: " /* Jan Michalak */\n",
      },

      target: {
        src:[
          "src/assets/js/source/vendor/jquery-3.1.0.min.js",
          "src/assets/js/source/vendor/jquery.autocomplete.js",
          "src/assets/js/source/vendor/featherlight.js",
          "src/assets/js/source/vendor/featherlight.gallery.js",
        ],
        dest: "src/assets/js/source/vendor.js",
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'src/assets/css/styles.css': 'src/assets/css/source/styles.scss',
        }
      }
    },

    watch: {
      source:{
        files: [
          'src/assets/js/source/main.js',
          'src/assets/css/source/{,*/}*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
    },

    express:{
      all:{
        options:{
          bases: ['./src'],
          port: 8080,
          hostname: "0.0.0.0",
          livereload: true
        }
      }
    },

    open: {
      all: {
        path: 'http://localhost:8080/index.html'
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask("default", ['concat','uglify','sass']);
  grunt.registerTask("dev", ['express','open','watch:source']);
};
