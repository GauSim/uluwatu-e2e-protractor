'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing OpenStack blueprint creation', function () {
    var dashboardPage;
    var newOSName = 'autotest-scaling-' + browser.params.nameTag;
    var newDescription = 'autotest';
    var newOSUrl = 'https://raw.githubusercontent.com/sequenceiq/uluwatu-e2e-protractor/master/blueprints/scaling-node-hdfs-yarn.bp';

    describe('with ' + newOSName + ' custom blueprint', function () {
        dashboardPage = new DashboardPage();
        var defaultBlueprints = 0;

        beforeAll(function () {
            console.log('Custom blueprint creation test setup has started!');
            dashboardPage.deleteBlueprint('autotest-scaling-');
            dashboardPage.getBadgeValue(4).then(function (value) {
                defaultBlueprints = value;
            });
        });

        it('Default blueprints should be available', function () {
            expect(dashboardPage.getDefaultBlueprints).toBeTruthy();
        });

        it('Create new custom blueprint', function () {
            dashboardPage.createBlueprint(newOSName, newDescription, newOSUrl);
            dashboardPage.getBadgeValue(4).then(function (value) {
                expect(value).toBeGreaterThan(defaultBlueprints);
            });
        });
    });
});