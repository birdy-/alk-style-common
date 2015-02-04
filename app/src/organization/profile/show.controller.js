'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationProfileShowController', [
    '$scope', '$routeParams', '$modal', '$$ORM', '$window',
    function ($scope, $routeParams, $modal, $$ORM, $window) {

    $scope.organization = {};
    $scope.brands = [];
    $scope.organizationForm = {};
    $scope.organizationFormInit = function (form) {
        form.$loading = true;
        form.$saving = false;
        $scope.organizationForm = form;
    };

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    $scope.updateOrganization = function () {
        $scope.organizationForm.$saving = true;
        $$ORM.repository('Organization').update($scope.organization).then(function (organization) {
            $scope.organizationForm.$saving = false;
            $scope.organizationForm.$setPristine();
        }, function (response) {
            $scope.organizationForm.$saving = false;
            $window.alert(response.data || 'Une erreur est survenue, merci de vous rapprocher de notre support.');
        });
    };

    $scope.addUser = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/organization/user/add.html',
            controller: 'OrganizationUserAddController',
            resolve: {
                organization: function () {
                    return $scope.organization;
                },
                brands: function () {
                    return $scope.brands;
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

}]);
