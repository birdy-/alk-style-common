'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given productInShop.
 */
angular.module('jDashboardFluxApp').controller('ProductAttributionModalController', [
    '$scope', '$log', '$modalInstance', '$window', 'productInShops', 'user', '$$sdkMailer',
    function ($scope, $log, $modalInstance, $window, productInShops, user, $$sdkMailer) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
        $scope.productInShops = productInShops;
        $scope.message = {
            from: user,
            to: {
                username: null
            },
            subject: '[INCO] ' + user.firstname + ' ' + user.lastname + ' vous invite à compléter vos fiches produit sur Alkemics',
            data: {
                productInShops: productInShops
            }
        };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
        $scope.ok = function () {
            $$sdkMailer.RetailerProductDataCompletionInvitationPost($scope.message).success(function (response) {
                $window.alert('Le message a bien été envoyé.');
                $modalInstance.close();
            }).error(function(){
                $window.alert('Une erreur est survenue pendant l\'envoi de l\'email. Merci de réessayer ultérieurement ou de contacter notre support.');
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    }
]);
