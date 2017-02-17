'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing OpenStack network creation', function () {
    var dashboardPage;
    var newName = 'autotest-eng-net-' + browser.params.nameTag;
    var newDescription = 'autotest';
    var newSubnetID = process.env.OS_SUBNET_ID;
    var newVirtualNetworkID = process.env.OS_VIRTUAL_NETWORK_ID;

    describe('with ' + newName + ' network', function () {
        dashboardPage = new DashboardPage();
        var defaultNetworks = 0;

        beforeAll(function () {
            console.log('Network creation test setup has started!');
            dashboardPage.deleteNetwork('autotest-eng-net-');
            dashboardPage.getBadgeValue(2).then(function (value) {
                defaultNetworks = value;
            });
        });

        it('Default networks should be available', function () {
            expect(dashboardPage.getDefaultNetworks).toBeTruthy();
        });

        it('Create new OpenStack network', function () {
            dashboardPage.createOSNetwork(newName, newDescription, newVirtualNetworkID, newSubnetID);
            dashboardPage.getBadgeValue(2).then(function (value) {
                expect(value).toBeGreaterThan(defaultNetworks);
            });
        });
    });
});