'use_strict';

angular.module('jDashboardFluxApp').controller('DmpActivationBuyItNowShowController', [
    '$scope', '$$ORM', 'permission', '$routeParams', '$window', '$location', '$log',
    function ($scope, $$ORM, permission, $routeParams, $window, $location, $log) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.campaign = null;
    $scope.user = null;
    $scope.preview = false;
    $scope.restrict = { with_isidentifiedby: 1 };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.persist = function () {
        // Compute campaign parameters
        $scope.campaign.runsIn = [$scope.campaign._runsIn];
        $scope.campaign.runsOnProduct = [$scope.campaign._runsOnProduct];

        // Error callback
        var error = function (response) {
            $window.alert('Une erreur est survenue pendant la mise à jour de la campagne.');
        };
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

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var create = function () {
        $scope.campaign = new Campaign();
        $scope.campaign.billedBy = $scope.user.belongsTo[0];
        $scope.campaign._runsIn = null;
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
                campaign._runsOnProduct = campaign.runsOnProduct[0];
                $$ORM.repository('Product').get(campaign._runsOnProduct.id, {reference: true});
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
    }
    init();

}]);
