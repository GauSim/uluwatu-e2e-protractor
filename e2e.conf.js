require('jasmine-reporters');
require('jasmine-spec-reporter');
require('protractor-jasmine2-html-reporter');
require('jasmine-allure-reporter');
require('protractor-console');

/**
 * Base configurations for the Uluwatu E2E Protractor tests.
 *
 * @type {{seleniumAddress: string, capabilities: {browserName: string}, specs: string[], framework: string, jasmineNodeOpts: {onComplete: null, showColors: boolean, includeStackTrace: boolean, isVerbose: boolean, defaultTimeoutInterval: number}, baseUrl: *, onPrepare: exports.config.onPrepare}}
 */
exports.config = {
    params: {
        nameTag: process.env.ENVIRONMENT + process.env.TARGET_CBD_VERSION.replace(/\./g,'')
    },
    plugins: [{
        path: 'node_modules/protractor-console',
        package: 'protractor-console',
        logLevels: ['severe']
    }],
    // The address of the running selenium server. In case of direct connection this is not needed.
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    // Protractor starts directly Chrome or Firefox. Do not need to start the WebDriver. This could be very useful in development pahse.
    directConnect: true,
    // Capabilities to be passed to the WebDriverJS instance.
    capabilities: {
        'browserName': (process.env.BROWSER || 'firefox'),
        'chromeOptions': {
            'args': [
               '--no-sandbox',
               '--disable-web-security'
            ]
        },
        // this takes seconds
        idleTimeout: 120,
        locationContextEnabled: true,
        javascriptEnabled: true,
        acceptSslCerts: true,
        trustAllSSLCertificates: true,
        ignoreUncaughtExceptions: true,
        handlesAlerts: true,
        loggingPrefs: { browser: 'SEVERE', driver: 'ALL' }
    },

    /**
     * Specify the name of the specs files.
     * Note: The spec patterns are relative to the root directory (app parent dir)!
     */
    specs: [
        //'utils/slowdown.conf.js',
        'tests/LoginSpec.js',
        'tests/blueprints/AWSBlueprintSpec.js',
        'tests/blueprints/OSBlueprintSpec.js',
        'tests/credentials/AWSCredentialSpec.js',
        'tests/credentials/OSCredentialSpec.js',
        'tests/templates/OSTemplateSpec.js',
        'tests/networks/OSNetworkSpec.js',
        'tests/recipes/SampleRecipeSpec.js',
        'tests/clusters/AWSClusterSpec.js',
        'tests/clusters/OSClusterSpec.js',
        'tests/Teardown.js'
    ],

    /**
     * Define suits with the name of the Spec patterns.
     * Note: The spec patterns are relative to this directory (where the configuration file is)!
     */
    suites: {
        prod: [
            'tests/LoginSpec.js',
            'tests/blueprints/AWSBlueprintSpec.js',
            'tests/credentials/AWSCredentialSpec.js',
            'tests/recipes/SampleRecipeSpec.js',
            'tests/clusters/AWSClusterSpec.js',
            'tests/Teardown.js'
        ],
        smoke: [
            'tests/LoginSpec.js',
            'tests/blueprints/AWSBlueprintSpec.js',
            'tests/blueprints/OSBlueprintSpec.js',
            'tests/credentials/AWSCredentialSpec.js',
            'tests/credentials/OSCredentialSpec.js',
            'tests/templates/OSTemplateSpec.js',
            'tests/networks/OSNetworkSpec.js',
            'tests/recipes/SampleRecipeSpec.js',
            'tests/Teardown.js'
        ],
        regression: [
            'tests/LoginSpec.js',
            'tests/blueprints/AWSBlueprintSpec.js',
            'tests/blueprints/OSBlueprintSpec.js',
            'tests/credentials/AWSCredentialSpec.js',
            'tests/credentials/OSCredentialSpec.js',
            'tests/templates/OSTemplateSpec.js',
            'tests/networks/OSNetworkSpec.js',
            'tests/recipes/SampleRecipeSpec.js',
            'tests/clusters/AWSClusterSpec.js',
            'tests/clusters/OSClusterSpec.js',
            'tests/Teardown.js'
        ]
    },

    /**
     * Jasmine is a behavior-driven development framework for testing JavaScript code.
     * It does not depend on any other JavaScript frameworks.
     */
    framework: 'jasmine2',
    allScriptsTimeout: 60000,
    getPageTimeout: 60000,
    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        onComplete: null,
        // Print colors to the terminal.
        showColors: true,
        //invertGrep: false,
        // print: function() {},
        includeStackTrace: true,
        isVerbose: true,
        // Default waiting time in ms before test fails.
        defaultTimeoutInterval: 60000
    },

    /**
     * Base URL for the Cloudbreak.
     * BASE_URL is environment variable.
     */
    baseUrl: process.env.BASE_URL,

    onPrepare: function() {
        var currentURL;

        console.log("The Base URL is: " + process.env.BASE_URL);
        console.log("The Username is: " + process.env.USERNAME);
        console.log("The Password is: " + process.env.PASSWORD);
        console.log("The SSH Key is: " + process.env.SSHKEY);
        console.log("The Test Suite: " + process.env.TEST_SUITE);

        // WebDriver general settings for browsers.
        browser.driver.manage().deleteAllCookies();
        // https://github.com/angular/protractor/issues/1467
        browser.driver.manage().window().setSize(1280, 1024);
        //browser.driver.manage().window().maximize();
        browser.driver.manage().timeouts().implicitlyWait(20000);
        browser.driver.manage().timeouts().pageLoadTimeout(60000);

        browser.getCapabilities().then(function (browserCapabilities) {
            console.log("Browser name is: " + browserCapabilities.get('browserName'));
            console.log("Browser version is: " + browserCapabilities.get('version'));
            console.log("Browser version is: " + browserCapabilities.get('platform'));
        });

        /**
         * Open the base URL that defined above.
         * OR
         * You can use parameter 'browser.params.baseUrl' with 'protractor e2e.conf.js --params.baseUrl=https://qa-accounts.sequenceiq.com/'.
         */
        browser.driver.get(browser.baseUrl);
        // Login to the Cloudbreak then check the redirected URL.
        browser.driver.findElement(by.id('email')).sendKeys(process.env.USERNAME);
        browser.driver.findElement(by.id('password')).sendKeys(process.env.PASSWORD);
        browser.driver.findElement(by.id('login-btn')).click().then(function() {
            return browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    currentURL = url;
                    return /dashboard/g.test(url) || /confirm/g.test(url) || /#/g.test(url);
                });
            }, 60000).then(function() {
                console.log(currentURL);
                var pageName = currentURL.split("/").pop();

                switch (pageName) {
                    case 'dashboard':
                        browser.driver.findElement(by.id('login-btn')).click().then(function() {
                            return browser.driver.wait(function() {
                                return browser.driver.getCurrentUrl().then(function(url) {
                                    return /#/.test(url);
                                });
                            }, 20000);
                        });
                        break;
                    case 'confirm':
                        browser.driver.findElement(by.id('confirm-yes')).click().then(function() {
                            return browser.driver.wait(function() {
                                return browser.driver.getCurrentUrl().then(function(url) {
                                    return /#/.test(url);
                                });
                            }, 20000);
                        });
                        break;
                    default:
                        return browser.driver.wait(function() {
                            return browser.driver.getCurrentUrl().then(function(url) {
                                return /#/.test(url);
                            });
                        }, 20000);
                        break;
                }
            });
        });

        // Waiting for Angular on the Cloudbreak Dashboard page.
        browser.waitForAngular();
        // It genereates JUnit XML report for test run.
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            savePath: './test-results/jasmine-reports',
            filePrefix: 'junitReport',
            consolidateAll:true
        }));
        // Format the Console test result report.
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'spec'}));
        // It generates HTML reports for the test run. In case of failure these save screenshot about the related page.
        var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
        jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
            savePath: './test-results/jasmine-reports/',
            screenshotsFolder: 'screenshots',
            filePrefix: 'htmlReport',
            takeScreenshots: true,
            takeScreenshotsOnlyOnFailures: true
        }));

        // It generates the Jasmine Allure Reports https://www.npmjs.com/package/jasmine-allure-reporter
        var AllureReporter = require('jasmine-allure-reporter');
        jasmine.getEnv().addReporter(new AllureReporter());
        jasmine.getEnv().afterEach(function(done){
            browser.takeScreenshot().then(function(png) {
                allure.createAttachment('Screenshot', function () {
                    return new Buffer(png, 'base64')
                }, 'image/png')();
                done();
            })
        });
    }
};