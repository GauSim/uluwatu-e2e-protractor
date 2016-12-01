'use strict';

var BasePage = require('../pages/BasePage.js');
var DashboardPage = require('../pages/DashboardPage.js');

describe('Test teardown', function () {
    var basePage;
    var dashboardPage;
    var credentialAWSName = 'autotest-aws-cred-' + browser.params.nameTag;
    var credentialOSName = 'autotest-eng-cred-' + browser.params.nameTag;
    var blueprintAWSName = 'autotest-multi-' + browser.params.nameTag;
    var blueprintOSName = 'autotest-scaling-' + browser.params.nameTag;
    var templateOSName = 'autotest-eng-tmp-' + browser.params.nameTag;
    var networkOSName = 'autotest-eng-net-' + browser.params.nameTag;
    var recipePreName = 'autotest-sample-' + browser.params.nameTag + '-pre';
    var recipePostName = 'autotest-sample-' + browser.params.nameTag + '-post';

    describe('where', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();

        it(blueprintAWSName + ' blueprint delete should be success', function () {
            expect(dashboardPage.deleteBlueprint(blueprintAWSName)).toBeTruthy();
        });
        it(blueprintOSName + ' blueprint delete should be success', function () {
            expect(dashboardPage.deleteBlueprint(blueprintOSName)).toBeTruthy();
        });
        it(templateOSName + ' template delete should be success', function () {
            expect(dashboardPage.deleteTemplate(templateOSName)).toBeTruthy();
        });
        it(networkOSName + ' network delete should be success', function () {
            expect(dashboardPage.deleteNetwork(networkOSName)).toBeTruthy();
        });
        it(credentialAWSName + ' credential delete should be success', function () {
            expect(dashboardPage.deleteCredential(credentialAWSName)).toBeTruthy();
        });
        it(credentialOSName + ' credential delete should be success', function () {
            expect(dashboardPage.deleteCredential(credentialOSName)).toBeTruthy();
        });
        it(recipePreName + ' recipe delete should be success', function () {
            expect(dashboardPage.deleteRecipe(recipePreName)).toBeTruthy();
        });
        it(recipePostName + ' recipe delete should be success', function () {
            expect(dashboardPage.deleteRecipe(recipePostName)).toBeTruthy();
        });
    });
});