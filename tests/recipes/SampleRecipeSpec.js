'use strict';

var DashboardPage = require('../../pages/DashboardPage.js');

describe('Testing sample recipe creation', function () {
    var dashboardPage;
    var newName = 'autotest-sample-' + browser.params.nameTag;
    var newDescription = 'autotest';

    describe('with ' + newName + ' recipe', function () {
        dashboardPage = new DashboardPage();
        var defaultRecipes = 0;
        var newPre = '#!/bin/bash\ntouch /pre-install\necho "Hello Pre-Install" >> /pre-install';
        var newPost = '#!/bin/bash\ntouch /post-install\necho "Hello Post-Install" >> /post-install';

        beforeAll(function () {
            console.log('Sample recipe creation test setup has started!');
            dashboardPage.deleteRecipe('autotest-sample-');
            dashboardPage.getBadgeValue(5).then(function (value) {
                defaultRecipes = value;
            });
        });

        it('Create new recipe', function () {
            dashboardPage.createRecipe(newName, newDescription, newPre, newPost);
            dashboardPage.getBadgeValue(5).then(function (value) {
                expect(value).toBeGreaterThan(defaultRecipes);
            });
        });
    });
});