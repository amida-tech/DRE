'use strict';

describe('Service: conditions', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var conditions;
  beforeEach(inject(function (_conditions_) {
    conditions = _conditions_;
  }));

  xit('should do something', function () {
    expect(!!conditions).toBe(true);
  });

});
