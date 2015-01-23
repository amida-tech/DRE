'use strict';

describe('Service: medications', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var medications;
  beforeEach(inject(function (_medications_) {
    medications = _medications_;
  }));

  xit('should do something', function () {
    expect(!!medications).toBe(true);
  });

});
