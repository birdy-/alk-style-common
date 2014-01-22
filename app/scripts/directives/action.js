'use strict';

angular.module('jDashboardFluxApp')
    .directive('action', ['$location', function ($location) {
        return {
            restrict: 'C',
            link: function (scope, element, attrs) {
                scope.open = function (action) {
                    if (scope.action.available) {
                        $location.path(scope.action.route(action));
                    } else {
                        alert(scope.action.name + ': You do not have access to this action yet.');
                    }
                };
                scope.new = function() {
                    $location.path('/action/new');
                }
            }
        };
    }]);
