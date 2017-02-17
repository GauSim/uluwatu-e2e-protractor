'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing OpenStack credential creation', function () {
    var dashboardPage;
    var newOSName = 'autotest-eng-cred-' + browser.params.nameTag;
    var newDescription = 'autotest';
    var userOS = process.env.OS_USERNAME;
    var passwordOS = process.env.OS_PASSWORD;
    var tenantOS = process.env.OS_TENANT_NAME;
    var endpointOS = process.env.OS_AUTH_URL;
    var apiFacing = 'internal';
    var sshKey = process.env.SSHKEY;

    describe('with ' + newOSName + ' OpenStack credential', function () {
        dashboardPage = new DashboardPage();
        var defaultCredentials = 0;

        beforeAll(function () {
            console.log('OpenStack credential creation test setup has started!');
            dashboardPage.deleteCredential('autotest-eng-cred-');
            dashboardPage.getBadgeValue(0).then(function (value) {
                defaultCredentials = value;
            });
        });

        it('Create new OpenStack credential', function () {
            dashboardPage.createOSCredential(newOSName, newDescription, userOS, passwordOS, tenantOS, endpointOS, apiFacing, sshKey);
            dashboardPage.getBadgeValue(0).then(function (value) {
                expect(value).toBeGreaterThan(defaultCredentials);
            });
        });
    });
});