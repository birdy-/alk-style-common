'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given productInShop.
 */
angular.module('jDashboardFluxApp').controller('ProductAttributionModalController', [
    '$scope', '$log', '$modalInstance', '$$sdkCrud', '$window', 'productInShop', 'user', '$$sdkMailer',
    function ($scope, $log, $modalInstance, $$sdkCrud, $window, productInShop, user, $$sdkMailer) {
        $scope.productInShop = productInShop;
        $scope.message = {
            from: user,
            to: {
                username: null
            },
            subject: '[AUCHAN] ' + user.firstname + ' ' + user.lastname + ' vous invite à compléter votre fiche produit sur Alkemics',
            data: {
                productInShop: productInShop
            }
        };
        $scope.ok = function () {
            // @todo :
            
            $$sdkMailer.RetailerProductDataCompletionInvitationPost($scope.message).success(function (response) {
                $log.info(response);
                $modalInstance.close();
            }).error(function(){
                alert('Une erreur est survenue pendant l\'envoi de l\'email. Merci de réessayer ultérieurement ou de contacter notre support.');
            });
            
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
