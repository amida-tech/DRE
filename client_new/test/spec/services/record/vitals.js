'use strict';

describe('Service: vitals', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var vitals;
  beforeEach(inject(function (_vitals_) {
    vitals = _vitals_;
  }));

  xit('should do something', function () {
    expect(!!vitals).toBe(true);
  });

});
