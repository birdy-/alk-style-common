'use strict';

/**
 * Controller in charge of the listing of ProductInShopSubstitutionRules.
 * Used by users that have a read / write authorization on the Substitution action on a
 * particular Shop.
 */
angular.module('jDashboardFluxApp').controller('UserPreferenceOrganizationCtrl', [
    '$scope', 'permission', 'Restangular', '$$sdkCampaign', '$$sdkUser',
    function ($scope, permission, Restangular, $$sdkCampaign, $$sdkUser) {

    // --------------------------------------------------------------------------------
    // Scope variables
    // --------------------------------------------------------------------------------
    $scope.user = {}

    // --------------------------------------------------------------------------------
    // Data retrievers
    // --------------------------------------------------------------------------------
    var URL = 'http://localhost.alkemics.com:6545/auth/v1';
    Restangular.setBaseUrl(URL);
    Restangular.setRestangularFields({
        selfLink: '_href'
    });
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred){
        return data.data;
    });
    var CRUD = Restangular.allUrl('shop', 'http://localhost.alkemics.com:6543/api/1');
    var AUTH = Restangular.allUrl('user', 'http://localhost.alkemics.com:6545/auth/v1');


    AUTH.one('user', 1).get({}).then(function(response){
        $scope.user = response;  

        $scope.user.managesWebsite.map(function(managesWebsite){
            CRUD.one('website', managesWebsite.id).get({}).then(function(fullWebsite){
                managesWebsite.name = fullWebsite.name;
            });
        });
        $scope.user.managesShop.map(function(managesShop){
            CRUD.one('shop', managesShop.id).get({}).then(function(fullShop){
                managesShop.name = fullShop.name;
            });
        });
        $scope.user.managesBrand.map(function(managesBrand){
            CRUD.one('brand', managesBrand.id).get({}).then(function(fullBrand){
                managesBrand.name = fullBrand.name;
            });
        });
        $scope.user.configures.map(function(configures){
            AUTH.one('plugin', configures.id).get({}).then(function(fullPlugin){
                configures.name = fullPlugin.name;
            });
        });

        // Get placements
        var websiteIds = $scope.user.managesWebsite.map(function(website){return website.id}).join(",");
        $$sdkCampaign.PlacementList({}, {appearsOn_id: websiteIds}).success(function(response){
            $scope.user.managesPlacement = response.data;
        }).error(function(response){
            alert("Erreur pendant la récupération de vos emplacements : "+response.message);
        });
    });
    
    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    var changePassword = function(){
        $$sdkUser.UserChangePassword($scope.user).success(function(){
            alert('Le mot de passe a été changé avec succès.');
            $scope.user.password.old = null;
            $scope.user.password.new = null;
        }).error(function(response){
            alert('Erreur lors du changement du mot de passe : '+response.message);
        });
    };
    $scope.changePassword = changePassword;

    // --------------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------------
    var init = function(){
        permission.getUser().then(function(user){
            $scope.user = user;
        });
    };
    //init();
}]);

