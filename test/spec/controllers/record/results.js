'use strict';

describe('Controller: RecordResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordResultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordResultsCtrl = $controller('RecordResultsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
