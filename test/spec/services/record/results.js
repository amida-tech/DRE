'use strict';

describe('Service: record/results', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/results;
  beforeEach(inject(function (_record/results_) {
    record/results = _record/results_;
  }));

  it('should do something', function () {
    expect(!!record/results).toBe(true);
  });

});
