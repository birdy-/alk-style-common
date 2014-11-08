'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('relatedRecipe', [
    '$route', '$$sdkCrud', '$$autocomplete', '$log', '$window',
    function ($route, $$sdkCrud, $$autocomplete, $log, $window) {
    return {
        restrict: 'AEC',
        scope: {
            product: '=',
            user: '=',
            relation: '=',
            attribute: '@'
        },
        templateUrl: '/src/maker/product/show/merchandising/relatedRecipe.html',
        controller: function($scope) {
            $scope.select2recipeOptions = $$autocomplete.getOptionAutocompletes('recipe', {
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

            // ------------------------------------------------------------------------
            // Event binding
            // ------------------------------------------------------------------------

            $scope.add = function() {
                if (!$scope.target || !$scope.target.id) {
                    $log.warn('RelatedRecipe directive : no target selected.');
                    return;
                }
                $log.log('RelatedRecipe directive : target is ' + $scope.target.id);
                var pspb = new Relation();
                pspb.recipe = $scope.target;
                if (!$scope.product[attribute]) {
                    $scope.product[attribute] = [];
                }
                for (var i = 0; i < $scope.product[attribute].length; i++) {
                    if ($scope.product[attribute][i].recipe.id === pspb.target.id) {
                        $log.error('RelatedRecipe directive : target already selected.');
                        $window.alert('Cette recette a déjà été ajoutée.');
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

            var updateRecipeAutocomplete = function() {
                var extra = {};
                if ($scope.user) {
                    extra.filter_website_shortid = $scope.user.allowedWebsites('recipe.show');
                }
                if ($scope.product && $scope.product.id && $scope.product.isValidated() && $scope.product.isConceptualizedBy) {
                    extra.filter_requiresingredient_isconstitutedby_id = $scope.product.isConceptualizedBy.id;
                }
                $scope.select2recipeOptions = $$autocomplete.getOptionAutocompletes('recipe', {
                    maximumSelectionSize: 1, multiple: false,
                    initSelection: function(el, fn) {}
                }, extra);
            };

            // ------------------------------------------------------------------------
            // Event listening
            // ------------------------------------------------------------------------
            $scope.$watch('user', function(){
                updateRecipeAutocomplete();
            });
            $scope.$watch('product', function(){
                // Load the relations
                if (!$scope.product[attribute]) {
                    return;
                }
                $scope.product[attribute].forEach(function(rel){
                    var entity = rel.recipe;
                    if (!entity
                    || !entity.id
                    || entity.text) {
                        // The lazy loading has already hapened
                        return;
                    }
                    $$sdkCrud.RecipeShow(entity.id).success(function(response){
                        angular.extend(entity, response.data);
                        entity.text = entity.title;
                    });
                });
                updateRecipeAutocomplete();
            }, true);

            // ------------------------------------------------------------------------
            // Init
            // ------------------------------------------------------------------------
        }
    };
}]);
