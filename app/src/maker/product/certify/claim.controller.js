'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductClaimModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', '$log', 'permission',
    function ($scope, $modalInstance, $$sdkCrud, $window, $log, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.productReference = {};
    $scope.product = null;
    $scope.user = null;

    $scope.errors = {
        badReference: null,
        alreadyClaimed: null,
        coherency: null,
        unknown: null,
        confirmBrand: null,
        ok: null
    };

    // ------------------------------------------------------------------------
    // Logic
    // ------------------------------------------------------------------------
    var sendClaim = function() {
        // @todo : plug here the claim system
        // @todo : make sure to connect the Product to the ProductSegment that
        // authorizes the Organization to access this Product
        $$sdkCrud.ProductClaim($scope.product);
    };

    /**
     * Verifies whether I have rights over the given brand
     */
    var checkIfProductIsBrandedByOneOfMyBrands = function(brandId) {
        if (brandId === 1) {
            return true;
        }
        var brandIds = $scope.user.managesBrand.map(function(brand){
            return brand.id;
        });
        return brandIds.indexOf(brandId) !== -1;
    };

    /**
     * Performs a set of tests against the claim request.
     */
    var checkClaim = function(response) {
        // If the GTIN is incoherent (too few digits, incoherent verification digit)
        if (false /* @todo */) {
            $log.error('Bad reference.');
            $scope.errors.badReference = true;
            $scope.errors.ok = false;
            return;
        }

        // If the Product was already claimed by someone else, we will have to
        // review the claim manually
        if (false /* @todo */) {
            $log.warn('Already claimed.');
            $scope.errors.alreadyClaimed = true;
            $scope.errors.ok = false;
            sendClaim();
            return;
        }

        // If there are various Products that correspond to the ProductReference,
        // we will have to review the claim manually
        if (false /* @todo */) {
            $log.warn('Product coherency.');
            $scope.errors.coherency = true;
            $scope.errors.ok = false;
            sendClaim();
            return;
        }

        // If the Product does not exist, create it
        if (response.data.data.length === 0) {
            $scope.errors.unknown = true;
            $scope.errors.ok = null;
            $scope.product = {};
            return;
        }

        // Retrieve more info about the Product
        var productId = response.data.data[0].identifies.id;
        $$sdkCrud.ProductShow(productId).then(function(response){
            $scope.product = response.data.data;
            // Check if the Brand of the Product is coherent
            var brandId = $scope.product.isBrandedBy.id;
            if (!checkIfProductIsBrandedByOneOfMyBrands(brandId)) {
                $log.warn('Brand coherency.');
                $scope.errors.confirmBrand = true;
                $scope.errors.ok = false;
                sendClaim();
                return;
            }
            // Else everything is fine
            $log.info('Claim seems valid.');
            $scope.errors.ok = true;
            // Claim will be sent when the user validates.
        }, function (response) {
            $window.alert("Erreur pendant la récupération du produit : " + response.data.message);
        });
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.search = function() {
        // @todo : adapt with Claim call
        $$sdkCrud.ProductReferenceList({}, {
            reference: $scope.productReference.reference,
            type: 'EAN13'
        }).then(checkClaim, function (response) {
            $window.alert("Erreur pendant la recherche de l'EAN : " + response.data.message);
        });
    };

    /**
     * Called when the Product is new and is created
     */
    $scope.create = function() {
        $$sdkCrud.ProductCreate($scope.product).then(function (response) {
            // @todo : make sure to connect the Product to the ProductReference
            // @todo : make sure to connect the Product to the ProductSegment that
            // authorizes the Organization to access this Product
            $scope.product = response.data.data;
            // Redirect to the Product page
            $location.path('/maker/product/' + $scope.productReference.reference + '/data/general');
        }, function (response) {
            $window.alert("Erreur pendant la création du produit : " + response.data.message);
        });
    };
    /**
     * Called when everything went OK
     */
    $scope.fill = function () {
        sendClaim();
        $location.path('/maker/product/' + $scope.productReference.reference + '/data/general');
        $modalInstance.close($scope.product);
    };
    /**
     * Called when something when wrong
     */
    $scope.cancel = function () {
        // The claim request was sent above.
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function (user) {
        $scope.user = user;
    });

}]);
