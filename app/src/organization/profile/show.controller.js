'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationProfileShowController', [
    '$scope', 'permission','$routeParams', '$modal', '$$ORM', '$window', '$$sdkAuth',
    function ($scope, permission, $routeParams, $modal, $$ORM, $window, $$sdkAuth) {

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

    $scope.addGLNClaim = function () {
        if (!$scope.organization.claimGLNs)
            $scope.organization.claimGLNs = [];
        $scope.organization.claimGLNs.push(new GLN('added'));
        return;
    };

    $scope.removeGLNClaim = function (glnIndex) {
        $scope.organization.claimGLNs.splice(glnIndex, 1);
        return;
    };

    $scope.removeGLN = function (glnIndex) {
        $scope.organization.ownsGLN.splice(glnIndex, 1);
        return;
    };

    $scope.updateOrganization = function () {
        if ($scope.organization.claimGLNs) {
            for (var gln in $scope.organization.claimGLNs) {
                gln = $scope.organization.claimGLNs[gln];
                $$sdkAuth.UserClaimGlnCreate({'gln': gln.gln, 'organization_id': $scope.organizationId}).then(function (response) {});
            }
            loadGlnClaims();
            $scope.organization.claimGLNs = [];
        }
        if (isEmpty($scope.organization.identifierLegal)) { return; }
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
                },
                currentUser: function() {
                    return $scope.currentUser;
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

    $scope.organizationId = $routeParams.id;
    $$ORM.repository('Organization').get($scope.organizationId).then(function (entity) {
        $scope.organization = entity;
        $scope.organizationForm.$loading = false;
        loadUsers();
        loadBrands();
        loadSegments();
        loadGlnClaims();
    });

    var loadUsers = function () {
        $$ORM.repository('Organization').method('Users')($scope.organizationId).then(function (users) {
            $scope.users = users;
            $scope.users.map(function (user) {
                for (var i = 0, len = user.permission.length; i < len; i++) {
                    if (user.permission[i] === 'admin') {
                        $scope.administrators.push(user);
                        return;
                    }
                }
            });
        });
    };

    var loadBrands = function () {
        $$ORM.repository('Organization').method('Brands')($scope.organizationId).then(function (brands) {
            var brandIds = brands.map(function (brand) {
                return brand.id;
            });
            $$ORM.repository('Brand').list({}, {id: brandIds}, {}, 0, 100).then(function (brands) {
                $scope.brands = brands;
            });
        });
    };

    var loadSegments = function () {
        console.log('segments loading');
        var productSegmentIds = $scope.organization.ownsProductSegment.map(function (productSegment) {
            return productSegment.id;
        });
        $$ORM.repository('ProductSegment').list({organization_id: $scope.organizationId}, {filter_id_in: productSegmentIds}, {}, 0, 100).then(function (segments) {
            $scope.productSegments = segments;
        });
    };

    var loadGlnClaims = function () {
        var filters = {
            'organization_id': $scope.organizationId,
            'status': 0
        }
        $$sdkAuth.UserClaimGlnList({}, filters, {})
        .then(function (entities) {
            $scope.organization.pendingclaimGLNs = [];
            $scope.organization.pendingclaimGLNs = entities.data.data;

        });
    };

    permission.getUser().then(function(user) {
        $scope.currentUser = user;
        $scope.currentUser.belongsTo.map(function (organization) {
            if (organization.id == $scope.organizationId) {
                for (var i = 0, len = organization.permissions.length; i < len; i++) {
                    if (organization.permissions[i] == 'admin') {
                        $scope.isAdmin = true;
                    }
                }
            }
        });
    });
}]);
