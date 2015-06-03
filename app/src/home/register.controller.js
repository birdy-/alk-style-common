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
        $scope.organizationGuessed = false;
        $scope.formInit = function(form) {
            form.$loading = true;
            form.$saving = false;
        };

        $scope.company = {}

        var resetCompany = function(){
            $scope.company.nameLegal = '',
            $scope.company.identifierLegal = null,
            $scope.company.identifierCity = null,
            $scope.company.address = null,
            $scope.company.postCode = null,
            $scope.company.city = null,
            $scope.company.country = null,
            $scope.company.claimGLNs = [new GLN()],
            $scope.company.type = 'Organization'
            $scope.organizationGuessed = false;
            $scope.existingCompany = null;
        }

        resetCompany();

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

        $scope.$watch('userForm.$valid', function (newValue) {
            //When userForm is valid, try to guess user organization
            if(newValue && $scope.company.nameLegal == ''){
                $$sdkAuth.OrganizationGuess($scope.user.username).success(function(response){
                    if (response.data.id) {
                        $scope.company = response.data;
                        $scope.existingCompany = $scope.company;
                        $scope.organizationGuessed = true;
                    }
                    else {
                        resetCompany();
                    }
                }).error(function(response){

                });
            }
            else{
                resetCompany();
            }
        });

        $scope.$watch('existingCompany', function () {
            // Field has been cleared, clear company and do not guess
            if ($scope.existingCompany == null){
                resetCompany();
            }
            // Field has been changed and there was a guess, remove the guess
            if ($scope.organizationGuessed && $scope.existingCompany !== $scope.company){
                $scope.organizationGuessed = false;
            }
            else if ($scope.existingCompany) {
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
            if (typeof $scope.company.claimGLNs === 'undefined') {
                $scope.company.claimGLNs = [];
            }
            $scope.company.claimGLNs.push(new GLN());
            return;
        };

        $scope.removeGLN = function (glnIndex) {
            $scope.company.claimGLNs.splice(glnIndex, 1);
            return;
        };

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
            var recordCompany = angular.copy($scope.company);
            // Remove users list from the info that is sent for Mailinglist record
            delete recordCompany['users'];
            var record = {
                origin: 0,   // Website Corporate Alkemics
                username: $scope.user.username,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                phonenumber: $scope.user.phonenumber,
                subject: 'New account created',
                message: angular.toJson({
                    user: recordUser,
                    company: recordCompany
                }, true)
            };

            $$sdkAuth.MailingListPost(record);
            // @todo : siltently register user so we will not have to re-ask the login
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------

}]);
