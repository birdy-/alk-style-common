"use strict";

/**
 * Modal that allows the user to register on the mailing list
 */
angular.module('jDashboardFluxApp').controller('UserRoleAddController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$ORM', '$$autocomplete', '$window', 'permission', 'user', 'brand', 'organization',
    function ($scope, $modalInstance, $$sdkAuth, $$ORM, $$autocomplete, $window, permission, user, brand, organization) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    user.text = user.username;
    organization.text = organization.name;
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });
    $scope.select2userOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[user], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });
    $scope.select2organizationOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });
    $scope.role = {
        organization: organization,
        brand: brand,
        user: user,
        plugin: {
            id: 205,
            name: 'Product Stream'
        }
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.submit = function () {
        if (!$scope.role.user) {
            $window.alert("Merci de préciser l'utilisateur.");
            return;
        }
        if (!$scope.role.brand) {
            $window.alert("Merci de préciser la marque.");
            return;
        }
        if (!$scope.role.organization) {
            $window.alert("Merci de préciser l'organisation.");
            return;
        }

        // Could be improved...
        $$sdkAuth.PluginAdd($scope.role.user.id, {
            plugin_id: $scope.role.plugin.id, // Plugin Product Stream
            brand_id: $scope.role.brand.id,
            organization_id: $scope.role.organization.id
        }).then(function(){
            $modalInstance.close();
        }, function(response){
            var message = '.';
            if (response && response.data && response.data.message) {
                message = ' : '+ response.data.message + '.';
            }
            $window.alert("Problème lors de l'ajout de la permission.");
        });

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function(user){
        user.belongsTo.forEach(function(organization){
            $$ORM.repository('Organization').get(organization.id);
        });
        angular.extend($scope.select2organizationOptions.data, user.belongsTo);
    });
    $$sdkAuth.OrganizationBrands(organization.id).then(function (response) {
        response.data.data.forEach(function (brand) {
            $$ORM.repository('Brand').get(brand.id).then(function (entity) {
                $scope.select2brandOptions.data.push(entity);
            });
        });
    });

}]);
