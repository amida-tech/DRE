'use strict';

describe('Controller: RecordResultsReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordResultsReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordResultsReviewCtrl = $controller('RecordResultsReviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
