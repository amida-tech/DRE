'use strict';

describe('Service: encounters', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var encounters;
  beforeEach(inject(function (_encounters_) {
    encounters = _encounters_;
  }));

  xit('should do something', function () {
    expect(!!encounters).toBe(true);
  });

});
