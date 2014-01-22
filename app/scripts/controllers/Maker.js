'use strict';

angular
    .module('jDashboardFluxApp')

    .controller('DashboardMakerShowCtrl', [
            '$scope',
            '$$sdkCrud',
            '$routeParams',
            'permission',
            function ($scope, $$sdkCrud, $routeParams, permission) {

            $scope.products = [];
            $scope.brand = null;

            permission.getUser().then(function (user) {
                var id = $routeParams.brand_id;
                $$sdkCrud.BrandShow(id, function(response){
                    var requestedBrand = response.data;
                    if (user.isAllowed('Brand', requestedBrand.id))  {
                        $scope.brand = requestedBrand;
                        loadBrandProducts();
                        return;
                    }
                    if (user.isAllowed('Brand', requestedBrand.isSubBrandOf.id))  {
                        $scope.brand = requestedBrand;
                        loadBrandProducts();
                        return;
                    }
                    alert('You are not allowed to view this page ('+id+').');
                });
            });

            var loadBrandProducts = function() {
                $$sdkCrud.ProductList($scope.brand.id, null, null, 0, 20, function(response){
                    $scope.products = response.data;
                });
            }

            angular.element('#navbar-holder')
                   .removeClass('color-action')
                   .addClass('color-product');

            $scope.submit = function() {
                alert('You do not have the necessary privileges to update this brand.');
            };
        }])

    .controller('DashboardMakerNotificationsCtrl', [
            '$scope',
            '$$sdkCrud',
            function ($scope, $$sdkCrud) {

            $scope.products = [];
            $scope.brand = {
                id: 1068
            };

            $$sdkCrud.BrandShow($scope.brand.id, function(response){
                $scope.brand = response.data;
            });

            angular.element('#navbar-holder')
                   .removeClass('color-action')
                   .addClass('color-product');
        }])

        .controller('DashboardMakerProductShowCtrl', [
            '$scope',
            '$$sdkCrud',
            '$routeParams',
            '$$autocomplete',
            function ($scope, $$sdkCrud, $routeParams, $$autocomplete) {

            $scope.select2productCompositionOptions = {
                allowClear:                 true,
                multiple:                   true,
                formatResult:               $$autocomplete.formatResult,
                formatResultCssClass:       $$autocomplete.formatResultCssClass,
                formatSelection:            $$autocomplete.formatSelection,
                formatSelectionCssClass:    $$autocomplete.formatSelectionCssClass,
                data: []
            };
            $scope.product = {
                id: $routeParams.id
            };

            $$sdkCrud.ProductShow($scope.product.id, true, function(response){
                $scope.product = response.data;
                if ($scope.product.composition !== null) {
                    var composition = $scope.product.composition.split(', ');
                    $scope.product.composition = [];
                    for (var i = 0; i < composition.length; i++) {
                        $scope.product.composition.push({
                            text: composition[i],
                            id: i,
                            _type: 'Concept'
                        });
                    }
                }
                if ($scope.product.additives !== null) {
                    var additives = $scope.product.additives.split(', ');
                    $scope.product.additives = [];
                    for (var i = 0; i < additives.length; i++) {
                        $scope.product.additives.push({
                            text: additives[i],
                            id: i,
                            _type: 'Concept'
                        });
                    }
                }
                if ($scope.product.allergens !== null) {
                    var allergens = $scope.product.allergens.split(',');
                    $scope.product.allergens = [];
                    for (var i = 0; i < allergens.length; i++) {
                        $scope.product.allergens.push({
                            text: allergens[i],
                            id: i,
                            _type: 'Concept'
                        });
                    }
                }
                if ($scope.product.amountStarch !== null) {
                    $scope.product.hasStarch = true;
                }
            });

            angular.element('#navbar-holder')
                   .removeClass('color-action')
                   .addClass('color-product');


            $scope.submit = function() {
                alert('You do not have the necessary privileges to update this product.');
                return;
                $$sdkCrud.ProductUpdate($scope.product, function(response) {});
            };
            // $scope.$watch('product', $scope.submit);

        }])

    .controller('DashboardMakerProductListCtrl', [
            '$scope',
            '$$sdkCrud',
            'permission',
            '$routeParams',
            function ($scope, $$sdkCrud, permission, $routeParams) {

            $scope.product = {
                name: ''
            };
            $scope.productReference = {
                value: ''
            };
            $scope.shops = {};
            $scope.shopsN = 0;
            $scope.products = {};
            $scope.offset = 0;
            $scope.limit = 20;
            $scope.brand = {
            };

            permission.getUser().then(function (user) {
                var id = $routeParams.brand_id;
                $$sdkCrud.BrandShow(id, function(response){
                    var requestedBrand = response.data;
                    if (user.isAllowed('Brand', requestedBrand.id))  {
                        $scope.brand = requestedBrand;
                        loadBrandProducts();
                        return;
                    }
                    if (user.isAllowed('Brand', requestedBrand.isSubBrandOf.id))  {
                        $scope.brand = requestedBrand;
                        loadBrandProducts();
                        return;
                    }
                    alert('You are not allowed to view this page ('+id+').');
                });
            });

            var loadBrandProducts = function() {
                var brand = $scope.brand;
                if (!brand || !brand.id) {
                    return;
                }
                $$sdkCrud.ProductList(brand.id, $scope.product.name, $scope.productReference.value, $scope.offset, $scope.limit, function(response){
                    if(response.data.length == 0) {
                        return;
                    }
                    $scope.products = [];
                    $scope.shops = {};
                    var shop, product, productInShop;
                    for (var i = 0; i < response.data.length; i ++) {
                        product = response.data[i];
                        for (var j = 0; j < product.isInstantiatedBy.length; j++) {
                            productInShop = product.isInstantiatedBy[j];
                            shop = productInShop.isSoldBy;
                            if (typeof($scope.shops[shop.id]) === 'undefined') {
                                $scope.shops[shop.id] = shop;
                            }
                        }
                        $scope.products.push(product);
                    }

                    $scope.shopsN = 0;
                    for (var shopId in $scope.shops) {
                        if ($scope.shops.hasOwnProperty(shopId)) {
                            $scope.shopsN += 1;
                        }
                    }
                });
            };

            $scope.soldIn = function(product, shop) {
                for (var j = 0; j < product.isInstantiatedBy.length; j++) {
                    if (shop.id == product.isInstantiatedBy[j].isSoldBy.id) {
                        return true;
                    }
                }
                return false;
            };
            $scope.prev = function() {
                $scope.offset = $scope.offset - $scope.limit;
                loadBrandProducts();
            }
            $scope.next = function() {
                $scope.offset = $scope.offset + $scope.limit;
                loadBrandProducts();
            }

            angular.element('#navbar-holder')
                   .removeClass('color-action')
                   .addClass('color-product');

            $scope.$watch('productReference.value', loadBrandProducts);
            $scope.$watch('product.name', loadBrandProducts);

        }]);
