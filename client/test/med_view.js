describe('View medication information', function () {

	function viewMedInfo() {
		var record = element(by.css('[href="#/record"]'));
		record.click();

		var allergies = element(by.id('navmedications'));
		allergies.click();

		var firstEntry = element(by.css('[entry-index="0"]'));
		var info = firstEntry.all(by.css('[ng-click="medicationDetails(recordEntry)"]')).last();
		info.click();

		var notes = element(by.css('[class="fa fa-comment"]'));
		notes.click();

		var history = element(by.css('[class="fa fa-clock-o"]'));
		history.click();

		var images = element(by.css('[class="fa fa-picture-o"]'));
		images.click();

		var adverse = element(by.css('[class="fa fa-exclamation-triangle"]'));
		adverse.click();

		var learn = element(by.css('[class="fa fa-question-circle"]'));
		learn.click();
	}

	beforeEach(function () {
        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
    });

    afterEach(function () {
		browser.manage().logs().get('browser').then(function (browserLog) {
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
        viewMedInfo();
    });
});