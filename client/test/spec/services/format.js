'use strict';

describe('Service: format', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var format;
  beforeEach(inject(function (_format_) {
    format = _format_;
  }));

  xit('should do something', function () {
    expect(!!format).toBe(true);
  });

});
