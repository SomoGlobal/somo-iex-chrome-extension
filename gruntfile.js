module.exports = function(grunt) {
    
    // JS files to be concatenated
    var jsList = [
      '<%= meta.srcPath %>js/jquery.min.js',
      '<%= meta.srcPath %>js/main.js'
    ]

    // Vars for Tasks
    var autoprefixer = require('autoprefixer-core');


    // Project configuration.
    grunt.initConfig({
 
      //Read the package.json (optional)
      pkg: grunt.file.readJSON('package.json'),

      // Metadata.
      meta: {
        buildPath: 'assets/',
        srcPath: 'src/',
        deliverPath: 'deliverable/',
      },


      // Task configuration:
      // SASS
      sass: {
        dev: {
          options: {
            style: 'expanded',
            sourcemap: true,
            require: 'susy'
          },
          files: {                         
            '<%= meta.buildPath %>style.css': '<%= meta.srcPath %>css/style.scss'
          }
        },
        build: {
          options: {
            style: 'compressed',
            require: 'susy'
          },
          files: {                         
            '<%= meta.buildPath %>style.css': '<%= meta.srcPath %>css/style.scss'
          }
        }
      },


      // Concat
      concat: {
        options: {
          separator: ' ',
          stripBanners: true,
          banner: '/*! <%= meta.projectName %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
        },
        application: {
          src: [jsList],
          dest: '<%= meta.buildPath %>main.js',
        },
      },

      // Copy
        copy: {
          images: {
            files: [
              {expand: true, flatten: true, src: ['<%= meta.srcPath %>images/**',  '!<%= meta.srcPath %>images/**/*.psd'], dest: '<%= meta.buildPath %>', filter: 'isFile'}
            ]
          },

          fonts: {
            files: [
              {expand: true, flatten: true, src: ['<%= meta.srcPath %>fonts/**'], dest: '<%= meta.buildPath %>', filter: 'isFile'}
            ]
          },

          videos: {
            files: [
              {expand: true, flatten: true, src: ['<%= meta.srcPath %>videos/**'], dest: '<%= meta.buildPath %>', filter: 'isFile'}
            ]
          },
      },

      // Uglify 
      uglify: {
        options: {
          mangle: false
        },
        my_target: {
          files: {
            '<%= meta.buildPath %>main.js': '<%= meta.buildPath %>main.js',
          }
        }
      },

      // CSS min
      cssmin: {
        minify: {
          options: {
          },
          files: {
            '<%= meta.buildPath %>style.css': '<%= meta.buildPath %>style.css'
            }
        }
      },

      // Compress
      compress: {
        main: {
          options: {
            archive: '<%= meta.deliverPath %><%= pkg.name %>-<%= grunt.template.today("yyyy-mm-dd") %>.zip'
          },
          files: [
            {expand: true, cwd: 'assets/', src: ['**'], dest: '<%= pkg.name %>-<%= grunt.template.today("yyyy-mm-dd") %>/assets/'},
            {expand: true, src: ['index.html'], dest: '<%= pkg.name %>-<%= grunt.template.today("yyyy-mm-dd") %>/'}
          ]
        }
      },

      // Post CSS
      postcss: {
          options: {
              processors: [
                autoprefixer({ 
                  browsers: ['last 6 versions'],
                }).postcss
              ]
          },
          dist: { src: '<%= meta.buildPath %>style.css' }
      },

      // Imagemin
      imagemin: {
        dynamic: {
          files: [{
            expand: true,
            cwd:    '<%= meta.buildPath %>',
            src:    ['**/*.{png,jpg,gif}'],
            dest:   '<%= meta.buildPath %>'
          }]
        }
      },
     
      // Watch
      watch: {
        sass: {
            files: ['<%= meta.srcPath %>css/**/*.scss'],
            tasks: ['sass:dev', 'postcss']
        },
        javascripts: {
          files: ['<%= meta.srcPath %>js/**/*.js'],
          tasks: ['concat']
        },
        images: {
          files: ['<%= meta.srcPath %>images/**/*.jpg','<%= meta.srcPath %>/images/**/*.png','<%= meta.srcPath %>/images/**/*.gif','<%= meta.srcPath %>/images/**/*.svg'],
          tasks: ['copy:images']
        },
        fonts: {
          files: ['<%= meta.srcPath %>fonts/**/*.*'],
          tasks: ['copy:fonts']
        },
        videos: {
          files: ['<%= meta.srcPath %>videos/**/*.*'],
          tasks: ['copy:videos']
        },
      },

      clean: ["<%= meta.buildPath %>", "<%= meta.deliverPath %>"]
 
    });
 
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
 
    // Default task.
    grunt.registerTask('default', ['sass:dev', 'postcss', 'concat', 'copy']);

    // Build Task
    grunt.registerTask('build', ['clean', 'sass:build', 'postcss', 'concat', 'copy', 'uglify', 'cssmin', 'imagemin']);

};
