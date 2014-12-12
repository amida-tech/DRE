'use strict';

describe('Controller: RecordMedicationsCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordMedicationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordMedicationsCtrl = $controller('RecordMedicationsCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
