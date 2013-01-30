module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'js/src/ui-date-picker/intro.js',
          'js/src/ui-date-picker/date-util.js',
          'js/src/ui-date-picker/date-picker-calendar.js',
          'js/src/ui-date-picker/outtro.js'
        ],
        dest:  'js/src/ui-date-picker/date-picker.js'
      }
    },
//    less: {
//      'css/do-what.css': 'less/do-what.less',
//      'js/src/ui-date-picker/date-picker.css': 'js/src/ui-date-picker/less/date-picker.less'
//    },

    watch: {
      cancat: {
        files: '<config:concat.dist.src>',
        tasks: 'concat'
      }
//      less: {
//        files: ['less/*.less', 'js/src/ui-date-picker/less/*.less'],
//        tasks: 'less'
//      }
    }
  });

  // less task
  //  grunt.loadNpmTasks('grunt-contrib-less');
  // Default task.
  grunt.registerTask('default', 'concat'/*less*/);

}