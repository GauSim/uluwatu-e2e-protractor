'use strict';

var BasePage = require('../pages/BasePage.js');
var DashboardPage = require('../pages/DashboardPage.js');

describe('Testing cluster creation', function () {
  var basePage;
  var dashboardPage;
  var credentialName = 'autotest-aws';
  var blueprintName = 'autotest-multi-node-hdfs-yarn';
  var clusterName = 'autotest-aws';
  var regionName = 'EU (Ireland)';
  var networkName = 'default-aws-network';
  var securityGroup = 'all-services-port';

  describe('on a new AWS cluster where', function () {
      basePage = new BasePage();
      dashboardPage = new DashboardPage();

      beforeAll(function() {
          console.log('Cluster creation test setup has started!');
          basePage.selectCredentialByName(credentialName);
      });
      afterAll(function() {
          console.log('Test suit teardown has started!');
          dashboardPage.deleteBlueprint(blueprintName);
          dashboardPage.deleteAWSCredential(credentialName);
      });

      it('the new cluster should be installed', function () {
          expect(basePage.getSelectedCredential()).toEqual(credentialName);
          expect(basePage.createNewAWSCluster(clusterName, regionName, networkName, securityGroup, blueprintName)).toBeTruthy();
          expect(basePage.isClusterInstalling()).toBeTruthy();
      });
      it('the new cluster should be launched', function (done) {
          jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
          expect(basePage.isClusterInstalled()).toBeTruthy();
          done();
      }, 40 * 60000);

      it('the Cluster Details should be available', function () {
          expect(basePage.isClusterDetailsControllers(clusterName)).toBeTruthy();
      });
      it('the Cluster AutoScaling should be available', function () {
          expect(basePage.isAmbariAutoScalingAvailable(clusterName)).toBeTruthy();
      });

      it('the Cluster should be stopped', function (done) {
          expect(basePage.stopCluster(clusterName)).toBeTruthy();

          jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
          expect(basePage.isClusterStopped()).toBeTruthy();
          done();
      }, 40 * 60000);
      it('the Cluster should be started', function (done) {
          expect(basePage.startCluster(clusterName)).toBeTruthy();

          jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
          expect(basePage.isClusterStarted()).toBeTruthy();
          done();
      }, 40 * 60000);
      it('the Cluster should be terminated', function (done) {
          expect(basePage.terminateCluster(clusterName)).toBeTruthy();

          jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 60000;
          expect(basePage.isClusterRemoved()).toBeTruthy();
          done();
      }, 40 * 60000);
  });
});