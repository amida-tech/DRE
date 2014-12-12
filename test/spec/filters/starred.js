'use strict';

describe('Filter: starred', function () {

  // load the filter's module
  beforeEach(module('phrPrototypeApp'));

  // initialize a new instance of the filter before each test
  var starred;
  beforeEach(inject(function ($filter) {
    starred = $filter('starred');
  }));

  xit('should return the input prefixed with "starred filter:"', function () {
    var text = 'angularjs';
    expect(starred(text)).toBe('starred filter: ' + text);
  });

});
