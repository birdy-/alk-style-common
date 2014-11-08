'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('DmpActivationShoppingListShowController', [
    '$scope', '$$ORM', 'permission', '$$sdkCrud', '$routeParams', '$window', '$log', '$location',
    function ($scope, $$ORM, permission, $$sdkCrud, $routeParams, $window, $log, $location) {

    // --------------------------------------------------------------------------------
    // Variables
    // --------------------------------------------------------------------------------
    $scope.campaign = null;
    $scope.recipe = null;
    $scope.user = null;

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    $scope.$watch('campaign._runsIn', function (placement) {
        if (!placement
        || !placement.id
        || !placement.appearsOn
        || !placement.appearsOn.id) {
            return;
        }
        $$sdkCrud.RecipeList({}, {
            website_shortId: placement.appearsOn.id,
            es: 0
        }).then(function (response) {
            $scope.recipe = response.data.data[0];
        });
    }, true);

    $scope.persist = function() {
        // Compute campaign parameters
        var whitelist = {};
        $scope.campaign.whitelist.forEach(function (brand) {
            whitelist[brand.id] = 1;
        });
        var blacklist = {};
        $scope.campaign.blacklist.forEach(function (brand) {
            blacklist[brand.id] = -1;
        });
        $scope.campaign.parameters = {
            emphasize: {isProducedBy: whitelist},
            filter: {isProducedBy: blacklist}
        };
        $scope.campaign.runsIn = [$scope.campaign._runsIn];

        // Error callback
        var error = function(error) {
            $log.error('', error);
            $window.alert('Une erreur est survenue pendant la mise à jour de la campagne.')
        };
        // Save
        if ($scope.campaign.id) {
            $$ORM.repository('Campaign').update($scope.campaign).then(function() {
                $location.path('/dmp/activation/campaign');
            }, error);
        } else {
            $$ORM.repository('Campaign').create($scope.campaign).then(function() {
                $location.path('/dmp/activation/campaign');
            }, error);
        }
    };


    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------
    var create = function () {
        $scope.campaign = new Campaign();
        $scope.campaign.billedBy = $scope.user.belongsTo[0];
        $scope.campaign._runsIn = null;
        $scope.campaign.type = Campaign.TYPE_PROMOTE.id;
    };
    var show = function (id) {
        $$ORM.repository('Campaign').get(id).then(function (campaign) {
            // Load attributes
            var brandIds = [];
            campaign.whitelist = [];
            campaign.blacklist = [];
            angular.forEach(campaign.parameters.filter.isProducedBy, function (_, brandId) {
                brandIds.push(brandId);
                campaign.blacklist.push($$ORM.repository('Brand').lazy(brandId));
            });
            angular.forEach(campaign.parameters.emphasize.isProducedBy, function (_, brandId) {
                brandIds.push(brandId);
                campaign.whitelist.push($$ORM.repository('Brand').lazy(brandId));
            });
            $$ORM.repository('Brand').list({}, {id: brandIds.join(',')});
            if (campaign.runsIn.length) {
                campaign._runsIn = campaign.runsIn[0];
            } else {
                campaign._runsIn = null;
            }
            $scope.campaign = campaign;
        }, function (response) {
            $window.alert('Une erreur est survenue pendant le chargement de la campagne.')
        });
    };

    var init = function() {
        permission.getUser().then(function(user) {
            $scope.user = user;
            if ($routeParams.id) {
                show($routeParams.id);
            } else {
                create();
            }
        });
    }
    init();

}]);
