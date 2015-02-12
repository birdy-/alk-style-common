'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkButtonNotificationSender', [
    '$modal',
    function ($modal) {
        return {
            restrict: 'AEC',
            scope: {},
            templateUrl: '/src/maker/notification/write/notification-directive.html',
            link: function(scope, elem, attrs) {
                scope.buttonClass = attrs.alkButtonClass || 'btn-default';
                scope.openNotification = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/src/maker/notification/write/notification-modal.html',
                        controller: 'NoticationSenderModalController'
                    });
                    modalInstance.result.then(function () {
                    }, function () {
                    });
                };
            }
        };
    }
]);
