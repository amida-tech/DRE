describe('register user', function() {
    var registerLink = element(by.css('.navbar-right a'));
    

    function registerTest() {
    	registerLink.click();

        var username = element(by.model('inputLogin'));
        var email = element(by.model('inputEmail'));
        var password = element(by.model('inputPassword'));
        var repeatPassword = element(by.model('inputRepeatPassword'));

        username.sendKeys('protractor_test');
        email.sendKeys('isabella@gmail.com');
        password.sendKeys('Protractor');
        repeatPassword.sendKeys('Protractor');


    }

    beforeEach(function() {
        browser.get('http://localhost:3000/');
    });

    it('register test', function() {
        
    	//loginTest('test','test');

        //expect(browser.getTitle()).toEqual('My PHR');
        //expect(element(by.css('.login-alert')).getText()).toContain('Invalid');

        registerTest();
        browser.pause();

        //expect(browser.getLocationAbsUrl()).toContain('home');

    });
});