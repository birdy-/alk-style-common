'use strict';

/**
 * Controller in charge of the listing of ProductInShopSubstitutionRules.
 * Used by users that have a read / write authorization on the Substitution action on a
 * particular Shop.
 */
angular.module('jDashboardFluxApp').controller('UserProfileShowController', [
    '$scope', 'permission', '$routeParams', '$$sdkAuth', '$$ORM', '$modal',
    function ($scope, permission, $routeParams, $$sdkAuth, $$ORM, $modal) {

    // --------------------------------------------------------------------------------
    // Variables
    // --------------------------------------------------------------------------------
    $scope.user = {}

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    var changePassword = function(){
        $$sdkAuth.UserChangePassword($scope.user).success(function(){
            alert('Le mot de passe a été changé avec succès.');
            $scope.user.password.old = null;
            $scope.user.password.new = null;
        }).error(function(response){
            alert('Erreur lors du changement du mot de passe : '+response.message);
        });
    };
    $scope.changePassword = changePassword;

    $scope.addBrand = function(brand) {
        // We could do better...
        var modalInstance = $modal.open({
            templateUrl: '/src/user/role/add.html',
            controller: 'UserRoleAddController',
            resolve: {
                user: function () {
                    return $scope.user;
                },
                brand: function() {
                    return brand;
                },
                organization: function() {
                    // We could do better...
                    return $scope.user.belongsTo[0];
                }
            }
        });

        modalInstance.result.then(function () {
            refresh();
        }, function () {
        });
    };

    $scope.deleteBrand = function(brand) {
        // Could be improved...
        var organizationId = $scope.user.belongsTo[0].id;
        $$sdkAuth.PluginRemove($scope.user.id, {
            plugin_id: 205, // Plugin Product Stream
            brand_id: brand.id,
            organization_id: organizationId
        }).then(refresh, function(response){
            var message = '.';
            if (response && response.data && response.data.message) {
                message = ' : '+ response.data.message + '.';
            }
            alert('Problème lors de la suppression de la marque');
        });
    };

    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------
    var hydrate = function(user) {
        user.belongsTo.forEach(function(entity){
            $$ORM.repository('Organization').get(entity.id);
        });
        user.managesBrand.forEach(function(entity){
            $$ORM.repository('Brand').get(entity.id);
        });
        user.managesWebsite.forEach(function(entity){
            $$ORM.repository('Website').get(entity.id);
        });
        /*user.managesShop.forEach(function(entity){
            $$ORM.repository('Shop').get(entity.id);
        });*/
        /*user.configures.forEach(function(configures){
        });*/
        $scope.user = user;
    };
    var refresh = function() {
        if ($routeParams.id) {
            $$ORM.repository('User').popCache($routeParams.id);
        } else {
            permission.reset();
        }
        init();
    };
    var init = function() {
        if ($routeParams.id) {
            $$ORM.repository('User').get($routeParams.id).then(hydrate);
        } else {
            permission.getUser().then(hydrate);
        }
    };
    init();
}]);

