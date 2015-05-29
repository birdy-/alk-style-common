'use strict';

var HomePage = require('../pages/home.page.js');
var LoginPage = require('../pages/login.page.js');
var OrganizationAdminPage = require('../pages/organization-admin.page.js');
var Utils = require('../utils/utils.js');

describe('[Organization Admin] Home page', function () {
    browser.driver.manage().window().maximize();

    var homePage = new HomePage();
    var loginPage = new LoginPage();
    var organizationAdminPage = new OrganizationAdminPage();
    var utils = new Utils();

    it('should log in as admin', function () {
        loginPage.get();

        loginPage.fillLoginFields(browser.params.admin.username, browser.params.admin.password).then(function() {
            loginPage.getLoginButton().click().then(function() {
                expect(browser.getCurrentUrl())
                .toEqual(browser.params.website.url + 'maker/activity');
            });
        });
    });

    it('should have the correct url', function () {
        organizationAdminPage.get();

        expect(browser.getCurrentUrl())
        .toEqual(browser.params.website.url + 'organization/7/admin/home');
    });

    it('should have a segment list', function () {
        expect(organizationAdminPage.getSegments().count())
        .toBeGreaterThan(3);
    });

});
