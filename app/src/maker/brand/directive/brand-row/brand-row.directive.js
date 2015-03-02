'use strict';

angular.module('jDashboardFluxApp').directive('brandRow', [
    '$modal',
    function ($modal) {
        return {
            restrict: 'AC',
            scope: {
              brand: '='
            },
            templateUrl: '/src/maker/brand/directive/brand-row/brand-row.view.html',
            link: function($scope, $elem, $attrs) {
              $scope.notCertified = parseInt($scope.brand.stats.counts['5'], 10) + parseInt($scope.brand.stats.counts['1'], 10) || 0;
              $scope.certified = parseInt($scope.brand.stats.counts['2']) || 0
            }
        };
    }
]);
