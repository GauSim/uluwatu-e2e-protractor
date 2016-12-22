'use strict';

var BasePage = require('../../pages/BasePage.js');
var DashboardPage = require('../../pages/DashboardPage.js');
var originalJasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

var fs = require('fs');
var exec = require('node-ssh-exec');

describe('Testing a new AWS', function () {
    var basePage;
    var dashboardPage;
    var credentialAWSName = 'autotest-aws-cred-' + browser.params.nameTag;
    var blueprintAWSName = 'autotest-multi-' + browser.params.nameTag;
    var clusterAWSName = 'autotest-aws-cls-' + browser.params.nameTag;
    var regionAWSName = 'EU (Ireland)';
    var networkAWSName = 'default-aws-network';
    var securityGroup = 'all-services-port';
    var recipeName = 'autotest-sample-' + browser.params.nameTag + '-pre';

    describe('cluster creation with recipe where', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();

        beforeAll(function () {
            console.log('AWS cluster creation test setup has started!');
            basePage.selectCredentialByName(credentialAWSName);
        });

        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalJasmineTimeout;
        });

        it('the new cluster should be installed', function () {
            expect(basePage.getSelectedCredential()).toEqual(credentialAWSName);
            expect(basePage.createNewAWSCluster(clusterAWSName, regionAWSName, networkAWSName, securityGroup, blueprintAWSName, recipeName)).toBeTruthy();
            expect(basePage.isClusterInstalling()).toBeTruthy();
        });
        it('the new cluster should be launched', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
            expect(basePage.isClusterInstalled()).toBeTruthy();
            done();
        }, 40 * 60000);
        it('the new Cluster Details should be available', function () {
            expect(basePage.isClusterDetailsControllers(clusterAWSName)).toBeTruthy();
        });

        it('the (Pre-install) script should be executed on nodes', function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 10000;
            basePage.getClusterPublicIPs(clusterAWSName).then(function (ips) {
                ips.forEach(function (ip, index) {
                    console.log('SSH Username: ' + process.env.CLOUDBREAK_CLOUDBREAK_SSH_USER);
                    console.log('SSH Key Path: ' + process.env.SSH_KEY_PATH);

                    var config = {
                        host: ip,
                        username: process.env.CLOUDBREAK_CLOUDBREAK_SSH_USER,
                        privateKey: fs.readFileSync(process.env.SSH_KEY_PATH)
                    };
                    var command = '[[ -f /pre-install ]] && echo true || echo false';

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

    describe('new AWS cluster operations', function () {
        basePage = new BasePage();
        dashboardPage = new DashboardPage();
        var nodeScalingUp = '6';
        var nodeScalingDown = '1';
        var hostGroup = 'slave_1';
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

            testResult = it('the Cluster AutoScaling should be available', function () {
                expect(basePage.isAmbariAutoScalingAvailable(clusterAWSName)).toBeTruthy();
                expect(basePage.isScalingHostGroupsAvailable(clusterAWSName)).toBeTruthy();
            }).result;

            testResult = it('the Cluster should be stopped', function (done) {
                expect(basePage.stopCluster(clusterAWSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterStopped()).toBeTruthy();
                done();
            }, 40 * 60000).result;
            testResult = it('the Cluster should be started', function (done) {
                expect(basePage.startCluster(clusterAWSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterStarted()).toBeTruthy();
                done();
            }, 40 * 60000).result;

            testResult = it('the Cluster should be up scaled', function (done) {
                expect(basePage.upScaleCluster(clusterAWSName, hostGroup, nodeScalingUp)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterUpScaled()).toBeTruthy();
                done();
            }, 40 * 60000).result;
            testResult = it('the Cluster should be down scaled', function (done) {
                expect(basePage.downScaleCluster(clusterAWSName, hostGroup, nodeScalingDown)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterDownScaled()).toBeTruthy();
                done();
            }, 40 * 60000).result;

            it('the Cluster should be terminated', function (done) {
                expect(basePage.terminateCluster(clusterAWSName)).toBeTruthy();

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
                expect(basePage.isClusterRemoved()).toBeTruthy();
                done();
            }, 40 * 60000);
        });
    });
});