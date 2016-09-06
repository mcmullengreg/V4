module.exports = function (grunt){
	
	// Show execution time
	require('time-grunt')(grunt);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// JS tasks
		jshint: {
			files:['Gruntfile.js', '_src/javascripts/**/*.js'], // Add more files to array
			options: {
				reporter: require('jshint-stylish')
			}
		},
		concat: {
			main: {
				src: ['_src/javascripts/*.js'],
				dest: 'javascripts/main.js'
			},
			admin: {
				src: [
					'bower_components/nestable/jquery.nestable.js',
					'_src/javascripts/admin/*.js'
				],
				dest: 'javascripts/admin.js'
			},
			vendor: {
				// combine some vendor scripts for production, to reduce requests
				src: [
					'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
					'bower_components/devbridge-autocomplete/dist/jquery.autocomplete.js',
					'bower_components/owl.carousel/dist/owl.carousel.js',
					'bower_components/aos/dist/aos.js'
				],
				dest: 'javascripts/vendor.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true
			},
			prod: {
				files: {
					'javascripts/main.min.js' : ['javascripts/main.js'],
					'javascripts/vendor.min.js': ['javascripts/vendor.js'],
					'javascripts/plugins.min.js' : ['javascripts/plugins.js'],
					'javascripts/admin.min.js' : ['javascripts/admin.js']	
				}
			}	
		},
		// Image tasks
		imagemin: {
			dynamic: {                         // Another target
				files: [{
					expand: true,                  // Enable dynamic expansion
					cwd: '_src/img/',                   // Src matches are relative to this path
					src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
					dest: 'img/'                  // Destination path prefix
				}]
			}
		},
		// CSS tasks
		compass: {
			dev: {
				options: {
					sassDir: '_src/sass',
					cssDir: 'css',
					environment: 'development',
					outputStyle: 'nested'
					
				}
			},
			prod: {
				options: {
					sassDir: '_src/sass',
					cssDir: 'css',
					environment: 'production',
					outputStyle: 'compressed'
				}
			},
			clean: {
				options: {
					clean: true
				}
			}
		},
		postcss: {
			options: {
				processors: [
					require('autoprefixer')({
						browsers: ['last 2 versions']
					})
				]
			},
			dist: {
				src: 'css/**/*.css'
			}
		},
		copy: {
			fonts: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['bower_components/fontawesome/fonts/*'],
						dest: 'fonts/',
						filter: 'isFile'
					}
				]
			},
			aos: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['bower_components/aos/dist/*.css'],
						dest: '_src/sass/partials/vendor/',
						filter: 'isFile',
						rename: function(dest,src){
							return dest + "_" + src.replace(/\.css$/, ".scss");
						}
					}
				]
			},
			jquery: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['bower_components/jquery/dist/jquery.min.js'],
						dest: 'javascripts/',
						filter: 'isFile'
					}
				]
			},
			customjs: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['_src/javascripts/custom/*.js'],
						dest: 'javascripts/',
						filter: 'isFile'
					}
				]
			}
		},
		
		// Watch should always be the last task, just because.
		watch: {
			dev:{
				files: ['_src/sass/**/*.{scss,sass}', '_src/javascripts/**/*.js', '_src/img/**/*.{svg,png,jpg,gif'],
				tasks: ['dev']
			},
			prod: {
				files: ['_src/sass/**/*.{scss,sass}', '_src/javascripts/**/*.js', '_src/img/**/*.{svg,png,jpg,gif'],
				tasks: ['prod']
			}
		}
	});
	
	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	// Register Tasks
	grunt.registerTask('check', ['jshint']);
	grunt.registerTask('default', ['watch:dev']);
	
	grunt.registerTask('dev', ['newer:jshint', 'newer:concat', 'newer:uglify', 'compass:dev', 'newer:postcss', 'copy:customjs', 'newer:imagemin', 'watch:dev']);
	grunt.registerTask('prod', ['newer:jshint', 'newer:concat', 'newer:uglify', 'compass:prod', 'newer:postcss', 'copy:customjs', 'newer:imagemin', 'watch:prod']);
};