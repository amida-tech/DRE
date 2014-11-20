'use strict';

describe('Controller: BillingClaimsCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var BillingClaimsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BillingClaimsCtrl = $controller('BillingClaimsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
