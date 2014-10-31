'use strict';

var HomePage = require('../pages/home.page.js');
var LoginPage = require('../pages/login.page.js');
var Utils = require('../utils/utils.js');

describe('[Login page]', function() {
    var homePage = new HomePage();
    var loginPage = new LoginPage();
    var utils = new Utils();

    it('should be accessible from home page', function() {
        homePage.getLoginPageButton().click().then(function() {
            expect(browser.getCurrentUrl())
            .toEqual(browser.params.website.url + 'login');
        });
    });

    it('should be accessible by url', function() {
        loginPage.get();
        expect(browser.getCurrentUrl())
        .toEqual(browser.params.website.url + 'login');
    });

    it('should have login fields', function() {
        expect(loginPage.getLoginField().isPresent())
        .toBe(true);

        expect(loginPage.getPasswordField().isPresent())
        .toBe(true);
    });

    it('should log in with correct identifiers', function() {
        loginPage.fillLoginFields(browser.params.user.username, browser.params.user.password).then(function() {
            loginPage.getLoginButton().click().then(function() {
                expect(browser.getCurrentUrl())
                .toEqual(browser.params.website.url + 'prehome');
            });
        });
    });
});
