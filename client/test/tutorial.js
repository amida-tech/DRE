describe('angularjs homepage', function() {
    var username = element(by.model('inputLogin'));
    var password = element(by.model('inputPassword'));
    var submit = element(by.id('main-login-btn'));

    function loginTest(un, pw) {
    	username.clear();
    	password.clear();
        username.sendKeys(un);
        password.sendKeys(pw);
        password.sendKeys(protractor.Key.ENTER);
    }

    beforeEach(function() {
        browser.get('http://localhost:3000/');
    });

    afterEach(function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
      //expect(browserLog.length).toEqual(0);
      // Uncomment to actually see the log.
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });

    it('should have a title', function() {
        
    	loginTest('test','test');

        //expect(browser.getTitle()).toEqual('My PHR');
        expect(element(by.css('.login-alert')).getText()).toContain('Invalid');

        loginTest('test','asdfasdf');

        expect(browser.getLocationAbsUrl()).toContain('home');

    });
});