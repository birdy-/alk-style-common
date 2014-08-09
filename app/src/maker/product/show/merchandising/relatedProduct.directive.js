'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('relatedProduct', [
    '$route', '$$sdkCrud', '$$autocomplete',
    function ($route, $$sdkCrud, $$autocomplete) {
    return {
        restrict: 'AEC',
        scope: {
            product: '=',
            relation: '=',
            attribute: '@',
        },
        templateUrl: '/src/maker/product/show/merchandising/relatedProduct.html',
        controller: function($scope) {
            $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                maximumSelectionSize: 1, multiple: false,
                initSelection: function(el, fn) {}, // https://github.com/angular-ui/ui-select2/issues/186
            });
        },
        link: function($scope, elem, attrs) {

            // ------------------------------------------------------------------------
            // Variables
            // ------------------------------------------------------------------------
            $scope.target = null;
            var attribute = $scope.attribute;
            var relation = $scope.relation;
            $scope.sortableOptions = {
                stop: function(e, ui) {
                    $scope.product[attribute].forEach(function(relation, i){
                        relation.ranking = i + 1;
                    })
                }
            };

            // ------------------------------------------------------------------------
            // Event binding
            // ------------------------------------------------------------------------
            $scope.add = function() {
                if (!$scope.target || !$scope.target.id) {
                    console.warn('No target selected.');
                    return;
                }
                console.log('Target is ' + $scope.target.id);
                var pspb = new relation();
                pspb.target = $scope.target;
                if (!$scope.product[attribute]) {
                    $scope.product[attribute] = [];
                }
                pspb.ranking = $scope.product[attribute].length + 1;
                for (var i = 0; i < $scope.product[attribute].length; i++) {
                    if ($scope.product[attribute][i].target.id == pspb.target.id) {
                        console.error('Target already selected.');
                        alert('Ce produit est déjà défini comme équivalent.');
                        return;
                    }
                }
                $scope.product[attribute].push(pspb);
                $scope.target = null;
            };
            $scope.delete = function(pspb) {
                var index = $scope.product[attribute].indexOf(pspb);
                if (index > -1) {
                    $scope.product[attribute].splice(index, 1);
                }
            };

            // ------------------------------------------------------------------------
            // Event listening
            // ------------------------------------------------------------------------
            $scope.$watch('product', function(){
                // Load the relations
                if ($scope.product[attribute]) {
                    $scope.product[attribute].forEach(function(relation, i){
                        var product = relation.target;
                        if (!product
                        || !product.id
                        || product.text) {
                            // The lazy loading has already hapened
                            return;
                        }
                        $$sdkCrud.ProductShow(product.id).success(function(response){
                            angular.extend(product, response.data);
                            product.text = product.nameLegal;
                        });
                    });
                }

                // Update autocompletes
                if ($scope.product.isBrandedBy) {
                    var certified = '1,2,3';
                    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                        maximumSelectionSize: 1, multiple: false,
                        initSelection: function(el, fn) {}
                    }, {
                        filter_isbrandedby_id: $scope.product.isBrandedBy.id,
                        filter_certified: certified
                    });
                }
            }, true);

            // ------------------------------------------------------------------------
            // Init
            // ------------------------------------------------------------------------
        }
    }
}]);
