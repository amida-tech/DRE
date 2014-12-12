'use strict';

describe('Directive: billingNavigation', function () {

  // load the directive's module
  beforeEach(module('phrPrototypeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<billing-navigation></billing-navigation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the billingNavigation directive');
  }));
});
