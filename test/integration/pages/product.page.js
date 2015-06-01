'use strict';

var ProductPage = function () {
  this.get = function () {
    return browser.get(browser.params.website.url + 'maker/product/' + browser.params.productId + '/data/general');
  };

  this.getNavTabs = function () {
    return element.all(by.css('.nav.nav-tabs li'));
  };

  this.getGeneralTab = function () {
    return element.all(by.css('.nav.nav-tabs li')).get(0);
  };

  this.getMediaTab = function () {
    return element.all(by.css('.nav.nav-tabs li')).get(4);
  };

  this.getNutritionTab = function () {
    return element.all(by.css('.nav.nav-tabs li')).get(6);
  };

  // -------------------------
  // Action buttons
  // -------------------------

  this.getSaveBtn = function () {
    return element(by.css('.actions-container .actions [button-save] .btn'));
  };

  this.getCertifyBtn = function () {
    return element(by.css('.actions-container .actions .certify.btn'));
  };

  this.getDuplicateBtn = function () {
    return element(by.css('.actions-container .actions .duplicate.btn'));
  };

  this.getDuplicatePopupHeader = function () {
    return element(by.css('.modal-content .modal-header h3'));
  };

  this.getDuplicatePopupReference = function () {
    return element(by.model('reference'));
  };

  this.getDuplicatePopupConfirmBtn = function () {
    return element(by.css('.modal-content .modal-footer .btn-success'));
  };

  this.getDuplicatePopupCancelBtn = function () {
    return element(by.css('.modal-content .modal-footer .btn-warning'));
  };

  this.getArchiveBtn = function () {
    return element(by.css('.actions-container .actions .archive.btn'));
  };

  // -------------------------
  // General tab
  // -------------------------

  this.getSynonymsField = function () {
    return element(by.css('#s2id_synonyms'));
  };

  this.getSynonymsSuggestionsBtn = function () {
    return element(by.css('.synonyms .input-group-btn button'));
  };

  this.getSynonymsSuggestions = function () {
    return element.all(by.repeater('synonym in synonyms'));
  };

  this.getSynonymsOkBtn = function () {
    return element(by.css('.modal-footer .btn.color-stream-inverse'));
  };

  this.getSynonymsCancelBtn = function () {
    return element(by.css('.modal-footer .btn-default'));
  };

  // -------------------------
  // Media tab
  // -------------------------

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

  // -------------------------
  // Nutrition tab
  // -------------------------

  this.getAddPSQBtn = function () {
    return element(by.css('form[name=productForm] .pull-right .btn.btn-success'));
  };

  this.getProductNutritionList = function () {
    return element.all(by.css('[product-nutrition]'));
  };
};

module.exports = ProductPage;