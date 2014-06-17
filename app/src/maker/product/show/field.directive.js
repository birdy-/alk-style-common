"use strict";

angular.module('jDashboardFluxApp').directive('productField', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            pnq: '=',
            psqs: '='
        },
        template: '<tr> <td class="pnq-name"> <label for="{{ pnq.id }}" class="control-label">{{ pnq.isConceptualizedBy.name }}</label> </td> <td ng-repeat="psq in psqs" class="psq-col"> <label ng-if="!pnq.isConceptualizedBy.compulsory" class="control-label pull-left separator"></label> <div class="input-group"> <input name="{{ pnq.id }}.quantity" type="text" class="form-control" ng-model="pnq.quantity" placeholder="ex : 100" alk-float="2" alk-focus ng-min="0" required/> <span class="input-group-addon">{{ psq.isMeasuredBy.name }} / {{ psq.name }}</span> </div> <span ng-show="false" class="help-block">La valeur entrée doit être un nombre décimal.</span> <span ng-show="false" class="help-block">La valeur entrée ne doit pas être inférieure à 0.</span> </td> <td class="pnq-legend"> </td> </tr> <tr ng-show="pnq.quantity > 0 || pnq.percentageOfDailyValueIntake"> <td class="text-right"> </td> <td ng-repeat="psq in psqs" class="psq-col"> <label class="control-label pull-left separator">soit</label> <div class="input-group"> <input name="{{ png.id }}.percentageOfDailyValueIntake" type="text" class="form-control" ng-model="pnq.percentageOfDailyValueIntake" placeholder="ex : 23.7" alk-float="2" alk-focus ng-min="0" required/> <span class="input-group-addon">% des AJR</span> </div> <span ng-show="false" class="help-block">La valeur entrée doit être un nombre décimal.</span> <span ng-show="false" class="help-block">La valeur entrée ne doit pas être inférieure à 0.</span> </td> <td class="pnq-legend"> {{ pnq.isConceptualizedBy.legend }} </td> </tr>',
        link: function(scope, element, attrs) {
            scope.$watch('pnq.quantity', function(new_, old_) {
                if (new_ > 0) {
                    if (scope.pnq.percentageOfDailyValueIntake === null) {
                        scope.pnq.percentageOfDailyValueIntake = 2 * scope.pnq.quantity;
                    }
                }
            });
        }
    };
});



