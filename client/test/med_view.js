describe('View medication information', function () {

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
			// console.log('log: ' + require('util').inspect(browserLog));
		});
	});
	
	it('view notes', function() {
		browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);
		
		var record = element(by.css('[ng-click="vm.navbarClick(\'record\')"]'));
		record.click();

		var medications = element(by.id('navmedications'));
		medications.click();

		var firstEntry = element(by.css('[entry-index="0"]'));
		var info = firstEntry.all(by.css('[ng-click="medicationDetails(recordEntry)"]')).last();
		info.click();

		var notes = element(by.css('[class="fa fa-comment"]'));
		notes.click();
	});
	
	it('view history', function() {
		var history = element(by.css('[class="fa fa-clock-o"]'));
		history.click();
	});
	
	it('view adverse events', function() {
		var adverse = element(by.css('[class="fa fa-exclamation-triangle"]'));
		adverse.click();
	});
});