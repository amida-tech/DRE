'use strict';

describe('Service: procedures', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var procedures;
  beforeEach(inject(function (_procedures_) {
    procedures = _procedures_;
  }));

  xit('should do something', function () {
    expect(!!procedures).toBe(true);
  });

});
