/* global module, require */

'use strict';

module.exports = function(grunt) {
  
  // JS files to be concatenated and compacted (in build priority order)
  var jsOrder = [
    '<%= meta.srcPath %>/js/vendor/jquery2.js',
    '<%= meta.srcPath %>/js/vendor/underscore.js',
    '<%= meta.srcPath %>/js/vendor/backbone.js',
    '<%= meta.srcPath %>/js/vendor/*.js',
    '<%= meta.srcPath %>/js/*.js'
  ];
  
  // Project configuration.
  grunt.initConfig({
    
    //Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),
    
    // Metadata.
    meta: {
      projectName: '<%= pkg.name %>',
      projectVersion: '<%= pkg.version %>',
      srcPath: 'src',
      buildPath: 'build/assets',
      distPath: 'dist',
      distFilename: '<%= meta.projectName %>-<%= meta.projectVersion %>__<%= grunt.template.today("yyyy-mm-dd") %>'
    },
    
    // Task configuration:
    // SASS
    sass: {
      dev: {
        options: {
          style: 'expanded',
          require: 'susy'
        },
        files: {
          '<%= meta.buildPath %>/styles/<%= meta.projectName %>.css': '<%= meta.srcPath %>/scss/main.scss'
        }
      },
      build: {
        options: {
          style: 'compressed',
          sourcemap: false,
          require: 'susy'
        },
        files: {                         
          '<%= meta.buildPath %>/styles/<%= meta.projectName %>.css': '<%= meta.srcPath %>/scss/main.scss'
        }
      }
    },
    
    // Concat
    concat: {
      options: {
        separator: ' ',
        stripBanners: true,
        banner: '/*! <%= meta.projectName %> v<%= meta.projectVersion %> [<%= grunt.template.today("yyyy-mm-dd") %>] */',
      },
      application: {
        src: [jsOrder],
        dest: '<%= meta.buildPath %>/scripts/<%= meta.projectName %>.js',
      },
    },
    
    // Copy
    copy: {
      images: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= meta.srcPath %>/img/**',  '!<%= meta.srcPath %>/img/**/*.psd'],
            dest: '<%= meta.buildPath %>/images',
            filter: 'isFile'
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= meta.srcPath %>/fonts/**'],
            dest: '<%= meta.buildPath %>/styles/fonts',
            filter: 'isFile'
          }
        ]
      }
    },
    
    // Uglify 
    uglify: {
      options: {
        screwIE8: true
      },
      my_target: {
        files: {
          '<%= meta.buildPath %>/scripts/<%= meta.projectName %>.js': '<%= meta.buildPath %>/scripts/<%= meta.projectName %>.js'
        }
      }
    },
    
    // CSS min
    cssmin: {
      minify: {
        options: {},
        files: {
          '<%= meta.buildPath %>/styles/<%= meta.projectName %>.css': '<%= meta.buildPath %>/styles/<%= meta.projectName %>.css'
        }
      }
    },
    
    // Compress
    compress: {
      main: {
        options: {
          archive: '<%= meta.distPath %>/<%= meta.distFilename %>.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'build',
            src: ['*'],
            dest: '<%= meta.distFilename %>'
          },
          {
            expand: true,
            cwd: 'build/assets',
            src: ['**'],
            dest: '<%= meta.distFilename %>/assets'
          },
        ]
      }
    },
    
    // Imagemin
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd:    '<%= meta.buildPath %>/img',
            src:    ['**/*.{png,jpg,gif}'],
            dest:   '<%= meta.buildPath %>/images/'
          }
        ]
      }
    },
    
    // Watch
    watch: {
      sass: {
        files: ['<%= meta.srcPath %>/scss/**/*.scss'],
        tasks: ['sass:dev']
      },
      javascripts: {
        files: ['<%= meta.srcPath %>/js/**/*.js'],
        tasks: ['concat']
      },
      images: {
        files: [
          '<%= meta.srcPath %>/images/**/*.jpg',
          '<%= meta.srcPath %>/images/**/*.png',
          '<%= meta.srcPath %>/images/**/*.gif',
          '<%= meta.srcPath %>/images/**/*.svg'
        ],
        tasks: ['copy:images']
      },
      fonts: {
        files: ['<%= meta.srcPath %>/fonts/**/*.*'],
        tasks: ['copy:fonts']
      }
    },
    
    clean: [
      "<%= meta.buildPath %>",
      "<%= meta.distPath %>"
    ]
    
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
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  
  // Default 
  grunt.registerTask('default', ['sass:dev', 'concat', 'copy']);
  
  // Build (dev)
  grunt.registerTask('build', ['clean', 'sass:build', 'concat', 'copy', 'uglify', 'cssmin', 'imagemin']);
  
  // Dist tast
  grunt.registerTask('dist', ['clean', 'sass:build', 'concat', 'copy', 'uglify', 'cssmin', 'imagemin', 'compress']);
  
};
