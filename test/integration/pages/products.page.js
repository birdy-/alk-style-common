'use strict';

var ProductsPage = function () {
  var that = this;

  this.get = function () {
    return browser.get(browser.params.website.url + 'maker/brand/all/product');
  };

  this.getProductsFiltersPanel = function () {
    return element(by.css('.sidebar'));
  };

  this.getPaginationBlocks = function () {
    return element.all(by.css('.pagination-block'));
  };

  this.getPaginationBlock = function (index) {
    return that.getPaginationBlocks().get(index);
  };

  this.getPrevArrow = function () {
    return element.all(by.css('.arrow-prev'));
  };

  this.getNextArrow = function () {
    return element.all(by.css('.arrow-next'));
  };

  this.getBrands = function () {
    return element.all(by.repeater('brand in brands'));
  };

  this.getBrand = function (index) {
    return element(by.repeater('brand in brands').row(index)).element(by.css('label.checkbox-inline'));
  };

  this.getProducts = function () {
    return element.all(by.repeater('product in products'));
  };

  this.getProduct = function (index) {
    return element(by.repeater('product in products').row(index));
  };
};

module.exports = ProductsPage;
