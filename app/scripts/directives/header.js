'use strict';

angular.module('jDashboardFluxApp')
    .directive('header', ['$location', function ($location) {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                scope.open = function (action) {
                    if (scope.header.available) {
                        $location.path(scope.header.route(action));
                    } else {
                        alert(scope.header.name + ': You do not have access to this header yet.');
                    }
                };
                scope.new = function() {
                    $location.path('/header/new');
                }
            }
        };
    }]);
