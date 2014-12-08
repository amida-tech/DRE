'use strict';

describe('Filter: sections', function () {

  // load the filter's module
  beforeEach(module('phrPrototypeApp'));

  // initialize a new instance of the filter before each test
  var sections;
  beforeEach(inject(function ($filter) {
    sections = $filter('sections');
  }));

  it('should return the input prefixed with "sections filter:"', function () {
    var text = 'angularjs';
    expect(sections(text)).toBe('sections filter: ' + text);
  });

});
