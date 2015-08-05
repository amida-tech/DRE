
var path = require('path');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

describe('register admin', function () {


    function registerLinkTest() {

        browser.get('http://localhost:3000/admin');
        browser.driver.manage().window().setSize(1280, 1024);

        var db = new Db('dre', new Server('localhost', 27017));
        db.open(function(err, db) {
            db.dropDatabase();
        });
        // db.dropDatabase();

        var registerLink = element.all(by.css('.navbar-right a')).first();
        registerLink.click();
        expect(browser.getLocationAbsUrl()).toContain('register');
    }

    function regForm() {
        var username = element(by.model('inputEmail'));
        var password = element(by.model('inputPassword'));
        var repeatPassword = element(by.model('inputRepeatPassword'));

        username.sendKeys('admin@amida-demo.com');
        password.sendKeys('asdf');
        repeatPassword.sendKeys('asdf');
        
        var complete = element(by.buttonText('Complete'));
        complete.click();
    }


    afterEach(function () {
        browser.manage().logs().get('browser').then(function (browserLog) {
            var errors = 0
            browserLog.forEach(function (log) {
                if (log.level.value >= 1000) {
                    errors++;
                };
            });
            expect(errors).toEqual(0);
            // console.log('log: ' + require('util').inspect(browserLog));
        });
    });


    it('register link test', function () {
        registerLinkTest();
    });

    it('should fill in reg form', function() {
        regForm();
        // browser.pause();
    });
    
    // it('should complete registration', function () {
    //     browser.get('http://localhost:3000/#/admin/clients');
    //     expect(browser.getLocationAbsUrl()).toContain('clients');
    // });

});