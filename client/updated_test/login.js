describe('login', function() {
    var username = element(by.model('vm.inputLogin'));
    var password = element(by.model('vm.inputPassword'));
    var submit = element(by.id('main-login-btn'));
   

    function loginTest(un, pw) {
    	username.clear();
    	password.clear();
        username.sendKeys(un);
        password.sendKeys(pw);
        password.sendKeys(protractor.Key.ENTER);
    }
    
    function accountHistoryTimeline() {
        var timeline = element(by.css('.timeline-graph'));
        expect(timeline.isDisplayed()).toBeTruthy;
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
      // console.log('log: ' + require('util').inspect(browserLog));
    });
  });

    it('should login', function() {
        loginTest('amida-demo','Protractor');
        // expect(browser.getLocationAbsUrl()).toContain('home');
        accountHistoryTimeline();
    });
});