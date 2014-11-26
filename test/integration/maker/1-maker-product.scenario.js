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
            console.log('imageCount', imageCount);

            productPage.getAddMediaBtn().click().then(function () {
                var fileToUpload = '../../fixtures/image-test.png';
                var absolutePath = path.resolve(__dirname, fileToUpload);

                console.log('absolutePath', absolutePath);
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
});
