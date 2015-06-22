
var path = require('path');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var common = require(path.join(__dirname, '../../test/common/common.js'));
var next1 = element(by.id('next1'));
var next2 = element(by.id('next2'));
var next3 = element(by.id('next3'));

describe('register user', function () {


    function registerLinkTest() {

        browser.get('http://localhost:3000/');
        browser.driver.manage().window().setSize(1280, 1024);

        var db = new Db('dre', new Server('localhost', 27017));
        db.open(function(err, db) {
            db.dropDatabase();
        });
        db.dropDatabase();

        var registerLink = element.all(by.css('.navbar-right a')).first();
        registerLink.click();
        expect(next1.isDisplayed()).toBeTruthy();
    }

    function registerStepOneTest() {
        var username = element(by.model('inputLogin'));
        var email = element(by.model('inputEmail'));
        var password = element(by.model('inputPassword'));
        var repeatPassword = element(by.model('inputRepeatPassword'));

        username.sendKeys('protractor_test');
        email.sendKeys('isabella@amida-demo');
        password.sendKeys('Protractor');
        repeatPassword.sendKeys('Protractor');
        element(by.id('next1')).click();

        expect(next2.isDisplayed()).toBeTruthy();
    }

    function registerStepTwoTest() {
        var firstname = element(by.model('inputFirst'));
        var middlename = element(by.model('inputMiddle'));
        var lastname = element(by.model('inputLast'));
        var dob = element(by.model('inputDOB'));
        var gender = element(by.model('inputGender'));

        firstname.sendKeys('Isabella');
        middlename.sendKeys('Isa');
        lastname.sendKeys('Jones');
        gender.sendKeys('f');
        dob.sendKeys('05/01/1975');

        element(by.id('next2')).click();
        expect(next3.isDisplayed()).toBeTruthy();
    }

    function registerStepThreeTest() {
        element(by.id('next3')).click();
    }

    function accountHistoryTimeline() {
        var timeline = element(by.css('.timeline-graph'));
        expect(timeline.isDisplayed()).toBeTruthy;
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
    })

    it('register step 1 test', function () {
        registerStepOneTest();
    })

    it('register step 2 test', function () {
        registerStepTwoTest();
    })

    it('registration complete test', function() {
        registerStepThreeTest();
        accountHistoryTimeline();
    })

});