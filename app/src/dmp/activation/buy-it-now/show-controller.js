'use_strict';

angular.module('jDashboardFluxApp').controller('DmpActivationBuyItNowShowController', [
    '$scope', '$$ORM', 'permission', '$routeParams', '$window', '$location', '$log',
    function ($scope, $$ORM, permission, $routeParams, $window, $location, $log) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    var authorizedShopIds = [2, 4, 5, 7, 13, 14, 38];

    $scope.campaign = null;
    $scope.user = null;
    $scope.preview = false;
    $scope.restrict = { with_isidentifiedby: 1 };
    $scope.authorizedShops = [];
    $scope.selectedShops = [];

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------

    var computeAvailableShops = function (shops) {
        var shopIds = [];
        for (var i=0; i<shops.length; i++) {
            shopIds.push(shops[i].id);
        }
        return shopIds
    };

    var fetchAuthorizedShop = function (id) {
        $$ORM.repository('Shop').get(id).then(function (shop) {
            $scope.authorizedShops.push(shop);
        });
    };

    var fetchSelectedShop = function (id) {
        angular.forEach($scope.authorizedShops, function (shop) {
            if (shop.id === id) {
                $scope.campaign.parameters.availableShops.push(shop);
            }
        });
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.persist = function () {
        // Compute campaign parameters
        $scope.campaign.runsOnProduct = $scope.campaign._runsOnProduct;
        $scope.campaign.runsIn = [$scope.campaign._runsIn];
        $scope.campaign.parameters.availableShops = [];
        $log.info('Selected shops:', $scope.selectedShops);
        angular.forEach($scope.selectedShops, fetchSelectedShop);

        // Error callback
        var error = function (response) {
            $window.alert('Une erreur est survenue pendant la mise à jour de la campagne.');
        };
        $log.info('Campaign sent:', $scope.campaign);
        // Save
        if ($scope.campaign.id) {
            $$ORM.repository('Campaign').update($scope.campaign).then(function (campaign) {
                $scope.campaign = campaign;
                $scope.preview = true;
            }, error);
        } else {
            $$ORM.repository('Campaign').create($scope.campaign).then(function (campaign) {
                $scope.campaign = campaign;
                $scope.preview = true;
            }, error);
        }
    };

    $scope.toggleSelection = function toggleSelection(shopId) {
        var ids = $scope.selectedShops.indexOf(shopId);
        // is currently selected
        if (ids > -1) {
          $scope.selectedShops.splice(ids, 1);
        }
        // is newly selected
        else {
          $scope.selectedShops.push(shopId);
        }
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var create = function () {
        $scope.campaign = new Campaign();
        $scope.campaign.billedBy = $scope.user.belongsTo[0];
        $scope.campaign._runsOnProduct = null;
        $scope.campaign.type = Campaign.TYPE_BUYITNOW.id;
    };

    var show = function (id) {
        $$ORM.repository('Campaign').get(id).then(function (campaign) {
            // Load attributes
            if (campaign.runsIn.length) {
                campaign._runsIn = campaign.runsIn[0];
                $$ORM.repository('Placement').get(campaign._runsIn.id);
            } else {
                campaign.runsIn = null;
            }

            if (campaign.runsOnProduct.length) {
                campaign._runsOnProduct = campaign.runsOnProduct;
                for (var i=0; i<campaign.runsOnProduct.length; i++) {
                    $$ORM.repository('Product').get(campaign._runsOnProduct[i].id, {reference: true});
                }
            }

            if (campaign.parameters.availableShops.length) {
                angular.forEach(campaign.parameters.availableShops, function (shop) {
                    $scope.toggleSelection(shop.id);
                });
            }

            $scope.campaign = campaign;
            $scope.preview = true;
        }, function (response) {
            $window.alert('Une erreur est survenue pendant le chargement de la campagne.');
        });
    };

    var init = function () {
        permission.getUser().then(function (user) {
            $scope.user = user;
            if ($routeParams.id) {
                show($routeParams.id);
            } else {
                create();
            }
        });

        angular.forEach(authorizedShopIds, fetchAuthorizedShop);
    }
    init();

}]);
