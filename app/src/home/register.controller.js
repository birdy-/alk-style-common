
angular.module('jDashboardFluxApp').controller('RegisterCtrl', [
    '$scope', '$$sdkUser', '$location', '$http',
    function ($scope, $$sdkUser, $location, $http) {

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
            name: null,
        };
        $scope.user = {
            firstname: null,
            lastname: null,
            job: null,
            phonenumber: null,
            login: null,
            password: null,
            accept: false,
        };
        $scope.ok = true;
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
            if (!$scope.user.accept) {
                alert("Vous n'avez pas accepté les CGU.");
                return;
            }

            // Create record of the registration
            var record = {
                origin: 0,   // Website Corporate Alkemics
                email: $scope.user.login,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                phone_number: $scope.user.phonenumber,
                message: "Account creation : " + angular.toJson({
                    user: $scope.user,
                    company: $scope.company,
                    data: $scope.data,
                }, true),
            };
            $http.post(
                'https://auth.alkemics.com/auth/v1/mailinglist/register',
                record
            ).success(function (response) {
            }).error(function (response) {
                $http.get(
                    'https://auth.alkemics.com/auth/v1/mailinglist/register',
                    record
                );
            });

            // Create user
            $$sdkUser.UserCreate($scope.user).success(function(response){
                $scope.ok = true;
            }).error(function(response){
                $scope.ok = false;
                $scope.message = "Une erreur a eu lieu pendant votre inscription, merci de réessayer ultérieurement.";
            });
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------

}]);