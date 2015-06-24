describe('export record', function() {
	
	function exportCCDA() {
    	var record = element(by.css('[ng-click="vm.navbarClick(\'record\')"]'));
        record.click();
    	var mainRecordPage = element(by.id('navall'));
    	mainRecordPage.click();
		var print = element(by.css('[ng-click="exportModal()"]'));
		print.click();
	}
	
	function withPatient() {
		var downloadYes = element(by.css('[ng-click="exportWithPatient()"]'));
		downloadYes.click();
	}
	
	it('Export CCDA', function() {
		exportCCDA();
	});
	
	it('With patient-entered data', function() {
		withPatient();
	});
	
});