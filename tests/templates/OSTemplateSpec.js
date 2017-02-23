'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing OpenStack template creation', function () {
    var dashboardPage;
    var newOSName = 'autotest-eng-tmp-' + browser.params.nameTag;
    var newDescription = 'autotest';
    var newOSInstanceType = 'm1.medium';
    var newAttachedVolumes = 0;
    var newOSVolumeSize = 10;

    describe('with ' + newOSName + ' template', function () {
        dashboardPage = new DashboardPage();
        var defaultTemplates = 0;

        beforeAll(function () {
            console.log('Template creation test setup has started!');
            dashboardPage.deleteTemplate('autotest-eng-tmp-');
            dashboardPage.getBadgeValue(3).then(function (value) {
                defaultTemplates = value;
            });
        });

        it('Default templates should be available', function () {
            expect(dashboardPage.getDefaultTemplates).toBeTruthy();
        });

        it('Create new OpenStack template', function () {
            dashboardPage.createOSTemplate(newOSName, newDescription, newOSInstanceType, newAttachedVolumes, newOSVolumeSize);
            dashboardPage.getBadgeValue(3).then(function (value) {
                expect(value).toBeGreaterThan(defaultTemplates);
            });
        });
    });
});