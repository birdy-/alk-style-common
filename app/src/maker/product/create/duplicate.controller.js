'use_strict';

/**
 * Modal that allows the user to duplicate a given product.
 */
angular.module('jDashboardFluxApp')
.controller('ProductDuplicationModalController', [
    '$scope', '$log', '$modalInstance', '$$sdkEtl', 'product', 'ngToast',
    function ($scope, $log, $modalInstance, $$sdkEtl, product, ngToast) {

    $scope.product = product;

    $scope.ok = function (product, reference) {
        var payload = {
            reference: reference,
            type: ProductReference.TYPE_EAN13.id
        };
        $$sdkEtl.ProductDuplicate(product.id, payload)
        .success(function (response) {
            ngToast.create({
              className: 'success',
              content: 'Le produit a correctement été dupliqué. <a href="#/maker/product/' + reference + '/data/general">Aller vers le nouveau produit.</a>',
              dismissOnTimeout: false,
              dismissButton: true
            });
        }).error(function (response) {
            var message = response.message || '';
            var content = 'Une erreur est survenue.';
            if (response.status === 403) {
                content = content + ' La référence demandée est déjà utilisée. Veuillez vous rapprocher de notre support.';
            } else {
                content = content + message;
            }
            ngToast.create({
                className: 'danger',
                content: content,
                dismissOnTimeout: false,
                dismissButton: true
            });
        });
        $modalInstance.close(product);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
