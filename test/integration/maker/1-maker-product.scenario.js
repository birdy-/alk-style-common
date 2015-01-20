'use strict';

var HomePage = require('../pages/home.page.js');
var ProductPage = require('../pages/product.page.js');
var Utils = require('../utils/utils.js');
var path = require('path');

describe('[Dashboard Maker] Product page', function () {
    browser.driver.manage().window().maximize();
    var homePage = new HomePage();
    var productPage = new ProductPage();
    var utils = new Utils();

    it('should have the correct url', function () {
        productPage.get();

        expect(browser.getCurrentUrl())
        .toEqual(browser.params.website.url + 'maker/product/' + browser.params.productId + '/data/general');
    });

    it('should have 9 navigation tabs', function () {
        expect(productPage.getNavTabs().count())
        .toEqual(9); //; Set to 9 while the retail tab is not functional
    });

    ///////////////////////
    // General tab
    ///////////////////////
    it('should have a general tab', function () {
        expect(productPage.getGeneralTab().getText())
        .toBe('GENERAL');
    });

    it('should have a synonyms field on general tab', function () {
        expect(productPage.getSynonymsField().isPresent())
        .toBe(true);
    });

    it('should have a synonyms suggestion button on general tab', function () {
        expect(productPage.getSynonymsSuggestionsBtn().isPresent())
        .toBe(true);
    });

    it('should have a popup for synonyms suggestion on click', function () {
        productPage.getSynonymsSuggestionsBtn().click().then(function () {
            expect(productPage.getSynonymsSuggestions().count())
            .toBeGreaterThan(0);

            expect(productPage.getSynonymsOkBtn().isPresent())
            .toBe(true);

            productPage.getSynonymsCancelBtn().click().then(function () {});
        })
    });

    ///////////////////////
    // Media tab
    ///////////////////////
    it('should have a media tab', function () {
        expect(productPage.getMediaTab().getText())
        .toBe('MÉDIAS');

        productPage.getMediaTab().click().then(function () {
            expect(browser.getCurrentUrl())
            .toEqual(browser.params.website.url + 'maker/product/' + browser.params.productId + '/data/media');
        });
    });

    it('should have a button to add media on media tab', function () {
        expect(productPage.getAddMediaBtn().isPresent())
        .toBe(true);
    });

    it('should be able to add media on media tab', function () {
        productPage.getImageMedia().count().then(function (imageCount) {

            productPage.getAddMediaBtn().click().then(function () {
                var fileToUpload = '../../fixtures/image-test.png';
                var absolutePath = path.resolve(__dirname, fileToUpload);

                productPage.getUploadMediaBtn().sendKeys(absolutePath);
                // browser.pause();

                // productPage.getValidateUploadMediaBtn().click().then(function () {
                //     console.log('should have been uploaded')
                //     expect(productPage.getImageMedia().count())
                //     .toEqual(int(imageCount) + 1);
                // });
            });
        })
    });


    ///////////////////////
    // Nutrition tab
    ///////////////////////
    it('should have a nutrition tab', function () {
        productPage.get();
        expect(productPage.getNutritionTab().getText())
        .toBe('NUTRITION');

        productPage.getNutritionTab().click().then(function () {
            expect(browser.getCurrentUrl())
            .toEqual(browser.params.website.url + 'maker/product/' + browser.params.productId + '/data/nutrition');
        });
    });

    it('should have a button to add a PSQ on nutrition tab', function () {
        expect(productPage.getAddPSQBtn().isPresent())
        .toBe(true);
    });

    it('should have a nutritial elements list on nutrition tab', function () {
        expect(productPage.getProductNutritionList().count())
        .toBeGreaterThan(10);
    });
});
