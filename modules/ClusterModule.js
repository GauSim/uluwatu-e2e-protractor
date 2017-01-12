/**
 * Created by aszegedi on 1/14/16.
 *
 * Page Objects for Create Cluster pane on the Cloudbreak Dashboard.
 */

'use strict';

var ClusterModule = function () {
    this.clusterSection = element(by.css('section.clusters'));
};

ClusterModule.prototype = Object.create({}, {
    clustercreateForm:                 { get: function () {     return element(by.css('div#create-cluster-panel-collapse'));                                                                                }},
    // Tab pages
    configureTab:                      { get: function () {     return element(by.cssContainingText('a', 'Configure Cluster'));                                                                             }},
    networkTab:                        { get: function () {     return element(by.cssContainingText('a', 'Setup Network and Security'));                                                                    }},
    blueprintTab:                      { get: function () {     return element(by.cssContainingText('a', 'Choose Blueprint'));                                                                              }},
    filesystemTab:                     { get: function () {     return element(by.cssContainingText('a', 'Add File System'));                                                                               }},
    reviewlaunchTab:                   { get: function () {     return element(by.cssContainingText('a', 'Review and Launch'));                                                                             }},
    // Configure Cluster tab
    clusternameBox:                    { get: function () {     return element(by.css('div#configure_cluster input#cl_clusterName'));                                                                       }},
    securityButton:                    { get: function () {     return element.all(by.cssContainingText('div#configure_cluster button.btn.btn-sm.btn-default.ng-binding', 'Setup Network and Security'));   }},
    // Setup Network and Security tab
    networknameSelect:                 { get: function () {     return element(by.css('select#selectClusterNetwork'));                                                                                      }},
    blueprintButton:                   { get: function () {     return element(by.cssContainingText('div#configure_security_group button.btn.btn-sm.btn-default.ng-binding', 'Choose Blueprint'));          }},

    typeName:                          { value: function (name) {
        return this.clusternameBox.sendKeys(name);
    }},
    selectRegion:                      { value:  function (name) {
        return this.clustercreateForm.element(by.cssContainingText('option', name)).click();
    }},
    selectAvailabilityZone:            { value:  function (name) {
        return this.clustercreateForm.element(by.cssContainingText('option', name)).click();
    }},
    clickSetupNetworkSecurity:         { value: function () {
        return this.securityButton.click().then(function() {
            return browser.driver.wait(function() {
                return element(by.css('select#selectClusterNetwork')).isDisplayed();
            }, 20000);
        });
    }},
    selectNetwork:                     { value: function (name) {
        return this.networknameSelect.element(by.cssContainingText('option', name)).click();
    }},
    clickChooseBlueprint:              { value: function () {
        return this.blueprintButton.click().then(function() {
            return browser.driver.wait(function() {
                return element(by.css('select#selectBlueprint')).isDisplayed();
            }, 20000);
        });
    }},
    selectBlueprint:                   { value: function (name) {
        return this.clustercreateForm.element(by.cssContainingText('option', name)).click();
    }},
    selectSecurityGroup:               { value: function (name) {
        var securityGroupSelects = element.all(by.xpath('//select[contains(@id,"securityGroupNameName")]'));

        return securityGroupSelects.each(function(select, index) {
            return select.element(by.cssContainingText('option', name)).click();
        });
    }},
    isBlueprintSelected:               { value: function (name) {
        browser.waitForAngular();
        return browser.driver.wait(function() {
            return element(by.cssContainingText('div#create-cluster-panel-collapse option', name)).isSelected();
        }, 20000, 'Cannot select ' + name + ' blueprint!');
    }},
    selectAmbariServer:                   { value: function () {
        var EC = protractor.ExpectedConditions;
        var serverButton = element(by.css('input#template-ambari-0'));
        var checkedServerButton = element(by.css('input#template-ambari-0[checked*="checked"]'));

        return browser.driver.wait(EC.elementToBeClickable(serverButton), 5000, 'Server button is NOT click able!').then(function() {
            return browser.driver.actions().click(serverButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(checkedServerButton), 5000, 'Server button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(serverButton).perform();
            });
        });
    }},
    selectRecipe:                         { value: function (name) {
        element.all(by.css('input[name="' + name + '"]')).each(function(recipeCheckBox, index) {
            recipeCheckBox.getAttribute('name').then(function(recipeName) {
                console.log('Select the ' + recipeName + ' ' + index + ' recipe.');
            });
            return recipeCheckBox.click();
        });
    }},
    clickReviewAndLaunch:              { value: function () {
        var EC = protractor.ExpectedConditions;
        var reviewButton = element(by.cssContainingText('div#configure_host_groups .btn.btn-sm.btn-default.ng-binding', 'Review and Launch'));
        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(reviewButton), 5000, 'Launch button is NOT click able!').then(function() {
            //   console.log('Launch button is clicked 1st!');
            return browser.driver.actions().doubleClick(reviewButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.invisibilityOf(reviewButton), 5000, 'Launch button has NOT clicked at 1st!').then(function() {
                //       console.log('Launch button has already clicked at 1st!');
            }, function(err) {
                //       console.log('Launch button is clicked 2nd!');
                return browser.driver.actions().click(reviewButton).perform();
            });
        });
    }},
    isReviewAndLaunchOpened:           { value: function () {
        browser.driver.wait(function() {
            return element(by.css('a#createCluster')).isPresent();
        }, 20000);
        return browser.driver.wait(function() {
            return element(by.css('a#createCluster')).isDisplayed();
        }, 20000);
    }},
    LaunchCluster:                     { value: function () {
        var EC = protractor.ExpectedConditions;
        var launchButton = element(by.css('a#createCluster'));
        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(launchButton), 5000, 'Start button is NOT click able!').then(function() {
            //    console.log('Start button is clicked 1st!');
            return browser.driver.actions().doubleClick(launchButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.invisibilityOf(launchButton), 5000,'Start button has NOT clicked at 1st!').then(function() {
                //        console.log('Start button has already clicked at 1st!');
            }, function(err) {
                //        console.log('Start button is clicked 2nd!');
                return browser.driver.actions().click(launchButton).perform();
            });
        });
    }},
    isClusterPanelOpen:                { value: function (name) {
        var EC = protractor.ExpectedConditions;
        var clusterPanel = element(by.css('div#active-cluster-panel'));
        var clusterNameTag = clusterPanel.element(by.cssContainingText('h4.ng-binding', name));

        return browser.driver.wait(EC.visibilityOf(clusterNameTag), 5000, 'The cluster panel has NOT opened!').then(function() {
            return clusterNameTag.isDisplayed().then(function(isDisplayed) {
                console.log('Cluster panel is NOT opened!');
                return isDisplayed;
            }, function(err) {
                console.log('Cluster panel is NOT displayed');
                return false;
            });
        }, function(err) {
            console.log('Cluster panel is not available');
            return false;
        });
    }},
    isClusterDetailsOpen:              { value: function () {
        var EC = protractor.ExpectedConditions;
        var openedDetailsTab = element(by.cssContainingText('a.ng-binding[role="tab"][aria-expanded="true"]', 'details'));

        return browser.driver.wait(EC.visibilityOf(openedDetailsTab), 5000, 'Details tab is NOT opened!').then(function() {
            return openedDetailsTab.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('Cluster details is not available');
            return false;
        });
    }},
    clickTerminateButton:              { value: function () {
        var EC = protractor.ExpectedConditions;
        var terminateButton = element(by.css('a#terminate-btn'));
        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(terminateButton), 5000, 'Terminate button is NOT click able!').then(function() {
            //    console.log('Terminate button is clicked 1st!');
            return browser.driver.actions().doubleClick(terminateButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(element(by.css('button#terminateStackBtn'))), 5000,'Terminate button has NOT clicked at 1st!').then(function() {
                //        console.log('Terminate button has already clicked at 1st!');
            }, function(err) {
                //        console.log('Terminate button is clicked 2nd!');
                return browser.driver.actions().click(terminateButton).perform();
            });
        });
    }},
    clickConfirmTerminateButton:       { value: function () {
        var EC = protractor.ExpectedConditions;
        var forceTerminateBox = element(by.css('input#modal-terminate-forced'));
        var stackTerminateButton = element(by.css('button#terminateStackBtn'));
        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(forceTerminateBox), 5000, 'Force terminate checkbox is NOT click able!').then(function() {
            //    console.log('Force terminate is clicked 1st!');
            browser.driver.actions().click(forceTerminateBox).perform();
            return browser.driver.actions().click(stackTerminateButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.invisibilityOf(stackTerminateButton), 5000,'Terminate button has NOT clicked at 1st!').then(function() {
                //        console.log('Force terminate has already clicked at 1st!');
            }, function(err) {
                //        console.log('Force terminate is clicked 2nd!');
                browser.driver.actions().click(forceTerminateBox).perform();
                return browser.driver.actions().click(stackTerminateButton).perform();
            });
        });
    }},
    clickStopButton:                   { value: function () {
        var EC = protractor.ExpectedConditions;
        var stopButton = element(by.cssContainingText('a.btn.btn-warning span','stop'));
        var stopConfirmationButton = element(by.cssContainingText('button#stackStackBtn','stop'));

        return browser.driver.wait(EC.elementToBeClickable(stopButton), 5000, 'Stop button is NOT click able!').then(function() {
            return browser.driver.actions().click(stopButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(stopConfirmationButton), 5000,'Stop button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(stopButton).perform();
            });
        });
    }},
    clickStopConfirmButton:       { value: function () {
        var EC = protractor.ExpectedConditions;
        var stopConfirmationButton = element(by.cssContainingText('button#stackStackBtn','stop'));

        return browser.driver.wait(EC.elementToBeClickable(stopConfirmationButton), 5000, 'Stop confirmation button is NOT click able!').then(function() {
            return browser.driver.actions().click(stopConfirmationButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.invisibilityOf(stopConfirmationButton), 5000,'Stop confirmation button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(stopConfirmationButton).perform();
            });
        });
    }},
    isClusterStopping:       { value: function () {
        var EC = protractor.ExpectedConditions;
        var clusterStatus = element(by.css('p#sl_cloudStatus'));

        return browser.driver.wait(EC.visibilityOf(clusterStatus), 2000, 'Cluster Status is NOT available!').then(function() {
            return clusterStatus.isDisplayed().then(function() {
                return clusterStatus.getText().then(function(message){
                    console.log(message);
                    return /stop/i.test(message);
                });
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('Cluster Status is NOT available!');
            return false;
        });
    }},
    clickStartButton:                   { value: function () {
        var EC = protractor.ExpectedConditions;
        var startButton = element(by.cssContainingText('a.btn.btn-success span','start'));
        var confirmationBox = element(by.css('div#modal-start-cluster'));
        var startConfirmationButton = confirmationBox.element(by.cssContainingText('button#stackStackBtn','start'));

        return browser.driver.wait(EC.elementToBeClickable(startButton), 5000, 'Start button is NOT click able!').then(function() {
            return browser.driver.actions().click(startButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(startConfirmationButton), 5000,'Start button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(startButton).perform();
            });
        });
    }},
    clickStartConfirmButton:           { value: function () {
        var EC = protractor.ExpectedConditions;
        var confirmationBox = element(by.css('div#modal-start-cluster'));
        var startConfirmationButton = confirmationBox.element(by.cssContainingText('button#stackStackBtn','start'));

        return browser.driver.wait(EC.elementToBeClickable(startConfirmationButton), 5000, 'Start confirmation button is NOT click able!').then(function() {
            return browser.driver.actions().click(startConfirmationButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.invisibilityOf(startConfirmationButton), 5000,'Start confirmation button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(startConfirmationButton).perform();
            });
        });
    }},
    isClusterStarting:                 { value: function () {
        var EC = protractor.ExpectedConditions;
        var clusterStatus = element(by.css('p#sl_cloudStatus'));

        return browser.driver.wait(EC.visibilityOf(clusterStatus), 2000, 'Cluster Status is NOT available!').then(function() {
            return clusterStatus.isDisplayed().then(function() {
                return clusterStatus.getText().then(function(message){
                    console.log(message);
                    return /start/i.test(message);
                });
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('Cluster Status is NOT available!');
            return false;
        });
    }},
    getClusterStatus:                  { value: function () {
        var EC = protractor.ExpectedConditions;
        var clusterStatus = element(by.css('p#sl_cloudStatus'));

        browser.driver.wait(EC.visibilityOf(clusterStatus), 2000, 'Cluster Status is NOT available!').then(function() {
            return clusterStatus.isDisplayed().then(function(isDisplayed) {
                clusterStatus.getText().then(function(message){
                    console.log(message);
                });
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }, function(err) {
            console.log('Cluster Status is NOT available!');
            return false;
        });
    }},
    clickAddNodesButton:               { value: function () {
        var EC = protractor.ExpectedConditions;
        var addNodesButton = element(by.cssContainingText('a.btn.btn-success span','add nodes'));
        var upscaleBox = element(by.css('div#modal-upscale-cluster'));

        return browser.driver.wait(EC.elementToBeClickable(addNodesButton), 5000, 'Add Nodes button is NOT click able!').then(function() {
            return browser.driver.actions().click(addNodesButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(upscaleBox), 5000,'Add Nodes button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(addNodesButton).perform();
            });
        });
    }},
    addNodesToCluster:                 { value: function (hostGroup, number) {
        var EC = protractor.ExpectedConditions;
        var upscaleBox = element(by.css('div#modal-upscale-cluster'));
        var hostGroupSelect = upscaleBox.element(by.css('select#hostgroupselected'));
        var nodeNumberInput = upscaleBox.element(by.css('input#numberOfInstances'));
        var startUpscaleButton = upscaleBox.element(by.cssContainingText('button#stackStackBtn','start upscale'));
        var visibilityOfHostGroups = EC.visibilityOf(hostGroupSelect);
        var visibilityOfNodes = EC.visibilityOf(nodeNumberInput);

        browser.driver.wait(EC.or(visibilityOfHostGroups,visibilityOfNodes), 5000, 'Upscale inputs are NOT visible').then(function() {
            hostGroupSelect.element(by.cssContainingText('option', hostGroup)).click();
            nodeNumberInput.getText().then(function(value) {
                if (value != number) {
                    return nodeNumberInput.clear().then(function() {
                        return nodeNumberInput.sendKeys(number);
                    });
                }
            });
        });

        return browser.driver.wait(EC.elementToBeClickable(startUpscaleButton), 5000, 'Start Upscale button is NOT click able!').then(function() {
            return startUpscaleButton.click().then(function () {
                return browser.driver.wait(EC.invisibilityOf(upscaleBox), 5000, 'Start Upscale button has NOT clicked at 1st!').then(function () {
                    return true;
                }, function (err) {
                    return browser.driver.actions().click(startUpscaleButton).perform();
                });
            });
        });
    }},
    clickRemoveNodesButton:            { value: function () {
        var EC = protractor.ExpectedConditions;
        var removeNodesButton = element(by.cssContainingText('a.btn.btn-success span','remove nodes'));
        var downscaleBox = element(by.css('div#modal-downscale-cluster'));

        return browser.driver.wait(EC.elementToBeClickable(removeNodesButton), 5000, 'Remove Nodes button is NOT click able!').then(function() {
            return browser.driver.actions().click(removeNodesButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(downscaleBox), 5000,'Remove Nodes button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(removeNodesButton).perform();
            });
        });
    }},
    removeNodesFromCluster:            { value: function (hostGroup, number) {
        var EC = protractor.ExpectedConditions;
        var downscaleBox = element(by.css('div#modal-downscale-cluster'));
        var hostGroupSelect = downscaleBox.element(by.css('select#hostgroupselected'));
        var nodeNumberInput = downscaleBox.element(by.css('input#numberOfInstances'));
        var startDownscaleButton = downscaleBox.element(by.cssContainingText('button#stackStackBtn','start downscale'));
        var visibilityOfHostGroups = EC.visibilityOf(hostGroupSelect);
        var visibilityOfNodes = EC.visibilityOf(nodeNumberInput);

        browser.driver.wait(EC.or(visibilityOfHostGroups,visibilityOfNodes), 5000, 'Downscale inputs are NOT visible').then(function() {
            hostGroupSelect.element(by.cssContainingText('option', hostGroup)).click();
            nodeNumberInput.getText().then(function(value) {
                if (value != number) {
                    return nodeNumberInput.clear().then(function() {
                        return nodeNumberInput.sendKeys(number);
                    });
                }
            });
        });

        return browser.driver.wait(EC.elementToBeClickable(startDownscaleButton), 5000, 'Start Downscale button is NOT click able!').then(function() {
            return startDownscaleButton.click().then(function() {
                return browser.driver.wait(EC.invisibilityOf(downscaleBox), 5000,'Start Downscale button has NOT clicked at 1st!').then(function() {
                    return true;
                }, function(err) {
                    return browser.driver.actions().click(startDownscaleButton).perform();
                });
            });
        });
    }},
    openDetails:                       { value: function () {
        var EC = protractor.ExpectedConditions;

        var defaultTab = element(by.cssContainingText('a.ng-binding[role="tab"]', 'details'));
        var openedDetailsTab = element(by.cssContainingText('a.ng-binding[role="tab"][aria-expanded="true"]', 'details'));
        var isDefaultTab = EC.visibilityOf(defaultTab);
        var isDetailsTab = EC.visibilityOf(openedDetailsTab);

        var closedDetailsTab = element(by.cssContainingText('a.ng-binding[role="tab"][aria-expanded="false"]', 'details'));
        var eventHistory = element(by.css('div#cluster-history-collapse01'));

        return browser.driver.wait(EC.visibilityOf(eventHistory), 5000,'Details tab has NOT opened!').then(function() {
            return console.log('Cluster Details tab is already opened!');
        }, function(err) {
            return browser.driver.wait(EC.elementToBeClickable(defaultTab), 5000, 'Details tab is NOT click able!').then(function() {
                return defaultTab.click();
            }).then(function() {
                return browser.driver.wait(EC.visibilityOf(eventHistory), 5000,'Details tab has NOT clicked at 1st!').then(function() {
                    return console.log('Cluster Details tab has successfully opened!');
                }, function(err) {
                    return browser.driver.actions().click(defaultTab).perform();
                });
            });
        });
    }},
    isDetailsButtonSetAvailable:       { value: function () {
        var EC = protractor.ExpectedConditions;
        var clusterDetails = element(by.css('div#active-cluster-panel'));
        var buttons = ['add nodes','remove nodes','sync','stop','terminate'];

        return buttons.every(function(button) {
            var expectedElement = clusterDetails.element(by.cssContainingText('span.ng-binding', button));

            return browser.driver.wait(EC.visibilityOf(expectedElement), 5000, 'Cluster "' + button + '" button is NOT present!').then(function () {
                return expectedElement.isDisplayed().then(function (isDisplayed) {
                    return isDisplayed;
                }, function (err) {
                    return false;
                });
            });
        });
    }},
    openAutoScaling:                   { value: function () {
        var EC = protractor.ExpectedConditions;

        var defaultTab = element(by.cssContainingText('a.ng-binding[role="tab"]', 'autoscaling SLA policies'));
        var openedAutoScalingTab = element(by.cssContainingText('a.ng-binding[role="tab"][aria-expanded="true"]', 'autoscaling SLA policies'));
        var isDefaultTab = EC.visibilityOf(defaultTab);
        var isScailingTab = EC.visibilityOf(openedAutoScalingTab);

        var closedAutoScalingTab = element(by.cssContainingText('a.ng-binding[role="tab"][aria-expanded="false"]', 'autoscaling SLA policies'));

        return browser.driver.wait(EC.visibilityOf(openedAutoScalingTab), 5000,'Scailing tab has NOT opened!').then(function() {

        }, function(err) {
            return browser.driver.wait(EC.elementToBeClickable(defaultTab), 5000, 'Scailing tab is NOT click able!').then(function() {
                return defaultTab.click();
            }).then(function() {
                return browser.driver.wait(EC.or(isDefaultTab, isScailingTab), 5000,'Scailing tab has NOT clicked at 1st!').then(function() {

                }, function(err) {
                    return browser.driver.actions().click(defaultTab).perform();
                });
            });
        });
    }},
    enableAutoScaling:                 { value: function () {
        var EC = protractor.ExpectedConditions;
        var enableAutoScaling = element(by.css('a#update-scaling-configuration-btn[class="btn btn-primary btn-block ng-binding"]'));
        var disableAutoScaling = element(by.css('a#update-scaling-configuration-btn[class="btn btn-danger btn-block ng-binding"]'));

        this.openAutoScaling();

        return browser.driver.wait(EC.visibilityOf(disableAutoScaling), 5000,'Enable auto scaling button has NOT clicked!').then(function() {

        }, function(err) {
            return browser.driver.wait(EC.elementToBeClickable(enableAutoScaling), 5000, 'Enable auto scaling button is NOT click able!').then(function() {
                return enableAutoScaling.click();
            }).then(function() {
                return browser.driver.wait(EC.visibilityOf(disableAutoScaling), 5000,'Enable auto scaling button has NOT clicked at 1st!').then(function() {

                }, function(err) {
                    return browser.driver.actions().click(enableAutoScaling).perform();
                });
            });
        });
    }},
    createAlert:                       { value: function () {
        var EC = protractor.ExpectedConditions;
        var createAlertButton = element(by.css('a#panel-create-periscope-alert-btn'));
        var closeAlertButton = element(by.css('a#panel-create-periscope-alert-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.elementToBeClickable(createAlertButton), 10000, 'Create Alert button is NOT click able!').then(function() {
            return createAlertButton.click();
        }).then(function() {
            return browser.driver.wait(EC.elementToBeClickable(closeAlertButton), 10000,'Create Alert button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(createAlertButton).perform();
            });
        });
    }},
    isAmbariAlertsAvailable:           { value: function () {
        var EC = protractor.ExpectedConditions;
        var alertSelect = element(by.css('select#alertDefinitions'));
        var ambariAlerts = element.all(by.repeater('alertDef in alertDefinitions'));

        return browser.driver.wait(EC.visibilityOf(alertSelect), 5000, 'Ambari Alerts drop-down is NOT available!').then(function() {
            return alertSelect.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }).then(function() {
            return ambariAlerts.then(function(alerts) {
                console.log('Number of Ambari alerts: ' + alerts.length);
                return alerts.length > 1;
            }, function(err) {
                return false;
            });
        });
    }},
    createPolicy:                       { value: function () {
        var EC = protractor.ExpectedConditions;
        var createPolicyButton = element(by.css('a#create-policy-collapse-btn'));
        var closePolicyButton = element(by.css('a#create-policy-collapse-btn[aria-expanded="true"]'));

        return browser.driver.wait(EC.elementToBeClickable(createPolicyButton), 10000, 'Create Scaling Policy button is NOT click able!').then(function() {
            return createPolicyButton.click();
        }).then(function() {
            return browser.driver.wait(EC.elementToBeClickable(closePolicyButton), 10000,'Create Scaling Policy button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(createPolicyButton).perform();
            });
        });
    }},
    isScalingHostgroupsAvailable:       { value: function () {
        var EC = protractor.ExpectedConditions;
        var hostGroupSelect = element(by.css('select#policyHostGroup'));
        var clusterHostGroups = element.all(by.repeater('hostGroup in activeClusterBlueprint.ambariBlueprint.host_groups'));

        return browser.driver.wait(EC.visibilityOf(hostGroupSelect), 5000, 'Cluster Hostgroups drop-down is NOT available!').then(function() {
            return hostGroupSelect.isDisplayed().then(function(isDisplayed) {
                return isDisplayed;
            }, function(err) {
                return false;
            });
        }).then(function() {
            return clusterHostGroups.then(function(hostGroups) {
                console.log('Number of Hostgroups alerts: ' + hostGroups.length);
                return hostGroups.length > 1;
            }, function(err) {
                return false;
            });
        });
    }},
    expandNodes:                        { value: function () {
        var EC = protractor.ExpectedConditions;
        var expandNodesButton = element(by.cssContainingText('a', 'Nodes'));
        var publicIP = element.all(by.css('table#metadataTable tr>td[data-title="\'public IP\'"]')).first();

        return browser.driver.wait(EC.elementToBeClickable(expandNodesButton), 10000, 'Expand Nodes button is NOT click able!').then(function() {
            return expandNodesButton.click();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(publicIP), 10000,'Expand Nodes button has NOT clicked at 1st!').then(function() {

            }, function(err) {
                return browser.driver.actions().click(expandNodesButton).perform();
            });
        });
    }},
    getPublicIPs:                      { value: function () {
        var EC = protractor.ExpectedConditions;
        var publicIP = element.all(by.css('table#metadataTable tr>td[data-title="\'public IP\'"]')).first();

        return browser.driver.wait(EC.visibilityOf(publicIP), 10000, 'Public IPs are NOT visible!').then(function() {
            return publicIP.isDisplayed().then(function (displayed) {
                return displayed;
            });
        }).then(function() {
            return element.all(by.css('table#metadataTable tr>td[data-title="\'public IP\'"]')).map(function (publicIPs) {
                return publicIPs.getText().then(function (text) {
                    return text;
                });
            });
        });
    }},
    getPrivateIPs:                     { value: function () {
        var EC = protractor.ExpectedConditions;
        var privateIP = element.all(by.css('table#metadataTable tr>td[data-title="\'private IP\'"]')).first();

        return browser.driver.wait(EC.visibilityOf(privateIP), 10000, 'Private IPs are NOT visible!').then(function() {
            return privateIP.isDisplayed().then(function (displayed) {
                return displayed;
            });
        }).then(function() {
            return element.all(by.css('table#metadataTable tr>td[data-title="\'private IP\'"]')).map(function (privateIPs) {
                return privateIPs.getText().then(function (text) {
                    return text;
                });
            });
        });
    }},
    getNodeCountValue:                 { value: function () {
        var EC = protractor.ExpectedConditions;
        var numberOfNodes = element(by.css('p#sl_nodeCount'));

        return browser.driver.wait(EC.visibilityOf(numberOfNodes), 10000, 'Number Of Nodes is NOT visible!').then(function() {
            return numberOfNodes.isDisplayed().then(function (displayed) {
                return displayed;
            });
        }).then(function() {
            return numberOfNodes.getText().then(function (text) {
                return text;
            });
        });
    }},
    getAllPublicIPs:                   { value: function () {
        this.expandNodes();
        return this.getPublicIPs();
    }},
    getAllPrivateIPs:                  { value: function () {
        this.expandNodes();
        return this.getPrivateIPs();
    }},
    createNewAWSCluster:               { value: function (clusterName, regionName, networkName, securityGroup, blueprintName, recipeName) {
        this.typeName(clusterName);
        this.selectRegion(regionName);
        this.clickSetupNetworkSecurity();

        this.selectNetwork(networkName);
        this.clickChooseBlueprint();

        this.selectBlueprint(blueprintName);
        this.selectSecurityGroup(securityGroup);
        this.selectAmbariServer();
        this.selectRecipe(recipeName);
        this.clickReviewAndLaunch();
        this.LaunchCluster();
    }},
    createNewOpenStackCluster:         { value: function (clusterName, regionName, zoneName, networkName, securityGroup, blueprintName, recipeName) {
        this.typeName(clusterName);
        this.selectRegion(regionName);
        this.selectAvailabilityZone(zoneName);
        this.clickSetupNetworkSecurity();

        this.selectNetwork(networkName);
        this.clickChooseBlueprint();

        this.selectBlueprint(blueprintName);
        this.selectSecurityGroup(securityGroup);
        this.selectAmbariServer();
        this.selectRecipe(recipeName);
        this.clickReviewAndLaunch();
        this.LaunchCluster();
    }}
});
module.exports = ClusterModule;