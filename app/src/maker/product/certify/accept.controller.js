'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given product.
 */
angular.module('jDashboardFluxApp')
.controller('ProductAcceptationModalController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$sdkCrud', '$$sdkGdsn', 'ngToast', 'product', 'user', 'productSegment', '$$ORM',
    function ($scope, $modalInstance, $$sdkAuth, $$sdkCrud, $$sdkGdsn, ngToast, product, user, productSegment, $$ORM) {

    $scope.product = product;
    $scope.productSegment = productSegment;
    $scope.glns = [];
    $scope.user = user;

    $scope.ok = function () {
        $scope.product.certified = Product.CERTIFICATION_STATUS_ACCEPTED.id;

        $$sdkAuth.UserClaimProductReferenceCreate(product.namePublicLong, product.isIdentifiedBy[0].reference, product.isBrandedBy.id, product.gln).then(
            function (response) {
                ngToast.create({
                    className: 'success',
                    content: 'Le produit ' + product.isIdentifiedBy[0].reference + ' a bien été accepté et est en cours de traitement.'
                });
                $scope.product.hasBeenActivated = true;
                $modalInstance.close($scope.product);
            },
            function (response ) {
                ngToast.create({
                    className: 'danger',
                    content: "Erreur pendant l'acceptation du produit : " + response.message
                });
            }
        );
    };

    $scope.cancel = function () {
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_REVIEWING.id,
            "1169"
        ).success(function (response){
            $scope.product.certified = response.data.certified;
            $modalInstance.dismiss('cancel');
        }).error(function (response){
            $modalInstance.dismiss('cancel');
        });
    };

    var getGLNs = function (productSegment) {
        return productSegment.glns ? productSegment.glns : productSegment.query[0].filter_glns;
    };

    var loadProductGLNs = function () {
        var filters = {
            'filter_ean': product.isIdentifiedBy[0].reference,
            'filter_type': '9'
        };
        $$sdkGdsn.GdsnGLNList({}, filters, {}, null, null).then(function (response) {
            var result = response.data.data;
            if (!result.length) { return; }
            _.map(result, function (gln) {
                if (_.indexOf($scope.glns, gln.gln) == -1) { $scope.glns.push(gln.gln); }
            });
            $scope.product.gln = result[0].gln;
        });
    };

    var init = function () {
        if (!product.isBrandedBy.id || product.isBrandedBy.id === 1) {
            product.isBrandedBy = null;
        } else {
            if (!product.isBrandedBy.name) {
                $$ORM.repository('Brand').get(product.isBrandedBy.id).then(function (brand) {
                    product.isBrandedBy.text = brand.name;
                })
            }
            product.isBrandedBy.text = product.isBrandedBy.name;
        }
        loadProductGLNs();
        $scope.glns = $scope.glns.concat(getGLNs(productSegment));
    }

    init();
}]);
