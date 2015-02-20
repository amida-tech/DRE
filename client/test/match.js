describe('record scenario', function() {
    

    function matchScenario() {
    	var record = element(by.css('[href="#/record"]'));
        record.click();

        var allergies = element(by.id('navallergies'));
        allergies.click();

        var match = element.all(by.css('[ng-click="launchMatch(recordEntry.metadata)"]')).first();

        match.click();

        var checkbox = element.all(by.css('[type="checkbox"]')).first();

        checkbox.click();

        var submit = element(by.css('[ng-click="submitButton()"]'));

        submit.click();

        allergies.click();



    }

    beforeEach(function() {
        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
    });

    it('should run', function() {
        
    	

        matchScenario();


    });
});