'use strict';

var BrandsPage = require('../pages/brands.page.js');
var BrandsClaimsPage = require('../pages/brands-claims.page.js');
var Utils = require('../utils/utils.js');

describe('[Dashboard Maker] Brands Claims page', function () {
    var brandsPage = new BrandsPage();
    var brandsClaimsPage = new BrandsClaimsPage();
    var utils = new Utils();

    it('should have a button to claim brands', function () {
        brandsPage.get();

        expect(brandsPage.getClaimBrandsBtn().isPresent())
        .toBe(true);
    });

    it('should display a popup to claim brands', function () {
        brandsPage.getClaimBrandsBtn().click().then(function () {
            expect(brandsClaimsPage.getClaimBrands().isPresent())
            .toBe(true);
            expect(brandsClaimsPage.getClaimBrandsBtn().isPresent())
            .toBe(true);
        });
    });

    it('should display a field to create brands', function () {
        brandsClaimsPage.getCreateBrandsBtn().click().then(function () {
            expect(brandsClaimsPage.getCreateClaimBrands().isPresent())
            .toBe(true);
            expect(brandsClaimsPage.getClaimBrandsBtn().isPresent())
            .toBe(true);
        });
    });
});
