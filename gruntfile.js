module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      compass: {
        files: ['./src/sass/*.sass'],
        tasks: ['compass']
      },
      browserify: {
        files: ['./src/js/*.js'],
        tasks: ['browserify']
      },
      babel: {
        files: ['./src/js/*.js'],
        tasks: ['babel']
      }
		},
    browserify: {
      client: {
        src: ['./src/js/index.js'],
        dest: './src/js/comp.js'
      }
    },
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/js/slammer.js': 'src/js/comp.js'
        }
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: ['src/sass'],
          cssDir: ['dist/css'],
          environment: 'development'
				}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['watch']);

};
