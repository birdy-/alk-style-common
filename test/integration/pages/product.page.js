'use strict';

var ProductPage = function () {
  this.get = function () {
    return browser.get(browser.params.website.url + 'maker/product/' + browser.params.productId + '/data/general');
  };

  this.getNavTabs = function () {
    return element.all(by.css('.nav.nav-tabs li'));
  };

  this.getMediaTab = function () {
    return element.all(by.css('.nav.nav-tabs li')).get(4);
  };

  this.getAddMediaBtn = function () {
    return element(by.css('[ng-click=\"uploadNewPictures()\"]'));
  };

  this.getUploadMediaBtn = function () {
    return element(by.css('.modal-dialog')).element(by.css('input[type="file"]'));
  };

  this.getValidateUploadMediaBtn = function () {
    return element(by.css('.modal-dialog [ng-click=\"done()\"]'));
  };

  this.getImageMedia = function () {
    return element.all(by.repeater('picture in pictures'));
  };
};

module.exports = ProductPage;