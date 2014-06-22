'use strict';

angular.module('jDashboardFluxApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.select2',
  'ui.bootstrap',
  'uiSlider',
  'ngSanitize',
  'angular-md5',
  'sdk-dashboard',
  'ui.gravatar',
  'infinite-scroll'
]);

var env = (window.location.hostname.indexOf('localhost') === 0) ? 'dev' : 'prod';
env = 'prod';
if (env == "prod") {
    angular.module('jDashboardFluxApp').constant('API_URL', 'https://api.alkemics.com');
    angular.module('jDashboardFluxApp').constant('URL_SERVICE_AUTH', 'https://auth.alkemics.com');
} else if (env == "dev") {
    angular.module('jDashboardFluxApp').constant('API_URL', '//localhost.alkemics.com:6543');
    angular.module('jDashboardFluxApp').constant('URL_SERVICE_AUTH', 'http://localhost.alkemics.com:6545');
}

angular.module('jDashboardFluxApp').config(function ($routeProvider) {

    // ------------------------------------------------------------------------------------------
    // Maker views
    // ------------------------------------------------------------------------------------------

    // Product views
    $routeProvider.when('/maker/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListCtrl',
    });
    $routeProvider.when('/maker/product/:id', {
        templateUrl: 'src/maker/product/show/index.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });

    // Brand views
    $routeProvider.when('/maker/brand/:id', {
        templateUrl: 'src/maker/brand/show/show.html',
        controller: 'DashboardMakerBrandShowCtrl'
    });
    $routeProvider.when('/maker/brand', {
        templateUrl: 'src/maker/brand/list/list.html',
        controller: 'DashboardMakerBrandListCtrl'
    });

    $routeProvider.when('/getstarted', {
        templateUrl: 'src/home/maker/getstarted/index.html',
        controller: 'DashboardMakerGetStartedCtrl'
    });

    // Notification views
    $routeProvider.when('/maker/notifications', {
        templateUrl: 'src/maker/notification/list/list.html',
        controller: 'DashboardMakerNotificationsCtrl'
    });
    // Home views
    $routeProvider.when('/maker/home', {
        templateUrl: 'src/maker/notification/list/list.html',
        controller: 'DashboardMakerNotificationsCtrl',
    });

    // ------------------------------------------------------------------------------------------
    // Security views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/login', {
        templateUrl: 'src/user/login/index.html',
        controller: 'LoginController',
        isPublic: true
    });

    $routeProvider.when('/register', {
        templateUrl: 'src/home/register.html',
        controller: 'RegisterCtrl'
    });

    $routeProvider.when('/account/send_password_reset', {
        templateUrl: 'src/user/account/send_password_reset.html',
        controller: 'PasswordResetController',
        isPublic: true
    });

    $routeProvider.when('/account/reset_email_sent', {
        templateUrl: 'src/user/account/reset_email_sent.html',
        controller: 'PasswordResetController',
        isPublic: true
    });

    $routeProvider.when('/account/password_reset', {
        templateUrl: 'src/user/account/password_reset.html',
        controller: 'PasswordResetController',
        isPublic: true
    });


    // ------------------------------------------------------------------------------------------
    // Home views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/', {
        templateUrl: 'src/home/home.html',
        controller: 'HomeCtrl',
        isPublic: true
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
