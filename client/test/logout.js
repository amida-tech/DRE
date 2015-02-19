describe('angularjs homepage', function() {
    var logoutDropdown = element(by.css('.navbar-right a'));

    function logoutTest(un, pw) {
    	logoutDropdown.click();
        var logout = element(by.css('[ng-click="logout()"]'));
        logout.click();
    }

    beforeEach(function() {
        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
    });

    it('logout', function() {
        
    	

        logoutTest();
        //browser.pause();


    });
});