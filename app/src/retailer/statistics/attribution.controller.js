'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given productInShop.
 */
angular.module('jDashboardFluxApp').controller('ProductAttributionModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', 'productInShop', 'user',
    function ($scope, $modalInstance, $$sdkCrud, $window, productInShop, user) {
        console.log(user);
        $scope.productInShop = productInShop;
        $scope.message = {
            from: user,
            to: {
                username: null
            },
            subject: user.firstname + ' ' + user.lastname + ' vous invite à remplir votre fiche produit sur Alkemics',
            data: {
                productInShop: productInShop
            }
        };
        $scope.ok = function () {
            // @todo :
            // - call service-mailing
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
