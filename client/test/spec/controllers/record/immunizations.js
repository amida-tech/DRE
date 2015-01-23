'use strict';

describe('Controller: RecordImmunizationsCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordImmunizationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordImmunizationsCtrl = $controller('RecordImmunizationsCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
