"use strict";

angular.module('jDashboardFluxApp').controller('RegisterController', [
    '$scope', '$$sdkAuth', '$location', '$http', '$window', '$$autocomplete',
    function ($scope, $$sdkAuth, $location, $http, $window, $$autocomplete) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.userForm = {};
        $scope.companyForm = {};
        $scope.emailForm = {};
        $scope.formInit = function(form) {
            form.$loading = true;
            form.$saving = false;
        };

        $scope.company = {
            nameLegal: '',
            identifierLegal: null,
            identifierCity: null,
            address: null,
            postCode: null,
            city: null,
            country: null,
            claimGLNs: [new GLN()],
            type: 'Organization'
        };

        $scope.user = {
            firstname: null,
            lastname: null,
            jobTitle: null,
            phonenumber: null,
            username: null,
            password: null,
            accept: false,
            type: 'User'
        };
        $scope.ok = false;
        $scope.message = null;

        $scope.select2OrganizationOptions = $$autocomplete.getOptions('organization', {multiple: false});

        // ------------------------------------------------------------------------
        // Event binding
        // ------------------------------------------------------------------------

        $scope.$watch('existingCompany', function () {
            if ($scope.existingCompany) {
                $scope.company = $scope.existingCompany;
            }
        }, true);

        $scope.checkUserForm = function(field) {
            return checkForm($scope.userForm);
        };
        $scope.checkCompanyForm = function(field) {
            return checkForm($scope.companyForm);
        };
        $scope.checkEmailForm = function(field) {
            if ($scope.companyForm.$valid) {
                return 'inprogress';
            }
            return 'todo';
        };
        var checkForm = function(form) {
            if (form.$valid) {
                return 'done';
            }
            if (form.$pristine) {
                return 'todo';
            }
            return 'inprogress';
        };

        $scope.checkCompanyFormField = function(field) {
            return checkFormField(field, $scope.companyForm);
        };
        $scope.checkUserFormField = function(field) {
            return checkFormField(field, $scope.userForm);
        };
        var checkFormField = function(field, form) {
            var classes = {};
            if(!form
            || !form[field]) {
                return [];
            }
            if (form[field].$invalid) {
                if (angular.isEmpty(form[field].$viewValue)) {
                    classes['has-warning'] = true;
                } else {
                    classes['has-error'] = true;
                }
            }
            if (form[field].$valid) {
                if (angular.isEmpty(form[field].$viewValue)) {
                    // Empty fields that are not required should not be displayed green
                } else {
                    classes['has-success'] = true;
                }
            }
            return classes;
        };

        $scope.addGLN = function () {
            $scope.company.claimGLNs.push(new GLN());
            return;
        };

        $scope.removeGLN = function (glnIndex) {
            $scope.company.claimGLNs.splice(glnIndex, 1);
            return;
        };

        $scope.$watch('company', function () {console.log($scope.company)}, true);

        $scope.submit = function () {
            if (!$scope.userForm.$valid) {
                $window.alert("Le formulaire est invalide, merci de le compléter.");
                return;
            }
            $scope.user.company = $scope.company.name;
            $scope.user.belongsTo = $scope.company;

            // Create user
            $$sdkAuth.UserSignUp($scope.user).success(function(){
                $scope.ok = true;
            }).error(function(response){
                $scope.ok = false;
                $scope.message = "Une erreur a eu lieu pendant votre inscription : " + response.message;
            });

            var recordUser = angular.copy($scope.user);
            // Remove password from the info that is sent for Mailinglist record
            delete recordUser['password'];
            // Create record of the registration
            var record = {
                origin: 0,   // Website Corporate Alkemics
                username: $scope.user.username,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                phonenumber: $scope.user.phonenumber,
                subject: 'New account created',
                message: angular.toJson({
                    user: recordUser,
                    company: $scope.company
                }, true)
            };

            $$sdkAuth.MailingListPost(record);
            // @todo : siltently register user so we will not have to re-ask the login
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------

}]);
