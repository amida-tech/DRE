'use strict';

describe('Service: record/medications', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/medications;
  beforeEach(inject(function (_record/medications_) {
    record/medications = _record/medications_;
  }));

  it('should do something', function () {
    expect(!!record/medications).toBe(true);
  });

});
