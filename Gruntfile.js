module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	cssmin: {
	   dist: {
		  files: {
			 'dist/css/style.min.css': ['src/css/**/*.css']  // destination : source
		  }
	   }
	},
	
	concat: {
	  options: {
		separator: ';',
	  },
	  dist: {
		// the files to concatenate
		src: ['src/**/*.js'],
		// the location of the resulting JS file
		dest: 'dist/js/<%= pkg.name %>.js'
	  },
	},
	
	uglify: {
	   dist: {
		  files: {
			 'dist/js/NeighborhoodMap.js': ['dist/js/NeighborhoodMap.js']  // destination : source
		  }
	   }
	},
	
	processhtml: {
        build: {
            files: {
                'index.html' : ['src/index.html']  // destination : source
            }
        }
    },
		
	htmlmin: {                                     // Task 
	  dist: {                                      // Target 
		options: {                                 // Target options 
		  removeComments: false,
		  collapseWhitespace: true
		},
		files: {                                   // Dictionary of files 
		  'index.html': 'index.html'               // 'destination': 'source' 
		}
	  }
	},
	
	
  });

  // Default task(s)
  grunt.registerTask('default', ['cssmin', 'concat', 'uglify', 'processhtml', 'htmlmin']);

};