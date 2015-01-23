'use strict';

describe('Controller: RecordVitalsCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordVitalsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordVitalsCtrl = $controller('RecordVitalsCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
