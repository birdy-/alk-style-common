'use strict';

angular.module('jDashboardFluxApp').directive('templateProduct', [
	'$location',
	function($location) {
    return {
        restrict: 'AEC',
        transclude: true,
        templateUrl: '/src/maker/product/show/template/templateProduct.html',
        link: function(scope, element, attrs, ctrl) {

		    scope.active = function() {
		        return $location.path().indexOf('data') !== -1;
		    };

        }
    };
}]);