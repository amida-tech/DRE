// conf.js
var HtmlReporter = require('protractor-html-screenshot-reporter');

var reporter=new HtmlReporter({
    baseDirectory: 'client/developer/test/protractor-dev', // a location to store screen shots.
    docTitle: 'Protractor Reporter',
    docName:    'protractor-dev-report.html'
});

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'register.js',
    'login.js',
    'client.js',
    'logout.js'
  ],
  suites: {
    all: ['login.js', 'client.js', 'logout.js']
    },
  capabilities: {
    browserName: 'firefox'
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  }
}