'use strict';

var ProductInShopPage = require('../pages/product-in-shop.page.js');

describe('[Dashboard Retailer] PISHs page', function () {
    browser.driver.manage().window().maximize();
    var productInShopPage = new ProductInShopPage();

    it('should have the correct url', function () {
        productInShopPage.get();

        expect(browser.getCurrentUrl())
        .toEqual(browser.params.website.url + 'retailer/productinshop');
    });

    it('should have a list of pish', function () {
        productInShopPage.getDetailsSearchBtn().click().then(function () {
            expect(productInShopPage.getPishsList().count())
            .toEqual(50);
        });
    });

    it('should have a filter by reference', function () {
        expect(productInShopPage.getReferenceFilter().isPresent())
        .toBe(true);
    });

    it('should have a filter by EAN', function () {
        expect(productInShopPage.getEanFilter().isPresent())
        .toBe(true);
    });

    it('should have a filter by Name', function () {
        expect(productInShopPage.getNameFilter().isPresent())
        .toBe(true);
    });

    it('should have a filter by status', function () {
        expect(productInShopPage.getStatusOptions().count())
        .toEqual(8);
    });

    it('should be able to filter on certified products', function () {
        productInShopPage.getStatusCertified().click().then(function () {
            productInShopPage.getDetailsSearchBtn().click().then(function () {
                expect(productInShopPage.getPishsList().count())
                .toEqual(50);

                productInShopPage.getPishsList().first()
                .element(by.css('.pish-preview')).click().then(function () {
                    expect(productInShopPage.getPishPreview().isPresent())
                    .toBe(true);
                })
            })
        });
    });

    it('should have 2 tabs on preview', function () {
        expect(productInShopPage.getPishPreviewTabs().count())
        .toEqual(2);
    });

    it('should have pictures on media tab', function () {
        productInShopPage.getPishPreviewMediaTab().click().then(function () {
            expect(productInShopPage.getPishPreviewPictures().count())
            .toBeGreaterThan(3);
        });
    });
});
