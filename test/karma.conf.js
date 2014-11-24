// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    preprocessors: {
      'app/src/**/*.html': ['ng-html2js']
    },

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-animate/angular-animate.js',
      //'app/bower_components/angular-gravatar/build/angular-gravatar.js',
      //'app/bower_components/angular-gravatar/build/md5.js',
      'app/bower_components/angular-http-auth/src/http-auth-interceptor.js',
      'app/bower_components/angular-md5/angular-md5.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      //'app/bower_components/angular-scenario/angular-scenario.js',
      //'app/bower_components/angular-slider/slider.js',
      //'app/bower_components/angular-ui/build/angular-ui.js',
      //'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-ui-select2/src/select2.js',
      'app/bower_components/angular-ui-sortable/sortable.js',
      'app/bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'app/bower_components/angular-ui-utils/ui-utils.js',
      'app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
      //'app/bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      //'app/bower_components/d3/d3.js',
      //'app/bower_components/es5-shim/es5-sham.js',
      //'app/bower_components/es5-shim/es5-shim.js',
      'app/bower_components/infinite-scroll/build/ng-infinite-scroll.js',
      'app/bower_components/jquery/jquery.js',
      //'app/bower_components/jquery-ui/jquery-ui.js',
      //'app/bower_components/json3/lib/json3.js',
      'app/bower_components/handsontable/dist/jquery.handsontable.full.js',
      'app/bower_components/nghandsontable/dist/ngHandsontable.js',
      //'app/bower_components/nvd3/nv.d3.js',
      //'app/bower_components/plupload/js/plupload.full.min.js',
      //'app/bower_components/select2/select2.js',
      'app/bower_components/textAngular/dist/textAngular-sanitize.min.js',
      'app/bower_components/textAngular/dist/textAngular.min.js',
      'app/bower_components/sdk-dashboard/src/*.js',
      'app/src/app.js',
      'app/src/common/model/common.model.js',
      'app/src/**/*.html',
      'app/src/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      prependPrefix: '/',
      moduleName: 'alkDashboardFluxTemplates'
    },

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    reporters: ['dots', 'junit'],
    junitReporter: {
      outputFile: 'dashboard-flux-test-results.xml',
      suite: 'unit'
    },
    coverageReporter: {
      type : 'cobertura',
      dir : 'target/coverage/'
    },
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
