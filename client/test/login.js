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
        browser.driver.manage().window().setSize(1280, 1024);
    });

    it('should have a title', function() {
        
    	

        loginTest('protractor_test','Protractor');

        expect(browser.getLocationAbsUrl()).toContain('home');

    });
});