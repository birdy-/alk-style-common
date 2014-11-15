'use strict';

describe('[Controller] FaqController', function () {

  beforeEach(module('jDashboardFluxApp'));

  var FaqController;

  beforeEach(inject(function ($controller) {
    FaqController = $controller('FaqController', {});
  }));

  it('should exist', function () {
    expect(FaqController).toBeDefined();
  });
});
