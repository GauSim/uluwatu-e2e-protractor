'use strict';
var ClusterModule = require('../modules/ClusterModule.js');
var WidgetModule = require('../modules/WidgetModule.js');
var BlueprintModule = require('../modules/BlueprintModule.js');
var WaitForUtils = require('../utils/WaitForUtils.js');

var BasePage = function () {
    browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
            //console.log(url);
            return /#/g.test(url);
        });
    }, 2000)
};

BasePage.prototype  = Object.create({}, {
    navBar:                                     { get: function ()  { return element(by.css('div#navbar-collapse-1'));                          }},
    clusterBar:                                 { get: function ()  { return element(by.css('div#clusters-bar'));                               }},
    dashboardLink:                              { get: function ()  { return this.navBar.element(by.cssContainingText('a', 'dashboard'));       }},
    accountLink:                                { get: function ()  { return this.navBar.element(by.cssContainingText('a', 'account'));         }},
    credentialList:                             { get: function ()  { return this.navBar.element(by.css('li#menu-credential'));                 }},
    credentials:                                { get: function ()  { return element.all(by.repeater('credential in $root.credentials'));       }},
    createClusterButton:                        { get: function ()  { return this.clusterBar.element(by.css('button#create-cluster-btn'));      }},
    notificationBar:                            { get: function ()  { return this.clusterBar.element(by.css('input#notification-n-filtering')); }},

    selectCredentialByName:                     { value: function (name)  {
        var EC = protractor.ExpectedConditions;
        var button = this.credentialList.element(by.css('.dropdown-toggle'));
        var isClickable = EC.elementToBeClickable(button);

        browser.driver.wait(isClickable, 10000, 'The Credential select drop-down is NOT available!');

        button.click().then(function() {
            return element(by.cssContainingText('li>a', name)).click().then(function () {
                browser.waitForAngular();
                return browser.driver.wait(function() {
                    return element(by.cssContainingText('li>a>span', name)).isDisplayed();
                }, 20000)
            });
        });
        this.credentials.filter(function(credential) {
            credential.element(by.cssContainingText('li>a', name)).then(function () {
                return browser.driver.wait(function () {
                    return element(by.css('li#menu-credential>a>span')).getText(function(text) {
                        return text === name;
                    });
                }, 20000);
            });
        });
    }},
    getSelectedCredential:                      { value: function ()  {
        return this.credentialList.element(by.css('a>span.ng-binding.text')).getText();
    }},
    openClusterCreate:                          { value: function ()  {
        this.createClusterButton.click().then(function() {
            return browser.driver.wait(function () {
                return element(by.css('div#cluster-form-panel')).isDisplayed();
            }, 20000);
        });
    }},
    notificationToConsole:                      { value: function ()  {
        this.notificationBar.getAttribute('value').then(function(message){
            console.log(message);
            return message.length > 0;
        });
    }},
    createNewAWSCluster:                        { value: function (name, region, network, securityGroup, blueprint, recipe)  {
        var clusterModule = new ClusterModule();
        this.openClusterCreate();
        clusterModule.createNewAWSCluster(name, region, network, securityGroup, blueprint, recipe);
        var widgetModule = new WidgetModule();
        return widgetModule.isClusterPresent(name);
    }},
    createNewOSCluster:                        { value: function (name, region, zone, network, securityGroup, blueprint, recipe) {
        var clusterModule = new ClusterModule();
        this.openClusterCreate();
        clusterModule.createNewOpenStackCluster(name, region, zone, network, securityGroup, blueprint, recipe);
        var widgetModule = new WidgetModule();
        return widgetModule.isClusterPresent(name);
    }},
    openClusterPanel:                           { value: function (name)  {
        var widgetModule = new WidgetModule();
        return widgetModule.openClusterPanel(name);
    }},
    openClusterDetails:                         { value: function ()  {
        var clusterModule = new ClusterModule();
        return clusterModule.openDetails();
    }},
    isClusterInstalling:                        { value: function ()  {
        var widgetModule = new WidgetModule();
        return widgetModule.isClusterInstallRunning();
    }},
    isClusterInstalled:                         { value: function ()  {
        var waitForUtils = new WaitForUtils();
        return waitForUtils.waitForClusterInstall();
    }},
    terminateCluster:                           { value: function (name)  {
        var widgetModule = new WidgetModule();
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);
        this.openClusterDetails();

        clusterModule.getClusterStatus();
        clusterModule.clickTerminateButton();
        clusterModule.clickConfirmTerminateButton();
        return widgetModule.isClusterTerminated();
    }},
    isClusterRemoved:                           { value: function ()  {
        var waitForUtils = new WaitForUtils();
        return waitForUtils.waitForClusterRemove();
    }},
    isAmbariAutoScalingAvailable:               { value: function (name)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);

        clusterModule.enableAutoScaling();
        clusterModule.createAlert();
        return clusterModule.isAmbariAlertsAvailable();
    }},
    isScalingHostGroupsAvailable:               { value: function (name)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);

        clusterModule.enableAutoScaling();
        clusterModule.createPolicy();
        return clusterModule.isScalingHostgroupsAvailable();
    }},
    isClusterDetailsControllers:                { value: function (name)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);
        this.openClusterDetails();

        return clusterModule.isDetailsButtonSetAvailable();
    }},
    getClusterPublicIPs:                        { value: function (name)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);
        this.openClusterDetails();

        return clusterModule.getAllPublicIPs();
    }},
    stopCluster:                                { value: function (name)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);
        this.openClusterDetails();

        clusterModule.clickStopButton();
        clusterModule.clickStopConfirmButton();
        return clusterModule.isClusterStopping();
    }},
    isClusterStopped:                           { value: function ()  {
        var waitForUtils = new WaitForUtils();
        return waitForUtils.waitForClusterStop();
    }},
    startCluster:                               { value: function (name)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(name);
        this.openClusterDetails();

        clusterModule.clickStartButton();
        clusterModule.clickStartConfirmButton();
        return clusterModule.isClusterStarting();
    }},
    isClusterStarted:                           { value: function ()  {
        var waitForUtils = new WaitForUtils();
        return waitForUtils.waitForClusterStart();
    }},
    upScaleCluster:                             { value: function (clusterName, hostGroup, numberOfNodes)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(clusterName);
        this.openClusterDetails();

        clusterModule.clickAddNodesButton();
        return clusterModule.addNodesToCluster(hostGroup, numberOfNodes);
    }},
    isClusterUpScaled:                          { value: function ()  {
        var waitForUtils = new WaitForUtils();
        return waitForUtils.waitForClusterScaleUp();
    }},
    downScaleCluster:                           { value: function (clusterName, hostGroup, numberOfNodes)  {
        var clusterModule = new ClusterModule();

        this.openClusterPanel(clusterName);
        this.openClusterDetails();

        clusterModule.clickRemoveNodesButton();
        return clusterModule.removeNodesFromCluster(hostGroup, numberOfNodes);
    }},
    isClusterDownScaled:                        { value: function ()  {
        var waitForUtils = new WaitForUtils();
        return waitForUtils.waitForClusterScaleDown();
    }},
    waitForUserDropDownMenu:                    { value: function(user) {
        var waitForUtils = new WaitForUtils();

        var EC = protractor.ExpectedConditions;
        var dropDownMenu = element(by.cssContainingText('li.dropdown a', user));

        waitForUtils.waitForOverlay();

        return browser.driver.wait(EC.elementToBeClickable(dropDownMenu), 10000, 'User drop-down is NOT click able!').then(function () {
            return dropDownMenu.isDisplayed().then(function(displayed) {
                return displayed;
            });
        }, function (err) {
            console.log(err);
            return false;
        });
    }},
    clickLogout:                                { value: function(user) {
        var EC = protractor.ExpectedConditions;
        var logOutLink = element(by.css('a[href="/logout"]'));

        return browser.driver.actions().click(element(by.cssContainingText('li.dropdown a', user))).perform().then(function() {
            return browser.driver.wait(EC.visibilityOf(logOutLink), 10000, 'Log out link is NOT visible!').then(function () {
                return logOutLink.click();
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
    }},
    isLoggedOut:                                { value: function() {
        browser.waitForAngular();

        return browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
                return /logout=true/g.test(url);
            });
        }, 10000, 'Logged out page has not loaded in!');
    }},
    logOut:                                     { value: function (user)  {
        this.waitForUserDropDownMenu(user);
        this.clickLogout(user);
        return this.isLoggedOut();
    }},
    isUserLoggedIn:                             { value: function(user) {
        var EC = protractor.ExpectedConditions;
        var loggedInUser = element(by.cssContainingText('li.dropdown a', user));

        return browser.driver.wait(EC.visibilityOf(loggedInUser), 20000,'User has NOT signed in!').then(function() {
            return loggedInUser.isPresent().then(function(displayed) {
                return displayed;
            }, function(dis_err) {
                console.log(dis_err);
                return false;
            })
        }, function(wai_err) {
            console.log(wai_err);
            return false;
        });
    }}
});
module.exports = BasePage;