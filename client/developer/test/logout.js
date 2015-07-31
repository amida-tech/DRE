describe('logout', function() {
    

    function logoutTest() {
        var logout = element(by.css('[ng-click="vm.devLogout()"]'));
        logout.click();
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

    it('should logout', function() {
        logoutTest();

    });
});