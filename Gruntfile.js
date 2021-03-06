module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      'datePicker': {
        src: [
          'ui-date-picker/intro.js',
          'ui-date-picker/date-util.js',
          'ui-date-picker/date-picker-calendar.js',
          'ui-date-picker/outtro.js'
        ],
        dest:  'ui-date-picker/build/date-picker.js'
      },

      'queue': {
        src: [
          'Queue/intro.js',
          'Queue/utils.js',
          'Queue/Queue.js',
          'Queue/outro.js'
        ],
        dest: 'Queue/build/queue-dev.js'

      },

      'md2html': {
        src: [
          'md2html/intro.js',
          'md2html/element.js',
          'md2html/md2html.js',
          'md2html/outro.js'
        ],
        dest: 'md2html/build/md2html.js'
      }
    },

    testacular: {
      unit: {
        configFile: 'testacular.conf.js'
      }
    },

    watch: {
      cancat: {
        files: [
            'Queue/*.js'
          , 'ui-date-picker/*.js'
          , 'md2html/*.js'
        ],
        tasks: 'concat'
      },
      testacular:{
        files:['Queue/*.js', 'ui-date-picker/*.js'],
        tasks:['testacular:unit:run']       //NOTE the :run flag
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  //  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('gruntacular');

  grunt.registerTask('default', 'concat');

}