'use strict';

var app = angular.module('jDashboardFluxApp', [
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
  'infinite-scroll',
  'ui.tree'
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
// env = 'prod';
if (env == "prod") {
    app.constant('API_URL', 'https://api.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'https://auth.alkemics.com');
    angular.module('jDashboardFluxApp').constant('URL_SERVICE_MEDIA', 'https://service-media.alkemics.com');
    // app.constant('URL_SERVICE_MEDIA', 'http://localhost.alkemics.com:6551');

    // app.config(function($logProvider){
    //     $logProvider.debugEnabled(true);
    // });

} else if (env == "dev") {
    app.constant('API_URL', '//localhost.alkemics.com:6543');
    app.constant('URL_SERVICE_AUTH', 'http://localhost.alkemics.com:6545');
    app.constant('URL_SERVICE_MEDIA', 'http://localhost.alkemics.com:6551');
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
        controller: 'DashboardMakerProductListCtrl',
    });
    $routeProvider.when('/maker/brand/:id/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id', {
        templateUrl: 'src/maker/product/show/marketing/marketing.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/marketing', {
        templateUrl: 'src/maker/product/show/marketing/marketing.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/packaging', {
        templateUrl: 'src/maker/product/show/packaging/packaging.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/manufacturer', {
        templateUrl: 'src/maker/product/show/manufacturer/manufacturer.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/identification', {
        templateUrl: 'src/maker/product/show/identification/identification.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/media', {
        templateUrl: 'src/maker/product/show/media/media.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/composition', {
        templateUrl: 'src/maker/product/show/composition/composition.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/nutrition', {
        templateUrl: 'src/maker/product/show/nutrition/nutrition.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/label', {
        templateUrl: 'src/maker/product/show/label/label.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/conservation', {
        templateUrl: 'src/maker/product/show/conservation/conservation.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/traceability', {
        templateUrl: 'src/maker/product/show/traceability/traceability.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/productinshop', {
        templateUrl: 'src/maker/product/show/productinshop/productinshop.html',
        controller: 'DashboardMakerProductShowCtrl',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:id/version', {
        templateUrl: 'src/maker/product/show/version/version.html',
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
        controller: 'RegisterCtrl',
        isPublic: true
    });

    $routeProvider.when('/faq', {
        templateUrl: 'src/home/faq.html',
        controller: 'FaqCtrl',
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

    $routeProvider.when('/settings', {
        redirectTo: '/settings/profile'
    });
    $routeProvider.when('/settings/profile', {
        templateUrl: 'src/settings/index.html',
        controller: 'SettingsCtrl'
    });
    $routeProvider.when('/settings/organization/:id/access', {
        templateUrl: 'src/settings/organization/members/members_access.html',
        controller: 'SettingsOrganizationMembersAccessCtrl'
    });
    $routeProvider.when('/settings/organization/:id/members', {
        templateUrl: 'src/settings/organization/members/members.html',
        controller: 'SettingsOrganizationMembersCtrl'
    });
    $routeProvider.when('/settings/organization/:id/members/new', {
        templateUrl: 'src/settings/organization/members/new.html',
        controller: 'SettingsOrganizationMembersNewCtrl'
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
