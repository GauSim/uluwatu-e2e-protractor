'use strict';

var TemplateModule = function () {
    browser.waitForAngular();
    browser.driver.wait(function() {
        return browser.driver.findElement(by.id('panel-templates-collapse')).isDisplayed().then(function(displayed) {
            return displayed;
        });
    }, 5000);
};

TemplateModule.prototype = Object.create({}, {
    providerTabSelector:               { get: function () {      return element(by.css('div#panel-create-templates-collapse div#providerSelector2'));}},
    // Tab pages
    awsTab:                            { get: function () {      return this.providerTabSelector.element(by.css('a#awsTemplateChange'));             }},
    azureTab:                          { get: function () {      return this.providerTabSelector.element(by.css('a#azureTemplateChange'));           }},
    gcpTab:                            { get: function () {      return this.providerTabSelector.element(by.css('a#gcpTemplateChange'));             }},
    openstackTab:                      { get: function () {      return this.providerTabSelector.element(by.css('a#openstackTemplateChange'));       }},
    // AWS template pane
    awstemplateForm:                   { get: function () {      return element(by.css('form[name=awsTemplateForm]'));                               }},
    awsnameBox:                        { get: function () {      return this.awstemplateForm.element(by.css('input#aws_tclusterName'));              }},
    awsdescriptionBox:                 { get: function () {      return this.awstemplateForm.element(by.css('input#aws_tdescription'));              }},
    awsattachedBox:                    { get: function () {      return this.awstemplateForm.element(by.css('input#aws_tvolumecount'));              }},
    awssizeBox:                        { get: function () {      return this.awstemplateForm.element(by.css('input#aws_tvolumesize'));               }},
    awsspotBox:                        { get: function () {      return this.awstemplateForm.element(by.css('input#aws_tspotprice'));                }},
    awscreateButton:                   { get: function () {      return this.awstemplateForm.element(by.css('a#createAwsTemplate'));                 }},
    // Azure template pane
    azuretemplateForm:                 { get: function () {      return element(by.css('form[name=azureTemplateForm]'));                             }},
    azurenameBox:                      { get: function () {      return this.azuretemplateForm.element(by.css('input#azure_tclusterName'));          }},
    azuredescriptionBox:               { get: function () {      return this.azuretemplateForm.element(by.css('input#azure_tdescription'));          }},
    azureattachedBox:                  { get: function () {      return this.azuretemplateForm.element(by.css('input#azure_tvolumescount'));         }},
    azuresizeBox:                      { get: function () {      return this.azuretemplateForm.element(by.css('input#azure_tvolumesize'));           }},
    azurecreateButton:                 { get: function () {      return  this.azuretemplateForm.element(by.css('a#createAzureTemplate'));            }},
    // GCP template pane
    gcptemplateForm:                   { get: function () {      return element(by.css('form[name=gcpTemplateForm]'));                               }},
    gcpnameBox:                        { get: function () {      return this.gcptemplateForm.element(by.css('input#gcp_tclusterName'));              }},
    gcpdescriptionBox:                 { get: function () {      return this.gcptemplateForm.element(by.css('input#gcp_tdescription'));              }},
    gcpattachedBox:                    { get: function () {      return this.gcptemplateForm.element(by.css('input#gcp_tvolumecount'));              }},
    gcpsizeBox:                        { get: function () {      return this.gcptemplateForm.element(by.css('input#gcp_tvolumesize'));               }},
    gcpcreateButton:                   { get: function () {      return  this.gcptemplateForm.element(by.css('a#createGcpTemplate'));                }},
    // OpenStack
    openstacktemplateForm:             { get: function () {      return element(by.css('form[name=openstackTemplateForm]'));                         }},
    openstacknameBox:                  { get: function () {      return this.openstacktemplateForm.element(by.css('input#openstack_tclusterName'));  }},
    openstackdescriptionBox:           { get: function () {      return this.openstacktemplateForm.element(by.css('input#openstack_tdescription'));  }},
    openstackinstanceBox:              { get: function () {      return this.openstacktemplateForm.element(by.css('input#openstack_tinstancetype')); }},
    openstackattachedBox:              { get: function () {      return this.openstacktemplateForm.element(by.css('input#openstack_tvolumecount'));  }},
    openstacksizeBox:                  { get: function () {      return this.openstacktemplateForm.element(by.css('input#openstack_tvolumesize'));   }},
    openstackcreateButton:             { get: function () {      return  this.openstacktemplateForm.element(by.css('a#createopenstackTemplate'));    }},

    openCreatePanel:                   { value: function () {
        var EC = protractor.ExpectedConditions;
        var createButton = element(by.cssContainingText('a#panel-create-templates-collapse-btn', 'create template'));
        var closeButton = element(by.cssContainingText('a#panel-create-templates-collapse-btn[aria-expanded="true"]', 'create template'));

        // We need to fix the GUI here. Something goes wrong with Angular here.
        return browser.driver.wait(EC.elementToBeClickable(createButton), 5000, 'Create button is NOT click able!').then(function() {
        //    console.log('Create button is clicked 1st!');
            return browser.driver.actions().doubleClick(createButton).perform();
        }).then(function() {
            return browser.driver.wait(EC.elementToBeClickable(closeButton), 5000, 'Create button has NOT clicked at 1st!').then(function() {
            //    console.log('Create button has already clicked at 1st!');
            }, function(err) {
            //    console.log('Create button is clicked 2nd!');
                return browser.driver.actions().click(createButton).perform();
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
        }
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
        }
    }},
    setInstanceType:                   { value: function (provider, key) {
        switch (provider) {
            case 'AWS':
                return this.awstemplateForm.element(by.cssContainingText('select#aws_tinstanceType option', key)).click();
                break;
            case 'Azure':
                return this.azuretemplateForm.element(by.cssContainingText('select#azure_tvmType option', key)).click();
                break;
            case 'GCP':
                return this.gcptemplateForm.element(by.cssContainingText('select#gcp_tinstanceType option', key)).click();
                break;
            case 'OpenStack':
                return this.openstackinstanceBox.sendKeys(key);
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        }
    }},
    setVolumeType:                     { value: function (provider, key) {
        switch (provider) {
            case 'AWS':
                return this.awstemplateForm.element(by.cssContainingText('select#aws_tvolumetype option', key)).click();
                break;
            case 'Azure':
                return this.azuretemplateForm.element(by.cssContainingText('select#azure_tvolumetype option', key)).click();
                break;
            case 'GCP':
                return this.gcptemplateForm.element(by.cssContainingText('select#gcp_tvolumetype option', key)).click();
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        }
    }},
    setAttachedVolume:                 { value: function (provider, volume) {
        var EC = protractor.ExpectedConditions;

        switch (provider) {
            case 'AWS':
                this.awsattachedBox.clear();
                return this.awsattachedBox.sendKeys(volume);
                break;
            case 'Azure':
                this.azureattachedBox.clear();
                return this.azureattachedBox.sendKeys(volume);
                break;
            case 'GCP':
                this.gcpattachedBox.clear();
                return this.gcpattachedBox.sendKeys(volume);
                break;
            case 'OpenStack':
                var attachedVolumeBox = this.openstackattachedBox;
                return browser.driver.wait(EC.elementToBeClickable(attachedVolumeBox), 5000, 'OpenStack Attached Volume inputs are NOT visible').then(function() {
                    return attachedVolumeBox.clear().then(function() {
                        return attachedVolumeBox.sendKeys(volume);
                    });
                });
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        }
    }},
    setVolumeSize:                     { value: function (provider, size) {
        var EC = protractor.ExpectedConditions;

        switch (provider) {
            case 'AWS':
                this.awssizeBox.clear();
                return this.awssizeBox.sendKeys(size);
                break;
            case 'Azure':
                this.azuresizeBox.clear();
                return this.azuresizeBox.sendKeys(size);
                break;
            case 'GCP':
                this.gcpsizeBox.clear();
                return this.gcpsizeBox.sendKeys(size);
                break;
            case 'OpenStack':
                var attachedVolumeSizeBox = this.openstacksizeBox;

                return browser.driver.wait(EC.elementToBeClickable(attachedVolumeSizeBox), 5000, 'OpenStack Attached Volume Size inputs are NOT visible').then(function() {
                    return attachedVolumeSizeBox.clear().then(function() {
                        return attachedVolumeSizeBox.sendKeys(size);
                    });
                });
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        }
    }},
    setSpotPrice:                      { value: function (price) {
        this.awsspotBox.clear();
        return this.awsspotBox.sendKeys(price);
    }},
    clickCreateTemplate:               { value: function (provider, newName) {
        var notificationBar = element(by.css('input#notification-n-filtering'));

        switch (provider) {
            case 'AWS':
                this.awscreateButton.click().then(function() {
                    browser.waitForAngular();
                    var EC = protractor.ExpectedConditions;
                    var newTemplate = element(by.cssContainingText('div>h5>a', newName));

                    return browser.driver.wait(EC.visibilityOf(newTemplate), 20000, 'The ' + newName + ' template has NOT created!').then(function() {
                        return newTemplate.isDisplayed().then(function(isDisplayed) {
                            notificationBar.getAttribute('value').then(function(message){
                                console.log(message);
                            });
                            return isDisplayed;
                        }, function(err) {
                            return false;
                        });
                    }, function(err) {
                        console.log('The ' + newName + ' template has NOT created!');
                        return err;
                    });
                });
                break;
            case 'Azure':
                this.azurecreateButton.click().then(function() {
                    browser.waitForAngular();
                    var EC = protractor.ExpectedConditions;
                    var newTemplate = element(by.cssContainingText('div>h5>a', newName));

                    return browser.driver.wait(EC.visibilityOf(newTemplate), 20000, 'The ' + newName + ' template has NOT created!').then(function() {
                        return newTemplate.isDisplayed().then(function(isDisplayed) {
                            notificationBar.getAttribute('value').then(function(message){
                                console.log(message);
                            });
                            return isDisplayed;
                        }, function(err) {
                            return false;
                        });
                    }, function(err) {
                        console.log('The ' + newName + ' template has NOT created!');
                        return err;
                    });
                });
                break;
            case 'GCP':
                this.gcpcreateButton.click().then(function() {
                    browser.waitForAngular();
                    var EC = protractor.ExpectedConditions;
                    var newTemplate = element(by.cssContainingText('div>h5>a', newName));

                    return browser.driver.wait(EC.visibilityOf(newTemplate), 20000, 'The ' + newName + ' template has NOT created!').then(function() {
                        return newTemplate.isDisplayed().then(function(isDisplayed) {
                            notificationBar.getAttribute('value').then(function(message){
                                console.log(message);
                            });
                            return isDisplayed;
                        }, function(err) {
                            return false;
                        });
                    }, function(err) {
                        console.log('The ' + newName + ' template has NOT created!');
                        return err;
                    });
                });
                break;
            case 'OpenStack':
                this.openstackcreateButton.click().then(function() {
                    browser.waitForAngular();
                    var EC = protractor.ExpectedConditions;
                    var newTemplate = element(by.cssContainingText('div>h5>a', newName));

                    return browser.driver.wait(EC.visibilityOf(newTemplate), 20000, 'The ' + newName + ' template has NOT created!').then(function() {
                        return newTemplate.isDisplayed().then(function(isDisplayed) {
                            notificationBar.getAttribute('value').then(function(message){
                                console.log(message);
                            });
                            return isDisplayed;
                        }, function(err) {
                            return false;
                        });
                    }, function(err) {
                        console.log('The ' + newName + ' template has NOT created!');
                        return err;
                    });
                });
                break;
            default:
                return this.throwError('Provider is not valid!');
                break;
        }
    }},
    deleteTemplate:                    { value: function (name) {
        var notificationBar = element(by.css('input#notification-n-filtering'));

        return element(by.cssContainingText('div>h5>a', name)).isDisplayed().then(function() {
            var templateLink = element(by.cssContainingText('div>h5>a', name));
            templateLink.click();
            browser.waitForAngular();

            var selectedTemplatePanel = element(by.css('div[id^="panel-template-collapse"][aria-expanded="true"]'));

            return selectedTemplatePanel.element(by.css('a[ng-click="deleteTemplate(template)"]')).click().then(function () {
                browser.waitForAngular();
                var EC = protractor.ExpectedConditions;
                var templateNotPresent = EC.stalenessOf(templateLink);
                return browser.driver.wait(templateNotPresent, 5000, 'The ' + name + ' template has NOT been deleted!').then(function() {
                    return notificationBar.getAttribute('value').then(function(message){
                        console.log(message);
                        return /deleted successfully/g.test(message);
                    });
                }, function(err) {
                    return false;
                });
            });
        }, function(err) {
            console.log('The template with ' + name + ' name is not present!');
            return true;
        });
    }},
    createAWSTemplate:                 { value: function (name, description, instanceType, volumeType, attachedVolumes, volumeSize, spotPrice) {
        this.openCreatePanel();
        this.awsTab.click();
        this.typeName('AWS', name);
        this.typeDescription('AWS', description);
        this.setInstanceType('AWS', instanceType);
        this.setVolumeType('AWS', volumeType);
        this.setAttachedVolume('AWS', attachedVolumes);
        this.setVolumeSize('AWS', volumeSize);
        this.setSpotPrice(spotPrice);
        this.clickCreateTemplate('AWS', name);
        browser.waitForAngular();
    }},
    createAzureTemplate:               { value: function (name, description, instanceType, volumeType, attachedVolumes, volumeSize) {
        this.openCreatePanel();
        this.azureTab.click();
        this.typeName('Azure', name);
        this.typeDescription('Azure', description);
        this.setInstanceType('Azure', instanceType);
        this.setVolumeType('Azure', volumeType);
        this.setAttachedVolume('Azure', attachedVolumes);
        this.setVolumeSize('Azure', volumeSize);
        this.clickCreateTemplate('Azure', name);
        browser.waitForAngular();
    }},
    createGCPTemplate:                 { value: function (name, description, instanceType, volumeType, attachedVolumes, volumeSize) {
        this.openCreatePanel();
        this.gcpTab.click();
        this.typeName('GCP', name);
        this.typeDescription('GCP', description);
        this.setInstanceType('GCP', instanceType);
        this.setVolumeType('GCP', volumeType);
        this.setAttachedVolume('GCP', attachedVolumes);
        this.setVolumeSize('GCP', volumeSize);
        this.clickCreateTemplate('GCP', name);
        browser.waitForAngular();
    }},
    createOpenStackTemplate:           { value: function (name, description, instanceType, attachedVolumes, volumeSize) {
        this.openCreatePanel();
        this.openstackTab.click();
        this.typeName('OpenStack', name);
        this.typeDescription('OpenStack', description);
        this.setInstanceType('OpenStack', instanceType);
        this.setAttachedVolume('OpenStack', attachedVolumes);
        if (attachedVolumes != 0) {
            this.setVolumeSize('OpenStack', volumeSize);
        }
        this.clickCreateTemplate('OpenStack', name);
        browser.waitForAngular();
    }},
    getTemplateID:                     { value: function (name) {
        return browser.element(by.cssContainingText('div>h5>a', name)).getAttribute('data-target');
    }},
    isDefaultTemplateAvailable:        { value: function () {
        var templateList = element(by.css('div#templete-list-accordion'));
        return templateList.$$(by.css('i.fa.fa-users.fa-lg.public-account-info.pull-right')).count > 1;
    }}
});
module.exports = TemplateModule;