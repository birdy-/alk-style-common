'use strict';

var HomePage = require('../pages/home.page.js');
var Utils = require('../utils/utils.js');

describe('[Logout]', function() {
    browser.driver.manage().window().maximize();
    var homePage = new HomePage();
    var utils = new Utils();

    it('should log out', function() {
        homePage.get()

        homePage.getLogoutButton().click().then(function () {
            expect(browser.getCurrentUrl())
            .toEqual(browser.params.website.url);
        });
    });
});
