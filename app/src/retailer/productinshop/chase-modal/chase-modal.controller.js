'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given productInShop.
 */
angular.module('jDashboardFluxApp').controller('ProductChaseModalController', [
    '$scope', '$modalInstance', '$window', 'productInShops', 'user', '$$sdkMailer',
    function ($scope, $modalInstance, $window, productInShops, user, $$sdkMailer) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
        $scope.productInShops = productInShops;
        $scope.message = {
            from: user,
            to: {
                username: productInShops[0].isProducedBy.name // WIP for demo, service-auth is not functional
            },
            subject: '[INCO] ' + user.firstname + ' ' + user.lastname + ' vous suggère une correction',
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
            }).error(function () {
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
