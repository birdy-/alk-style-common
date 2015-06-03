"use strict";

angular.module('jDashboardFluxApp').controller('SignupInvitationController', [
    '$scope', '$$sdkAuth', '$location', '$http', '$window', '$routeParams', '$$ORM',
    function ($scope, $$sdkAuth, $location, $http, $window, $routeParams, $$ORM) {

        // ------------------------------------------------------------------------
        // Params
        // ------------------------------------------------------------------------
        $scope.token = null;
        $scope.username = null;
        $scope.invited_by_id = null;

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.user = null;

        $scope.userForm = null;
        $scope.passwordForm = null;
        $scope.accountForm = null;

        // ------------------------------------------------------------------------
        // Form Checking
        // ------------------------------------------------------------------------
        $scope.formInit = function(form) {
            form.$loading = true;
            form.$saving = false;
        };

        $scope.checkUserForm = function(field) {
            return checkForm($scope.userForm);
        };
        $scope.checkPasswordForm = function(field) {
            return checkForm($scope.passwordForm);
        };
        $scope.checkAccountForm = function(field) {
            return ($scope.accountForm.$valid ? 'inprogress' : 'todo');
        };

        var checkForm = function(form) {
            return (form.$valid ? 'done' : (form.$pristine ? 'todo' : 'inprogress'));
        };

        $scope.checkUserFormField = function(field) {
            return checkFormField(field, $scope.userForm);
        };

        $scope.checkPasswordFormField = function(field) {
            return checkFormField(field, $scope.passwordForm);
        };

        var checkFormField = function(field, form) {
            var classes = {};
            if(!form || !form[field])
                return [];
            if (form[field].$invalid) {
                if (angular.isEmpty(form[field].$viewValue))
                    classes['has-warning'] = true;
                else
                    classes['has-error'] = true;
            }
            if (form[field].$valid) {
                if (angular.isEmpty(form[field].$viewValue)) {
                    // Empty fields that are not required should not be displayed green
                }
                else
                    classes['has-success'] = true;
            }
            return classes;
        };

        $scope.submit = function() {
            if (!$scope.userForm.$valid) {
                $window.alert("Le formulaire est invalide, merci de le compléter.");
                return;
            }

            // Activate User
            var payload = {
                username: $scope.user.username,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                jobTitle: $scope.user.jobTitle,
                phonenumber: $scope.user.phonenumber,
                password: $scope.user.password,
                token: $scope.token
            };
            if ($scope.invited_by_id != null)
                payload.invited_by_id = $scope.invited_by_id;
            $$sdkAuth.UserSignUpInvitation(payload).success(function (){
                $scope.ok = true;
            }).error(function (response) {
                $scope.ok = false;
                $scope.message = "Impossible d'activer votre compte : " + response.message;
            });
       };


        // ------------------------------------------------------------------------
        // Navigation
        // ------------------------------------------------------------------------
        $scope.goHome = function() {
            $location.path($location.url($location.path('/')));
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        $scope.loadUser = function() {
            $$sdkAuth.UserActivationCheck($scope.username, $scope.token).then(function (response) {
                if (typeof(response.data) === 'undefined' || typeof(response.data.data) === 'undefined')
                    $scope.goHome();
                $scope.user = response.data.data;
            });
        };

        $scope.init = function() {

            $scope.token         = $location.search()['token'];
            $scope.username      = $location.search()['username'];
            $scope.invited_by_id = $location.search()['i'];

            if ($scope.username === 'undefined' || $scope.token === 'undefined')
                $scope.goHome()

            $scope.loadUser();
        };

        $scope.init();

}]);
