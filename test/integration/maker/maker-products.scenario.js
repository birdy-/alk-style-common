'use strict';

var HomePage = require('../pages/home.page.js');
var ProductsPage = require('../pages/products.page.js');
var ProductPage = require('../pages/product.page.js');
var Utils = require('../utils/utils.js');

describe('[Dashboard Maker] Products page', function () {
    browser.driver.manage().window().maximize();
    var homePage = new HomePage();
    var productsPage = new ProductsPage();
    var productPage = new ProductPage();
    var utils = new Utils();

    it('should have the correct url', function () {
        productsPage.get();

        expect(browser.getCurrentUrl())
        .toEqual(browser.params.website.url + 'maker/brand/all/product');
    });

    it('should have a filter sidebar', function () {
        expect(productsPage.getProductsFiltersPanel().isPresent())
        .toBe(true);
    });

    it('should have some products', function () {
        expect(productsPage.getProducts().count())
        .toBeGreaterThan(5);
    });

    it('should have clickable products', function () {
        productsPage.getProduct(0).click().then(function () {
            var productsPageRegex = new RegExp('maker\/product\/(\\d+)\/data\/general', 'g');

            browser.getCurrentUrl().then(function (browserUrl) {
                expect(browserUrl)
                .toMatch(productsPageRegex);

                // Save the productId for future use (in product.scenario.js for instance)
                var match = productsPageRegex.exec(browserUrl);
                browser.params.productId = match[1];
            })
        })
    });
});
