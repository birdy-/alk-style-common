'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
var ProductCertificationModalController = function ($scope, $modalInstance, $$sdkCrud, product, user) {
    
    $scope.product = product;
    $scope.user = user;
    
    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        };

        $scope.product.certified = 3;
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_CERTIFIED.id,
            "1169"
        ).success(function(response){
            $scope.product.certified = response.data.certified;
            $modalInstance.close($scope.product);
        }).error(function(response){
            alert("Erreur pendant la certification du produit : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


/**
 * Modal that allows the user to accept the responsability for a given product.
 */
var ProductAcceptationModalController = function ($scope, $modalInstance, $$sdkCrud, product, user) {
    $scope.product = product;
    $scope.user = user;
    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        }
        $scope.product.accepted = true;
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_ACCEPTED.id,
            "1169"
        ).success(function(response){
            $scope.product.certified = response.data.certified;
            $modalInstance.close($scope.product);
        }).error(function(response){
            alert("Erreur pendant l'acceptation du produit : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowPreviewCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    $scope.completeness = 0;
    $scope.$watch('product', function() {
        $scope.completeness = computeScore($scope.product, $scope.productForm);
    }, true);

    $scope.submit = function() {
        $$sdkCrud.ProductUpdate(
            $scope.product, null
        ).success(function(response) {
            load($scope.product.id);
        }).error(function(response) {
            alert('Erreur pendant la mise à jour du produit.');
        });
    };
    

    $scope.certify = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/certification.html',
            controller: ProductCertificationModalController,
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; },
                product: function () {return $scope.product; },
                user: function () {return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.accept = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/acceptation.html',
            controller: ProductAcceptationModalController,
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; },
                product: function () {return $scope.product; },
                user: function () {return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $location.path('/maker/product');
        });
    };
}]);

var computeScore = function(product, productForm) {
    var total = 0, ok = 0;
    for (var key in productForm) {
        if (!productForm.hasOwnProperty(key)
        || angular.isUndefined(productForm[key].$error)
        || angular.isUndefined(productForm[key].$error.required)) {
            continue;
        }
        total += 1;
        if (productForm[key].$error['required'] == false) {
            ok += 1;
        }
    }
    return ok * 100 / total;
};