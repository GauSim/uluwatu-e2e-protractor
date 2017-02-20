/**
 * Created by elgalu and mcalthrop on 3/14/14
 * https://github.com/elgalu and https://github.com/mcalthrop
 * https://github.com/angular/protractor/issues/610#issuecomment-37659676
 * https://github.com/angular/protractor/issues/543
 */

'use strict';

var WaitForUtils = function () {};

WaitForUtils.prototype = Object.create({}, {
    isWarningDisplayed:                { value: function (expectedVisibility)  {
        return browser.driver.wait(function () {
            if (expectedVisibility) {
                return element(by.css('.warning')).isDisplayed().then(function(visibility) {
                    return visibility === expectedVisibility;
                });
            } else {
                return element.all(by.css('.warning .collapse.in')).then(function(items) {
                    return items.length === 0;
                });
            }
        }, 20000).then(function() {
            return element.all(by.css('.warning .collapse.in'));
        }).then(function (items) {
            return items.length > 0;
        });
    }},
    waitForOverlay:                  {   value:  function() {
        var EC = protractor.ExpectedConditions;
        var loading = element(by.cssContainingText('div.block-ui-message-container div.block-ui-message.ng-binding', 'Loading ...'));
        var overlay = element(by.css('div.block-ui-overlay'));

        browser.waitForAngular();

        return browser.driver.wait(EC.invisibilityOf(loading), 20000,'Loading is visible!').then(function() {
            return browser.driver.wait(EC.invisibilityOf(overlay), 20000,'Overlay is visible!').then(function() {
                return overlay.isDisplayed().then(function(displayed) {
                    return !displayed;
                }, function(dis_err) {
                    return true;
                })
            }, function(wai_err) {
                console.log(wai_err);
                return false;
            });
        }, function(wai_err) {
            console.log(wai_err);
            return false;
        });
    }},
    checkingNotifications:             { value: function (notificationArray, errorMessagesArray)  {
        var EC = protractor.ExpectedConditions;
        var notificationBar = element(by.css('input#notification-n-filtering'));

        return notificationArray.every(function(notification, index) {
            var expectedElement = element(by.css('input#notification-n-filtering[value*="' + notification + '"]'));

            return browser.driver.wait(EC.visibilityOf(expectedElement), 60 * 20000, errorMessagesArray[index]).then(function() {
                return expectedElement.isDisplayed().then(function(isDisplayed) {
                    notificationBar.getAttribute('value').then(function(message){
                        console.log(message);
                    });
                    return isDisplayed;
                }, function(display_err) {
                    console.log('Expected "' + notification + '" notification is not visible!');
                    notificationBar.getAttribute('value').then(function(message){
                        console.log(message);
                    });
                    return false;
                });
            }, function(wait_err) {
                console.log('Expected "' + notification + '" notification is not present!');
                notificationBar.getAttribute('value').then(function(message){
                    console.log(message);
                });
                return false;
            });
        });
    }},
    waitForClusterInstall:             { value: function ()  {
        var EC = protractor.ExpectedConditions;

        var runningLed = element(by.css('div.mod-LED>span.state5-run'));
        var stoppedLed = element(by.css('div.mod-LED>span.state3-stop'));
        var clusterISRunning = EC.visibilityOf(runningLed);
        var clusterISFailed = EC.visibilityOf(stoppedLed);

        var notifications = ['Creating infrastructure', 'collection finished', 'Bootstrapping infrastructure', 'cluster services', 'Building Ambari', 'Execute recipes: master:', 'cluster built'];
        var messages = ['The stack creation has NOT started!', 'Metadata collection has NOT finished!', 'Infrastructure bootstrapping has NOT started!', 'Ambari services has NOT started!', 'Ambari building has NOT started!', 'Executing recipes has NOT started!', 'Ambari building has NOT finished!'];

        this.checkingNotifications(notifications, messages);

        return browser.driver.wait(EC.or(clusterISRunning, clusterISFailed), 5000, 'The cluster has NOT been installed!').then(function() {
            return runningLed.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('The notification has NOT generated!');
            return false;
        });
    }},
    waitForClusterRemove:        { value: function ()  {
        var EC = protractor.ExpectedConditions;

        var successfullyTerminated = element(by.css('input#notification-n-filtering[value*="successfully been terminated"]'));

        var notifications = ['Terminating the cluster', 'successfully been terminated'];
        var messages = ['The cluster termination has NOT started!', 'The cluster has not been terminated!'];

        this.checkingNotifications(notifications, messages);

        return browser.driver.wait(EC.visibilityOf(successfullyTerminated), 5000, 'The cluster has NOT been terminated!').then(function() {
            return successfullyTerminated.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('The notification has NOT generated!');
            return false;
        });
    }},
    waitForClusterStop:        { value: function ()  {
        var EC = protractor.ExpectedConditions;

        var successfullyStopped = element(by.css('input#notification-n-filtering[value*="successfully stopped"]'));

        var notifications = ['stop', 'Infrastructure is now stopping', 'successfully stopped'];
        var messages = ['Ambari services has NOT stopping!', 'Infrastructure has NOT stopping!', 'Cluster stopping has NOT finished!'];

        this.checkingNotifications(notifications, messages);

        return browser.driver.wait(EC.visibilityOf(successfullyStopped), 5000, 'The cluster has NOT been stopped!').then(function() {
            return successfullyStopped.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('The notification has NOT generated!');
            return false;
        });
    }},
    waitForClusterStart:             { value: function ()  {
        var EC = protractor.ExpectedConditions;

        var successfullyStarted = element(by.css('input#notification-n-filtering[value*="cluster started"]'));

        var notifications = ['Starting Ambari cluster', 'Starting Ambari services', 'Ambari cluster started'];
        var messages = ['Ambari cluster has NOT started!', 'Ambari services has NOT started!', 'Ambari restarting has NOT finished!'];

        this.checkingNotifications(notifications, messages);

        return browser.driver.wait(EC.visibilityOf(successfullyStarted), 5000, 'The cluster has NOT been started!').then(function() {
            return successfullyStarted.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('The notification has NOT generated!');
            return false;
        });
    }},
    waitForClusterScaleUp:           { value: function ()  {
        var EC = protractor.ExpectedConditions;

        var successfullyScaledUp = element(by.css('input#notification-n-filtering[value*="cluster scaled up"]'));

        var notifications = ['new instances to the infrastructure', 'Scaling up', 'cluster scaled up'];
        var messages = ['Infrastructure extension has NOT started!', 'Ambari scale up has NOT started!', 'Ambari scaling up has NOT finished!'];

        this.checkingNotifications(notifications, messages);

        return browser.driver.wait(EC.visibilityOf(successfullyScaledUp), 5000, 'The cluster has NOT been scaled up!').then(function() {
            return successfullyScaledUp.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('The notification has NOT generated!');
            return false;
        });
    }},
    waitForClusterScaleDown:           { value: function ()  {
        var EC = protractor.ExpectedConditions;

        var successfullyScaledDown = element(by.css('input#notification-n-filtering[value*="successfully downscaled"]'));

        var notifications = ['Removing', 'successfully downscaled'];
        var messages = ['Scaling down has NOT started!', 'Infrastructure down scale has NOT finished!'];

        this.checkingNotifications(notifications, messages);

        return browser.driver.wait(EC.visibilityOf(successfullyScaledDown), 5000, 'The cluster has NOT been scaled down!').then(function() {
            return successfullyScaledDown.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('The notification has NOT generated!');
            return false;
        });
    }}
});

module.exports = WaitForUtils;