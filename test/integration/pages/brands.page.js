'use strict';

var BrandsPage = function () {
  var that = this;

  this.get = function () {
    return browser.get(browser.params.website.url + 'maker/brand');
  };

  this.getBrands = function () {
    return element.all(by.repeater('brand in brands'));
  };

  this.getBrand = function (index) {
    return element(by.repeater('brand in brands').row(index));
  };

  this.getBrandLogo = function (index) {
    return that.getBrand(index).element(by.css('.brand-logo'));
  };

  this.getBrandName = function (index) {
    return that.getBrand(index).element(by.binding('brand.name'));
  };

  this.getBrandEditBtn = function (index) {
    return that.getBrand(index).element(by.css('a i.fa.fa-edit'));
  };

  this.getBrandProductBtn = function (index) {
    return that.getBrand(index).element(by.css('a .fa.fa-barcode'));
  };

  this.getBrandAddProductBtn = function (index) {
    return that.getBrand(index).element(by.css('[alk-button-product-claim]'));
  };

  this.getClaimBrandsBtn = function () {
    return element(by.css('[alk-button-brand-claim]'));
  };
};

module.exports = BrandsPage;
