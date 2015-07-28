describe('reconciliation scenario', function() {

    
    function allergies() {
        var allergies = element(by.id('navallergies'));
        allergies.click();
        var allergyEntries = element.all(by.repeater('(recordIndex, recordEntry) in entryListFiltered'));
        expect(allergyEntries.count()).toEqual(5);
    }
    
    function gotoMatch() {
        var match = element.all(by.css('[ng-click="launchMatch(recordEntry.metadata)"]')).first();
        match.click();
    }
    
    function checkMatch() {
        var checkbox = element(by.css('[ng-if="exists(flagData.observation.status)"]'));
        checkbox.click();
    }
    
    function saveMatch() {
        var submit = element(by.css('[ng-click="submitButton()"]'));
        submit.click();
    }
    
    
    function updatedDetails() {
        var details = element.all(by.css('[data-target="#details2"]'));
        details.first().click();
        var allergyStatus = element(by.id('record2')).element(by.binding('entryData.observation.status.name'));
        expect(allergyStatus.isDisplayed()).toBeTruthy();
    }
    function updatedSource() {
        var source = element.all(by.css('[data-target="#history2"]'));
        source.first().click();
        var showHistory = element(by.id('record2')).element(by.css('[ng-show="showDetails"]'));
        expect(showHistory).toBeTruthy();
    }  

    // beforeEach(function() {
    //     browser.get('http://localhost:3000/');
    //     browser.driver.manage().window().setSize(1280, 1024);
    // });

    it('go to allergies', function() {
        allergies();
    });

    it('go to Penicillin match', function() {
        gotoMatch();
    });

    it('reconcile Penicillin match', function() {
        checkMatch();
    });

    it('save Penicillin match', function() {
        saveMatch();
    });

    it('view updated Details', function() {
        updatedDetails();
    });

    it('view updated Sources', function() {
        updatedSource();
    });
});