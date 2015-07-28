describe('allergies scenario one', function() {
    
    function recordTimeline() {
    	var record = element(by.css('[ng-click="vm.navbarClick(\'record\')"]'));
        record.click();
        var timeline = element(by.css('.timeline-graph'));
        expect(timeline.isDisplayed()).toBeTruthy;
    }
    function allergies() {
        var allergies = element(by.id('navallergies'));
        allergies.click();
        var allergyEntries = element.all(by.repeater('(recordIndex, recordEntry) in entryListFiltered'));
        expect(allergyEntries.count()).toEqual(5);
    }
    function neomycinSource() {
        var source = element.all(by.css('[data-target="#history0"]'));
        source.first().click();
        var showHistory = element(by.id('record0')).element(by.css('[ng-show="showDetails"]'));
        expect(showHistory).toBeTruthy();
    }
    function penicillinSource() {
        var source = element.all(by.css('[data-target="#history2"]'));
        source.first().click();
        var showHistory = element(by.id('record2')).element(by.css('[ng-show="showDetails"]'));
        expect(showHistory).toBeTruthy();
    }    
    



    // beforeEach(function() {
    //     browser.get('http://localhost:3000/');
    //     browser.driver.manage().window().setSize(1280, 1024);
    // });

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

    it('go to My Record', function() {
        recordTimeline();
    });
    
    it('view all Allergies', function() {
        allergies();
    });
        
    it('view Neomycin Allergy source', function() {
        neomycinSource();
    });
        
    it('view updated Penicillin Allergy source', function() {
        penicillinSource();
    });
});