// conf.js
var HtmlReporter = require('protractor-html-screenshot-reporter');

var reporter=new HtmlReporter({
    baseDirectory: './protractor-test-result', // a location to store screen shots.
    docTitle: 'Protractor Reporter',
    docName:    'protractor-tests-report.html'
});

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'register.js',
    'upload_1.js',
    'upload_2.js',
    'scenarios.js',
    'upload_3.js',
    'match.js',
    'logout.js',
    'med_view.js',
    'med_new.js'],
  suites: {
    populate: ['register.js','upload_1.js','upload_2.js','upload_3.js','logout.js'],
    scenarios: ['login.js','scenarios.js','match.js','logout.js'],
    medications: ['login.js','med_view.js', 'med_new.js','logout.js'],
    test: ['register.js', 'upload_1.js'],
    demo: ['register.js', 'upload_1.js', 'scenario_1.js']
  },
  capabilities: {
    browserName: 'firefox'
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  }
}