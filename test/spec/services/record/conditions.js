'use strict';

describe('Service: record/conditions', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/conditions;
  beforeEach(inject(function (_record/conditions_) {
    record/conditions = _record/conditions_;
  }));

  it('should do something', function () {
    expect(!!record/conditions).toBe(true);
  });

});
