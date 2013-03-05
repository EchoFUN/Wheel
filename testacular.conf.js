// Testacular configuration
// Generated on Wed Jan 16 2013 01:06:56 GMT+0800 (CST)


// base path, that will be used to resolve files and exclude
basePath = './test/';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,

  // date-picker-script
  '../ui-date-picker/date-util.js',
  'ui-date-picker/unit/date-util.js',

  // Queue test
  '../Queue/Queue.js',
  'Queue/unit/queue-test.js',

  //md2html test
  '../md2html/element.js',
  '../md2html/md2html.js',
  'md2html/unit/regexp-test.js',
  'md2html/unit/parse-test.js'

];


// list of files to exclude
exclude = [
  
];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome', 'PhantomJS', 'Safari'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 15000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
