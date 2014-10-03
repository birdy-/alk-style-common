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
// env = 'vagrant';
// env = 'prod';
if (env === 'prod') {
    app.constant('API_URL', 'https://api.alkemics.com:6543');
    app.constant('URL_SERVICE_AUTH', 'https://auth.alkemics.com:6545');
    app.constant('URL_SERVICE_MEDIA', 'https://service-media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'https://assets.toc.io/ui/button/product/v1/index.html');
    app.constant('URL_CDN_MEDIA', 'https://smedia.alkemics.com');
    angular.module('jDashboardFluxApp').constant('URL_SERVICE_MEDIA', 'https://service-media.alkemics.com');
} else if (env === 'dev') {
    app.constant('API_URL', '//localcore.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'http://localauth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'http://localhost.alkemics.com:6551');
    // app.constant('URL_UI_BUTTON_PRODUCT', 'http://localhost.alkemics.com:9010/');
    app.constant('URL_UI_BUTTON_PRODUCT', 'http://assets.toc.io/ui/button/product/v1/index.html');
    app.constant('URL_CDN_MEDIA', 'https://s3-eu-west-1.amazonaws.com/pprd.media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'http://localhost.alkemics.com:9010/');
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
} else if (env === 'vagrant') {
    app.constant('API_URL', 'https://localcore.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'https://localauth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'https://localservice-media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'http://localhost.alkemics.com:9010/');
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
    $routeProvider.when('/maker/brand/:productReference_reference/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data', {
        templateUrl: 'src/maker/product/show/general/general.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/general', {
        templateUrl: 'src/maker/product/show/general/general.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/packaging', {
        templateUrl: 'src/maker/product/show/packaging/packaging.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/manufacturer', {
        templateUrl: 'src/maker/product/show/manufacturer/manufacturer.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/identification', {
        templateUrl: 'src/maker/product/show/identification/identification.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/media', {
        templateUrl: 'src/maker/product/show/media/media.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/composition', {
        templateUrl: 'src/maker/product/show/composition/composition.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/nutrition', {
        templateUrl: 'src/maker/product/show/nutrition/nutrition.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/label', {
        templateUrl: 'src/maker/product/show/label/label.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/conservation', {
        templateUrl: 'src/maker/product/show/conservation/conservation.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/productinshop', {
        templateUrl: 'src/maker/product/show/productinshop/productinshop.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/data/version', {
        templateUrl: 'src/maker/product/show/version/version.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/merchandising', {
        templateUrl: 'src/maker/product/show/merchandising/merchandising.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/search', {
        templateUrl: 'src/maker/product/show/search/search.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/segment', {
        templateUrl: 'src/maker/product/show/segment/segment.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });
    $routeProvider.when('/maker/product/:productReference_reference/marketing', {
        templateUrl: 'src/maker/product/show/marketing/marketing.html',
        controller: 'DashboardMakerProductShowController',
        parameter: {id: 'integer'}
    });

    // Product Specific show
    $routeProvider.when('/maker/product/:productReference_reference/data/specific/wine', {
        templateUrl: 'src/maker/product/show/specific/wine.html',
        controller: 'DashboardMakerProductShowWineController',
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

    $routeProvider.when('/prehome', {
        templateUrl: 'src/user/login/prehome.html',
        controller: 'PreHomeController',
        isPublic: true
    });

    // ------------------------------------------------------------------------------------------
    // Timeline views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/timeline', {
        templateUrl: 'src/retailer/notifications.html',
        controller: 'DashboardRetailerNotificationsController',
    });

    // ------------------------------------------------------------------------------------------
    // Statistics views
    // ------------------------------------------------------------------------------------------
    $routeProvider.when('/retailer', {
        templateUrl: 'src/retailer/statistics/index.html',
        controller: 'RetailerDataStatisticsController',
    });

    $routeProvider.when('/retailer/products', {
        templateUrl: 'src/retailer/statistics/product.html',
        controller: 'RetailerProductStatisticsController',
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


// Mock for development
if (env === 'dev') {
    app.config(function($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    });
    app.run(function($httpBackend) {
        $httpBackend.whenGET(new RegExp('/media/v2/picture/entitye')).respond({
            data: [
                {
                    updatedAt: "2014-08-31T15:46:34",
                    fileEffectiveStartDateTime: "2014-08-31T15:46:34",
                    fileEffectiveEndDateTime: "2014-08-31T15:46:34",
                    uniformResourceIdentifier: "https://smedia.alkemics.com/product/2558/picture/packshot/256x256.png"
                },
                {
                    updatedAt: "2014-08-31T15:46:34",
                    fileEffectiveStartDateTime: "2014-08-31T15:46:34",
                    fileEffectiveEndDateTime: "2014-08-31T15:46:34",
                    uniformResourceIdentifier: "https://smedia.alkemics.com/product/2559/picture/packshot/256x256.png"
                },
                {
                    updatedAt: "2014-08-31T15:46:34",
                    fileEffectiveStartDateTime: "2014-08-31T15:46:34",
                    fileEffectiveEndDateTime: "2014-08-31T15:46:34",
                    uniformResourceIdentifier: "https://smedia.alkemics.com/product/2559/picture/packshot/256x256.png"
                }
            ]
        });
        $httpBackend.whenJSONP().passThrough();
        $httpBackend.whenGET().passThrough();
        $httpBackend.whenPOST().passThrough();
        $httpBackend.whenPUT().passThrough();
        $httpBackend.whenGET().passThrough();
    });
}
