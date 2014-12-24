'use strict';

var ProductInShopPage = function () {
  var that = this;

  this.get = function () {
    return browser.get(browser.params.website.url + 'retailer/productinshop');
  };

  this.getPishsList = function () {
    return element.all(by.repeater('productInShop in productInShops'));
  };

  this.getReferenceFilter = function () {
    return element(by.model('request.productInShop.shortIdOut'));
  };

  this.getEanFilter = function () {
    return element(by.model('request.productReference.reference'));
  };

  this.getNameFilter = function () {
    return element(by.model('request.productInShop.name'));
  };

  this.getStatusOptions = function () {
    return element.all(by.options('choice.id as choice.name for choice in choices'));
  };

  this.getStatusCertified = function () {
    return that.getStatusOptions().get(5);
  };

  this.getSearchBtn = function () {
    return element(by.css('.btn-search'));
  };

  this.getPishPreview = function () {
    return element(by.css('#product-preview'));
  };

  this.getPishPreviewTabs = function () {
    return element.all(by.css('.modal-body .nav-tabs li'));
  };

  this.getPishPreviewMediaTab = function () {
    return that.getPishPreviewTabs(1);
  };

  this.getPishPreviewPictures = function () {
    return element.all(by.repeater('picture in pictures'));
  };
};

module.exports = ProductInShopPage;
