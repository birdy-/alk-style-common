'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given productInShop.
 */
angular.module('jDashboardFluxApp').controller('ProductAttributionModalController', [
    '$scope', '$modalInstance', '$window', 'productInShops', 'user', '$$sdkMailer', '$$sdkCrud',
    function ($scope, $modalInstance, $window, productInShops, user, $$sdkMailer, $$sdkCrud) {

        var AttributionModal = function () {
            $scope.productInShops = productInShops;
            this.initMessage();
            this.initScope();
        };

        AttributionModal.prototype.initScope = function () {
            $scope.recipients = [];
            $scope.ok = this.validForm;
            $scope.cancel = this.closeModal;
        };

        AttributionModal.prototype.validForm = function () {
            var usernames = [];
            for (var i = 0; i < $scope.recipients.length; i++) {
                var type = $scope.recipients[i].type;
                var value = $scope.recipients[i].value;
                if (type === 'organization') {
                    $scope.message.to.organization = true;
                } else if (typeof(value) === 'string') {
                    usernames.push(value);
                }
            }
            $scope.message.to.username = _.uniq(usernames);
            $$sdkMailer.RetailerProductDataCompletionInvitationPost($scope.message).success(function (response) {
                $window.alert('Le message a bien été envoyé.');
                $modalInstance.close();
            }).error(function () {
                $window.alert('Une erreur est survenue pendant l\'envoi de l\'email. Merci de réessayer ultérieurement ou de contacter notre support.');
            });
        };

        AttributionModal.prototype.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };

        AttributionModal.prototype.initMessage = function () {
            if (productInShops.length === 1) {
                this.initProductContact();
            }
            $scope.message = {
                from: user,
                to: {
                    username: null,
                    organization: null
                },
                subject: '[INCO] ' + user.firstname + ' ' + user.lastname + ' vous invite à compléter vos fiches produit sur Alkemics',
                data: {
                    productInShops: productInShops
                }
            };
        };

        AttributionModal.prototype.initProductContact = function () {
            var productInShop = productInShops[0];
            $$sdkCrud.ProductShow(productInShop.isIdentifiedBy[0].identifiesProduct.id).then(function (result) {
                var product = result.data.data;
                var brand = product.isBrandedBy;
                // API returns 'ProductBrand' if the product has no brand
                if (brand.name !== 'ProductBrand') {
                    $scope.recipients.push({ type: 'organization', name: brand.name, value: true });
                }
            });
        };

        var attributionModal = new AttributionModal();
    }
]);
