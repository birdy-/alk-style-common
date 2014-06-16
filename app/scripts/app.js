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
if (env == "prod") {
    angular.module('jDashboardFluxApp').constant('API_URL', '//api.alkemics.com');
    angular.module('jDashboardFluxApp').constant('API_URL_AUTH', '//auth.alkemics.com');
} else if (env == "dev") {
    angular.module('jDashboardFluxApp').constant('API_URL', '//localhost.alkemics.com:6543');
    angular.module('jDashboardFluxApp').constant('API_URL_AUTH', 'http://localhost.alkemics.com:6545');
}

angular.module('jDashboardFluxApp').config(function ($routeProvider) {

    // ------------------------------------------------------------------------------------------
    // Product views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/maker/product', {
        templateUrl: 'views/maker/product/list/index.html',
        controller: 'DashboardMakerProductListCtrl',
    });
    $routeProvider.when('/maker/product/:id', {
        templateUrl: 'views/maker/product/show/index.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });

    // ------------------------------------------------------------------------------------------
    // Brand views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/maker/brand/:id', {
        templateUrl: 'views/maker/brand/show.html',
        controller: 'DashboardMakerBrandShowCtrl'
    });
    $routeProvider.when('/maker/brand', {
        templateUrl: 'views/maker/brand/list.html',
        controller: 'DashboardMakerBrandListCtrl'
    });

    // ------------------------------------------------------------------------------------------
    // Notification views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/maker/notifications', {
        templateUrl: 'views/maker/notifications.html',
        controller: 'DashboardMakerNotificationsCtrl'
    });
    $routeProvider.when('/maker/home', {
        templateUrl: 'views/maker/notifications.html',
        controller: 'DashboardMakerNotificationsCtrl',
    });

    // ------------------------------------------------------------------------------------------
    // Security views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        isPublic: true
    });
    $routeProvider.when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
    });
    $routeProvider.when('/getstarted', {
        templateUrl: 'views/maker/getstarted/index.html',
        controller: 'DashboardMakerGetStartedCtrl'
    });

    // ------------------------------------------------------------------------------------------
    // Home views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        isPublic: true
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
<<<<<<< HEAD



/**
 * $http interceptor.
 * Add token to every request that is issued to the apis.
 */
angular.module('jDashboardFluxApp').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$window', function($window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            }
        };
    }]);
}]);
=======
>>>>>>> d47c3480152197fe2462277da0428c2e0ec01bd9
