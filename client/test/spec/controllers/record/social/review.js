'use strict';

describe('Controller: RecordSocialReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordSocialReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordSocialReviewCtrl = $controller('RecordSocialReviewCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
