module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
		 	compass: {
	    	files: ['./src/sass/*.sass'],
	    	tasks: ['compass']
	    },
      babel: {
        files: ['./src/js/*.js'],
        tasks: ['babel']
      }
		},
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/js/slammer.js': 'src/js/slammer.js'
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

  grunt.registerTask('default', ['watch']);

};
