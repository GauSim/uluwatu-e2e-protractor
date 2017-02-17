'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing AWS credential creation', function () {
    var dashboardPage;
    var newAWSName = 'autotest-aws-cred-' + browser.params.nameTag;
    var newDescription = 'autotest';
    var iamRole = process.env.AWS_ROLE_ARN;
    var sshKey = process.env.SSHKEY;

    describe('with ' + newAWSName + ' AWS credential', function () {
        dashboardPage = new DashboardPage();
        var defaultCredentials = 0;

        beforeAll(function () {
            console.log('AWS credential creation test setup has started!');
            dashboardPage.deleteCredential('autotest-aws-cred-');
            dashboardPage.getBadgeValue(0).then(function (value) {
                defaultCredentials = value;
            });
        });

        it('Create new AWS credential', function () {
            dashboardPage.createAWSCredential(newAWSName, newDescription, iamRole, sshKey);
            dashboardPage.getBadgeValue(0).then(function (value) {
                expect(value).toBeGreaterThan(defaultCredentials);
            });
        });
    });
});