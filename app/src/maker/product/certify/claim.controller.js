'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductClaimModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$$ORM', '$window', '$log', 'permission', '$routeParams', '$$sdkAuth', 'brand', '$location',
    function ($scope, $modalInstance, $$sdkCrud, $$ORM, $window, $log, permission, $routeParams, $$sdkAuth, brand, $location) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.productReference = {};
    $scope.product = null;
    $scope.user = null;
    if (typeof(brand) !== 'undefined') {
        $scope.brand = brand;
    }
    $scope.claim = {};
    $scope.multiple = true;
    $scope.switchMultiple = function() {
        $scope.multiple = !$scope.multiple;

        initErrors();
    };

    var initErrors = function () {
        $scope.errors = {
            badReference: null,
            alreadyClaimed: null,
            coherency: null,
            unknown: null,
            confirmBrand: null,
            badGLN: null,
            noProducts: null,
            ok: null
        };
    };

    initErrors();

    $scope.products = [];

    // ------------------------------------------------------------------------
    // Logic
    // ------------------------------------------------------------------------

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
        if (response.data.message && response.data.message.indexOf("is not valid") !== -1) {
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
                $scope.sendClaim();
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

    var isGLNOk = function () {
        if (!$scope.claim.gln) {
            $scope.errors.badGLN = true;
            return false;
        }
        $scope.errors.badGLN = false;
        return true;
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    var sendClaim = function() {
        var brand_id = $scope.brand ? $scope.brand.id : $scope.product.isBrandedBy.id;
        $$sdkAuth.UserClaimProductReferenceCreate($scope.product.nameLegal,
            $scope.productReference.reference,
            brand_id, $scope.claim.gln).then(function (response) {
                $scope.errors.noError = ($scope.errors.confirmBrand === true) ? false : true;
                $scope.errors.unknown = false;
                $scope.errors.ok = false;
            }, checkClaim);
    };

    var sendClaimMultiple = function() {
        var brand_id = $scope.brand ? $scope.brand.id : $scope.product.isBrandedBy.id;
        var products = $scope.products;
        for (var index in products) {
            if (!products[index].reference || !products[index].reference.length) {
                continue;
            }
            $$sdkAuth.UserClaimProductReferenceCreate(
                products[index].nameLegal,
                products[index].reference,
                brand_id, $scope.claim.gln).then(function (response) {
                    $scope.errors.noError = ($scope.errors.confirmBrand === true) ? false : true;
                    $scope.errors.unknown = false;
                    $scope.errors.ok = false;
                });
        }
    };

    $scope.search = function() {
        if (!isGLNOk()) {
            return;
        }
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
        sendClaim();
    };
    /**
     * Called when everything went OK
     */
    $scope.fill = function () {
        sendClaim();
        $location.path('/maker/product/' + $scope.productReference.reference + '/data/general');
        $modalInstance.close($scope.product);
    };

    $scope.fillMultiple = function () {
        if (!isGLNOk()) {
            return;
        }
        sendClaimMultiple();
    };

    /**
     * Called when something went wrong
     */
    $scope.cancel = function () {
        // The claim request was sent above.
        $modalInstance.dismiss('cancel');
    };

    /**
     *
     */
    $scope.renewClaim = function () {
        // The claim request was sent above.
        $modalInstance.close();
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function (user) {
        $scope.user = user;
        var organizationId = user.belongsTo[0].id;
        $$ORM.repository('Organization').get(organizationId).then(function (entity) {
            $scope.organization = entity;
        });
    });

}]);
