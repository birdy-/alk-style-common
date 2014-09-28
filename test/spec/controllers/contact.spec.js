'use strict';

describe('[Controller] ContactController', function () {

  var ContactController, $controllerProvider, scope;
  var $modal, $modalProvider;

  beforeEach(module('jDashboardFluxApp'));
  beforeEach(module(function(_$controllerProvider_, _$modalProvider_){
    $controllerProvider = _$controllerProvider_;
    $modalProvider = _$modalProvider_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$modal_) {
    scope = $rootScope.$new();
    $modal = _$modal_;
    ContactController = $controller('ContactController', {
      $scope: scope,
      $modal: $modal
    });
  }));

  it('should exist', function () {
    expect(ContactController).toBeDefined();
  });
});
