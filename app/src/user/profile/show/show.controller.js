'use strict';

/**
 * Controller in charge of the listing of ProductInShopSubstitutionRules.
 * Used by users that have a read / write authorization on the Substitution action on a
 * particular Shop.
 */
angular.module('jDashboardFluxApp').controller('UserProfileShowController', [
    '$scope', 'permission', '$routeParams', '$$sdkAuth', '$$ORM', '$modal', '$window',
    function ($scope, permission, $routeParams, $$sdkAuth, $$ORM, $modal, $window) {

    // --------------------------------------------------------------------------------
    // Variables
    // --------------------------------------------------------------------------------
    $scope.user = {};
    $scope.userFormInit = function(form) {
        form.$loading = true;
        form.$saving = false;
        $scope.userForm = form;
    };
    $scope.passwordFormInit = function(form) {
        form.$loading = true;
        form.$saving = false;
        $scope.passwordForm = form;
    };

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    $scope.updatePassword = function(){
        $scope.userForm.$saving = true;
        $$sdkAuth.UserChangePassword({
            id: $scope.user.id,
            password: $scope.user.password
        }).success(function(){
            $window.alert('Le mot de passe a été changé avec succès.');
            $scope.user.password['old'] = null;
            $scope.user.password['new'] = null;
            $scope.passwordForm.$saving = false;
            $scope.passwordForm.$setPristine();
        }).error(function(response){
            var message = '.';
            if (response && response.data && response.data.message) {
                message = ' : ' + response.data.message;
            }
            $window.alert('Erreur lors du changement du mot de passe'+message);
        });
    };

    $scope.updateUser = function() {
        $scope.userForm.$saving = true;
        $$sdkAuth.UserUpdate($scope.user).then(function(response){
            $scope.userForm.$saving = false;
            $scope.userForm.$setPristine();
        });
    };

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
            $window.alert('Problème lors de la suppression de la marque'+message);
        });
    };

    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------
    var hydrate = function(user) {
        if ($scope.userForm) {
            $scope.userForm.$loading = false;
        }
        if ($scope.passwordForm) {
            $scope.passwordForm.$loading = false;
        }
        user.belongsTo.forEach(function(entity){
            $$ORM.repository('Organization').get(entity.id);
        });
        var brandIds = user.managesBrand.map(function(entity){ return entity.id; });
        $$ORM.repository('Brand').list({}, {id: brandIds});
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

