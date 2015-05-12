'use_strict';

angular.module('jDashboardFluxApp').controller('ProductSegmentCreateModalController', [
    '$scope', '$window', '$modalInstance', 'permission', 'organization_id', 'productsegment_id', '$$sdkAuth', '$$sdkCrud',
    function ($scope, $window, $modalInstance, permission, organization_id, productsegment_id, $$sdkAuth, $$sdkCrud) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.possibleGLNS = [];
    $scope.pendingGLN = null;
    $scope.display = {
        help: false,
        advanced: false
    };

    $scope.editMode = (productsegment_id !== null);
    $scope.segmentLoaded = !$scope.editMode;
    $scope.productSegment = null;

    $scope.user = null;
    $scope.organization = null;
    $scope.productSegmentName = null;
    $scope.glns = [];
    $scope.brands = [];


    // ------------------------------------------------------------------------
    // Event Binding
    // ------------------------------------------------------------------------
    $scope.removeGLN = function (i) {
        $scope.possibleGLNS.push($scope.glns[i]);
        $scope.glns.splice(i, 1);
    };

    $scope.addGLN = function () {
       if ($scope.pendingGLN != null)
            $scope.glns.push($scope.pendingGLN);
        $scope.glns.map(function (gln) {
            var s = -1;
            if ((s = $scope.possibleGLNS.indexOf(gln)) !== -1)
                $scope.possibleGLNS.splice(s, 1);
        });
        $scope.pendingGLN = $scope.possibleGLNS[0];
    };

    $scope.validate = function () {
        // Cleaning possible bad values of GLNS
        for (var i = 0, len = $scope.glns.length; i < len; i++) {
            if (typeof($scope.glns[i]) === 'undefined' || $scope.glns[i] == null || $scope.glns[i].length == 0) {
                $scope.glns.splice(i, 1);
                continue;
            }
            if ($scope.glns.indexOf($scope.glns[i]) !== i)
                $scope.glns.splice(i, 1);
        }
        // Name and at least one GLN (for now) are mandatory
        if (typeof($scope.productSegmentName) === 'undefined'
            || $scope.productSegmentName == null
            || $scope.productSegmentName.length == 0
            || typeof($scope.glns) === 'undefined'
            || $scope.glns == null
            || $scope.glns.length == 0) {
            $window.alert('Création du segment de produits impossible. Merci de consulter le guide utilisateur.'); // voluntarily generic
            return false;
        }
        return true;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss(null);
    };

    $scope.submit = function () {
        if ($scope.validate() == false)
            return;

        // Craft query
        var query = [];
        var brandIds = [];
        $scope.brands.map(function (brand) { brandIds.push(brand.id); });
        query.push({'filter_brand_ids': brandIds, 'filter_glns': $scope.glns });

        // Craft ShortID
        var shortId = "PS_" + organization_id + "_" + $scope.user['id'] + "_" + $scope.productSegmentName.substring(0, 3);

        // Create Productsegment
        if ($scope.editMode) {
            $$sdkCrud.ProductSegmentUpdate(productsegment_id, $scope.productSegmentName, query).then(function (response) {
                $modalInstance.close('OK');
            });
        } else {
            $$sdkCrud.ProductSegmentCreate($scope.productSegmentName, shortId, query, organization_id).then(function (response) {
                $modalInstance.close('OK');
            });
        }
    };


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    var loadProductSegment = function () {
        $$sdkCrud.ProductSegmentShow(productsegment_id).then(function (response) {

            $scope.productSegment = response.data.data;
            $scope.productSegmentName = $scope.productSegment.name;

            $scope.glns = $scope.productSegment.query[0].filter_glns;
            for (var i in $scope.glns) {
                if ($scope.possibleGLNS.indexOf($scope.glns[i]) >= 0)
                    $scope.possibleGLNS.splice(i, 1);
            }

            // Retrieve brands
            if ($scope.productSegment.query[0].filter_brand_ids.length > 0) {
                $$sdkCrud.BrandList({}, { 'id':$scope.productSegment.query[0].filter_brand_ids })
                .then(function(brandResponse) {
                    $scope.brands = brandResponse.data.data;
                    for (i in $scope.brands) {
                        $scope.brands[i].text = $scope.brands[i].name;
                    }
                    $scope.segmentLoaded = true;
                });
            }
        });
    }

    var loadOrganization = function () {
        $$sdkAuth.OrganizationShow(organization_id).then(function (response) {
            $scope.organization = response.data.data;

            $scope.organization.ownsGLN.map(function (gln) {
                $scope.possibleGLNS.push(gln.gln);
            });

            if ($scope.editMode) {
                loadProductSegment();
            } else {
                // On create, all the GLN are selected by default
                $scope.glns = $scope.possibleGLNS;
                $scope.possibleGLNS = [];
            }


        });
    };

    var init = function() {
        permission.getUser().then(function (user) {
            $scope.user = user;
        });
        loadOrganization();
    };

    init();
}]);
