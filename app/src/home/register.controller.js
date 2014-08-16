
angular.module('jDashboardFluxApp').controller('RegisterController', [
    '$scope', '$$sdkAuth', '$location', '$http',
    function ($scope, $$sdkAuth, $location, $http) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.userForm = {};
        $scope.companyForm = {};
        $scope.dataForm = {};
        $scope.formInit = function(form) {
        };

        $scope.data = {
            product: null,
            brand: null,
        };
        $scope.company = {
            rcs: null,
            nameLegal: null,
            identifierLegal: null,
            identifierCity: null,
            adress: null,
            postcode: null,
            city: null,
            country: null,
        };
        $scope.user = {
            firstname: null,
            lastname: null,
            job: null,
            phonenumber: null,
            username: null,
            password: null,
            accept: false,
        };
        $scope.ok = false;
        $scope.message = null;

        // ------------------------------------------------------------------------
        // Event binding
        // ------------------------------------------------------------------------

        $scope.checkCompanyForm = function(field) {
            return checkForm(field, $scope.companyForm);
        };
        $scope.checkUserForm = function(field) {
            return checkForm(field, $scope.userForm);
        };
        var checkForm = function(field, form) {
            var classes = {};
            if(!form
            || !form[field]) {
                return [];
            }
            if (form[field].$invalid) {
                if (isEmpty(form[field].$viewValue)) {
                    classes['has-warning'] = true;
                } else {
                    classes['has-error'] = true;
                }
            }
            if (form[field].$valid) {
                if (isEmpty(form[field].$viewValue)) {
                    // Empty fields that are not required should not be displayed green
                } else {
                    classes['has-success'] = true;
                }
            }
            return classes;
        };

        $scope.submit = function() {
            if (!$scope.userForm.$valid) {
                alert("Le formulaire est invalide, merci de le compléter.");
                return;
            }
            if (!$scope.user.accept) {
                alert("Vous n'avez pas accepté les CGU.");
                return;
            }
            $scope.user.company = $scope.company.name;

            // Create record of the registration
            var record = {
                origin: 0,   // Website Corporate Alkemics
                username: $scope.user.username,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                phonenumber: $scope.user.phonenumber,
                subject: 'New account created',
                message: angular.toJson({
                    user: $scope.user,
                    company: $scope.company,
                    data: $scope.data,
                }, true),
            };
            $$sdkAuth.MailingListPost(record);

            // Create user
            $$sdkAuth.UserSignUp($scope.user).success(function(response){
                $scope.ok = true;
            }).error(function(response){
                $scope.ok = false;
                $scope.message = "Une erreur a eu lieu pendant votre inscription : "+response.message;
            });
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------

}]);