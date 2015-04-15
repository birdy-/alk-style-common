'use strict';

var ProductsPage = function () {
  var that = this;

  this.get = function () {
    return browser.get(browser.params.website.url + 'maker/brand/all/product');
  };

  this.getProductsFiltersPanel = function () {
    return element(by.css('.sidebar'));
  };

  // ------------------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------------------

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

  // ------------------------------------------------------------------------
  // Display
  // ------------------------------------------------------------------------

  this.getChangeDisplay = function () {
    return element.all(by.css('.change-display label[btn-radio]'));
  };

  this.getChangeDisplayToList = function () {
    return element.all(by.css('.change-display label[btn-radio]')).get(1);
  };

  this.getChangeDisplayToPreview = function () {
    return element.all(by.css('.change-display label[btn-radio]')).get(0);
  };

  this.getSelectAllProducts = function () {
    return element(by.model('display.allSelected'));
  };

  this.getBulkCertify = function () {
    return element(by.css('.btn.certify'));
  };

  this.getBulkCertifyUserEmail = function () {
    return element(by.model('user.email'));
  };

  this.getBulkCancelBtn = function () {
    return element(by.css('.modal-footer .btn-warning'));
  };

  this.getBulkEdit = function () {
    return element(by.css('.btn.edit'));
  };

  this.getBulkEditWarning = function () {
    return element(by.css('.modal-body .bg-warning'));
  };

  this.getBulkEditOk = function () {
    return element(by.css('.modal-footer .btn-success'));
  };

  this.getBulkEditManufacturerFields = function () {
    return element.all(by.repeater('field in manufacturerFields'));
  };

  this.getBulkEditConsumerSupportFields = function () {
    return element.all(by.repeater('field in consumerSupportFields'));
  };

  // ------------------------------------------------------------------------
  // Brands & Products
  // ------------------------------------------------------------------------

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
