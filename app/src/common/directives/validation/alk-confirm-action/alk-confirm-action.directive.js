'use strict';

/**
 * A directive to display a confirmation modal
 * confirmAction:  The function that should be called on confirmation
 * item:           The argument given to confirmAction function
 * confirmMessage: The message that will be display to confirm
 */
angular.module('jDashboardFluxApp').directive('alkConfirmAction', [
    '$modal',
    function ($modal) {
        var ModalConfirmActionController = [
            '$scope', '$modalInstance',
            function ($scope, $modalInstance) {
                $scope.ok = function () {
                    $modalInstance.close();
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            }
        ];

        return {
            restrict: 'AC',
            scope: {
                confirmAction: '&',
                confirmMessage: '=',
                item: '='
            },
            link: function ($scope, $element, $attrs) {
                // On click the confirm modal will appear
                $element.bind('click', function () {
                    $scope.message = $scope.confirmMessage || "Êtes-vous sûr de vouloir continuer ?";
                    var modalInstance = $modal.open({
                        templateUrl: '/src/common/directives/validation/alk-confirm-action/alk-confirm-action.view.html',
                        controller: ModalConfirmActionController,
                        scope: $scope
                    });

                    modalInstance.result.then(function () {
                        $scope.confirmAction()($scope.item);
                    }, function () {
                        //Modal dismissed
                    });
                });
            }
        };
    }
]);
