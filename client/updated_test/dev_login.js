describe('login', function() {
    var username = element(by.model('vm.inputLogin'));
    var password = element(by.model('vm.inputPassword'));
    var submit = element(by.buttonText('Log In'));

    function loginTest(un, pw) {
        browser.get('http://localhost:3000/developer');
        browser.driver.manage().window().setSize(1280, 1024);
        username.sendKeys(un);
        password.sendKeys(pw);
        expect(browser.getLocationAbsUrl()).toContain('dev');
    }

  afterEach(function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
        var errors = 0
        browserLog.forEach(function (log) {
            if (log.level.value >= 1000) {
                errors++;
            };
        })
      expect(errors).toEqual(0);
      // Uncomment to actually see the log.
      // console.log('log: ' + require('util').inspect(browserLog));
    });
  });

    it('should enter login', function() {
        loginTest('dev@third-party.com','asdf');
        // browser.pause();
    });
    it('should login', function() {
        
        submit.click();
        // expect(browser.getLocationAbsUrl()).toContain('clients');
        // browser.pause();
    });
});