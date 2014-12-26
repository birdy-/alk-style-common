'use strict';

var HomePage = function () {
  this.get = function () {
    browser.get(browser.params.website.url);
  };

  /** Header **/
  this.getHeader = function () {
    return element.all(by.css('.navbar.navbar-inverse')).first();
  };

  this.getHeaderTabs = function () {
    return element.all(by.css('.navbar.navbar-inverse .navbar-collapse .nav li'));
  };

  this.getHeaderActiveTab = function () {
    return element(by.css('.navbar.navbar-inverse .navbar-collapse .nav .active'));
  };

  this.getContactTab = function () {
    return element(by.css('.navbar.navbar-inverse .navbar-collapse .nav li:nth-child(2)'));
  };

  /** Contact Modal **/
  this.getContactModal = function () {
    return element(by.css('.modal'));
  };

  this.getContactModalHeader = function () {
    return element(by.css('.modal .modal-header'));
  };

  this.getContactModalOriginField = function () {
    return element(by.model('record.origin'));
  };

  this.getContactModalFirstnameField = function () {
    return element(by.model('record.firstname'));
  };

  this.getContactModalLastnameField = function () {
    return element(by.model('record.lastname'));
  };

  this.getContactModalUsernameField = function () {
    return element(by.model('record.username'));
  };

  this.getContactModalPhonenumberField = function () {
    return element(by.model('record.phonenumber'));
  };

  this.getContactModalMessageField = function () {
    return element(by.model('record.message'));
  };

  this.getContactModalSubmit = function () {
    return element(by.css('.modal .modal-footer .btn-success'));
  };

  /** Page content **/
  this.getRegistrationPageButton = function () {
    return element.all(by.css('.sign-up-btn')).first();
  };

  this.getLoginPageButton = function () {
    return element(by.css('.ptor-signin'));
  };

  /** Footer **/
  this.getFooter = function () {
    return element.all(by.css('.navbar.navbar-inverse')).last();
  };
};

module.exports = HomePage;
