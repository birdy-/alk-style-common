'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('NoticationSenderModalController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$autocomplete', 'permission', '$route', '$timeout',
    function ($scope, $modalInstance, $$sdkAuth, $$autocomplete, permission, $route, $timeout) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = null;
    $scope.errors = [];
    $scope.errors.unknown = false;
    $scope.errors.ok = true;
    $scope.request = {};
    $scope.select2OrganizationOptions = $$autocomplete.getOptions('organization', {multiple: false});
    $scope.notification = {
        organization: null,
        message: '',
        subject: 'notification',
        to_timeline: true,
        to_mail: false, //Pass to true | options ?
        allow_response: false,
    }

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    /**
     * Reload page to allow timeline refresh on background  
     */
    var reloadPage = function () {
        $timeout(function () {
            $route.reload();
        }, 500);
    }

    $scope.cancel = function () {
        // The claim request was sent above.
        $modalInstance.dismiss('cancel');
    };
    /**
     * Called when the Product is new and is created
     */
    $scope.sendNotification = function () {
        if ($scope.notification.to_timeline == false && $scope.notification.to_mail == false)
            return alert("You must select at least timeline or email");
        if ($scope.notification.subject == '')
            return alert("One must provide a subject");
        if ($scope.notification.message == '')
            return alert("One must provide a message");
        var user_id_in = [];
        $scope.mail_status = 0;
        $scope.notification.organization.users.map(function(user) {
            if (user.selected == false)
                return
            user_id_in.push(user.id);
        });
        var extra_mail = [];
        if (typeof $scope.user_extra_mail !== 'undefined') {
            $scope.user_extra_mail.map(function(user) {
                if (user.selected == false)
                    return
                extra_mail.push(user.username);
            });
            $scope.notification.user_extra_mail = extra_mail.join();
        }
        $$sdkAuth.NotificationCreate(user_id_in.join(), $scope.notification).then(function (response) {
            location.reload();
        });
    }
    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function (user) {
        $scope.user = user;
    });

}]);
