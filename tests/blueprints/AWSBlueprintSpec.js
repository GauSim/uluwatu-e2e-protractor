'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing AWS blueprint creation', function () {
    var dashboardPage;
    var newAWSName = 'autotest-multi-' + browser.params.nameTag;
    var newDescription = 'autotest';
    var newAWSUrl = 'https://raw.githubusercontent.com/sequenceiq/uluwatu-e2e-protractor/master/blueprints/multi-node-hdfs-yarn.bp';

    describe('with ' + newAWSName + ' HDP 2.5 blueprint', function () {
        dashboardPage = new DashboardPage();
        var defaultBlueprints = 0;

        beforeAll(function () {
            console.log('HDP 2.5 blueprint creation test setup has started!');
            dashboardPage.deleteBlueprint('autotest-multi-');
            dashboardPage.getBadgeValue(4).then(function (value) {
                defaultBlueprints = value;
            });
        });

        it('Default blueprints should be available', function () {
            expect(dashboardPage.getDefaultBlueprints).toBeTruthy();
        });

        it('Create new HDP 2.5 blueprint', function () {
            dashboardPage.createBlueprint(newAWSName, newDescription, newAWSUrl);
            dashboardPage.getBadgeValue(4).then(function (value) {
                expect(value).toBeGreaterThan(defaultBlueprints);
            });
        });
    });
});