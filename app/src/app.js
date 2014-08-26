'use strict';

var app = angular.module('jDashboardFluxApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'http-auth-interceptor',
  'ui.select2',
  'ui.bootstrap',
  'ngSanitize',
  'angular-md5',
  'sdk-dashboard',
  'infinite-scroll',
  'ui.sortable',
  'ui.tree',
  'nvd3ChartDirectives'
]);

// Update on each deploy
app.constant('version', '0.2');

app.factory('jquery', [
'$window',
function($window) {
  return $window.jQuery;
}
]);

app.factory('plupload', [
'$window',
function($window) {
  return $window.plupload;
}
]);


var env = (window.location.hostname.indexOf('localhost') === 0) ? 'dev' : 'prod';
env = 'vagrant';
if (env === 'prod') {
    app.constant('API_URL', 'https://api.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'https://auth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'https://service-media.alkemics.com');
    app.constant('URL_CDN_MEDIA', 'https://smedia.alkemics.com');
    
    angular.module('jDashboardFluxApp').constant('URL_SERVICE_MEDIA', 'https://service-media.alkemics.com');

} else if (env === 'dev') {
    app.constant('API_URL', '//localhost.alkemics.com:6543');
    app.constant('URL_SERVICE_AUTH', 'http://localhost.alkemics.com:6545');
    app.constant('URL_SERVICE_MEDIA', 'http://localhost.alkemics.com:6551');
    app.constant('URL_CDN_MEDIA', 'https://s3-eu-west-1.amazonaws.com/pprd.media.alkemics.com');
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
} else if (env === 'vagrant') {

    app.constant('API_URL', 'https://localcore.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'https://localauth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'https://localservice-media.alkemics.com');
    app.constant('URL_CDN_MEDIA', 'https://s3-eu-west-1.amazonaws.com/pprd.media.alkemics.com');
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
}

app.config(function ($routeProvider) {

    // ------------------------------------------------------------------------------------------
    // Maker views
    // ------------------------------------------------------------------------------------------

    // Product views
    $routeProvider.when('/maker/brand/all/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListController'
    });
    $routeProvider.when('/maker/brand/:id/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data', {
        templateUrl: 'src/maker/product/show/general/general.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/general', {
        templateUrl: 'src/maker/product/show/general/general.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/packaging', {
        templateUrl: 'src/maker/product/show/packaging/packaging.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/manufacturer', {
        templateUrl: 'src/maker/product/show/manufacturer/manufacturer.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/identification', {
        templateUrl: 'src/maker/product/show/identification/identification.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/media', {
        templateUrl: 'src/maker/product/show/media/media.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/composition', {
        templateUrl: 'src/maker/product/show/composition/composition.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/nutrition', {
        templateUrl: 'src/maker/product/show/nutrition/nutrition.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/label', {
        templateUrl: 'src/maker/product/show/label/label.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/conservation', {
        templateUrl: 'src/maker/product/show/conservation/conservation.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/productinshop', {
        templateUrl: 'src/maker/product/show/productinshop/productinshop.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/data/version', {
        templateUrl: 'src/maker/product/show/version/version.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/merchandising', {
        templateUrl: 'src/maker/product/show/merchandising/merchandising.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/search', {
        templateUrl: 'src/maker/product/show/search/search.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/segment', {
        templateUrl: 'src/maker/product/show/segment/segment.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/marketing', {
        templateUrl: 'src/maker/product/show/marketing/marketing.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });

    // Brand views
    $routeProvider.when('/maker/brand/:id', {
        templateUrl: 'src/maker/brand/show/show.html',
        controller: 'DashboardMakerBrandShowController'
    });
    $routeProvider.when('/maker/brand', {
        templateUrl: 'src/maker/brand/list/list.html',
        controller: 'DashboardMakerBrandListController'
    });

    $routeProvider.when('/getstarted', {
        templateUrl: 'src/home/maker/getstarted/index.html',
        controller: 'DashboardMakerGetStartedController'
    });

    // Notification views
    $routeProvider.when('/maker/notifications', {
        templateUrl: 'src/maker/notification/list/list.html',
        controller: 'DashboardMakerNotificationsController'
    });
    // Home views
    $routeProvider.when('/maker/home', {
        templateUrl: 'src/maker/notification/list/list.html',
        controller: 'DashboardMakerNotificationsController'
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
        controller: 'RegisterController',
        isPublic: true
    });

    $routeProvider.when('/faq', {
        templateUrl: 'src/home/faq.html',
        controller: 'FaqController',
        isPublic: true
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
    // Settings views
    // ------------------------------------------------------------------------------------------

    $routeProvider.when('/user/me/profile', {
        templateUrl: 'src/user/profile/me/index.html',
        controller: 'UserProfileShowController'
    });
    $routeProvider.when('/user/:id/profile', {
        templateUrl: 'src/user/profile/show/index.html',
        controller: 'UserProfileShowController'
    });

    $routeProvider.when('/organization/:id/profile', {
        templateUrl: 'src/organization/profile/index.html',
        controller: 'OrganizationProfileShowController'
    });

    // ------------------------------------------------------------------------------------------
    // Home views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/', {
        templateUrl: 'src/home/home.html',
        controller: 'HomeController',
        isPublic: true
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
