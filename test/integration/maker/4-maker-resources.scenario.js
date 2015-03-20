'use strict';

var BrandsPage = require('../pages/brands.page.js');
var ResourcesPage = require('../pages/resources.page.js');
var Utils = require('../utils/utils.js');

describe('[Dashboard Maker] Brands Claims page', function () {
    var brandsPage = new BrandsPage();
    var resourcesPage = new ResourcesPage();
    var utils = new Utils();

    it('should have an Resources/FAQ button on header', function () {
        brandsPage.get();

        expect(resourcesPage.getResourcesBtn().isPresent())
        .toBe(true);

        resourcesPage.getResourcesBtn().click().then(function () {
            resourcesPage.getFAQHeaderBtn().click().then(function () {
                expect(browser.getCurrentUrl())
                .toEqual(browser.params.website.url + 'maker/resources/faq');
            });
        });
    });

    it('should have an Resources/Tutorial button on header', function () {
        resourcesPage.getResourcesBtn().click().then(function () {
            resourcesPage.getTutorialHeaderBtn().click().then(function () {
                expect(browser.getCurrentUrl())
                .toEqual(browser.params.website.url + 'maker/resources/tutorial');
            });
        });
    });

    it('should have an Resources/Procedures button on header', function () {
        resourcesPage.getResourcesBtn().click().then(function () {
            resourcesPage.getProceduresHeaderBtn().click().then(function () {
                expect(browser.getCurrentUrl())
                .toEqual(browser.params.website.url + 'maker/resources/procedures');
            });
        });
    });
});
