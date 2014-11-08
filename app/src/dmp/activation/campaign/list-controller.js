'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('DmpActivationCampaignListController', [
    '$scope', '$$ORM', 'permission',
    function ($scope, $$ORM, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.campaigns = [];
    $scope.placements = [];
    $scope.offset = 0;
    $scope.limit = 20;

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    $scope.prev = function () {
        $scope.offset = Math.max($scope.offset - $scope.limit, 0);
        list();
    };
    $scope.next = function () {
        $scope.offset = $scope.offset + $scope.limit;
        list();
    };

    $scope.link = function (campaign) {
        if (campaign.type === Campaign.TYPE_QRCODE.id
        || campaign.type === Campaign.TYPE_LANDINGPAGE.id) {
            return 'landingpage';
        } else if (campaign.type === Campaign.TYPE_BUTTON.id) {
            return 'button';
        } else if (campaign.type === Campaign.TYPE_SHOPPINGLIST.id) {
            return 'shoppinglist';
        } else {
            return '';
        }
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var list = function() {
        var placementIds = $scope.placements.map(function(placement) {return placement.id}).join(",");
        var types = [
            Campaign.TYPE_QRCODE.id,
            Campaign.TYPE_SHOPPINGLIST.id,
            Campaign.TYPE_BUTTON.id,
            Campaign.TYPE_LANDINGPAGE.id
        ].join(',');
        $$ORM.repository('Campaign').list({}, {
            runsIn_id: placementIds,
            type: types
        }, {}, $scope.limit, $scope.offset).then(function(campaigns) {
            $scope.campaigns = campaigns;
        });
    };

    var init = function() {
        permission.getUser().then(function(user) {
            var websiteIds = user.managesWebsite.map(function(website) {return website.id}).join(",");
            var types = [
                Placement.TYPE_SHOPPING_LIST_RECIPE.id,
                Placement.TYPE_SHOPPING_LIST_LIST.id,
                Placement.TYPE_PRINTED_LIST_RECIPE.id,
                Placement.TYPE_PRINTED_LIST_LIST.id,
                Placement.TYPE_RECIPE_LINK.id,
                Placement.TYPE_PRODUCT_LINK.id,
                Placement.TYPE_IN_BANNER.id,
                Placement.TYPE_IN_VIDEO.id,
                Placement.TYPE_BANNER_SIMPLE.id,
                Placement.TYPE_BANNER_INTERACTIVE.id
            ].join(',');
            $$ORM.repository('Placement').list({}, {
                appearsOn_id: websiteIds,
                type: types
            }).then(function(placements) {
                $scope.placements = placements;
                list();
            });
        });
    };
    init();

}]);
