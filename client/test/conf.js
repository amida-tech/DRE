// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['register.js','upload_1.js','upload_2.js','scenarios.js','logout.js'],
  suites: {
    populate: ['register.js','upload_1.js','upload_2.js','logout.js'],
    scenarios: ['login.js','scenarios.js','logout.js']
  }
}