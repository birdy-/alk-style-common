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
angular.module('jDashboardFluxApp').constant('API_URL', '//api.alkemics.com');
//angular.module('jDashboardFluxApp').constant('API_URL', '//localhost.chefjerome.com:6543');

angular.module('jDashboardFluxApp').config(function ($routeProvider) {

    $routeProvider
        .when('/flux/maker/product/:id', {
            templateUrl: 'views/maker/product/show.html',
            controller: 'DashboardMakerProductShowCtrl',
            parameter: {id: 'integer'}
        })
        .when('/flux/maker/product', {
            templateUrl: 'views/maker/product/list.html',
            controller: 'DashboardMakerProductListCtrl',
        })
        .when('/flux/maker/brand', {
            templateUrl: 'views/maker/show.html',
            controller: 'DashboardMakerShowCtrl'
        })
        .when('/flux/maker/assortment', {
            templateUrl: 'views/maker/assortment.html',
            controller: 'DashboardMakerAssortmentCtrl'
        })
        .when('/flux/maker/sales', {
            templateUrl: 'views/maker/sales.html',
            controller: 'DashboardMakerSalesCtrl'
        })
        .when('/flux/maker/notifications', {
            templateUrl: 'views/maker/notifications.html',
            controller: 'DashboardMakerNotificationsCtrl'
        })
        .when('/flux/maker/home', {
            templateUrl: 'views/maker/notifications.html',
            controller: 'DashboardMakerNotificationsCtrl',
        })


        .when('/flux/retailer/product/:id/show', {
            templateUrl: 'views/retailer/product/show.html',
            controller: 'DashboardRetailerProductShowCtrl'
        })
        .when('/flux/retailer/product/list', {
            templateUrl: 'views/retailer/product/list.html',
            controller: 'DashboardRetailerProductListCtrl'
        })
        .when('/flux/retailer/show', {
            templateUrl: 'views/retailer/show.html',
            controller: 'DashboardRetailerShowCtrl'
        })
        .when('/flux/retailer/notifications', {
            templateUrl: 'views/retailer/notifications.html',
            controller: 'DashboardRetailerNotificationsCtrl'
        })

        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginController',
          isPublic: true
        })

        .when('/register', {
          templateUrl: 'views/register.html',
          controller: 'HomeCtrl',
          isPublic: true
        })

        .when('/', {
          templateUrl: 'views/maker/product/list.html',
          controller: 'DashboardMakerProductListCtrl',          
        })
        .otherwise({
          redirectTo: '/'
        });
});
