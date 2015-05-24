describe('logout', function() {
    

    function logoutTest() {
        var logoutDropdown = element.all(by.css('.navbar-right a')).first();
    	logoutDropdown.click();
        var logout = element(by.css('[ng-click="vm.navbarLogout()"]'));
        logout.click();
    }

    beforeEach(function() {
        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
    });

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
      console.log('log: ' + require('util').inspect(browserLog));
    });
  });

    it('should logout', function() {
        
    	

        logoutTest();
        //browser.pause();


    });
});