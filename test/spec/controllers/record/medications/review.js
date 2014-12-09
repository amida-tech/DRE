'use strict';

describe('Controller: RecordMedicationsReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordMedicationsReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordMedicationsReviewCtrl = $controller('RecordMedicationsReviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
