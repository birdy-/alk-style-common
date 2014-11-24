'use strict';

describe('[alkInputMatch] It', function () {

  beforeEach(module('jDashboardFluxApp'));

  var alkNotification, $compile, $rootScope, form, inputValue, element;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    inputValue = 'testValue';

    element = angular.element(
        '<form name="form">' +
        '<input type="text" ng-model="test" name="test"></input>' +
        '<input type="text" input-match="test" ng-model="testConfirm" name="testConfirm"></input>' +
        '</form>'
      );

    $rootScope.test = inputValue;
    $compile(element)($rootScope);
    $rootScope.$digest();
    form = $rootScope.form;
  }));

  it('should check if variables are identical', function () {
    form.testConfirm.$setViewValue(inputValue);
    $rootScope.$digest();
    expect(form.testConfirm.$error.inputMatch)
    .toBe(false);
  });

  it('should check if variables are identical', function () {
    form.testConfirm.$setViewValue(inputValue + 'falseValue');
    $rootScope.$digest();
    expect(form.testConfirm.$error.inputMatch)
    .toBe(true);
  });
});
