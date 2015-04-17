'use strict';

/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductListController', [
    '$rootScope', '$scope', '$$sdkCrud', '$$sdkAuth', 'permission', '$routeParams', '$$ORM', '$log', '$location', '$window', 'URL_CDN_MEDIA', '$modal','$timeout',
    function ($rootScope, $scope, $$sdkCrud, $$sdkAuth, permission, $routeParams, $$ORM, $log, $location, $window, URL_CDN_MEDIA, $modal,$timeout) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};
    $scope.productModel = Product;
    permission.getUser().then(function (user) {
        var organizationId = user.belongsTo[0].id;
        $scope.user = user;
        $scope.isAdmin = permission.isAdmin(organizationId);
        $$ORM.repository('Organization').get(organizationId).then(function (organization) {
            var productSegmentRoot = Organization.getProductSegmentRoot(organization);
            $$ORM.repository('ProductSegment').get(productSegmentRoot.id).then(function (segment) {
                $$ORM.repository('ProductSegment').method('Stats')(productSegmentRoot.id).then(function (stats) {
                    $scope.rootProductSegment = segment;
                    $scope.newProductsCount = getNewProductsCount(stats[0]);
                    $scope.newProductsLoaded = true;
                });
            });
        });
    });
    $scope.request = $rootScope.navigation.maker.request;
    $scope.products = $scope.request.products || [];
    $scope.allBrands = [];
    $scope.brands = [];
    $scope.segmentIds = [];
    $scope.displayNewProducts = false;
    $scope.newProductsLoaded = false;
    $scope.display = {
        type: 'preview',
        allSelected: false
    };

    var currentFindByNameRequest = null;

    // `$scope.request` is retrieved from the rootScope by inheritance
    if (!$scope.request.initialized) {
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = false;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;

        $scope.request.offset = 0;
        $scope.request.limit = 24;
        $scope.request.busy = false;

        $scope.request.initialized = true;
    }
    $scope.options = {
        'data-drag-enabled': false
    };

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------

    var getNewProductsCount = function (stats) {
        var count = null;

        count += stats.counts[Product.CERTIFICATION_STATUS_DEFAULT.id]
        count += stats.counts[Product.CERTIFICATION_STATUS_PUBLISHED.id]
        count += stats.counts[Product.CERTIFICATION_STATUS_REVIEWING.id]
        count += stats.counts[Product.CERTIFICATION_STATUS_ATTRIBUTED.id]

        return count;
    };

    var getCertifiedStatus = function (certifiedObject) {
        // Collect parameters
        var certifieds = [];
        for (var key in certifiedObject) {
            if ($scope.request.product.certifieds[key] === true) {
                certifieds.push(key);
            }
        };

        // If no option is selected do not make any call
        if (certifieds.length === 0) {
            return;
        }
        return certifieds.join(',');
    };

    var accept = function (product) {
        if(product.claimInProgress) {
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/acceptation.html',
            controller: 'ProductAcceptationModalController',
            resolve: {
                product: function () { return product; },
                productSegment: function () { return $scope.rootProductSegment; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            selectedItem.claimInProgress = true;
        }, function () {
            $location.path('/maker/brand/' + $scope.product.isBrandedBy.id + '/product');
        });
    };


    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    var attachClaimStatus = function (response) {
        if(!response.data.data.length) { return; }
        var lastClaim = response.data.data[0];

        _.map($scope.products, function (product) {
            if(product.isIdentifiedBy[0].reference === lastClaim.reference) {
                product.claimInProgress = lastClaim.status === UserClaimProductReference.TYPE_CREATED.id;
            }
        });
    };

    $scope.toggleNewProducts = function () {
        if (!$scope.newProductsLoaded) { return; }
        $scope.displayNewProducts = !$scope.displayNewProducts;

        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DEFAULT.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = !$scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = !$scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_REVIEWING.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;

        refresh($scope.displayNewProducts);
    };

    var list = function () {
        if ($scope.displayNewProducts) {
            return findPendingProducts();
        }
        $scope.request.product.certified = getCertifiedStatus($scope.request.product.certifieds);
        if ($scope.request.product.isIdentifiedBy.reference) {
            return findByReference();
        } else if ($scope.request.product.nameSmooth) {
            return findByName();
        } else {
            return findByBrand();
        }
    };

    var findPendingProducts = function () {
        $scope.request.product.certified = getCertifiedStatus($scope.request.product.certifieds);

        var filters = {
            productsegment_id: $scope.rootProductSegment.id,
            certified: $scope.request.product.certified
        };

        return find({}, filters);
    };

    var findByReference = function () {
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            brands.push($scope.allBrands[i].id);
        }
        brands = brands.join(',');

        var filters = {
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        };

        var queries = {
            isidentifiedby_reference: $scope.request.product.isIdentifiedBy.reference
        }

        return find(queries, filters);
    };

    var findByBrand = function (filters) {
        var filters = filters || {};
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            if ($scope.allBrands[i].active === true) {
                brands.push($scope.allBrands[i].id);
            }
        }
        if (brands.length === 0) {
            $log.warn("Product List Controller : no <Brand> set in findByBrand.");
            return;
        }
        brands = brands.join(',');

        $log.log("Product List Controller : listing by <Brand> " + brands);
        var filters = angular.extend({
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        }, filters);
        return find({}, filters);
    };

    var findByName = function () {
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            if ($scope.allBrands[i].active === true) {
                brands.push($scope.allBrands[i].id);
            }
        }
        if (brands.length === 0) {
            $log.warn("Product List Controller : no <Brand> set in findByName.");
            return;
        }
        brands = brands.join(',');

        var filters = {
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        };
        var queries = {
            namesmooth: $scope.request.product.nameSmooth
        };
        $scope.request.busy = true;
        //Setting delay before effective search
        var timeout = $timeout(function(){
            $log.log("Product List Controller : listing by name '" + queries.namesmooth + "' in " + brands);
            find(queries,filters);
            currentFindByNameRequest=null;
        },500);
        //If another search was pending, cancel it
        if(currentFindByNameRequest != null){
            $timeout.cancel(currentFindByNameRequest);
        }
        currentFindByNameRequest = timeout;
        return timeout;
    };

    var find = function (queries, filters) {
        filters.productsegment_id = $scope.segmentIds.join(',');
        $log.log("Product List Controller : listing [" + $scope.request.offset + "-" + ($scope.request.offset + $scope.request.limit) + "]" );
        $scope.request.busy = true;

        $$sdkCrud.ProductList(queries, filters, {},
            $scope.request.offset,
            $scope.request.limit,
            { isIdentifiedBy: 1 }
        ).success(function (response) {
            $scope.products = [];
            var product;
            for (var i = 0; i < response.data.length; i ++) {
                product = hydrateProduct(response.data[i]);
                if ($scope.displayNewProducts) {
                    $$sdkAuth.UserClaimProductReferenceList({}, {reference: product.isIdentifiedBy[0].reference}).then(attachClaimStatus);
                }
                $scope.products.push(product);
            }
            // $location.search('offset', $scope.request.offset);
            $scope.request.products = $scope.products;
            $scope.request.busy = false;
            $scope.request.totalProducts = response.totalResults;
            $scope.request.currentPage = 1+($scope.request.offset/$scope.request.limit);
            $scope.request.totalPages = Math.floor(1+(response.totalResults/$scope.request.limit));


        }).error(function (response) {
            $window.alert("Erreur pendant la récupération des Produits.");
        });
    };

    $scope.prev = function () {
        $scope.request.busy = true;
        $scope.request.offset = Math.max($scope.request.offset - $scope.request.limit, 0);
        list();
    };

    $scope.next = function () {
        $scope.request.busy = true;
        $scope.request.offset = $scope.request.offset + $scope.request.limit;
        list();
    };

    var refresh = function (displayNewProducts) {
        if (!displayNewProducts) { $scope.displayNewProducts = false; }
        $log.log("Product List Controller : refresh <Products>.");
        $scope.products = [];
        $scope.request.products = $scope.products;
        $scope.request.offset = 0;
        list();
    };

    var propagate = function (brand, value) {
        if (!brand._subBrands) {
            return;
        }
        for (var i = 0; i < brand._subBrands.length; i++) {
            brand._subBrands[i].active = value;
            propagate(brand._subBrands[i], value);
        }
    };

    $scope.refreshBrand = function (brand) {
        propagate(brand, brand.active);
        refresh();
    };

    /**
     * Redirects to the Product details page
     * Check if a redirection to a specific tab
     * should be performed based on User permissions.
     * Defaults to the general tab.
     */
    $scope.show = function (product, index) {
        if (!product.isAccepted()) {
            accept(product);
            return;
        }

        // Hot Feature - Specific tabs according to user permissions
        // Heineken
        var brandId = product.isBrandedBy.id;
        var brand = _.find($scope.user.managesBrand, function (brand) {
            return brand.id == brandId;
        });
        var mediaTabPermission = _.find(brand.permissions, function (permission) {
            return permission === 'product.show.media';
        });
        if (mediaTabPermission) {
            $location.path('/maker/product/' + product.isIdentifiedBy[0].reference + '/data/media');
            return;
        }
        $location.path('/maker/product/' + product.isIdentifiedBy[0].reference + '/data/general');
    };

    $scope.$watch('request.product.isIdentifiedBy.reference', function(newVal, oldVal) {
        if (oldVal !== newVal) {
            refresh();
        }
    });

      $scope.$watch('request.product.nameSmooth', function(newVal, oldVal) {
        if (oldVal !== newVal) refresh();
    });

    $scope.$watch('request.product.certifieds', function(newVal, oldVal) {
        if (oldVal !== newVal && !$scope.displayNewProducts) {
            refresh(true);
        }
    }, true);

    // ------------------------------------------------------------------------
    // Multiple selection
    // ------------------------------------------------------------------------

    var filterSelectedProducts = function () {
        // Check if we have selected multiple Products
        var selectedProducts = $scope.products.filter(function (product) {
            return product.selected;
        });
        return selectedProducts;
    };

    $scope.certificate = function () {
        var selectedProducts = filterSelectedProducts();

        if (selectedProducts.length === 0) {
            $window.alert('Veuillez selectionner au moins un produit.');
            return;
        }

        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/certification.html',
            controller: 'ProductCertificationModalController',
            resolve: {
                products: function () { return selectedProducts; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    };

    $scope.bulkEdit = function () {
        var selectedProducts = filterSelectedProducts();

        if (selectedProducts.length === 0) {
            $window.alert('Veuillez selectionner au moins un produit.');
            return;
        }

        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/edit/bulk-edit-warning.html',
            controller: 'ProductBulkEditWarningModalController',
            resolve: {
                products: function () { return selectedProducts; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedProducts) {
            var modalInstance = $modal.open({
                templateUrl: '/src/maker/product/edit/bulk-edit.html',
                controller: 'ProductBulkEditModalController',
                resolve: {
                    products: function () { return selectedProducts; },
                    user: function () { return $scope.user; }
                }
            });
        }, function () {
        });
    };

    $scope.$watch('display.allSelected', function () {
        $scope.products.map(function (product) {
            product.selected = !!$scope.display.allSelected;
        });
    });

    $scope.$watch('display.type', function () {
        $scope.request.offset = 0;
        $scope.request.limit = $scope.display.type === 'preview' ? 24 : 50;
        list();
    });

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    var init = function () {
        $scope.request.busy = true;
        permission.getUser().then(function (user) {
            // Load all available brands
            var brandIds = user.managesBrand.map(function (brand) {
                return brand.id;
            }).join(',');
            $$ORM.repository('Brand').list({}, {id: brandIds}, {}, 0, 100, {subbrands: 1}).then(function (brands) {
                brands.forEach(function (brand) {
                    brand._subBrands = [];
                    brand.isSubBrandOf._subBrands = [];
                });
                brands.forEach(function (brand) {
                    brand.root = true;
                    var subBrandIndex = brand.isSubBrandOf._subBrands.indexOf(brand);
                    // We need to check if the subbrand is in the $scope.brands because of lazy load
                    if ($scope.brands.indexOf(brand.isSubBrandOf._subBrands[subBrandIndex]) !== -1 && subBrandIndex !== -1) {
                        return;
                    }
                    brand.isSubBrandOf._subBrands.push(brand);
                    if (brand.isSubBrandOf.allowed) {
                        brand.root = false;
                    } else {
                        $scope.brands.push(brand);
                    }
                });
            });
            $scope.allBrands = user.managesBrand;
            $scope.request.busy = false;

            // Load by reference
            var reference = $routeParams.reference;
            if (reference) {
                $log.log("Product List Controller : initializing screen with isIdentifiedBy=" + reference);
                $scope.request.product.isIdentifiedBy.reference = reference;
                list();
                return;
            }

            // Load brand
            var brandId = $routeParams.id ? parseInt($routeParams.id, 10) : null;
            var active = false;
            if (brandId) {
                $log.log("Product List Controller : initializing screen with isBrandedBy=" + brandId);
                if (user.isAllowed('Brand', brandId)) {
                    $$ORM.repository('Brand').lazy(brandId).active = true;
                } else {
                    $window.alert("You are not allowed to view Brand");
                    return;
                }
            }

            // For now, no filter on ProductSegments, just use them for permission
            // The if clause can be removed, it's just for backward compatibility
            if (user.managesProductSegment) {
                $scope.segmentIds = user.managesProductSegment.map(function (segment) {
                    return segment.id;
                });
            }

            list();
            return;
        });
    };

    var hydrateProduct = function (data) {
        var product = new Product().fromJson(data);
        product.urlPictureOriginal = URL_CDN_MEDIA + '/product/' + product.id + '/picture/packshot/256x256.png?' + Math.random() * 100000000;
        return product;
    };

    init();
}]);
