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
  'sdk-dashboard'
])
  // .constant('API_URL', 'http://api.chefjerome.com')
  .constant('API_URL', 'http://localhost.chefjerome.com:6543')
  .config(function ($routeProvider) {
    $routeProvider

      .when('/flux/maker/:brand_id/product/:id', {
          templateUrl: 'views/maker/product/show.html',
          controller: 'DashboardMakerProductShowCtrl',
          parameter: {id: 'integer', brand_id: 'integer'}
      })
      .when('/flux/maker/:brand_id/product', {
          templateUrl: 'views/maker/product/list.html',
          controller: 'DashboardMakerProductListCtrl',
          parameter: {brand_id: 'integer'}
      })
      .when('/flux/maker/:brand_id/show', {
          templateUrl: 'views/maker/show.html',
          controller: 'DashboardMakerShowCtrl'
      })
      .when('/flux/maker/notifications', {
          templateUrl: 'views/maker/notifications.html',
          controller: 'DashboardMakerNotificationsCtrl'
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

      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
