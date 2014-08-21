'use strict';

 /**
  * Select input, preloaded with brands that the user is allowed to manipulate.
  */
angular.module('jDashboardFluxApp').directive('selectMyBrands', [
    'permission', '$$autocomplete', '$$BrandRepository',
    function (permission, $$autocomplete, $$BrandRepository) {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/brand.html',
        controller: function($scope) {
            $scope.options = $$autocomplete.getOptionAutocompletes(null, {
                data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
            });
        },
        link: function(scope, elem, attrs) {
            permission.getUser().then(function(user){
                var ids = user.managesBrand.map(function(brand){
                    return brand.id;
                }).join(',');
                $$BrandRepository.list({}, {id: ids});
                angular.extend(scope.options.data, user.managesBrand);
            });
        }
    };
}]);
