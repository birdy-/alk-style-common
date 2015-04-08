'use_strict';

/**
 * Modal that allows the user to duplicate a given product.
 */
angular.module('jDashboardFluxApp')
.controller('ProductDuplicationModalController', [
    '$scope', '$log', '$modalInstance', '$$sdkCrud', '$$sdkEtl', '$window', 'product', 'user',
    function ($scope, $log, $modalInstance, $$sdkCrud, $$sdkEtl, $window, product, user) {

    $scope.product = product;
    $scope.user = user;

    var formatProductReference = function (response) {
        // If the GTIN is incoherent (too few digits, incoherent verification digit)
        if (response.data.message && response.data.message.indexOf("is not valid") !== -1) {
            $log.error('Bad reference.');
            return;
        }

        if (response.data.data.length === 0) {
            $log.error('No reference found.');
            return;
        }

        var productId = response.data.data[0].identifies.id;
        $$sdkCrud.ProductShow(productId).then(function(response){
            var product = response.data.data;
            // Else everything is fine
            $log.info('Product found:', product);
            // Claim will be sent when the user validates.
        }, function (response) {
            $window.alert("Erreur pendant la récupération du produit : " + response.data.message);
        });
    };

    $scope.searchProductReference = function (reference) {
        $$sdkCrud.ProductReferenceList({}, {
            reference: reference,
            type: ProductReference.TYPE_EAN13.name
        }).then(formatProductReference, function (response) {
            $window.alert("Erreur pendant la recherche de l'EAN : " + response.data.message);
        });
    };

    $scope.ok = function (product, reference) {
        var payload = {
            reference: reference,
            type: ProductReference.TYPE_EAN13.id
        };
        $$sdkEtl.ProductDuplicate(product.id, payload)
        .success(function (response) {
            $log.info(response);
        }).error(function (response) {
            $window.alert("Erreur pendant la duplication du produit : " + response.data.message);
        });
        $modalInstance.close(product);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
