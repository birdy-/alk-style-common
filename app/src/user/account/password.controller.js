'use strict';

/**
 * Controller for the Login form. For protection reasons, the login form is always
 * displayed at startup, and disappears once permissions have loaded. See the
 * authenticate directive for that matter.
 */
angular.module('jDashboardFluxApp').controller('PasswordResetController', [
    '$scope', '$http', 'URL_SERVICE_AUTH', '$location', '$window', '$routeParams',
     function ($scope, $http, URL_SERVICE_AUTH, $location, $window, $routeParams) {

    $scope.login = $routeParams.login || null;

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.subscribe = function (message) {
        var modalInstance = $modal.open({
            templateUrl: '/src/home/contact.html',
            controller: 'ContactController',
            resolve: {
                user: function () {
                    return $scope.user;
                },
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.sendResetEmail = function() {

        $http.post(URL_SERVICE_AUTH + '/auth/v1/user/password/forgotten', {
            username: $scope.login
        })
        .success(function (response) {
            $location.path('/account/reset_email_sent');
        })
        .error(function (response) {
            $scope.message = 'Une erreur est survenue. Merci de réessayer ultérieurement.';
        });
    };

    $scope.newPassword = null;
    $scope.newPasswordConfirm = null;
    $scope.resetToken = $location.search()['token'];
    $scope.username = $location.search()['username'];

    $scope.resetPassword = function() {

        if ($scope.newPassword.length < 8) {
            $window.alert('Erreur: Le mot de passe doit faire au moins 8 caractères.');
            $scope.newPassword = null;
            $scope.newPasswordConfirm = null;
            return;
        }

        if ($scope.newPassword !== $scope.newPasswordConfirm) {
            $window.alert('Les mots de passe ne correspondent pas !');
            return;
        }

        $http.post(URL_SERVICE_AUTH + '/auth/v1/user/password/reset', {
            username: $scope.username,
            reset_token: $scope.resetToken,
            password: $scope.newPassword
        })
        .success(function (response) {
            $location.url($location.path());
            $location.path('/login');
        })
        .error(function (response) {
            $window.alert('Une erreur est survenue. Merci de réessayer ultérieurement.');
        });

    };

}]);
