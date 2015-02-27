describe('record scenario', function() {
    

    function scenarioOne() {
    	var record = element(by.css('[href="#/record"]'));
        record.click();

        var allergies = element(by.id('navallergies'));
        allergies.click();


        var firstEntry = element(by.css('[entry-index="0"]'));


        var details = firstEntry.all(by.css('[data-target="#details0"]')).last();
        details.click();

        var history = firstEntry.all(by.css('[data-target="#history0"]')).last();
        history.click();



        var notes = firstEntry.all(by.css('[data-target="#comments0"]')).last();

        notes.click();
        

        

        
        

        var noteField = firstEntry.element(by.model('newComment.comment'));
        noteField.sendKeys('New comment');

        var addNote = firstEntry.element(by.className('btn-primary'));
        addNote.click();

        var star = firstEntry.all(by.css('[ng-show="commentEntry.starred === false"]')).last().element(by.tagName('a'));
        star.click();

        var notePage = element(by.css('[href="#/notes"]'));

        notePage.click();




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

    it('should run', function() {
        
    	

        scenarioOne();


    });
});