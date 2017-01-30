'use strict';
var WaitForUtils = require('../utils/WaitForUtils.js');

var LoggedOutPage = function () {
    browser.waitForAngular();

    browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
            return /sl/g.test(url) || /logout=true/g.test(url);
        });
    }, 10000);
};

LoggedOutPage.prototype  = Object.create({}, {
    emailBox:                     {   get:    function() { return element(by.css('input#email'));                 }},
    passwordBox:                  {   get:    function() { return element(by.css('input#password'));              }},
    logInButton:                  {   get:    function() { return element(by.css('button#login-btn'));            }},

    refreshPage:                          {   value:  function() {
        var waitForUtils = new WaitForUtils();

        browser.refresh();
        browser.waitForAngular();

        return waitForUtils.waitForOverlay();
    }},
    reLogIn:                      {   value:  function(loginUser, loginPassword) {
        var email = this.emailBox;
        var password = this.passwordBox;

        this.refreshPage();

        email.clear().then(function() {
            return email.sendKeys(loginUser);
        });
        password.clear().then(function() {
            return password.sendKeys(loginPassword);
        });
        return this.logInButton.click().then(function() {
            return browser.driver.wait(function () {
                return browser.driver.getCurrentUrl().then(function (url) {
                    return /sl/g.test(url) || /#/g.test(url);
                });
            }, 20000);
        });
    }},
    isUserIncorrectWarning:       {   value:  function() {
        var EC = protractor.ExpectedConditions;
        var incorrUserWarning = element(by.css('div#msgDialog[style="display: block;"]'));
        var closeButton = incorrUserWarning.element(by.cssContainingText('div.modal-footer button', 'Close'));

        browser.waitForAngular();

        return browser.driver.wait(EC.visibilityOf(incorrUserWarning), 10000,'Warning has NOT visible!').then(function() {
            return incorrUserWarning.isPresent().then(function(displayed) {
                closeButton.click();
                return displayed;
            }, function(dis_err) {
                console.log(dis_err);
                return false;
            })
        }, function(wai_err) {
            console.log(wai_err);
            return false;
        });
    }},
    isUserLoggedOut:               {   value:  function() {
        var EC = protractor.ExpectedConditions;
        var loginTitle = element(by.cssContainingText('h1.panel-title', 'Login'));

        return browser.driver.wait(EC.visibilityOf(loginTitle), 5000,'User has NOT signed out!').then(function() {
            return loginTitle.isDisplayed().then(function(displayed) {
                return displayed;
            }, function(dis_err) {
                console.log(dis_err);
                return false;
            });
        });
    }}
});
module.exports = LoggedOutPage;