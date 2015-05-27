'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowPreviewController', [
    '$rootScope', '$scope', '$$sdkCrud', '$modal', '$location', 'permission', '$window', '$$sdkAuth',
    function ($rootScope, $scope, $$sdkCrud, $modal, $location, permission, $window, $$sdkAuth) {

    var computeScore = function (product, productForm) {
        var total = 0, ok = 0;
        for (var key in productForm) {
            if (!productForm.hasOwnProperty(key)
            || angular.isUndefined(productForm[key].$error)
            || angular.isUndefined(productForm[key].$error.required)) {
                continue;
            }
            total += 1;
            if (productForm[key].$error['required'] === false) {
                ok += 1;
            }
        }
        return ok * 100 / total;
    };

    $scope.completeness = 0;
    $scope.$watch('product', function () {
        if (!$scope.product
        || !$scope.product.id) {
            return;
        }

        $scope.completeness = computeScore($scope.product, $scope.productForm);
        if (!$scope.product.isAccepted()) {
            $scope.accept();
        }
    }, true);

    $scope.submit = function () {
        $rootScope.$broadcast('PRODUCT_SAVING');
        $scope.productForm.$saving = true;
        $$sdkCrud.ProductUpdate(
            $scope.product, null
        ).success(function (response) {
            $scope.productForm.$saving = false;
            $scope.load($scope.product.id);
            $scope.productForm.$setPristine();
        }).error(function (response) {
            var message = '.';
            if (response && response.message) {
                message = ' : ' + response.message;
            }
            $window.alert("Erreur pendant la mise à jour du produit" + message);
        });
    };

    $scope.uncertify = function () {
        if (confirm('Êtes vous sur de vouloir décertifier ce produit ?') != true) {
            return
        }
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_ACCEPTED.id,
            '1169'
        ).then(function(response) {
            $scope.product.certified = response.data.certified;
        });
    }

    $scope.loadCGUModal = function (user, organization) {
        var modalInstance = $modal.open({
            templateUrl: '/src/user/organization/infoclaim-modal.html',
            controller: 'InfoClaimModalController',
            resolve: {
                user: function () { return user; },
                organization: function () { return organization; },
                redirect: function () { return function(){}; }
            },
            backdrop: 'static'
        });

        modalInstance.result.then(
            function () {
            $scope.loadCertificationModal();               
        },  function () {
            $scope.loadCertificationModal();    
        });
    };

    $scope.loadCertificationModal = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/certification.html',
            controller: 'ProductCertificationModalController',
            resolve: {
                $$sdkCrud: function () { return $$sdkCrud; },
                products: function () { return [$scope.product]; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });        
    };

    $scope.certify = function () {
        permission.getUser().then(function (user) {
            $scope.user = user;
            if ($scope.user.belongsTo.length === 0)
                $scope.redirect();
            $$sdkAuth.OrganizationShow($scope.user.belongsTo[0].id).then(function (response) {
                $scope.organization = response.data.data;
                if ($scope.organization.acceptedLastCGU == 0) {
                    $scope.pendingRedirection = true;
                    $scope.loadCGUModal($scope.user, $scope.organization);
                }
                else {
                    $scope.loadCertificationModal();
                }
            });

        });
        return;
    };

    $scope.duplicate = function (product) {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/create/duplicate.html',
            controller: 'ProductDuplicationModalController',
            resolve: {
                product: function () { return product; },
                user: function () { return $scope.user; }
            }
        });
    };

    $scope.accept = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/acceptation.html',
            controller: 'ProductAcceptationModalController',
            resolve: {
                $$sdkCrud: function () { return $$sdkCrud; },
                product: function () { return $scope.product; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
            $location.path('/maker/brand/' + $scope.product.isBrandedBy.id + '/product');
        });
    };
}]);
