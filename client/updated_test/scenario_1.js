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
        expect(allergyEntries.count()).toEqual(3);
    }
    function allergyDetails() {
        var details = element.all(by.css('[data-target="#details1"]'));
        details.first().click();
        var allergyStatus = element(by.id('record1')).element(by.binding('entryData.observation.status.name'));
        expect(allergyStatus.isDisplayed()).toBeTruthy();
    }
    function allergySource() {
        var source = element.all(by.css('[data-target="#history1"]'));
        source.first().click();
        var showHistory = element(by.id('record1')).element(by.css('[ng-show="showDetails"]'));
        expect(showHistory).toBeTruthy();
    }    
    function allergyNotes() {
        var notes = element.all(by.css('[data-target="#comments1"]'));
        notes.first().click();
        var showNotes = element(by.id('record1')).element(by.css('[ng-show="showComments"]'));
        expect(showNotes).toBeTruthy();
    }
    
    function addNote() {
        var noteField = element(by.id('record1')).element(by.model('newComment.comment'));
        noteField.sendKeys('Inconsistent reaction.');

        var addNote = element(by.id('record1')).element(by.css('[ng-submit="addNote(recordIndex)"]')).element(by.className('btn-primary'));
        addNote.click();
        
        var editNote = element(by.id('record1')).element(by.css('[ng-click="editNote()"]'));
        expect(editNote.isDisplayed()).toBeTruthy();
        // var editNote = firstEntry.element(by.css('[ng-click="editNote()"]'));
        // editNote.click();
        // var edit = firstEntry.element(by.css('[name="editForm"]'));
        // var saveNote = firstEntry.element(by.css('[ng-click="saveNote(editComment)"]'));
        // saveNote.click();
        
        // var star = edit.element(by.css('[ng-show="entryMetaData.comments[0].starred === false"]'));
        // star.click();
        // expect();
    }
    
    function notePage() {
        var notePage = element(by.css('[ng-click="vm.navbarClick(\'notes\')"]'));
        notePage.click();
        var timeline = element(by.css('.timeline-graph'));
        expect(timeline.isDisplayed()).toBeTruthy;
        expect(element.all(by.repeater('(noteIndex, noteEntry) in notesList')).count()).toEqual(1);
    }
    
    function notePageLink() {
        var entryLink = element(by.css('[data-target="#details0"]'));
        entryLink.click();
    }
    
    function noteEntryLink() {
        var recordLink = element(by.css('[ng-hide="noteEntry.section === \'claims\' || noteEntry.section === \'insurance\'"]'));
        recordLink.click();
        var allergyEntries = element.all(by.repeater('(recordIndex, recordEntry) in entryListFiltered'));
        expect(allergyEntries.count()).toEqual(3);
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
    
    it('view Penicillin Allergy details', function() {
        allergyDetails();
    });
        
    it('view Penicillin Allergy source', function() {
        allergySource();
    });
        
    it('view Penicillin Allergy notes', function() {
        allergyNotes();
    });
        
    it('add Penicillin Allergy notes', function() {
        addNote();
    });
    
    it('go to Notes page', function() {
        notePage();
    });
    
    it('go to Entry Details for note', function() {
        notePageLink();
    });
    
    
    it('return to Allergies page', function() {
        noteEntryLink();
    });
});