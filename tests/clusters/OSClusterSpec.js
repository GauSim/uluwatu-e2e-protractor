'use strict';

var BasePage = require('../../pages/BasePage.js');
var DashboardPage = require('../../pages/DashboardPage.js');
var originalJasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

describe('Testing a new OpenStack', function () {
    var basePage;
    var dashboardPage;
    var credentialOSName = 'autotest-eng-cred-' + browser.params.nameTag;
    var blueprintOSName = 'autotest-scaling-' + browser.params.nameTag;
    var clusterOSName = 'autotest-os-cls-' + browser.params.nameTag;
    var regionOSName = 'RegionOne';
    var availabilityZoneName = 'nova';
    var networkOSName = 'autotest-eng-net-' + browser.params.nameTag;
    var securityGroup = 'all-services-port';

    describe('cluster creation with recipe where', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();

        beforeAll(function () {
            console.log('OpenStack cluster creation test setup has started!');
            basePage.selectCredentialByName(credentialOSName);
        });

        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalJasmineTimeout;
        });

        it('the new cluster should be installed', function () {
            expect(basePage.getSelectedCredential()).toEqual(credentialOSName);
            expect(basePage.createNewOSCluster(clusterOSName, regionOSName, availabilityZoneName, networkOSName, securityGroup, blueprintOSName)).toBeTruthy();
            expect(basePage.isClusterInstalling()).toBeTruthy();
        });
        it('the new cluster should be launched', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterInstalled()).toBeTruthy();
            done();
        }, 40 * 60000);
        it('the new Cluster Details should be available', function () {
            expect(basePage.isClusterDetailsControllers(clusterOSName)).toBeTruthy();
        });
    });

    describe('on new OpenStack cluster operations', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();
        var nodeScalingUp = '1';
        var nodeScalingDown = '1';
        var hostGroup = 'slave_2';
        var testResult;
        var isSkip;

        describe('where', function () {
            afterEach(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalJasmineTimeout;

                if ((JSON.stringify(testResult).indexOf('\"passed\":false') !== -1) || (JSON.stringify(testResult).indexOf('\"message\":\"Failed') !== -1)) {
                    console.log('Test Failed happened');
                    isSkip = true;
                }
            });

            testResult = it('the Cluster AutoScaling should be available', function (done) {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isAmbariAutoScalingAvailable(clusterOSName)).toBeTruthy();
                expect(basePage.isScalingHostGroupsAvailable(clusterOSName)).toBeTruthy();
                done();
            }, 40 * 60000).result;

            testResult = it('the Cluster should be stopped', function (done) {
                expect(basePage.stopCluster(clusterOSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterStopped()).toBeTruthy();
                done();
            }, 40 * 60000).result;
            testResult = it('the Cluster should be started', function (done) {
                expect(basePage.startCluster(clusterOSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterStarted()).toBeTruthy();
                done();
            }, 40 * 60000).result;

            testResult = it('the Cluster should be up scaled', function (done) {
                expect(basePage.upScaleCluster(clusterOSName, hostGroup, nodeScalingUp)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterUpScaled()).toBeTruthy();
                done();
            }, 40 * 60000).result;
            testResult = it('the Cluster should be down scaled', function (done) {
                expect(basePage.downScaleCluster(clusterOSName, hostGroup, nodeScalingDown)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterDownScaled()).toBeTruthy();
                done();
            }, 40 * 60000).result;

            it('the Cluster should be terminated', function (done) {
                expect(basePage.terminateCluster(clusterOSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterRemoved()).toBeTruthy();
                done();
            }, 40 * 60000);
        });
    });
});