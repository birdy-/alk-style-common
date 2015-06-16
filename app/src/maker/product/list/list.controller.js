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
    '$rootScope', '$scope', '$$sdkCrud', '$$sdkAuth', 'permission', '$routeParams', '$$ORM', '$log', '$location', '$window', 'URL_CDN_MEDIA', '$modal', '$timeout', '$analytics', '$q', 'ngToast',
    function ($rootScope, $scope, $$sdkCrud, $$sdkAuth, permission, $routeParams, $$ORM, $log, $location, $window, URL_CDN_MEDIA, $modal, $timeout, $analytics, $q, ngToast) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};
    $scope.productModel = Product;
    $scope.gtinModel = Gtin;
    $scope.request = $rootScope.navigation.maker.request;
    $scope.display = $rootScope.navigation.maker.display;
    $scope.products = $scope.request.products || [];
    $scope.allBrands = [];
    $scope.brands = [];
    $scope.productsegments = [];
    $scope.displayNewProducts = false;
    $scope.gtinRelatesToGln = Gtin.TYPE_GDSN.id;
    $scope.newProductsLoaded = false;
    $scope.currentPage  = 1;
    $scope.newProductsCount = 0;

    var currentFindByNameRequest = null;
    var rootProductSegment = null;

    // `$scope.request` is retrieved from the rootScope by inheritance
    if (!$scope.request.initialized) {
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = false;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_REVIEWING.id] = false;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;

        $scope.request.offset = 0;
        $scope.request.limit = 24;
        $scope.request.busy = false;

        $scope.request.initialized  = true;
        $scope.display.type         = 'preview';
        $scope.display.allSelected  = false;
   } else {
        // Check if the previous location was the product page
        $scope.display.allSelected = false;
    }

    $scope.options = {
        'data-drag-enabled': false
    };

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------

    var setPageFromUrl = function() {
        var pageInRoute = Number($routeParams.page);
        if ($routeParams.page !== undefined && pageInRoute > 1) {
            $scope.display.page = pageInRoute;
        } else {
            $scope.display.page = 1;
        }
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
                productSegment: function () { return rootProductSegment; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            selectedItem.claimInProgress = true;
        }, function () {
            $scope.newProductsCount--;
            list();
        });
    };


    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    // Add claim status to products that have been claimed by users
    var attachClaimStatus = function (response) {
        if(!response.data.data.length) { return; }
        var mapProducts = _.indexBy($scope.products,function(product){
          return product.isIdentifiedBy[0].reference;
        });
        // Filter to get only the latest claim for each product, and put everything into an object {ref:claim}
        var claims =  _.map(
                        _.values(
                          _.groupBy(response.data.data,function(claim){return claim.reference})),function(array){
                              return _.max(array,function(claim){return new Date(claim.updatedAt)})});
        // Attach each claim to good product
        _.each(claims,function(claim){
          mapProducts[claim.reference].claimInProgress = claim.status === UserClaimProductReference.TYPE_CREATED.id;
        });

    };

    $scope.onPageChangeFromPaginator = function() {
        list();
    };

    $scope.toggleNewProducts = function () {
        if (!$scope.newProductsLoaded) { return; }
        $scope.displayNewProducts = !$scope.displayNewProducts;

        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DEFAULT.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = !$scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = !$scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_REVIEWING.id] = false;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = $scope.displayNewProducts;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;

        refresh($scope.displayNewProducts);
    };

    $scope.toggleNewProductsFilter = function (type) {
        if(type != $scope.gtinRelatesToGln){
            $scope.gtinRelatesToGln = type ? type.id : null;
            $analytics.eventTrack('MAK Products NewProducts Filter ', {
              filterType: type ? type.name : 'All'
            });
            refresh(true);
        }
    }

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
            productsegment_id: rootProductSegment.id,
            certified: Product.CERTIFICATION_STATUS_ATTRIBUTED.id
        };
        if ($scope.gtinRelatesToGln) {
            filters.product_origin = $scope.gtinRelatesToGln;
        }
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
        var defaultFilters = {};
        defaultFilters.certified = $scope.request.product.certified;
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            if ($scope.allBrands[i].active === true) {
                brands.push($scope.allBrands[i].id);
            }
        }
        if (brands.length) {
            defaultFilters.isbrandedby_id = brands.join(',');
        }

        // Product Segment
        var productsegments = _.filter($scope.productsegments, {active: true});
        if (productsegments.length) {
            defaultFilters.productsegment_id =_.map(productsegments, function (ps) { return ps.id; }).join(',')
        }

        $log.log("Product List Controller : listing by <Brand> " + brands);
        filters = angular.extend(defaultFilters, filters);
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
        $scope.request.offset = $scope.request.limit * ($scope.display.page - 1);
        $log.log("Product List Controller : listing [" + $scope.request.offset + "-" + ($scope.request.offset + $scope.request.limit) + "]" );
        $scope.request.busy = true;

        $$sdkCrud.ProductList(queries, filters, {},
            $scope.request.offset,
            $scope.request.limit,
            { isIdentifiedBy: 1 }
        ).success(function (response) {
            $scope.products = [];
            var product;
            for (var i = 0; i < response.data.length; i++) {
                product = hydrateProduct(response.data[i]);
                $scope.products.push(product);
            }
            if ($scope.displayNewProducts) {
              var references = _.map($scope.products, function(product) {
                return product.isIdentifiedBy[0].reference;
              });
              $$sdkAuth.UserClaimProductReferenceList({}, {reference: references}).then(attachClaimStatus);
            }
            if ($scope.display.page > 1 && $scope.products.length == 0) {
                $scope.display.page = 1;
                find(queries,filters);
            } else {
                $scope.request.products = $scope.products;
                $scope.request.busy = false;
                $scope.request.totalProducts = response.totalResults;
                $scope.request.totalPages = Math.floor(1 + (response.totalResults / $scope.request.limit));
            }
        }).error(function (response) {
            $window.alert("Erreur pendant la récupération des Produits.");
        });
    };

    $scope.refreshProductSegment = function () {
        $analytics.eventTrack('MAK Products Filters Product Segment');
        refresh();
    };

    var refresh = function (displayNewProducts) {
        if (!displayNewProducts) { $scope.displayNewProducts = false; }
        if ($scope.displayNewProducts) {
            //Go back to initial display
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DEFAULT.id] = false;
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = false;
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_REVIEWING.id] = false;
            $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;
        }
        $log.log("Product List Controller : refresh <Products>.");
        $scope.products = [];
        $scope.request.products = $scope.products;
        $scope.display.page = 1;
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
        $analytics.eventTrack('MAK Products Filters Brand');
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
        if (brand && brand.permissions) {
            var mediaTabPermission = _.find(brand.permissions, function (permission) {
                return permission === 'product.show.media';
            });
            if (mediaTabPermission) {
                $location.path('/maker/product/' + product.isIdentifiedBy[0].reference + '/data/media');
                return;
            }
        }
        $analytics.eventTrack('MAK Products Click Item');
        $location.path('/maker/product/' + product.isIdentifiedBy[0].reference + '/data/general');
        $location.search('page', null)
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

    var bulkCertificate = function (selectedProducts) {
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

    var bulkArchive = function (selectedProducts) {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/edit/bulk-edit-warning.html',
            controller: 'ProductBulkEditWarningModalController',
            resolve: {
                products: function () { return selectedProducts; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedProducts) {
            var allPromises = [];
            var content = '';
            for (var i = 0; i < selectedProducts.length; i++) {
                var product = selectedProducts[i];
                var productPromise = $q.defer();
                allPromises.push(productPromise.promise);

                product.certified = Product.CERTIFICATION_STATUS_DISCONTINUED.id;
                $$sdkCrud.ProductCertify(
                    product,
                    product.certified,
                    "1169"
                ).success(function (response) {
                    product.certified = response.data.certified;
                    productPromise.resolve(response.data.certified);
                }).error(function (response) {
                    if (response.message !== 'undefined') {
                        content = "Erreur pendant l'archivage du produit : " + response.message;
                    }
                    else {
                        content = "Erreur pendant l'archivage du produit : " + response.data.message;
                    }
                    ngToast.create({
                        className: 'danger',
                        content: content,
                        dismissOnTimeout: true,
                        dismissButton: true
                    });
                    productPromise.resolve(response.message);
                });
            }

            $q.all(allPromises)
            .then(function (results) {
                // $window.location.reload();
            });
        }, function () {
        });
    };

    var bulkEdit = function (selectedProducts) {
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

    $scope.bulkAction = function (actionType) {
        var selectedProducts = filterSelectedProducts();

        if (selectedProducts.length === 0) {
            $window.alert('Veuillez selectionner au moins un produit.');
            return;
        }

        $analytics.eventTrack('MAK Products Button Bulk ' + actionType, {
            count: selectedProducts.length
        });

        switch (actionType) {
            case 'certificate':
                bulkCertificate(selectedProducts);
                break;
            case 'archive':
                bulkArchive(selectedProducts);
                break;
            case 'edit':
                bulkEdit(selectedProducts);
                break;
            default:
                $log.info('Invalid action type', actionType);
        }
    };


    $scope.$watch('display.allSelected', function () {
        $scope.products.map(function (product) {
            product.selected = !!$scope.display.allSelected;
        });
    });

    $scope.$watch('display.type', function (newVal, oldVal) {
        if (oldVal != newVal) {
            $scope.display.page = 1;
            $scope.request.limit = $scope.display.type === 'preview' ? 24 : 50;
            list();
        }
    });

    $scope.$watch('display.page', function(newVal, oldVal) {
        if (oldVal != newVal) {
            $location.search("page", newVal);
        }
    });

    $scope.$on('$routeUpdate',function(e) {
        var oldPage = $scope.display.page;
        setPageFromUrl();
        if (oldPage != $scope.display.page) {
            list();
        }
    });

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    var init = function () {
        $scope.request.busy = true;
        permission.refreshUser().then(function (user) {
            $scope.user = user;
            var organizationId = user.belongsTo[0].id;
            $scope.isAdmin = permission.isAdmin(organizationId);

            $$ORM.repository('Organization').get(organizationId).then(function (organization) {
                var productSegmentRoot = Organization.getProductSegmentRoot(organization);

                if ($scope.isAdmin) {
                    $$ORM.repository('ProductSegment').get(productSegmentRoot.id).then(function (segment) {
                        var filters = {
                            certified: Product.CERTIFICATION_STATUS_ATTRIBUTED.id
                        };
                        // Getting the product list with new product-style filters, and limit of 0 (need count only)
                        // Done to enforce the consistency of the count and the actual product list
                        $$sdkCrud.ProductList({}, filters, {}, 0, 0, {})
                        .then(function (response) {
                            $scope.newProductsCount = response.data.totalResults;
                            rootProductSegment = segment;
                            if ($rootScope.navigation.maker.displayNewProducts) {
                                $scope.toggleNewProducts();
                            }
                            $scope.newProductsLoaded = true;
                        }, function (response) {
                            ngToast.create({
                                className: 'danger',
                                content: 'Erreur lors du chargement des nouvelles références :' + response.data.message,
                                dismissOnTimeout: true,
                                dismissButton: true
                            });
                        }).finally(function () {
                            $scope.newProductsLoaded = true;
                        });
                    });
                } else {
                    $scope.newProductsLoaded = true;
                }

                // Load product segments
                $$ORM.repository('User').method('ManagesProductSegmentWithPermission')('product.show').then(function(permissions) {
                $$ORM.repository('ProductSegment').list({}, { filter_id_in: permissions.productsegmentids }, {}, 0, permissions.productsegmentids.length).then(function (productsegments) {
                        $scope.productsegments = _.filter(productsegments, function (ps) {
                            return permissions.productsegmentids.indexOf(ps.id) !== -1 &&
                                ps.id !== productSegmentRoot.id;
                        });
                    });
                });
            });

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

            setPageFromUrl();
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
