/**
 * Created by aszegedi on 1/14/16.
 *
 * Page Objects for the Manage Credentials pane on the Cloudbreak Dashboard.
 */

'use strict';

var CredentialModule = function () {
    browser.waitForAngular();
    browser.driver.wait(function() {
        return browser.driver.findElement(by.id('panel-credentials-collapse')).isDisplayed().then(function(displayed) {
            return displayed;
        });
    }, 5000);
};

CredentialModule.prototype = Object.create({}, {
    providerTabSelector:               { get: function () {      return element(by.css('div#providerSelector1'));                                                   }},
    // Tab pages
    awsTab:                            { get: function () {      return this.providerTabSelector.element(by.css('a#awsChange'));                                    }},
    azureTab:                          { get: function () {      return this.providerTabSelector.element(by.css('a#azureRmChange'));                                }},
    gcpTab:                            { get: function () {      return this.providerTabSelector.element(by.css('a#gcpChange'));                                    }},
    openstackTab:                      { get: function () {      return this.providerTabSelector.element(by.css('a#openstackChange'));                              }},
    // AWS credential pane
    awscredentialForm:                 { get: function () {      return element(by.css('form[name=awsCredentialForm]'));                                            }},
    awsnameBox:                        { get: function () {      return this.awscredentialForm.element(by.css('input#awscname'));                                   }},
    awsdescriptionBox:                 { get: function () {      return this.awscredentialForm.element(by.css('input#awscdescription'));                            }},
    awsiamroleBox:                     { get: function () {      return this.awscredentialForm.element(by.css('input#croleArn'));                                   }},
    awssshBox:                         { get: function () {      return this.awscredentialForm.element(by.css('textarea#aws_sshPublicKey'));                        }},
    awscreateButton:                   { get: function () {      return this.awscredentialForm.element(by.css('a#createAwsCredential'));                            }},
    // Azure credential pane
    azurecredentialForm:               { get: function () {      return element(by.css('form[name=azureRmCredentialForm]'));                                        }},
    azurenameBox:                      { get: function () {      return this.azurecredentialForm.element(by.css('form[name=azureRmCredentialForm] input#cname'));   }},
    azuredescriptionBox:               { get: function () {      return this.azurecredentialForm.element(by.css('input#cdescription'));                             }},
    azuresubscriptionBox:              { get: function () {      return this.azurecredentialForm.element(by.css('input[id*=subscriptionId]'));                      }},
    azureappBox:                       { get: function () {      return this.azurecredentialForm.element(by.css('input[id*=accesKey]'));                            }},
    azurepasswordBox:                  { get: function () {      return this.azurecredentialForm.element(by.css('input[id*=secretKey]'));                           }},
    azuretenantBox:                    { get: function () {      return this.azurecredentialForm.element(by.css('input[id*=tenantId]'));                            }},
    azuresshBox:                       { get: function () {      return this.azurecredentialForm.element(by.css('textarea#azure_sshPublicKey'));                    }},
    azurecreateButton:                 { get: function () {      return  this.azurecredentialForm.element(by.css('a#createAzureRmCredential'));                     }},
    // GCP credential pane
    gcpcredentialForm:                 { get: function () {      return element(by.css('form[name=gcpCredentialForm]'));                                            }},
    gcpnameBox:                        { get: function () {      return this.gcpcredentialForm.element(by.css('input#gcpcname'));                                   }},
    gcpdescriptionBox:                 { get: function () {      return this.gcpcredentialForm.element(by.css('input#gcpcdescription'));                            }},
    gcpprojectBox:                     { get: function () {      return this.gcpcredentialForm.element(by.css('input#gcp_tprojectId'));                             }},
    gcpemailBox:                       { get: function () {      return this.gcpcredentialForm.element(by.css('input#gcpcsubscriptionId'));                         }},
    gcpprivatekeyBox:                  { get: function () {      return this.gcpcredentialForm.element(by.css('input.ng-isolate-scope'));                           }},
    gcpsshBox:                         { get: function () {      return this.gcpcredentialForm.element(by.css('textarea#gcp_sshPublicKey'));                        }},
    gcpcreateButton:                   { get: function () {      return this.gcpcredentialForm.element(by.css('a#createGcpCredential'));                            }},
    // OpenStack
    openstackcredentialForm:           { get: function () {      return element(by.css('form[name=openstackCredentialForm]'));                                      }},
    openstacknameBox:                  { get: function () {      return this.openstackcredentialForm.element(by.css('input#openstackcname'));                       }},
    openstackdescriptionBox:           { get: function () {      return this.openstackcredentialForm.element(by.css('input#openstackcdescription'));                }},
    openstackuserBox:                  { get: function () {      return this.openstackcredentialForm.element(by.css('input#ouser'));                                }},
    openstackpasswordBox:              { get: function () {      return this.openstackcredentialForm.element(by.css('input#opassword'));                            }},
    openstacktenantBox:                { get: function () {      return this.openstackcredentialForm.element(by.css('input#otenantName'));                          }},
    openstackendpointBox:              { get: function () {      return this.openstackcredentialForm.element(by.css('input#oendpoint'));                            }},
    openstacksshBox:                   { get: function () {      return this.openstackcredentialForm.element(by.css('textarea#openstack_sshPublicKey'));            }},
    openstackcreateButton:             { get: function () {      return this.openstackcredentialForm.element(by.css('a#createopenstackCredential'));                }},

    openCreatePanel:                   { value: function () {
        var EC = protractor.ExpectedConditions;
        var createButton = element(by.cssContainingText('a#panel-create-credentials-collapse-btn', 'create credential'));
        var closeButton = element(by.cssContainingText('a#panel-create-credentials-collapse-btn[aria-expanded="true"]', 'create credential'));

        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(createButton), 5000, 'Create button is NOT click able!').then(function() {
            //    console.log('Create button is clicked 1st!');
            return createButton.click().then(function() {
                browser.waitForAngular();
                return browser.driver.wait(EC.elementToBeClickable(element(by.css('a#awsChange'))), 20000, 'Create Credential tab is NOT available!').then(function() {
                    return element(by.css('a#awsChange')).isEnabled();
                });
            });
        }).then(function() {
            return browser.driver.wait(EC.elementToBeClickable(closeButton), 5000, 'Create button has NOT clicked at 1st!').then(function() {
                //    console.log('Create button has already clicked at 1st!');
            }, function(err) {
                //    console.log('Create button is clicked 2nd!');
                return browser.driver.actions().click(createButton).perform();
            });
        });
    }},
    selectKeystone:                    { value: function (key) {
        return this.openstackcredentialForm.element(by.cssContainingText('select#keystoneVersion option', key)).click();
    }},
    clickCredentialProviderTab:        { value: function (provider) {
        var EC = protractor.ExpectedConditions;
        var tabPage;
        var credentialForm;

        switch (provider) {
            case 'AWS':
                tabPage = this.awsTab;
                credentialForm = this.awscredentialForm;
                break;
            case 'Azure':
                tabPage = this.azureTab;
                credentialForm = this.azurecredentialForm;
                break;
            case 'GCP':
                tabPage = this.gcpTab;
                credentialForm = this.gcpcredentialForm;
                break;
            case 'OpenStack':
                tabPage = this.openstackTab;
                credentialForm = this.openstackcredentialForm;
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        }

        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(tabPage), 5000, provider +' tab page is NOT click able!').then(function() {
            //console.log('Launch button is clicked 1st!');
            return tabPage.click();
        }).then(function() {
            return browser.driver.wait(EC.visibilityOf(credentialForm), 5000, provider + ' tab has NOT clicked at 1st!').then(function() {
                //console.log('Launch button has already clicked at 1st!');
            }, function(err) {
                //console.log('Launch button is clicked 2nd!');
                return browser.driver.actions().click(tabPage).perform();
            });
        });
    }},
    typeName:                          { value: function (provider, name) {
        switch (provider) {
            case 'AWS':
                return this.awsnameBox.sendKeys(name);
                break;
            case 'Azure':
                return this.azurenameBox.sendKeys(name);
                break;
            case 'GCP':
                return this.gcpnameBox.sendKeys(name);
                break;
            case 'OpenStack':
                return this.openstacknameBox.sendKeys(name);
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        };
    }},
    typeDescription:                   { value: function (provider, description) {
        switch (provider) {
            case 'AWS':
                return this.awsdescriptionBox.sendKeys(description);
                break;
            case 'Azure':
                return this.azuredescriptionBox.sendKeys(description);
                break;
            case 'GCP':
                return this.gcpdescriptionBox.sendKeys(description);
                break;
            case 'OpenStack':
                return this.openstackdescriptionBox.sendKeys(description);
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        };
    }},
    typeSSHKey:                        { value: function (provider, key) {
        switch (provider) {
            case 'AWS':
                return this.awssshBox.sendKeys('ssh-rsa ' + key);
                break;
            case 'Azure':
                return this.azuresshBox.sendKeys('ssh-rsa ' + key);
                break;
            case 'GCP':
                return this.gcpsshBox.sendKeys('ssh-rsa ' + key);
                break;
            case 'OpenStack':
                return this.openstacksshBox.sendKeys('ssh-rsa ' + key);
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        };
    }},
    clickCreateCredential:             { value: function (provider, newName) {
        var notificationBar = element(by.css('input#notification-n-filtering'));

        switch (provider) {
            case 'AWS':
                this.awscreateButton.click().then(function() {
                    browser.waitForAngular();
                    var EC = protractor.ExpectedConditions;
                    var newCredential = element(by.cssContainingText('div>h5>a', newName));

                    return browser.driver.wait(EC.visibilityOf(newCredential), 20000, 'The ' + newName + ' credential has NOT created!').then(function() {
                        return newCredential.isDisplayed().then(function(isDisplayed) {
                            notificationBar.getAttribute('value').then(function(message){
                                console.log(message);
                            });
                            return isDisplayed;
                        }, function(err) {
                            return false;
                        });
                    }, function(err) {
                        console.log('The ' + newName + ' credential has NOT created!');
                        return err;
                    });
                });
                break;
            case 'Azure':
                this.azurecreateButton.click().then(function() {
                    browser.waitForAngular();
                    return browser.driver.wait(function () {
                        return browser.element(by.cssContainingText('div>h5>a', newName)).isDisplayed();
                    }, 20000);
                });
                break;
            case 'GCP':
                this.gcpcreateButton.click().then(function() {
                    browser.waitForAngular();
                    return browser.driver.wait(function () {
                        return browser.element(by.cssContainingText('div>h5>a', newName)).isDisplayed();
                    }, 20000);
                });
                break;
            case 'OpenStack':
                this.openstackcreateButton.click().then(function() {
                    browser.waitForAngular();
                    return browser.driver.wait(function () {
                        return browser.element(by.cssContainingText('div>h5>a', newName)).isDisplayed();
                    }, 20000);
                });
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        };
    }},
    typePassword:                      { value: function (provider, password) {
        switch (provider) {
            case 'Azure':
                return this.azurepasswordBox.sendKeys(password);
                break;
            case 'OpenStack':
                return this.openstackpasswordBox.sendKeys(password);
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        };
    }},
    typeTenantId:                      { value: function (provider, id) {
        switch (provider) {
            case 'Azure':
                return this.azuretenantBox.sendKeys(id);
                break;
            case 'OpenStack':
                return this.openstacktenantBox.sendKeys(id);
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        };
    }},
    typeIAMRole:                       { value: function (role) {
        return this.awsiamroleBox.sendKeys(role);
    }},
    typeSubscriptionId:                { value: function (id) {
        return this.azuresubscriptionBox.sendKeys(id);
    }},
    typeAppId:                         { value: function (id) {
        return this.azureappBox.sendKeys(id);
    }},
    typeProjectId:                     { value: function (id) {
        return this.gcpprojectBox.sendKeys(id);
    }},
    typeEmailAddress:                  { value: function (email) {
        return this.gcpemailBox.sendKeys(email);
    }},
    typeP12Key:                        { value: function (keyPath) {
        return this.gcpprivatekeyBox.sendKeys(keyPath);
    }},
    typeUser:                          { value: function (user) {
        return this.openstackuserBox.sendKeys(user);
    }},
    typeEndpoint:                      { value: function (endpoint) {
        return this.openstackendpointBox.sendKeys(endpoint);
    }},
    selectAPIFacing:                   { value: function (key) {
        return this.openstackcredentialForm.element(by.cssContainingText('select#facing option', key)).click();
    }},
    deleteCredential:                  { value: function (name) {
        var notificationBar = element(by.css('input#notification-n-filtering'));

        return element(by.cssContainingText('div>h5>a', name)).isDisplayed().then(function() {
            var credentialLink = element(by.cssContainingText('div>h5>a', name));
            credentialLink.click();
            browser.waitForAngular();

            var selectedCredentialPanel = element(by.css('div[id^="panel-credential-collapse"][aria-expanded="true"]'));

            return selectedCredentialPanel.element(by.css('a[ng-click="deleteCredential(credential)"]')).click().then(function () {
                browser.waitForAngular();
                var EC = protractor.ExpectedConditions;
                var credentialNotPresent = EC.stalenessOf(credentialLink);
                return browser.driver.wait(credentialNotPresent, 5000, 'The ' + name + ' credential has NOT been deleted!').then(function() {
                    return notificationBar.getAttribute('value').then(function(message){
                        console.log(message);
                        return /deleted successfully/g.test(message);
                    });
                }, function(err) {
                    return false;
                });
            });
        }, function(err) {
            console.log('The credential with ' + name + ' name is not present!');
            return true;
        });
    }},
    createAWSCredential:               { value: function (name, description, iamRole, sshKey) {
        browser.waitForAngular();
        this.openCreatePanel();
        this.clickCredentialProviderTab('AWS');
        this.typeName('AWS', name);
        this.typeDescription('AWS', description);
        this.typeIAMRole(iamRole);
        this.typeSSHKey('AWS', sshKey);
        this.clickCreateCredential('AWS', name);
        browser.waitForAngular();
    }},
    createAzureCredential:             { value: function (name, description, subscriptionID, appID, password, tenantID, sshKey) {
        browser.waitForAngular();
        this.openCreatePanel();
        this.clickCredentialProviderTab('Azure');
        this.typeName('Azure', name);
        this.typeDescription('Azure', description);
        this.typeSubscriptionId(subscriptionID);
        this.typeAppId(appID);
        this.typePassword('Azure', password);
        this.typeTenantId('Azure', tenantID);
        this.typeSSHKey('Azure', sshKey);
        this.clickCreateCredential('Azure', name);
        browser.waitForAngular();
    }},
    createGCPCredential:               { value: function (name, description, projectID, accountEmail, p12KeyPath, sshKey) {
        browser.waitForAngular();
        this.openCreatePanel();
        this.clickCredentialProviderTab('GCP');
        this.typeName('GCP', newName);
        this.typeDescription('GCP', newDescription);
        this.typeProjectId(projectID);
        this.typeEmailAddress(accountEmail);
        this.typeP12Key(p12KeyPath);
        this.typeSSHKey('GCP', sshKey);
        this.clickCreateCredential('GCP', name);
        browser.waitForAngular();
    }},
    createOpenStackCredential:         { value: function (name, description, user, password, tenant, endpoint, apiFacing, sshKey) {
        browser.waitForAngular();
        this.openCreatePanel();
        this.clickCredentialProviderTab('OpenStack');
        this.selectKeystone('v2');
        this.typeName('OpenStack', name);
        this.typeDescription('OpenStack', description);
        this.typeUser(user);
        this.typePassword('OpenStack', password);
        this.typeTenantId('OpenStack', tenant);
        this.typeEndpoint(endpoint);
        this.selectAPIFacing(apiFacing);
        this.typeSSHKey('OpenStack', sshKey);
        this.clickCreateCredential('OpenStack', name);
        browser.waitForAngular();
    }},
    getCredentialID:                   { value: function (name) {
        return browser.element(by.cssContainingText('div>h5>a', name)).getAttribute('data-target');
    }}
});
module.exports = CredentialModule;