'use strict';

describe('[Controller] FaqController', function () {

  beforeEach(module('jDashboardFluxApp'));

  var FaqController, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    FaqController = $controller('FaqController', {
        $scope: scope
    });
  }));

  it('should exist', function () {
    expect(FaqController).toBeDefined();
  });
});
