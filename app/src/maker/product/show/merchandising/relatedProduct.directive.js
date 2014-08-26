'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('relatedProduct', [
    '$route', '$$sdkCrud', '$$autocomplete', '$log', '$window',
    function ($route, $$sdkCrud, $$autocomplete, $log, $window) {
    return {
        restrict: 'AEC',
        scope: {
            product: '=',
            relation: '=',
            attribute: '@'
        },
        templateUrl: '/src/maker/product/show/merchandising/relatedProduct.html',
        controller: function($scope) {
            $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                maximumSelectionSize: 1, multiple: false,
                initSelection: function(el, fn) {} // https://github.com/angular-ui/ui-select2/issues/186
            });
        },
        link: function($scope, elem, attrs) {

            // ------------------------------------------------------------------------
            // Variables
            // ------------------------------------------------------------------------
            $scope.target = null;
            var attribute = $scope.attribute;
            var Relation = $scope.relation;
            $scope.sortableOptions = {
                stop: function(e, ui) {
                    $scope.product[attribute].forEach(function(relation, i){
                        relation.ranking = i + 1;
                    });
                }
            };

            // ------------------------------------------------------------------------
            // Event binding
            // ------------------------------------------------------------------------
            $scope.add = function() {
                if (!$scope.target || !$scope.target.id) {
                    $log.warn('RelatedProduct directive : no target selected.');
                    return;
                }
                $log.log('RelatedProduct directive : target is ' + $scope.target.id);
                var pspb = new Relation();
                pspb.target = $scope.target;
                if (!$scope.product[attribute]) {
                    $scope.product[attribute] = [];
                }
                pspb.ranking = $scope.product[attribute].length + 1;
                for (var i = 0; i < $scope.product[attribute].length; i++) {
                    if ($scope.product[attribute][i].target.id === pspb.target.id) {
                        $log.error('RelatedProduct directive : target already selected.');
                        $window.alert("Ce produit est déjà défini comme équivalent.");
                        return;
                    }
                }
                $scope.product[attribute].push(pspb);
                $scope.target = null;
            };
            $scope['delete'] = function(pspb) {
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
                    var certified = [
                        Product.CERTIFICATION_STATUS_ACCEPTED.id,
                        Product.CERTIFICATION_STATUS_CERTIFIED.id,
                        Product.CERTIFICATION_STATUS_PUBLISHED.id
                    ].join(',');
                    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                        maximumSelectionSize: 1, multiple: false, minimumInputLength: 0,
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
    };
}]);
