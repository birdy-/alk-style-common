'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationProfileShowController', [
    '$scope', 'permission','$routeParams', '$modal', '$$ORM', '$window',
    function ($scope, permission, $routeParams, $modal, $$ORM, $window) {

    $scope.organization = {};
    $scope.brands = [];
    $scope.organizationForm = {};
    $scope.administrators = [];
    $scope.isAdmin = false;
    $scope.organizationFormInit = function (form) {
        form.$loading = true;
        form.$saving = false;
        $scope.organizationForm = form;
    };


    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    var isEmpty = function(value) {
        return (typeof(value) === 'undefined' || value == null || value == '' || value.length == 0);
    };



    $scope.updateOrganization = function () {
        if (isEmpty($scope.organization.identifierLegal))
            return;
        $scope.organizationForm.$saving = true;
        $$ORM.repository('Organization').update($scope.organization).then(function (organization) {
            $scope.organizationForm.$saving = false;
            $scope.organizationForm.$setPristine();
        }, function (response) {
            $scope.organizationForm.$saving = false;
            $window.alert(response.data || 'Une erreur est survenue, merci de vous rapprocher de notre support.');
        });
    };


    $scope.contactAdmin = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/organization/user/forbidden.html',
            controller: 'OrganizationUserForbiddenController',
            resolve: {
                administrators: function() {
                    return $scope.administrators;
                },
                title: function() {
                    return "Inviter un nouvel utilisateur";
                },
                action: function() {
                    return "inviter un nouvel utilisateur";
                }

            }
        });
    }; 

    $scope.addUser = function () {
        if ($scope.isAdmin == false) {
            $scope.contactAdmin();
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: '/src/organization/user/add.html',
            controller: 'OrganizationUserAddController',
            resolve: {
                organization: function () {
                    return $scope.organization;
                },
                brands: function () {
                    return $scope.brands;
                },
                administrators: function() {
                    return $scope.administrators;
                }

            }
        });

        modalInstance.result.then(function () {
            loadUsers();
        }, function () {
        });
    };

    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------

    var organizationId = $routeParams.id;
    $$ORM.repository('Organization').get(organizationId).then(function (entity) {
        $scope.organization = entity;
        $scope.organizationForm.$loading = false;
    });

    var loadUsers = function () {
        $$ORM.repository('Organization').method('Users')(organizationId).then(function (users) {
            $scope.users = users;
            $scope.users.map(function (user) {
                for (var i = 0, len = user.permission.length; i < len; i++) {
                    if (user.permission[i] == 'admin') {
                        $scope.administrators.push(user);
                        return;
                    }
                }
            });
        });
    };
    loadUsers();

    var loadBrands = function () {
        $$ORM.repository('Organization').method('Brands')(organizationId).then(function (brands) {
            var brandIds = brands.map(function (brand) {
                return brand.id;
            });
            $$ORM.repository('Brand').list({}, {id: brandIds}, {}, 0, 100).then(function (brands) {
                $scope.brands = brands;
            });
        });
    };
    loadBrands();

    permission.getUser().then(function(user) {
    $scope.currentUser = user;
    $scope.currentUser.belongsTo.map(function (organization) {
        if (organization.id == $scope.organization.id) {
            for (var i = 0, len = organization.permissions.length; i < len; i++)
                if (organization.permissions[i] == 'admin') {
                    $scope.isAdmin = true;
                    return;
                }
            }
        });
    });


}]);
