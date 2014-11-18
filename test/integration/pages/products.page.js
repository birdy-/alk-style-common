'use strict';

var ProductsPage = function () {
  this.get = function () {
    return browser.get(browser.params.website.url + 'maker/brand/all/product');
  };

  this.getProductsFiltersPanel = function () {
    return element(by.css('.sidebar'));
  };

  this.getProducts = function () {
    return element.all(by.repeater('product in products'));
  };

  this.getProduct = function (index) {
    return element(by.repeater('product in products').row(index));
  };
};

module.exports = ProductsPage;
