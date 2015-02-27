describe('angularjs homepage', function() {

    var path = require('path');
    var files = element(by.css('[href="#/files"]'));

    var pathToFiles = "../../test/artifacts/demo-r1.3.1/";

    function uploadTest(un, pw) {
    	files.click();
        var upload = element(by.css('[href="#/files/upload"]'));
        upload.click();

        var fileToUpload = pathToFiles + "bluebutton-03-cms.txt";
        var absolutePath = path.resolve(__dirname, fileToUpload);
        $('input[type="file"]').sendKeys(absolutePath);

        var continueButton = element(by.id('continue-button'));

        continueButton.click();

        var confirmButton = element(by.id('confirm-button'));

        confirmButton.click();

        var record = element(by.css('[href="#/record"]'));

        record.click();
        
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

    it('upload test', function() {
        
    	

        uploadTest();
        //browser.pause();


    });
});