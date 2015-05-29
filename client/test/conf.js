// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['register.js','upload_1.js','upload_2.js','scenarios.js','upload_3.js','match.js','logout.js'],
  suites: {
    populate: ['register.js','upload_1.js','upload_2.js','upload_3.js','logout.js'],
    scenarios: ['login.js','scenarios.js','match.js','logout.js']
  },
  capabilities: {
    browserName: 'firefox'
  }
}