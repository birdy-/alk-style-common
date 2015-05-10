'use strict';

var app = angular.module('jDashboardFluxApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'http-auth-interceptor',
  'ui.select2',
  'ui.bootstrap',
  'ngSanitize',
  'angular-md5',
  'sdk-dashboard',
  'infinite-scroll',
  'ui.sortable',
  'ui.tree',
  'ui.unique',
  'textAngular',
  'ngHandsontable',
  'ngToast',
  // 'nvd3ChartDirectives',
  'angulartics',
  'angulartics.google.analytics'
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

var env = 'prod';
if (window.location.hostname.indexOf('localhost') === 0) {
    env = 'vagrant';
} else if (window.location.hostname.indexOf('preprod-') === 0) {
    env = 'preprod';
}

if (env === 'prod') {
    app.constant('URL_CDN_MEDIA', 'https://smedia.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'https://auth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'https://service-media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'https://sassets.toc.io/ui/button/product/v1/index.html');
    app.constant('URL_UI_SHOPPINGLIST', 'https://sassets.toc.io/interfaces/banner/v3/index.html');
    app.constant('URL_UI_LANDINGPAGE', 'https://sassets.toc.io/interfaces/landing-page-product/v1/index.html');
} else if (env === 'preprod') {
    app.constant('URL_CDN_MEDIA', 'http://pprd.media.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'http://preprod-auth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'http://preprod-service-media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'https://sassets.toc.io/ui/button/product/v1/index.html');
    app.constant('URL_UI_SHOPPINGLIST', 'https://sassets.toc.io/interfaces/banner/v3/index.html');
    app.constant('URL_UI_LANDINGPAGE', 'https://sassets.toc.io/interfaces/landing-page-product/v1/index.html');
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
} else if (env === 'dev') {
    app.constant('URL_CDN_MEDIA', 'https://smedia.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'http://localauth.alkemics.com');
    app.constant('URL_SERVICE_MEDIA', 'http://localservice-media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'https://sassets.toc.io/ui/button/product/v1/index.html');
    app.constant('URL_UI_SHOPPINGLIST', 'https://sassets.toc.io/interfaces/banner/v3/index.html');
    app.constant('URL_UI_LANDINGPAGE', 'https://sassets.toc.io/interfaces/landing-page-product/v1/index.html');
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
} else if (env === 'vagrant') {
    app.constant('URL_CDN_MEDIA', 'https://s3-eu-west-1.amazonaws.com/pprd.media.alkemics.com');
    app.constant('URL_SERVICE_AUTH', 'http://192.168.50.2:6545');
    app.constant('URL_SERVICE_MEDIA', 'http://localservice-media.alkemics.com');
    app.constant('URL_UI_BUTTON_PRODUCT', 'http://localhost.alkemics.com:9010/');
    app.constant('URL_UI_SHOPPINGLIST', 'https://sassets.toc.io/interfaces/banner/v3/index.html');
    app.constant('URL_UI_LANDINGPAGE', 'https://sassets.toc.io/interfaces/landing-page-product/v1/index.html');
    app.config(function($logProvider){
        $logProvider.debugEnabled(true);
    });
}
angular.module('sdk-dashboard').constant('APPLICATION_ID', 'UA-0000-3');

// ==========================================================================================
//                                          TRACKING
// ==========================================================================================

app.config(['$analyticsProvider', function($analyticsProvider){
    $analyticsProvider.firstPageview(false);
}]);

// ==========================================================================================
//                                          ROUTING
// ==========================================================================================

app.config(function ($routeProvider) {

    // ------------------------------------------------------------------------------------------
    // Maker views
    // ------------------------------------------------------------------------------------------

    // Notification views
    $routeProvider.when('/maker/activity', {
        templateUrl: 'src/maker/notification/list/list.html',
        controller: 'DashboardMakerNotificationsController'
    });

    // Product views
    $routeProvider.when('/maker/brand/all/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListController',
        reloadOnSearch: false
    });
    $routeProvider.when('/maker/brand/:id/product', {
        templateUrl: 'src/maker/product/list/index.html',
        controller: 'DashboardMakerProductListController',
        parameter: {id: 'integer'},
        reloadOnSearch: false
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

    // Resources views
    $routeProvider.when('/maker/resources/faq', {
        templateUrl: 'src/maker/resources/faq/faq.html',
        controller: 'MakerFaqController'
    });
    $routeProvider.when('/maker/resources/tutorial', {
        templateUrl: 'src/maker/resources/tutorial/tutorial.html',
        controller: 'MakerTutorialController'
    });
    $routeProvider.when('/maker/resources/procedures', {
        templateUrl: 'src/maker/resources/procedures/procedures.html',
        controller: 'MakerProceduresController'
    });

    // Activation views
    $routeProvider.when('/dmp/activation/campaign', {
        templateUrl: 'src/dmp/activation/campaign/list.html',
        controller: 'DmpActivationCampaignListController'
    });
    $routeProvider.when('/dmp/activation/shoppinglist', {
        templateUrl: 'src/dmp/activation/shoppinglist/show.html',
        controller: 'DmpActivationShoppingListShowController'
    });
    $routeProvider.when('/dmp/activation/shoppinglist/:id', {
        templateUrl: 'src/dmp/activation/shoppinglist/show.html',
        controller: 'DmpActivationShoppingListShowController'
    });
    $routeProvider.when('/dmp/activation/button', {
        templateUrl: 'src/dmp/activation/button/show.html',
        controller: 'DmpActivationButtonShowController'
    });
    $routeProvider.when('/dmp/activation/button/:id', {
        templateUrl: 'src/dmp/activation/button/show.html',
        controller: 'DmpActivationButtonShowController'
    });
    $routeProvider.when('/dmp/activation/landingpage', {
        templateUrl: 'src/dmp/activation/landingpage/show.html',
        controller: 'DmpActivationButtonShowController'
    });
    $routeProvider.when('/dmp/activation/landingpage/:id', {
        templateUrl: 'src/dmp/activation/landingpage/show.html',
        controller: 'DmpActivationButtonShowController'
    });
    $routeProvider.when('/dmp/activation/landingpage', {
        templateUrl: 'src/dmp/activation/landingpage/show.html',
        controller: 'DmpActivationButtonShowController'
    });
    $routeProvider.when('/dmp/activation/buy-it-now', {
        templateUrl: 'src/dmp/activation/buy-it-now/show.html',
        controller: 'DmpActivationBuyItNowShowController'
    });
    $routeProvider.when('/dmp/activation/buy-it-now/:id', {
        templateUrl: 'src/dmp/activation/buy-it-now/show.html',
        controller: 'DmpActivationBuyItNowShowController'
    });

    // Analytics views

    $routeProvider.when('/dmp/analytics/campaign/:id', {
        templateUrl: 'src/dmp/analytics/campaign/show.html',
        controller: 'DmpAnalyticsCampaignShowController'
    });

    // ProductSegment views
    $routeProvider.when('/maker/productsegment/:id/validate', {
        templateUrl: 'src/maker/productsegment/show/validator/validate.html',
        controller: 'ProductSegmentValidatorController'
    });


    // ------------------------------------------------------------------------------------------
    // Retailer views
    // ------------------------------------------------------------------------------------------

    $routeProvider.when('/retailer/activity', {
        templateUrl: 'src/retailer/notification/list.html',
        controller: 'DashboardRetailerNotificationListController'
    });
    $routeProvider.when('/retailer/productinshop', {
        templateUrl: 'src/retailer/productinshop/list.html',
        controller: 'RetailerProductInShopListController',
        reloadOnSearch: false
    });
    $routeProvider.when('/retailer/productinshopsegment', {
        templateUrl: 'src/retailer/productinshopsegment/list.html',
        controller: 'RetailerProductInShopSegmentListController',
        reloadOnSearch: false
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

    $routeProvider.when('/welcome', {
        templateUrl: 'src/home/welcome.html',
        controller: 'WelcomeController',
        isPublic: true
    });


    $routeProvider.when('/faq', {
        templateUrl: 'src/home/faq/faq.html',
        controller: 'FaqController'
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

    $routeProvider.when('/organization/:id/admin/home', {
        templateUrl: 'src/organization/admin/home/list.html',
        controller: 'OrganizationAdminHomeListController'
    });

    $routeProvider.when('/organization/:id/admin/users', {
        templateUrl: 'src/organization/admin/productsegment/permissions/edit.html',
        controller: 'OrganizationAdminProductSegmentPermissionsController'
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


// Ajax Caching: IE caches the XHR requests. In order to avoid this, we set an HTTP response header to mimic default behaviors of moderns browsers.
// http://ng-learn.org/2013/12/Dealing-with-IE-family/
// https://www.ng-book.com/p/AngularJS-and-Internet-Explorer/
app.config(function($httpProvider) {
    function isIE(version, comparison) {
        var cc      = 'IE',
            b       = document.createElement('B'),
            docElem = document.documentElement,
            isIE;

        if(version){
            cc += ' ' + version;
            if(comparison){ cc = comparison + ' ' + cc; }
        }

        b.innerHTML = '<!--[if '+ cc +']><b id="iecctest"></b><![endif]-->';
        docElem.appendChild(b);
        isIE = !!document.getElementById('iecctest');
        docElem.removeChild(b);
        return isIE;
    };

    if (isIE(8)) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }
    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
});

// ------------------------------------------------------------------------------------------
// App init
// ------------------------------------------------------------------------------------------

// Configure the navigation parameters on dashboard maker products
app.run([
    '$rootScope',
    function ($rootScope) {
        $rootScope.navigation = {
            maker: {
                request: {
                    product: {
                        name: '',
                        isBrandedBy: null,
                        certified: [],
                        certifieds: {},
                        isIdentifiedBy: {
                            reference: null
                        }
                    },
                    initialized: false
                },
                display: {
                    type: 'preview',
                    allSelected: false
                }
            }
        };
    }
]);

//Mock for development
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
        $httpBackend.whenDELETE().passThrough();
        $httpBackend.whenPOST().passThrough();
        $httpBackend.whenPUT().passThrough();
        $httpBackend.whenGET().passThrough();
    });
}
