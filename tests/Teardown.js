'use strict';

var BasePage = require('../pages/BasePage.js');
var DashboardPage = require('../pages/DashboardPage.js');

describe('Testing', function () {
    var basePage;
    var dashboardPage;
    var credentialAWSName = 'autotest-aws-cred-' + browser.params.nameTag;
    var credentialOSName = 'autotest-eng-cred-' + browser.params.nameTag;
    var blueprintAWSName = 'autotest-multi-' + browser.params.nameTag;
    var blueprintOSName = 'autotest-scaling-' + browser.params.nameTag;
    var templateOSName = 'autotest-eng-tmp-' + browser.params.nameTag;
    var networkOSName = 'autotest-eng-net-' + browser.params.nameTag;
    var recipeName = 'autotest-sample-' + browser.params.nameTag;

    describe('teardown', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();

        it('should be success', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(dashboardPage.deleteBlueprint(blueprintAWSName)).toBeTruthy();
            expect(dashboardPage.deleteBlueprint(blueprintOSName)).toBeTruthy();
            expect(dashboardPage.deleteTemplate(templateOSName)).toBeTruthy();
            expect(dashboardPage.deleteNetwork(networkOSName)).toBeTruthy();
            expect(dashboardPage.deleteCredential(credentialAWSName)).toBeTruthy();
            expect(dashboardPage.deleteCredential(credentialOSName)).toBeTruthy();
            expect(dashboardPage.deleteRecipe(recipeName)).toBeTruthy();
            done();
        }, 40 * 60000);
    });
});