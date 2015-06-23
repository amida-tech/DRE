describe('angularjs homepage', function() {

    var path = require('path');
    var files = element(by.css('[ng-click="vm.navbarClick(\'files\')"]'));

    var pathToFiles = "../../test/artifacts/demo-r1.5/";
    var continueButton = element(by.id('continue-button'));
    var confirmButton = element(by.id('confirm-button'));

    function uploadTest() {
    	files.click();
        var upload = element(by.css('[href="#/files/upload"]'));
        upload.click();

        var fileToUpload = pathToFiles + "bluebutton-02-updated.xml";
        var absolutePath = path.resolve(__dirname, fileToUpload);
        $('input[type="file"]').sendKeys(absolutePath);
        expect(continueButton.isDisplayed()).toBeTruthy();     
    }
    
    function continueUpload() {
        continueButton.click();
        expect(confirmButton.isDisplayed()).toBeTruthy();        
    }
    
    function confirmUpload() {
        confirmButton.click();
        // browser.pause();
        
        var fileList = element.all(by.repeater('file in vm.fileList')).count();
        expect(fileList).toEqual(2);     
    }
    
    function gotoRecord() {
        var record = element(by.css('[ng-click="vm.navbarClick(\'record\')"]'));
        record.click();        
    }
    
    function recordTimeline() {
        var timeline = element(by.css('.timeline-graph'));
        expect(timeline.isDisplayed()).toBeTruthy;
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

    it('upload bb02', function() {        
        uploadTest();
        //browser.pause();
    });
    
    it('continue bb02 upload', function() {        
        continueUpload();
        //browser.pause();
    });
    
    it('confirm bb02 upload', function() {        
        confirmUpload();
        //browser.pause();
    });   
    
    
    it('go to record section after bb02 upload', function() {        
        gotoRecord();
        recordTimeline();
        //browser.pause();
    });    
});