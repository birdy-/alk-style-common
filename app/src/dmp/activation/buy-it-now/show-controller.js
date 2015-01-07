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
        if ($scope.campaign.basedOn === 'product') {
            delete $scope.campaign.runsOnBrand;
        } else if ($scope.campaign.basedOn === 'brand') {
            delete $scope.campaign.runsOnBrand;
        }

        $scope.campaign.id = Math.random().toString(36).substring(7);
        $scope.preview = true;
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var create = function () {
        $scope.campaign = new Campaign();
        $scope.campaign.billedBy = $scope.user.belongsTo[0];
        $scope.campaign._runsIn = null;
        $scope.campaign._runsOnProduct = null;
        $scope.campaign._runsOnBrand = null;
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
