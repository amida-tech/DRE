// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  suites: {
    register: ['register.js','logout.js'],
    login: ['login.js','logout.js']
  },
}