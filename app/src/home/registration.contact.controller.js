'use strict';

/**
 * Modal that allows the user to register on the mailing list
 */
var RegistrationContactModalController = ['$scope', '$modalInstance', '$http',
                                 function ($scope, $modalInstance, $http) {

    $scope.contactForm = {
        headerMessage: "Je m'inscris sur la plateforme Alkemics"        
    };
    
    $scope.mailingListRecord = {
        origin: 0,   // Website Corporate Alkemics
        email: null,
        message: "Bonjour,\nJe souhaite m'inscrire sur la plateforme.",
    };

    /*
     * Register a user to the mailing list
     * Default is a POST to the endpoint
     * Fallback with a GET to have the email in the logs
     */
    $scope.ok = function () {
        var record = $scope.mailingListRecord;

        if (!record.email) {
            alert("Merci de renseigner une adresse email valide.");
            return;
        }

        record.message += "\n(" + record.lastname;
        record.message += "\n" + record.firstname;
        record.message += "\n" + record.company;
        record.message += "\n" + record.job + ")";

        $http.post(
            'https://auth.alkemics.com/auth/v1/mailinglist/register',
            record
        ).success(function (response) {
            $modalInstance.close($scope.product);
        }).error(function (response) {
            $http.get(
                'https://auth.alkemics.com/auth/v1/mailinglist/register',
                record
            );
            $modalInstance.close($scope.product);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}];