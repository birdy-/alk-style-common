'use strict';

angular.module('jDashboardFluxApp').directive('recipientBar', [
    function () {
        return {
            restrict: 'A',
            scope: {
              autocomplete: '=',
              recipients: '='
            },
            templateUrl: '/src/common/directives/recipient-bar.html',
            link: function (scope, el, attrs) {
                scope.value = '';

                var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

                scope.valueChanged = function () {
                    var value = scope.value;
                    var separators = [' ', ',', ';'];
                    var lastChar = value.substr(value.length - 1);
                    if (separators.indexOf(lastChar) !== -1) {
                        scope.value = value.substr(0,value.length - 1);
                        scope.add();
                    }
                };

                scope.add = function () {
                    var value = scope.value;
                    if (value.length > 0) {
                        if (value.match(emailRegex)) {
                            scope.recipients.push({
                                name: value,
                                value: value
                            });
                            scope.value = '';
                        }
                    }
                };

                scope.keyPressed = function (event) {
                    if (event.keyCode === 13) {
                      scope.add();
                    }
                };

                scope.delete = function (i) {
                    scope.recipients.splice(i, 1);
                };
            }
        };
    }
]);
