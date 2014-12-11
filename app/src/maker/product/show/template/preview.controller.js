'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowPreviewController', [
    '$rootScope', '$scope', '$$sdkCrud', '$modal', '$location', 'permission', '$window',
    function ($rootScope, $scope, $$sdkCrud, $modal, $location, permission, $window) {

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

    $scope.certify = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/certification.html',
            controller: 'ProductCertificationModalController',
            resolve: {
                $$sdkCrud: function () { return $$sdkCrud; },
                product: function () { return $scope.product; },
                user: function () { return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
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
