'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowCompositionCtrl', [
    '$scope',
    function ($scope) {

    	// Prevents errors when clearing values
    	$scope.$watch('product.ratioCacao', function(){
    		if ($scope.product.ratioCacao === '') {
    			$scope.product.ratioCacao = null;
    		}
    	});
    	$scope.$watch('product.ratioAlcohol', function(){
    		if ($scope.product.ratioAlcohol === '') {
    			$scope.product.ratioAlcohol = null;
    		}
    	});
    	$scope.$watch('product.ratioFat', function(){
    		if ($scope.product.ratioFat === '') {
    			$scope.product.ratioFat = null;
    		}
    	});
    	$scope.$watch('product.levelPH', function(){
    		if ($scope.product.levelPH === '') {
    			$scope.product.levelPH = null;
    		}
    	});
}]);