'use strict';

angular.module('jDashboardFluxApp').directive('templateProduct', [
	'$location',
    function($location) {
    return {
        restrict: 'AEC',
        transclude: true,
        templateUrl: '/src/maker/product/show/template/templateProduct.html',
        link: function(scope, element, attrs, ctrl) {

            /**
             * Decide whether to display a product tab or not.
             * Current check is based on the permissions
             * of the User on the Brand of the given Product.
             */
            scope.displayTab = function(tabName) {
                if (scope.user === {} || typeof(scope.product.isBrandedBy) === 'undefined') {
                    return false;
                }

                var brandId = scope.product.isBrandedBy.id;
                var brand = _.find(scope.user.managesBrand, function (brand) {
                    return brand.id == brandId;
                });

                /**
                 * Hackihs, to be refactored - Heineken inside
                 */
                var mediaTabPermission = _.find(brand.permissions, function (permission) {
                    return permission === 'product.show.media';
                });
                if (tabName !== 'media' && mediaTabPermission) {
                    return false;
                }
                return true;
            };

		    scope.active = function() {
		        return $location.path().indexOf('data') !== -1;
		    };

        }
    };
}]);