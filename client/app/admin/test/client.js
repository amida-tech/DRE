describe('admin client', function() {
    
    var addForm = element(by.css('[ng-show="vm.showForm"]'));
    
    function clientPage() {
        browser.get('http://localhost:3000/#/admin/clients');
        // browser.driver.manage().window().setSize(1280, 1024);
        expect(browser.getLocationAbsUrl()).toContain('clients');
    }

    function showAddForm() {
        var addNew = element(by.css('[ng-click="vm.showAddClient()"]'));
        addNew.click()
        expect(addForm.isDisplayed()).toBeTruthy;
    }
    
    function addClient() {
        var name = element(by.model('vm.clientInfo.client_name'));
        name.sendKeys('Protractor Test Admin Client');
    }
    
    function saveClient() {
        var submit = element(by.css('[ng-click="vm.addClient()"]'));
        submit.click();
        expect(addForm.isDisplayed()).toBeFalsey;
    }  
     
    function searchClient() {
        var search = element(by.model('searchText'));
        search.sendKeys('Protractor');
    }    
    
    function unapproveClient() {
        var unapprove = element(by.buttonText('Unapprove'));
        unapprove.click();
    }
        
    function approveClient() {
        var approve = element(by.buttonText('Approve'));
        approve.click();
    }
    
    function deleteClient() {
        var trash = element(by.css('[ng-click="vm.deleteClient(client.name)"]'));
        trash.click();
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

    it('should go to client page', function() {
        clientPage();
    });
    it('should show add new client form', function() {
        showAddForm();
    });
    it('populate add new client form', function() {
        addClient();
    });
    it('save new client form', function() {
        saveClient();
    });
    it('search new client', function() {
        searchClient();
        expect(element.all(by.repeater('client in vm.clientsList | filter:searchText')).count()).toEqual(1);
    });
    it('unapprove new client', function() {
        unapproveClient();
        searchClient();
        expect(element(by.buttonText('Approve')).isDisplayed()).toBeTruthy;
    });
    it('approve new client', function() {
        approveClient();
        searchClient();
        expect(element(by.buttonText('Unapprove')).isDisplayed()).toBeTruthy;
    });
    it('delete new client', function() {
        deleteClient();
        searchClient();
        expect(element.all(by.repeater('client in vm.clientsList | filter:searchText')).count()).toEqual(0);
    });
});