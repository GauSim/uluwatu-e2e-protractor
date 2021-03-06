'use strict';

var BasePage = require('../../pages/BasePage.js');
var DashboardPage = require('../../pages/DashboardPage.js');
var originalJasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
var originalNumberOfNodes;

var fs = require('fs');
var exec = require('node-ssh-exec');

describe('Testing a new OpenStack', function () {
    var basePage;
    var dashboardPage;
    var credentialOSName = 'autotest-eng-cred-' + browser.params.nameTag;
    var blueprintOSName = 'autotest-scaling-' + browser.params.nameTag;
    var clusterOSName = 'autotest-os-cls-' + browser.params.nameTag;
    var regionOSName = 'RegionOne';
    var availabilityZoneName = 'nova';
    var networkOSName = 'autotest-eng-net-' + browser.params.nameTag;
    var securityGroup = 'UNSECURE-openstack-all-services-open';
    var recipeName = 'autotest-sample-' + browser.params.nameTag + '-post';

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
            expect(basePage.createNewOSCluster(clusterOSName, regionOSName, availabilityZoneName, networkOSName, securityGroup, blueprintOSName, recipeName)).toBeTruthy();
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

        it('the (Post-install) script should be executed on nodes', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 10000;
            basePage.getClusterPrivateIPs(clusterOSName).then(function (ips) {
                ips.forEach(function (ip, index) {
                    console.log('SSH Username: ' + process.env.CLOUDBREAK_CLOUDBREAK_SSH_USER);
                    console.log('SSH Key Path: ' + process.env.SSH_KEY_PATH);

                    var config = {
                        host: ip,
                        username: process.env.CLOUDBREAK_CLOUDBREAK_SSH_USER,
                        privateKey: fs.readFileSync(process.env.SSH_KEY_PATH)
                    };
                    var command = '[[ -f /post-install ]] && echo true || echo false';

                    exec(config, command, function (error, response) {
                        if (error) {
                            throw error;
                        }
                        console.log('ip: ' + ip + '; index: ' + index + '; result: ' + response);
                        expect(response).toContain('true');
                        done();
                    })
                });
            });
        }, 4 * 10000);
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
                basePage.getNumberOfNodes(clusterOSName).then(function (value) {
                    originalNumberOfNodes = value;
                });
                expect(basePage.upScaleCluster(clusterOSName, hostGroup, nodeScalingUp)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterUpScaled()).toBeTruthy();
                done();
            }, 40 * 60000).result;
            testResult = it('the Number Of Nodes should be increased', function () {
                basePage.getNumberOfNodes(clusterOSName).then(function (value) {
                    expect(value).toBeGreaterThan(originalNumberOfNodes);
                });
            }).result;
            testResult = it('the Cluster should be down scaled', function (done) {
                basePage.getNumberOfNodes(clusterOSName).then(function (value) {
                    originalNumberOfNodes = value;
                });
                expect(basePage.downScaleCluster(clusterOSName, hostGroup, nodeScalingDown)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterDownScaled()).toBeTruthy();
                done();
            }, 40 * 60000).result;
            testResult = it('the Number Of Nodes should be decreased', function () {
                basePage.getNumberOfNodes(clusterOSName).then(function (value) {
                    expect(value).toBeLessThan(originalNumberOfNodes);
                });
            }).result;

            it('the Cluster should be terminated', function (done) {
                expect(basePage.terminateCluster(clusterOSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterRemoved()).toBeTruthy();
                done();
            }, 40 * 60000);
        });
    });
});