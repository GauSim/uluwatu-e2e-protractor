'use strict';

var BasePage = require('../pages/BasePage.js');
var DashboardPage = require('../pages/DashboardPage.js');
var LoggedOutPage = require('../pages/LoggedOutPage.js');

describe('Testing Cloudbreak login', function () {
    var dashboardPage;
    var basePage;
    var loggedOutPage;
    var cloudbreakURL = '/#/';

    describe('with invalid user name', function () {
        var invalidUser = 'teszt.elek@hibasan.com';
        var invalidPassword = 'bakter';

        beforeAll(function() {
            console.log('Test suit setup has started!');
            basePage = new BasePage();
            basePage.logOut(process.env.USERNAME);
        });

        it('should get a warning dialog', function () {
            loggedOutPage = new LoggedOutPage();
            loggedOutPage.reLogIn(invalidUser, invalidPassword);
            expect(loggedOutPage.isUserIncorrectWarning()).toBeTruthy();
        });
    });

    describe('with ' + process.env.USERNAME + ' user', function () {
        dashboardPage = new DashboardPage();
        var userName = process.env.USERNAME;
        var passWord = process.env.PASSWORD;

        beforeAll(function() {
            console.log('Test suit setup has started!');
            loggedOutPage = new LoggedOutPage();
            loggedOutPage.reLogIn(userName, passWord);
        });

        it('should be logged in', function () {
            basePage = new BasePage();
            expect(basePage.isUserLoggedIn(userName)).toBeTruthy();
        });

        it('should be at the Dashboard page', function () {
            expect(browser.getCurrentUrl()).toContain(cloudbreakURL);
        });

        it('should see default blueprints', function () {
            dashboardPage.getBadgeValue(3).then(function (value) {
                expect(value).toBeGreaterThan(2);
            });
        });

    });
});