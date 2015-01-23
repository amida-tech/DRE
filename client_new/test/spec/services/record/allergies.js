'use strict';

describe('Service: allergies', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var allergies;
  beforeEach(inject(function (_allergies_) {
    allergies = _allergies_;
  }));

  xit('should do something', function () {
    expect(!!allergies).toBe(true);
  });

});
