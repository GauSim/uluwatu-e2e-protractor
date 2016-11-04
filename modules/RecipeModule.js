'use strict';

var RecipeModule = function () {
    this.managementSection = element(by.css('section.management-panels'));
    this.newrecipeButton = element(by.css('a#panel-create-recipes-collapse-btn'));
};

RecipeModule.prototype = Object.create({}, {
    recipeForm:                    { get: function () {     return element(by.css('form[name*=recipeCreationForm]'));               }},
    nameBox:                       { get: function () {     return this.recipeForm.element(by.css('input#recipename'));             }},
    descriptionBox:                { get: function () {     return this.recipeForm.element(by.css('input#recipedescription'));      }},
    typeSelect:                    { get: function () {     return this.recipeForm.element(by.css('select#recipetype'));            }},
    preBox:                        { get: function () {     return this.recipeForm.element(by.css('textarea#preInstallScript'));    }},
    postBox:                       { get: function () {     return this.recipeForm.element(by.css('textarea#postInstallScript'));   }},
    createButton:                  { get: function () {     return this.recipeForm.element(by.css('a#createRecipe'));               }},

    typeName:                      { value: function (name)  {
        return this.nameBox.sendKeys(name);
    }},
    typeDescription:               { value: function (description) {
        return this.descriptionBox.sendKeys(description);
    }},
    selectPlugin:                  { value: function (name) {
        return this.typeSelect.element(by.cssContainingText('option', name)).click();
    }},
    deleteRecipe:                  { value: function (name) {
        var notificationBar = element(by.css('input#notification-n-filtering'));

        return element(by.cssContainingText('div>h5>a', name)).isDisplayed().then(function(isDisplayed) {
            var recipeLink = element(by.cssContainingText('div>h5>a', name));
            recipeLink.click();
            browser.waitForAngular();

            var selectedRecipePanel = element(by.css('div[id^="panel-recipe-collapse"][aria-expanded="true"]'));

            return selectedRecipePanel.element(by.css('a[ng-click="deleteRecipe(recipe)"]')).click().then(function () {
                browser.waitForAngular();
                var EC = protractor.ExpectedConditions;
                var recipeNotPresent = EC.stalenessOf(recipeLink);
                return browser.driver.wait(recipeNotPresent, 5000, 'The ' + name + ' recipe has NOT been deleted!').then(function() {
                    return notificationBar.getAttribute('value').then(function(message){
                        console.log(message);
                        return /deleted successfully/g.test(message);
                    });
                }, function(err) {
                    return false;
                });
            });
        }, function(err) {
            console.log('The recipe with ' + name + ' name is not present!');
            return true;
        });
    }},
    typePreScript:                 { value: function (script) {
        return this.preBox.sendKeys(script);
    }},
    typePostScript:                { value: function (script) {
        return this.postBox.sendKeys(script);
    }},
    createRecipe:                  { value: function (name, description, preScript, postScript) {
        browser.waitForAngular();
        var EC = protractor.ExpectedConditions;
        var newRecipe = element(by.cssContainingText('div>h5>a', name));
        var notificationBar = element(by.css('input#notification-n-filtering'));

        this.newrecipeButton.click();
        this.typeName(name);
        this.typeDescription(description);
        this.selectPlugin('Script');
        this.typePreScript(preScript);
        this.typePostScript(postScript);
        this.createButton.click().then(function () {
            browser.waitForAngular();
            return browser.driver.wait(EC.visibilityOf(newRecipe), 20000, 'The ' + name + ' recipe has NOT created!').then(function() {
                return newRecipe.isDisplayed().then(function(isDisplayed) {
                    notificationBar.getAttribute('value').then(function(message){
                        console.log(message);
                    });
                    return isDisplayed;
                }, function(err) {
                    return false;
                });
            }, function(err) {
                console.log('The ' + name + ' recipe has NOT created!');
                return err;
            });
        });
    }},
    getRecipeID:                   { value: function (name) {
        return element(by.cssContainingText('div>h5>a', name)).getAttribute('data-target');
    }}
});
module.exports = RecipeModule;