module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'ui-date-picker/intro.js',
          'ui-date-picker/date-util.js',
          'ui-date-picker/date-picker-calendar.js',
          'ui-date-picker/outtro.js'
        ],
        dest:  'ui-date-picker/date-picker.js'
      },

      dist: {
        src: [
          'Queue/intro.js',
          'Queue/Queue.js',
          'Queue/outro.js'
        ],
        dest: 'Queue/queue-dev.js'

      }
    },

    testacular: {
      unit: {
        configFile: 'testacular.conf.js'
      }
    },

    watch: {
      cancat: {
        files: ['Queue/*.js', 'ui-date-picker/*.js'],
        tasks: 'concat'
      },
      testacular:{
        files:['Queue/*.js', 'ui-date-picker/*.js', 'test/*/unit/*.js'],
        tasks:['testacular:unit:run']       //NOTE the :run flag
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
//  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
//  grunt.loadNpmTasks('gruntacular');

  grunt.registerTask('default', 'concat');

}