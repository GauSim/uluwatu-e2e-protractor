'use strict';
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

    reLogIn:                      {   value:  function(loginUser, loginPassword) {
        var email = this.emailBox;
        var password = this.passwordBox;
        var currentURL;

        browser.refresh();
        browser.waitForAngular();

        email.clear().then(function() {
            return email.sendKeys(loginUser);
        });
        password.clear().then(function() {
            return password.sendKeys(loginPassword);
        });
        return this.logInButton.click().then(function() {
            return browser.driver.wait(function () {
                return browser.driver.getCurrentUrl().then(function (url) {
                    currentURL = url;
                    return /dashboard/g.test(url) || /confirm/g.test(url) || /#/g.test(url) || /sl/g.test(url);
                });
            }, 60000).then(function() {
                console.log(currentURL);
                var pageName = currentURL.split("/").pop();

                switch (pageName) {
                    case '':
                        browser.driver.findElement(by.css('div#msgDialog[style="display: block;"]')).then(function() {
                            return true;
                        });
                        break;
                    case 'dashboard':
                        browser.driver.findElement(by.id('login-btn')).click().then(function() {
                            return browser.driver.wait(function() {
                                return browser.driver.getCurrentUrl().then(function(url) {
                                    return /#/.test(url);
                                });
                            }, 20000);
                        });
                        break;
                    case 'confirm':
                        browser.driver.findElement(by.id('confirm-yes')).click().then(function() {
                            return browser.driver.wait(function() {
                                return browser.driver.getCurrentUrl().then(function(url) {
                                    return /#/.test(url);
                                });
                            }, 20000);
                        });
                        break;
                    default:
                        return browser.driver.wait(function() {
                            return browser.driver.getCurrentUrl().then(function(url) {
                                return /#/.test(url);
                            });
                        }, 20000);
                        break;
                }
            });
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