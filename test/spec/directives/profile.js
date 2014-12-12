'use strict';

describe('Directive: profile', function () {

  // load the directive's module
  beforeEach(module('phrPrototypeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<profile></profile>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the profile directive');
  }));
});
