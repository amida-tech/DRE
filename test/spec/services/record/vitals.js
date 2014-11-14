'use strict';

describe('Service: record/vitals', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/vitals;
  beforeEach(inject(function (_record/vitals_) {
    record/vitals = _record/vitals_;
  }));

  it('should do something', function () {
    expect(!!record/vitals).toBe(true);
  });

});
