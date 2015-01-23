'use strict';

describe('Service: record', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record;
  beforeEach(inject(function (_record_) {
    record = _record_;
  }));

  xit('should do something', function () {
    expect(!!record).toBe(true);
  });

});
