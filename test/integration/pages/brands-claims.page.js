'use strict';

var BrandsClaimsPage = function () {
  var that = this;

  this.getClaimBrands = function () {
    return element(by.model('request.selectedBrand'));
  };

  this.getCreateClaimBrands = function () {
    return element(by.model('request.createdBrand'));
  };

  this.getClaimBrandsBtn = function () {
    return element(by.css('.modal-body .btn.btn-success'));
  };

  this.getCreateBrandsBtn = function () {
    return element(by.css('.modal-footer .btn.btn-default'));
  };
};

module.exports = BrandsClaimsPage;
