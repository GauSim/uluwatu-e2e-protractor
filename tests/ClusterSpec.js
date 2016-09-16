'use strict';

var BasePage = require('../pages/BasePage.js');
var DashboardPage = require('../pages/DashboardPage.js');
var originalJasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

describe('Testing cluster creation', function () {
    var basePage;
    var dashboardPage;
    var credentialAWSName = 'autotest-aws-cred-' + browser.params.nameTag;
    var credentialOSName = 'autotest-kilo-cred-' + browser.params.nameTag;
    var blueprintAWSName = 'autotest-multi-' + browser.params.nameTag;
    var blueprintOSName = 'autotest-scaling-' + browser.params.nameTag;
    var templateOSName = 'autotest-kilo-tmp-' + browser.params.nameTag;
    var clusterAWSName = 'autotest-aws-cls-' + browser.params.nameTag;
    var clusterOSName = 'autotest-os-cls-' + browser.params.nameTag;
    var regionAWSName = 'EU (Ireland)';
    var regionOSName = 'local';
    var networkAWSName = 'default-aws-network';
    var networkOSName = 'autotest-kilo-net-' + browser.params.nameTag;
    var securityGroup = 'all-services-port';

    describe('on a new AWS cluster where', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();
        var nodeScalingUp = '6';
        var nodeScalingDown = '1';
        var hostGroup = 'slave_1';

        beforeAll(function() {
            console.log('AWS cluster creation test setup has started!');
            basePage.selectCredentialByName(credentialAWSName);
        });
        afterAll(function() {
            console.log('AWS Test suit teardown has started!');
            dashboardPage.deleteBlueprint(blueprintAWSName);
            dashboardPage.deleteCredential(credentialAWSName);
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalJasmineTimeout;
        });

        it('the new AWS cluster should be installed', function () {
            expect(basePage.getSelectedCredential()).toEqual(credentialAWSName);
            expect(basePage.createNewAWSCluster(clusterAWSName, regionAWSName, networkAWSName, securityGroup, blueprintAWSName)).toBeTruthy();
            expect(basePage.isClusterInstalling()).toBeTruthy();
        });
        it('the new AWS cluster should be launched', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterInstalled()).toBeTruthy();
            done();
        }, 40 * 60000);

        it('the Cluster Details should be available', function () {
            expect(basePage.isClusterDetailsControllers(clusterAWSName)).toBeTruthy();
        });

        it('the Cluster AutoScaling should be available', function () {
            expect(basePage.isAmbariAutoScalingAvailable(clusterAWSName)).toBeTruthy();
            expect(basePage.isScalingHostGroupsAvailable(clusterAWSName)).toBeTruthy();
        });

        it('the Cluster should be stopped', function (done) {
            expect(basePage.stopCluster(clusterAWSName)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterStopped()).toBeTruthy();
            done();
        }, 40 * 60000);
        it('the Cluster should be started', function (done) {
            expect(basePage.startCluster(clusterAWSName)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterStarted()).toBeTruthy();
            done();
        }, 40 * 60000);

        it('the Cluster should be up scaled', function (done) {
            expect(basePage.upScaleCluster(clusterAWSName, hostGroup, nodeScalingUp)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterUpScaled()).toBeTruthy();
            done();
        }, 40 * 60000);
        it('the Cluster should be down scaled', function (done) {
            expect(basePage.downScaleCluster(clusterAWSName, hostGroup, nodeScalingDown)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterDownScaled()).toBeTruthy();
            done();
        }, 40 * 60000);

        it('the Cluster should be terminated', function (done) {
            expect(basePage.terminateCluster(clusterAWSName)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterRemoved()).toBeTruthy();
            done();
        }, 40 * 60000);
    });

    describe('on a new OpenStack cluster where', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();
        var nodeScalingUp = '1';
        var nodeScalingDown = '1';
        var hostGroup = 'slave_2';

        beforeAll(function() {
            console.log('OpenStack cluster creation test setup has started!');
            basePage.selectCredentialByName(credentialOSName);
        });
        afterAll(function() {
            console.log('OpenStack test suit teardown has started!');
            dashboardPage.deleteBlueprint(blueprintOSName);
            dashboardPage.deleteTemplate(templateOSName);
            dashboardPage.deleteNetwork(networkOSName);
            dashboardPage.deleteCredential(credentialOSName);
        });
        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalJasmineTimeout;
        });

        it('the new OpenStack cluster should be installed', function () {
            expect(basePage.getSelectedCredential()).toEqual(credentialOSName);
            expect(basePage.createNewOSCluster(clusterOSName, regionOSName, networkOSName, securityGroup, blueprintOSName)).toBeTruthy();
            expect(basePage.isClusterInstalling()).toBeTruthy();
        });
        it('the new OpenStack cluster should be launched', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterInstalled()).toBeTruthy();
            done();
        }, 40 * 60000);

        it('the Cluster Details should be available', function () {
            expect(basePage.isClusterDetailsControllers(clusterOSName)).toBeTruthy();
        });

        it('the Cluster AutoScaling should be available', function () {
            expect(basePage.isAmbariAutoScalingAvailable(clusterOSName)).toBeTruthy();
            expect(basePage.isScalingHostGroupsAvailable(clusterOSName)).toBeTruthy();
        });

        it('the Cluster should be stopped', function (done) {
            expect(basePage.stopCluster(clusterOSName)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterStopped()).toBeTruthy();
            done();
        }, 40 * 60000);
        it('the Cluster should be started', function (done) {
            expect(basePage.startCluster(clusterOSName)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterStarted()).toBeTruthy();
            done();
        }, 40 * 60000);

        it('the Cluster should be up scaled', function (done) {
            expect(basePage.upScaleCluster(clusterOSName, hostGroup, nodeScalingUp)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterUpScaled()).toBeTruthy();
            done();
        }, 40 * 60000);
        it('the Cluster should be down scaled', function (done) {
            expect(basePage.downScaleCluster(clusterOSName, hostGroup, nodeScalingDown)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterDownScaled()).toBeTruthy();
            done();
        }, 40 * 60000);

        it('the Cluster should be terminated', function (done) {
            expect(basePage.terminateCluster(clusterOSName)).toBeTruthy();

            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterRemoved()).toBeTruthy();
            done();
        }, 40 * 60000);
    });
});