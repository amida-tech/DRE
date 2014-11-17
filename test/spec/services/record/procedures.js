'use strict';

describe('Service: record/procedures', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/procedures;
  beforeEach(inject(function (_record/procedures_) {
    record/procedures = _record/procedures_;
  }));

  it('should do something', function () {
    expect(!!record/procedures).toBe(true);
  });

});
