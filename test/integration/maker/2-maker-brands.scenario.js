'use strict';

var BrandsPage = require('../pages/brands.page.js');
var Utils = require('../utils/utils.js');

describe('[Dashboard Maker] Brands page', function () {
    var brandsPage = new BrandsPage();
    var utils = new Utils();

    it('should have the correct url', function () {
        brandsPage.get();

        expect(browser.getCurrentUrl())
        .toEqual(browser.params.website.url + 'maker/brand');
    });

    it('should display a brand list', function () {
        expect(brandsPage.getBrands().count())
        .toBeGreaterThan(2);
    });

    it('should display brands with a logo', function () {
        expect(brandsPage.getBrandLogo(1).isPresent())
        .toBe(true);
    });

    it('should display brands with a clickable name', function () {
        expect(brandsPage.getBrandName(1).isPresent())
        .toBe(true);

        brandsPage.getBrandName(1).click().then(function () {
            expect(browser.getCurrentUrl())
            .toMatch(/maker\/brand\/\d+/);
            brandsPage.get();
        });
    });

    it('should display brands with a clickable edit button', function () {
        expect(brandsPage.getBrandEditBtn(1).isPresent())
        .toBe(true);

        brandsPage.getBrandEditBtn(1).click().then(function () {
           expect(browser.getCurrentUrl())
           .toMatch(/maker\/brand\/\d+/);
           brandsPage.get();
        });
    });

    it('should display brands with a clickable products button', function () {
        expect(brandsPage.getBrandProductBtn(1).isPresent())
        .toBe(true);

        brandsPage.getBrandProductBtn(1).click().then(function () {
           expect(browser.getCurrentUrl())
           .toMatch(/maker\/brand\/\d+\/product/);
           brandsPage.get();
        });

    });

    it('should display brands with a clickable products button', function () {
            expect(brandsPage.getBrandAddProductBtn(1).isPresent())
            .toBe(true);
        });

    it('should have a button to claim brands', function () {
        expect(brandsPage.getClaimBrandsBtn().isPresent())
        .toBe(true);
    });
});
