'use strict';

angular.module('jDashboardFluxApp').directive('alkModelProductCertifiedSelect', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
            placeholder: '@'
        },
        require: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function (scope, elem, attrs) {
            scope.placeholder = attrs.placeholder;
            scope.choices = [
                { id: Product.CERTIFICATION_STATUS_DEFAULT, name: "Le produit n'a pas encore été attribué"},
                { id: Product.CERTIFICATION_STATUS_REVIEWING, name: "Le produit est en cours de vérification"},
                { id: Product.CERTIFICATION_STATUS_ATTRIBUTED, name: "Le produit a été attribué à son fabriquant"},
                { id: Product.CERTIFICATION_STATUS_ACCEPTED, name: "Le fabriquant a accepté de remplir ce produit"},
                { id: Product.CERTIFICATION_STATUS_CERTIFIED, name: "Le fabriquant a certifié le produit"},
                { id: Product.CERTIFICATION_STATUS_PUBLISHED, name: "Le fabriquant a envoyé ce produit par la GDSN"},
                { id: Product.CERTIFICATION_STATUS_DISCONTINUED, name: "Le produit n'est plus fabriqué"}
            ];
        }
    };
}]);
