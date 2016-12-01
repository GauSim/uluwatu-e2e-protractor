'use strict';
var CredentialModule = require('../modules/CredentialModule.js');
var BlueprintModule = require('../modules/BlueprintModule.js');
var TemplateModule = require('../modules/TemplateModule.js');
var NetworkModule = require('../modules/NetworkModule.js');
var RecipeModule = require('../modules/RecipeModule.js');

var DashboardPage = function () {
    browser.waitForAngular();
    browser.driver.wait(function () {
        return browser.driver.getCurrentUrl().then(function (url) {
            //console.log(url);
            return /#/g.test(url);
        });
    }, 2000)
};

DashboardPage.prototype = Object.create({}, {
    networksexpandButton:                   { get: function ()      { return element(by.css('a#network-btn'));                }},
    templatesexpandButton:                  { get: function ()      { return element(by.css('a#templates-btn'));              }},
    blueprintsexpandButton:                 { get: function ()      { return element(by.css('a#blueprints-btn'));             }},
    credentialsexpandButton:                { get: function ()      { return element(by.css('a#credentials-btn'));            }},
    recipesexpandButton:                    { get: function ()      { return element(by.css('a#recipes-btn'));                }},

    expandNetworks:                         { value: function ()    {
        var EC = protractor.ExpectedConditions;
        var expandButton = this.networksexpandButton;
        var expandedButton = element(by.css('a#network-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.stalenessOf(expandedButton), 2000, 'Manage Networks has already expanded!').then(function () {
            return expandButton.click().then(function () {
                return browser.driver.wait(function () {
                    return expandedButton.isDisplayed();
                }, 2000, 'Cannot see this element!');
            });
        }, function (err) {
            //console.log('Manage Networks have NOT expanded!');
        });
    }},
    expandTemplates:                        { value: function ()    {
        var EC = protractor.ExpectedConditions;
        var expandButton = this.templatesexpandButton;
        var expandedButton = element(by.css('a#templates-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.stalenessOf(expandedButton), 2000, 'Manage Templates has already expanded!').then(function () {
            return expandButton.click().then(function () {
                return browser.driver.wait(function () {
                    return expandedButton.isDisplayed();
                }, 2000, 'Cannot see this element!');
            });
        }, function (err) {
            //console.log('Manage Templates have NOT expanded!');
        });
    }},
    expandBlueprints:                       { value: function ()    {
        var EC = protractor.ExpectedConditions;
        var expandButton = this.blueprintsexpandButton;
        var expandedButton = element(by.css('a#blueprints-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.stalenessOf(expandedButton), 2000, 'Manage Blueprints has already expanded!').then(function () {
            return expandButton.click().then(function () {
                return browser.driver.wait(function () {
                    return expandedButton.isDisplayed();
                }, 2000, 'Cannot see this element!');
            });
        }, function (err) {
            //console.log('Manage Blueprints have NOT expanded!');
        });
    }},
    expandCredentials:                      { value: function ()    {
        var EC = protractor.ExpectedConditions;
        var expandButton = this.credentialsexpandButton;
        var expandedButton = element(by.css('a#credentials-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.stalenessOf(expandedButton), 2000, 'Manage Credentials has already expanded!').then(function () {
            return expandButton.click().then(function () {
                browser.waitForAngular();
                return browser.driver.wait(function () {
                    return expandedButton.isDisplayed();
                }, 2000, 'Cannot see this element!');
            });
        }, function (err) {
            //console.log('Manage Credentials has NOT expanded!');
        });
    }},
    expandRecipes:                          { value: function ()    {
        var EC = protractor.ExpectedConditions;
        var expandButton = this.recipesexpandButton;
        var expandedButton = element(by.css('a#recipes-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.stalenessOf(expandedButton), 2000, 'Manage Recipes has already expanded!').then(function () {
            return expandButton.click().then(function () {
                browser.waitForAngular();
                return browser.driver.wait(function () {
                    return expandedButton.isDisplayed();
                }, 2000, 'Cannot see this element!');
            });
        }, function (err) {
            //console.log('Manage Credentials has NOT expanded!');
        });
    }},
    getBadgeValue:                          { value: function (idx) {
        return element.all(by.css('span.badge.pull-right.ng-binding')).get(idx).getText().then(function (value) {
            return parseInt(value.trim(), 10);
        });
    }},
    deleteCredential:                       { value: function (name) {
        this.expandCredentials();
        var credentialModule = new CredentialModule();
        return credentialModule.deleteCredential(name);
    }},
    createAWSCredential:                    { value: function (name, description, iamRole, sshKey) {
        this.expandCredentials();
        var credentialModule = new CredentialModule();
        return credentialModule.createAWSCredential(name, description, iamRole, sshKey);
    }},
    createOSCredential:                     { value: function (name, description, user, password, tenant, endpoint, apiFacing, sshKey) {
        this.expandCredentials();
        var credentialModule = new CredentialModule();
        return credentialModule.createOpenStackCredential(name, description, user, password, tenant, endpoint, apiFacing, sshKey);
    }},
    getDefaultBlueprints:                   { value: function () {
        this.expandBlueprints();
        var blueprintModule = new BlueprintModule();
        return blueprintModule.isDefaultBlueprintAvailable();
    }},
    deleteBlueprint:                        { value: function (name) {
        this.expandBlueprints();
        var blueprintModule = new BlueprintModule();
        return blueprintModule.deleteBlueprint(name);
    }},
    createBlueprint:                        { value: function (name, description, url) {
        this.expandBlueprints();
        var blueprintModule = new BlueprintModule();
        return blueprintModule.createBlueprint(name, description, url);
    }},
    getDefaultTemplates:                    { value: function () {
        this.expandTemplates();
        var templateModule = new TemplateModule();
        return templateModule.isDefaultTemplateAvailable();
    }},
    deleteTemplate:                         { value: function (name) {
        this.expandTemplates();
        var templateModule = new TemplateModule();
        return templateModule.deleteTemplate(name);
    }},
    createOSTemplate:                       { value: function (name, description, instanceType, attachedVolumes, volumeSize) {
        this.expandTemplates();
        var templateModule = new TemplateModule();
        return templateModule.createOpenStackTemplate(name, description, instanceType, attachedVolumes, volumeSize);
    }},
    getDefaultNetworks:                     { value: function () {
        this.expandNetworks();
        var networkModule = new NetworkModule();
        return networkModule.isDefaultNetworkAvailable();
    }},
    deleteNetwork:                          { value: function (name) {
        this.expandNetworks();
        var networkModule = new NetworkModule();
        return networkModule.deleteNetwork(name);
    }},
    createOSNetwork:                        { value: function (name, description, virtualNetworkID, subnetID) {
        this.expandNetworks();
        var networkModule = new NetworkModule();
        return networkModule.createOpenStackNetwork(name, description, virtualNetworkID, subnetID);
    }},
    deleteRecipe:                           { value: function (name) {
        this.expandRecipes();
        var recipeModule = new RecipeModule();
        return recipeModule.deleteRecipe(name);
    }},
    createRecipe:                           { value: function (name, description, content, scriptType) {
        this.expandRecipes();
        var recipeModule = new RecipeModule();
        return recipeModule.createRecipe(name, description, content, scriptType);
    }}
});

module.exports = DashboardPage;