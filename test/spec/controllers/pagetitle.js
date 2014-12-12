'use strict';

describe('Controller: PagetitleCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var PagetitleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PagetitleCtrl = $controller('PagetitleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
