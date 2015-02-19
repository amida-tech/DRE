describe('logout', function() {
    

    function logoutTest() {
        var logoutDropdown = element.all(by.css('.navbar-right a')).first();
    	logoutDropdown.click();
        var logout = element(by.css('[ng-click="logout()"]'));
        logout.click();
    }

    beforeEach(function() {
        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
    });

    it('should logout', function() {
        
    	

        logoutTest();
        //browser.pause();


    });
});